// ============================================================
// PRANU v2 — Orchestrator
// Central control loop coordinating all agents
// ============================================================

import { v4 as uuid } from 'uuid';
import { TaskStatus, StepStatus } from '../types/index.js';
import type { TaskStep } from '../types/index.js';
import { StateMachine } from './state-machine.js';
import { eventBus } from './event-bus.js';
import { PlannerAgent } from '../agents/planner.js';
import { ExecutorAgent } from '../agents/executor.js';
import { CriticAgent } from '../agents/critic.js';
import { MemoryAgent } from '../agents/memory.js';
import type { BaseAgent } from '../agents/base.js';
import { ShortTermMemory } from '../memory/short-term.js';
import { getMemoryStore } from '../memory/store.js';
import { toolRegistry } from '../tools/registry.js';
import { llmRouter } from '../llm/router.js';
import { config } from '../config.js';
import { sandboxManager } from '../sandbox/manager.js';
import { mkdirSync } from 'fs';

// Register all tools
import '../tools/terminal.js';
import '../tools/files.js';
import '../tools/search.js';
import '../tools/packages.js';
import '../tools/http.js';

import { TerminalTool } from '../tools/terminal.js';
import { ReadFileTool, WriteFileTool } from '../tools/files.js';
import { SearchCodeTool } from '../tools/search.js';
import { InstallPackageTool } from '../tools/packages.js';
import { HttpRequestTool } from '../tools/http.js';

// Register tools
toolRegistry.register(new TerminalTool());
toolRegistry.register(new ReadFileTool());
toolRegistry.register(new WriteFileTool());
toolRegistry.register(new SearchCodeTool());
toolRegistry.register(new InstallPackageTool());
toolRegistry.register(new HttpRequestTool());

const MAX_STEP_RETRIES = 2;
const MAX_TOOL_CALLS_PER_TASK = 50;

export class Orchestrator {
    private stateMachine: StateMachine;
    private memoryStore;
    private planner: PlannerAgent;
    private executor: ExecutorAgent;
    private critic: CriticAgent;
    private memoryAgent: MemoryAgent;

    private currentTaskId: string | null = null;
    private currentPlan: TaskStep[] = [];
    private currentStepIndex = 0;
    private toolCallCount = 0;
    private isRunning = false;
    private isPaused = false;

    constructor() {
        this.stateMachine = new StateMachine(TaskStatus.PENDING);
        this.memoryStore = getMemoryStore();

        const sharedConfig = {
            provider: llmRouter,
            toolRegistry,
            memoryStore: this.memoryStore,
            shortTermMemory: new ShortTermMemory(),
        };

        this.planner = new PlannerAgent(sharedConfig);
        this.executor = new ExecutorAgent(sharedConfig);
        this.critic = new CriticAgent(sharedConfig);
        this.memoryAgent = new MemoryAgent(sharedConfig);

        // Wire agent events to event bus
        this.wireAgentEvents(this.planner);
        this.wireAgentEvents(this.executor);
        this.wireAgentEvents(this.critic);
    }

    async startTask(description: string, workspacePath?: string): Promise<string> {
        if (this.isRunning) {
            throw new Error('A task is already running. Stop it first.');
        }

        const taskId = uuid();
        const wsPath = workspacePath ?? config.WORKSPACE_PATH;

        // Ensure workspace exists
        mkdirSync(wsPath, { recursive: true });

        // Create task in memory store
        this.memoryStore.createTask({
            id: taskId,
            description,
            status: TaskStatus.PENDING,
            workspacePath: wsPath,
        });

        this.currentTaskId = taskId;
        this.currentPlan = [];
        this.currentStepIndex = 0;
        this.toolCallCount = 0;
        this.isRunning = true;

        eventBus.emit('task.created', { taskId, data: { description } });

        // Run the task asynchronously
        this.runTask(taskId, description, wsPath).catch((error) => {
            console.error(`Task ${taskId} failed:`, error);
            this.handleTaskError(taskId, error instanceof Error ? error.message : String(error));
        });

        return taskId;
    }

    private async runTask(taskId: string, description: string, workspacePath: string): Promise<void> {
        try {
            // Initialize sandbox if enabled
            let containerId: string | undefined;
            if (config.SANDBOX_ENABLED) {
                await sandboxManager.initialize();
                containerId = await sandboxManager.createContainer(taskId, workspacePath);
            }

            // Phase 1: Retrieve memory context
            this.transition(TaskStatus.PLANNING);
            eventBus.emit('task.planning', { taskId });

            const memoryContext = await this.memoryAgent.run(
                taskId,
                description
            );

            // Phase 2: Plan
            const planJson = await this.planner.run(taskId, description, memoryContext);
            this.currentPlan = JSON.parse(planJson);

            if (this.currentPlan.length === 0) {
                throw new Error('Planner produced an empty plan');
            }

            eventBus.emit('plan.ready', {
                taskId,
                data: { steps: this.currentPlan },
            });

            // Phase 3: Execute each step
            this.transition(TaskStatus.EXECUTING);

            for (this.currentStepIndex = 0; this.currentStepIndex < this.currentPlan.length; this.currentStepIndex++) {
                // Check for pause/stop
                while (this.isPaused) {
                    await this.sleep(500);
                }
                if (!this.isRunning) break;

                const step = this.currentPlan[this.currentStepIndex];
                this.memoryStore.updateStepStatus(step.id, StepStatus.EXECUTING);
                eventBus.emit('step.started', { taskId, stepId: step.id, data: { step } });

                let stepComplete = false;
                let retryCount = 0;

                while (!stepComplete && retryCount <= MAX_STEP_RETRIES) {
                    // Execute
                    const executorResult = await this.executor.run(
                        taskId,
                        `Step ${step.stepNumber}: ${step.description}\nAcceptance criteria: ${step.acceptanceCriteria}\nSuggested tool: ${step.toolHint}`
                    );

                    // Review
                    this.transition(TaskStatus.REVIEWING);
                    eventBus.emit('task.reviewing', { taskId, stepId: step.id });

                    const reviewResult = await this.critic.run(
                        taskId,
                        step.description,
                        executorResult
                    );

                    const review = JSON.parse(reviewResult);

                    if (review.approved) {
                        // Step approved
                        this.memoryStore.updateStepStatus(step.id, StepStatus.COMPLETED, executorResult.substring(0, 500));
                        eventBus.emit('step.completed', {
                            taskId,
                            stepId: step.id,
                            data: { status: 'completed', result: executorResult },
                        });
                        stepComplete = true;
                        this.transition(TaskStatus.EXECUTING);
                    } else {
                        // Step rejected — retry
                        retryCount++;
                        this.memoryStore.incrementStepRetry(step.id);
                        this.memoryStore.updateStepStatus(step.id, StepStatus.REJECTED, review.feedback);

                        eventBus.emit('step.rejected', {
                            taskId,
                            stepId: step.id,
                            data: { feedback: review.feedback, retryCount },
                        });

                        if (retryCount > MAX_STEP_RETRIES) {
                            // Max retries reached — continue with warnings
                            console.warn(`Step ${step.stepNumber} failed after ${MAX_STEP_RETRIES} retries`);
                            stepComplete = true;
                        } else {
                            // Re-enter executing state for retry
                            this.transition(TaskStatus.EXECUTING);
                        }
                    }
                }
            }

            // Phase 4: Task complete
            const summary = this.buildTaskSummary();
            this.memoryStore.completeTask(taskId, summary);
            this.memoryAgent.storeTaskResult(taskId, description, summary);

            eventBus.emit('task.completed', {
                taskId,
                data: { summary, stepsCompleted: this.currentPlan.length },
            });

            this.transition(TaskStatus.COMPLETED);

            // Cleanup sandbox
            if (containerId) {
                await sandboxManager.destroyContainer(taskId);
            }
        } catch (error) {
            this.handleTaskError(taskId, error instanceof Error ? error.message : String(error));
        } finally {
            this.isRunning = false;
            this.currentTaskId = null;
        }
    }

    stopTask(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.isPaused = false;

        this.planner.stop();
        this.executor.stop();
        this.critic.stop();

        if (this.currentTaskId) {
            this.memoryStore.updateTaskStatus(this.currentTaskId, TaskStatus.STOPPED);
            eventBus.emit('task.stopped', { taskId: this.currentTaskId });
        }

        this.stateMachine.reset();
    }

    pauseTask(): void {
        if (!this.isRunning || this.isPaused) return;
        this.isPaused = true;

        if (this.currentTaskId) {
            this.memoryStore.updateTaskStatus(this.currentTaskId, TaskStatus.PAUSED);
            eventBus.emit('task.paused', { taskId: this.currentTaskId });
        }
    }

    resumeTask(): void {
        if (!this.isPaused) return;
        this.isPaused = false;

        if (this.currentTaskId) {
            this.memoryStore.updateTaskStatus(this.currentTaskId, TaskStatus.EXECUTING);
            eventBus.emit('task.resumed', { taskId: this.currentTaskId });
        }
    }

    getStatus(): {
        isRunning: boolean;
        isPaused: boolean;
        currentTaskId: string | null;
        currentState: TaskStatus;
        currentStepIndex: number;
        totalSteps: number;
        toolCallCount: number;
    } {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentTaskId: this.currentTaskId,
            currentState: this.stateMachine.state,
            currentStepIndex: this.currentStepIndex,
            totalSteps: this.currentPlan.length,
            toolCallCount: this.toolCallCount,
        };
    }

    getAgentStates(): Record<string, { role: string; state: string; currentTaskId: string | null }> {
        return {
            planner: { role: this.planner.role, state: this.planner.state, currentTaskId: this.planner.currentTaskId },
            executor: { role: this.executor.role, state: this.executor.state, currentTaskId: this.executor.currentTaskId },
            critic: { role: this.critic.role, state: this.critic.state, currentTaskId: this.critic.currentTaskId },
            memory: { role: this.memoryAgent.role, state: this.memoryAgent.state, currentTaskId: this.memoryAgent.currentTaskId },
        };
    }

    private transition(to: TaskStatus): void {
        this.stateMachine.transition(to);
    }

    private handleTaskError(taskId: string, error: string): void {
        this.memoryStore.updateTaskStatus(taskId, TaskStatus.FAILED, error);
        eventBus.emit('task.failed', { taskId, error });
        this.isRunning = false;
        this.currentTaskId = null;
        this.stateMachine.reset();
    }

    private buildTaskSummary(): string {
        const completed = this.currentPlan.filter((s) => s.status === StepStatus.COMPLETED).length;
        const total = this.currentPlan.length;
        return `Completed ${completed}/${total} steps.`;
    }

    private wireAgentEvents(agent: BaseAgent): void {
        agent.on('stateChange', (data) => {
            eventBus.emit('agent.state_change', { agent: data.agent, data });
        });
        agent.on('thought', (data) => {
            eventBus.emit('agent.thought', { agent: data.agent, data });
        });
        agent.on('actionStarted', (data) => {
            this.toolCallCount++;
            eventBus.emit('agent.action_started', { agent: data.agent, data });
        });
        agent.on('actionCompleted', (data) => {
            eventBus.emit('agent.action_completed', { agent: data.agent, data });
        });
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Singleton
export const orchestrator = new Orchestrator();

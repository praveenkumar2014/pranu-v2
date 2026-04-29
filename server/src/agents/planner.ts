// ============================================================
// PRANU v2 — Planner Agent
// Breaks tasks into structured step-by-step plans
// ============================================================

import { v4 as uuid } from 'uuid';
import { BaseAgent, type AgentConfig } from './base.js';
import { AgentRole, StepStatus } from '../types/index.js';
import type { TaskStep } from '../types/index.js';

const PLANNER_SYSTEM_PROMPT = `You are an expert software architect and planner. Your job is to break down user tasks into clear, atomic, executable steps.

Rules:
1. Each step must be specific and actionable
2. Each step should hint at which tool to use
3. Each step must have clear acceptance criteria
4. Steps should be ordered by dependency
5. Keep plans concise — aim for 3-8 steps
6. Output ONLY valid JSON matching the expected format

Available tools:
- run_terminal: Execute shell commands
- write_file: Create or modify files
- read_file: Read file contents
- search_code: Search the codebase
- install_package: Install npm/pip packages
- http_request: Make HTTP requests

Output format — return a JSON array of steps:
[
  {
    "description": "What to do in this step",
    "toolHint": "which tool to primarily use",
    "acceptanceCriteria": "how to verify this step is complete"
  }
]`;

export class PlannerAgent extends BaseAgent {
  constructor(config: Omit<AgentConfig, 'role' | 'systemPrompt' | 'maxIterations' | 'stepTimeout'>) {
    super({
      ...config,
      role: AgentRole.PLANNER,
      systemPrompt: PLANNER_SYSTEM_PROMPT,
      maxIterations: 1,
      stepTimeout: 60000,
    });
  }

  async run(taskId: string, input: string, context?: string): Promise<string> {
    this.startRun(taskId);

    try {
      const prompt = context
        ? `Task: ${input}\n\nContext from previous tasks:\n${context}\n\nCreate a step-by-step plan.`
        : `Task: ${input}\n\nCreate a step-by-step plan.`;

      const thought = await this.think(prompt);

      // Parse the plan from the response
      const plan = this.parsePlan(thought.content);

      if (plan.length === 0) {
        throw new Error('Planner failed to generate a valid plan');
      }

      // Store steps in memory
      const steps: TaskStep[] = plan.map((step, index) => ({
        id: uuid(),
        stepNumber: index + 1,
        description: step.description,
        toolHint: step.toolHint,
        acceptanceCriteria: step.acceptanceCriteria,
        status: StepStatus.PENDING,
        retryCount: 0,
      }));

      for (const step of steps) {
        this.memoryStore.createStep({
          id: step.id,
          taskId,
          stepNumber: step.stepNumber,
          description: step.description,
          status: step.status,
          acceptanceCriteria: step.acceptanceCriteria,
          toolHint: step.toolHint,
        });
      }

      this.emit('planReady', { taskId, steps });
      return JSON.stringify(steps);
    } finally {
      this.endRun();
    }
  }

  private parsePlan(content: string): Array<{
    description: string;
    toolHint: string;
    acceptanceCriteria: string;
  }> {
    // Try to extract JSON from the response
    try {
      // Look for JSON array in the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('Planner output does not contain JSON array, using fallback');
        return this.fallbackPlan(content);
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed)) {
        return this.fallbackPlan(content);
      }

      return parsed.map((step: Record<string, unknown>) => ({
        description: String(step.description ?? ''),
        toolHint: String(step.toolHint ?? 'run_terminal'),
        acceptanceCriteria: String(step.acceptanceCriteria ?? 'Step completed without errors'),
      })).filter((s) => s.description.length > 0);
    } catch {
      return this.fallbackPlan(content);
    }
  }

  private fallbackPlan(content: string): Array<{
    description: string;
    toolHint: string;
    acceptanceCriteria: string;
  }> {
    // If JSON parsing fails, create a single-step plan from the raw text
    return [{
      description: content.substring(0, 500),
      toolHint: 'run_terminal',
      acceptanceCriteria: 'Task description processed and steps identified',
    }];
  }
}

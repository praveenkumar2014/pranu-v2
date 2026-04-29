// ============================================================
// PRANU v2 — Zustand Store
// Single source of truth for all frontend state
// ============================================================

import { create } from 'zustand';
import type {
    Task,
    TaskStep,
    AgentInfo,
    LogEntry,
    FileTreeNode,
    WSMessageType,
} from './types';

// Simple ID generator (avoid uuid dependency in browser)
let idCounter = 0;
function generateId(): string {
    return `log-${Date.now()}-${++idCounter}`;
}

interface PranuStore {
    // Tasks
    tasks: Task[];
    activeTask: Task | null;

    // Agents
    agents: Record<string, AgentInfo>;

    // Logs
    logs: LogEntry[];

    // Files
    fileTree: FileTreeNode[];
    openFiles: string[];
    activeFile: string | null;
    fileContents: Record<string, string>;

    // Connection
    isStreaming: boolean;
    wsConnected: boolean;

    // Actions
    addTask: (task: Task) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    setActiveTask: (task: Task | null) => void;

    updateAgent: (role: string, updates: Partial<AgentInfo>) => void;

    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    clearLogs: () => void;

    setFileTree: (tree: FileTreeNode[]) => void;
    openFile: (path: string) => void;
    closeFile: (path: string) => void;
    setActiveFile: (path: string | null) => void;
    setFileContent: (path: string, content: string) => void;

    setStreaming: (streaming: boolean) => void;
    setWsConnected: (connected: boolean) => void;

    // WS message handler
    handleWSMessage: (type: WSMessageType, payload: Record<string, unknown>) => void;
}

export const useStore = create<PranuStore>((set, get) => ({
    // Initial state
    tasks: [],
    activeTask: null,
    agents: {
        planner: { role: 'planner', state: 'idle', currentTaskId: null },
        executor: { role: 'executor', state: 'idle', currentTaskId: null },
        critic: { role: 'critic', state: 'idle', currentTaskId: null },
        memory: { role: 'memory', state: 'idle', currentTaskId: null },
    },
    logs: [],
    fileTree: [],
    openFiles: [],
    activeFile: null,
    fileContents: {},
    isStreaming: false,
    wsConnected: false,

    // Task actions
    addTask: (task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),

    updateTask: (taskId, updates) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates } : t
            ),
            activeTask:
                state.activeTask?.id === taskId
                    ? { ...state.activeTask, ...updates }
                    : state.activeTask,
        })),

    setActiveTask: (task) => set({ activeTask: task }),

    // Agent actions
    updateAgent: (role, updates) =>
        set((state) => ({
            agents: {
                ...state.agents,
                [role]: { ...state.agents[role], ...updates } as AgentInfo,
            },
        })),

    // Log actions
    addLog: (entry) =>
        set((state) => ({
            logs: [
                ...state.logs,
                { ...entry, id: generateId(), timestamp: new Date().toISOString() },
            ].slice(-500), // Keep last 500 entries
        })),

    clearLogs: () => set({ logs: [] }),

    // File actions
    setFileTree: (tree) => set({ fileTree: tree }),

    openFile: (path) =>
        set((state) => ({
            openFiles: state.openFiles.includes(path)
                ? state.openFiles
                : [...state.openFiles, path],
            activeFile: path,
        })),

    closeFile: (path) =>
        set((state) => {
            const openFiles = state.openFiles.filter((f) => f !== path);
            const activeFile =
                state.activeFile === path
                    ? openFiles[openFiles.length - 1] ?? null
                    : state.activeFile;
            const fileContents = { ...state.fileContents };
            delete fileContents[path];
            return { openFiles, activeFile, fileContents };
        }),

    setActiveFile: (path) => set({ activeFile: path }),

    setFileContent: (path, content) =>
        set((state) => ({
            fileContents: { ...state.fileContents, [path]: content },
        })),

    // Connection actions
    setStreaming: (streaming) => set({ isStreaming: streaming }),
    setWsConnected: (connected) => set({ wsConnected: connected }),

    // WebSocket message handler
    handleWSMessage: (type, payload) => {
        const state = get();

        switch (type) {
            case 'task.created': {
                const task: Task = {
                    id: payload.taskId as string,
                    description: payload.description as string,
                    status: 'pending',
                    workspacePath: '',
                    steps: [],
                    currentStepIndex: 0,
                    createdAt: new Date().toISOString(),
                };
                state.addTask(task);
                state.setActiveTask(task);
                state.addLog({
                    type: 'system',
                    content: `Task created: ${task.description}`,
                });
                state.setStreaming(true);
                break;
            }

            case 'task.planning': {
                state.updateTask(payload.taskId as string, { status: 'planning' });
                state.updateAgent('planner', { state: 'thinking', currentTaskId: payload.taskId as string });
                state.addLog({
                    type: 'system',
                    agent: 'planner',
                    content: 'Planning task...',
                });
                break;
            }

            case 'plan.ready': {
                const steps = (payload.steps as TaskStep[]) ?? [];
                state.updateTask(payload.taskId as string, { steps, status: 'executing' });
                state.updateAgent('planner', { state: 'idle', currentTaskId: null });
                state.addLog({
                    type: 'system',
                    agent: 'planner',
                    content: `Plan created with ${steps.length} steps`,
                });
                break;
            }

            case 'agent.thought': {
                const agent = payload.agent as string;
                state.updateAgent(agent, { state: 'thinking' });
                state.addLog({
                    type: 'thought',
                    agent: agent as 'planner' | 'executor' | 'critic' | 'memory',
                    content: (payload.thought as string) ?? 'Thinking...',
                });
                break;
            }

            case 'action.started': {
                const agentRole = payload.agent as string;
                state.updateAgent(agentRole, { state: 'acting' });
                state.addLog({
                    type: 'action',
                    agent: agentRole as 'planner' | 'executor' | 'critic' | 'memory',
                    content: `Using tool: ${payload.tool ?? 'unknown'}`,
                    metadata: { tool: payload.tool, input: payload.input },
                });
                break;
            }

            case 'action.completed': {
                const resultAgent = payload.agent as string;
                state.updateAgent(resultAgent, { state: 'idle' });
                const result = payload.result as { output?: string; success?: boolean } | undefined;
                state.addLog({
                    type: 'result',
                    agent: resultAgent as 'planner' | 'executor' | 'critic' | 'memory',
                    content: result?.output ?? 'Action completed',
                    metadata: { success: result?.success, duration: payload.duration },
                });
                break;
            }

            case 'review.complete': {
                const approved = payload.approved as boolean;
                state.addLog({
                    type: 'review',
                    agent: 'critic',
                    content: approved ? 'Step approved' : `Step rejected: ${payload.feedback ?? ''}`,
                    metadata: { approved, feedback: payload.feedback },
                });
                break;
            }

            case 'step.completed': {
                state.addLog({
                    type: 'system',
                    content: `Step completed`,
                });
                break;
            }

            case 'task.completed': {
                state.updateTask(payload.taskId as string, {
                    status: 'completed',
                    summary: payload.summary as string,
                });
                state.updateAgent('executor', { state: 'idle', currentTaskId: null });
                state.addLog({
                    type: 'system',
                    content: `Task completed: ${payload.summary ?? 'Done'}`,
                });
                state.setStreaming(false);
                break;
            }

            case 'task.error': {
                state.updateTask(payload.taskId as string, { status: 'failed' });
                state.addLog({
                    type: 'error',
                    content: `Error: ${payload.error ?? 'Unknown error'}`,
                });
                state.setStreaming(false);
                break;
            }

            case 'task.stopped': {
                state.updateTask(payload.taskId as string, { status: 'stopped' });
                state.addLog({
                    type: 'system',
                    content: 'Task stopped',
                });
                state.setStreaming(false);
                break;
            }

            case 'agent.status': {
                const statusAgent = payload.agent as string;
                state.updateAgent(statusAgent, {
                    state: payload.status as 'idle' | 'thinking' | 'acting' | 'error',
                    currentTaskId: (payload.currentTask as string) ?? null,
                });
                break;
            }

            case 'file.changed': {
                state.addLog({
                    type: 'system',
                    content: `File ${payload.action}: ${payload.path}`,
                });
                break;
            }
        }
    },
}));

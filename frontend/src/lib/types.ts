// ============================================================
// PRANU v2 — Frontend Types
// ============================================================

export type TaskStatus =
    | 'pending'
    | 'planning'
    | 'executing'
    | 'reviewing'
    | 'completed'
    | 'failed'
    | 'stopped'
    | 'paused';

export type AgentRole = 'planner' | 'executor' | 'critic' | 'memory';
export type AgentState = 'idle' | 'thinking' | 'acting' | 'error';

export interface TaskStep {
    id: string;
    stepNumber: number;
    description: string;
    toolHint: string;
    acceptanceCriteria: string;
    status: 'pending' | 'executing' | 'completed' | 'rejected' | 'failed';
    resultSummary?: string;
    retryCount: number;
}

export interface Task {
    id: string;
    description: string;
    status: TaskStatus;
    workspacePath: string;
    steps: TaskStep[];
    currentStepIndex: number;
    summary?: string;
    createdAt: string;
    completedAt?: string;
}

export interface AgentInfo {
    role: AgentRole;
    state: AgentState;
    currentTaskId: string | null;
}

export interface LogEntry {
    id: string;
    type: 'thought' | 'action' | 'result' | 'error' | 'system' | 'review';
    agent?: AgentRole;
    content: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    extension?: string;
}

export type WSMessageType =
    | 'connected'
    | 'task.created'
    | 'task.planning'
    | 'plan.ready'
    | 'agent.thought'
    | 'action.started'
    | 'action.progress'
    | 'action.completed'
    | 'review.start'
    | 'review.complete'
    | 'step.completed'
    | 'task.completed'
    | 'task.error'
    | 'task.stopped'
    | 'task.paused'
    | 'task.resumed'
    | 'agent.status'
    | 'file.changed';

export interface WSMessage {
    id: string;
    type: WSMessageType;
    timestamp: string;
    payload: Record<string, unknown>;
}

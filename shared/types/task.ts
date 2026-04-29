// ============================================================
// PRANU v2 — Shared Type Definitions: Task
// Uses const objects + type unions instead of enums
// for better compatibility across packages
// ============================================================

export const TaskStatus = {
    PENDING: 'pending',
    PLANNING: 'planning',
    EXECUTING: 'executing',
    REVIEWING: 'reviewing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    STOPPED: 'stopped',
    PAUSED: 'paused',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const AgentRole = {
    PLANNER: 'planner',
    EXECUTOR: 'executor',
    CRITIC: 'critic',
    MEMORY: 'memory',
} as const;

export type AgentRole = (typeof AgentRole)[keyof typeof AgentRole];

export const AgentState = {
    IDLE: 'idle',
    THINKING: 'thinking',
    ACTING: 'acting',
    ERROR: 'error',
} as const;

export type AgentState = (typeof AgentState)[keyof typeof AgentState];

export const StepStatus = {
    PENDING: 'pending',
    EXECUTING: 'executing',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
    FAILED: 'failed',
} as const;

export type StepStatus = (typeof StepStatus)[keyof typeof StepStatus];

export interface TaskStep {
    id: string;
    stepNumber: number;
    description: string;
    toolHint: string;
    acceptanceCriteria: string;
    status: StepStatus;
    resultSummary?: string;
    retryCount: number;
}

export interface Task {
    id: string;
    description: string;
    status: TaskStatus;
    workspacePath: string;
    plan: TaskStep[];
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

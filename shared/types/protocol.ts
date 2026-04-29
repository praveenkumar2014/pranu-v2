// ============================================================
// PRANU v2 — Shared Type Definitions: Protocol
// WebSocket message protocol (single source of truth)
// ============================================================

export type WSMessageType =
    // Server → Client
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
    | 'file.changed'
    // Client → Server
    | 'task.start'
    | 'task.stop'
    | 'task.pause'
    | 'task.resume'
    | 'chat.message'
    | 'ping'
    | 'pong';

export interface WSMessage<T = unknown> {
    id: string;
    type: WSMessageType;
    timestamp: string;
    payload: T;
}

// Server → Client payloads
export interface ConnectedPayload {
    sessionId: string;
    serverVersion: string;
}

export interface TaskCreatedPayload {
    taskId: string;
    description: string;
    status: string;
}

export interface PlanReadyPayload {
    taskId: string;
    steps: Array<{
        id: string;
        stepNumber: number;
        description: string;
        toolHint: string;
        acceptanceCriteria: string;
    }>;
}

export interface AgentThoughtPayload {
    taskId: string;
    agent: AgentRole;
    thought: string;
    token?: string;
}

export interface ActionStartedPayload {
    taskId: string;
    agent: AgentRole;
    tool: string;
    input: Record<string, unknown>;
}

export interface ActionProgressPayload {
    taskId: string;
    tool: string;
    output: string;
}

export interface ActionCompletedPayload {
    taskId: string;
    agent: AgentRole;
    tool: string;
    result: ToolResult;
    duration: number;
}

export interface ReviewCompletePayload {
    taskId: string;
    approved: boolean;
    feedback: string;
}

export interface StepCompletedPayload {
    taskId: string;
    stepId: string;
    status: string;
}

export interface TaskCompletedPayload {
    taskId: string;
    summary: string;
    stepsCompleted: number;
}

export interface TaskErrorPayload {
    taskId: string;
    error: string;
    stage: string;
}

export interface AgentStatusPayload {
    agent: AgentRole;
    status: AgentState;
    currentTask: string | null;
}

export interface FileChangedPayload {
    path: string;
    action: 'created' | 'modified' | 'deleted';
}

// Client → Server payloads
export interface TaskStartPayload {
    description: string;
    workspacePath?: string;
}

export interface TaskStopPayload {
    taskId: string;
}

export interface TaskPausePayload {
    taskId: string;
}

export interface TaskResumePayload {
    taskId: string;
}

export interface ChatMessagePayload {
    taskId: string;
    message: string;
}

// Re-export enums
export { AgentRole, AgentState } from './task';
export type { ToolResult } from './tool';

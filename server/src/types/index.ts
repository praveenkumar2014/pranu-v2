// ============================================================
// PRANU v2 — Server-side Type Definitions
// ============================================================

// ---- Task Status ----
export type TaskStatus = 'pending' | 'planning' | 'executing' | 'reviewing' | 'completed' | 'failed' | 'stopped' | 'paused';
export const TaskStatus = {
  PENDING: 'pending', PLANNING: 'planning', EXECUTING: 'executing',
  REVIEWING: 'reviewing', COMPLETED: 'completed', FAILED: 'failed',
  STOPPED: 'stopped', PAUSED: 'paused',
} as const;

// ---- Agent Role ----
export type AgentRole = 'planner' | 'executor' | 'critic' | 'memory';
export const AgentRole = {
  PLANNER: 'planner', EXECUTOR: 'executor', CRITIC: 'critic', MEMORY: 'memory',
} as const;

// ---- Agent State ----
export type AgentState = 'idle' | 'thinking' | 'acting' | 'error';
export const AgentState = {
  IDLE: 'idle', THINKING: 'thinking', ACTING: 'acting', ERROR: 'error',
} as const;

// ---- Step Status ----
export type StepStatus = 'pending' | 'executing' | 'completed' | 'rejected' | 'failed';
export const StepStatus = {
  PENDING: 'pending', EXECUTING: 'executing', COMPLETED: 'completed',
  REJECTED: 'rejected', FAILED: 'failed',
} as const;

// ---- Interfaces ----
export interface TaskStep {
  id: string; stepNumber: number; description: string;
  toolHint: string; acceptanceCriteria: string; status: StepStatus;
  resultSummary?: string; retryCount: number;
}

export interface Task {
  id: string; description: string; status: TaskStatus;
  workspacePath: string; plan: TaskStep[]; currentStepIndex: number;
  summary?: string; createdAt: string; completedAt?: string;
}

export interface AgentInfo {
  role: AgentRole; state: AgentState; currentTaskId: string | null;
}

export interface ToolResult {
  success: boolean; output: string; error?: string;
  metadata?: Record<string, unknown>;
}

export interface MemoryEntry {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string; timestamp: string;
  metadata?: { toolName?: string; tokenCount?: number; isTruncated?: boolean };
}

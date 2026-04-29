// ============================================================
// PRANU v2 — Shared Type Definitions: Memory
// ============================================================

export interface MemoryEntry {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: string;
    metadata?: {
        toolName?: string;
        tokenCount?: number;
        isTruncated?: boolean;
    };
}

export interface ShortTermMemory {
    window: MemoryEntry[];
    maxTokens: number;
    maxEntries: number;
}

export interface LongTermMemoryEntry {
    id: string;
    type: 'task_history' | 'codebase_index' | 'pattern';
    data: Record<string, unknown>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

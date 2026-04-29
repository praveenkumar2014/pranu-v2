// ============================================================
// PRANU v2 — Memory Store
// Simple in-memory storage for AI agent state
// ============================================================

import { logger } from '../utils/logger.js';

class MemoryStore {
    private memories: Map<string, string> = new Map();
    private tasks: Map<string, any> = new Map();
    private steps: Map<string, any> = new Map();
    private actions: Map<string, any> = new Map();
    private codebaseIndex: Map<string, any> = new Map();
    private patterns: Map<string, any> = new Map();

    constructor() {
        logger.info('Memory store initialized (in-memory mode)');
    }

    // ---- Memory operations ----

    async set(key: string, value: string): Promise<void> {
        this.memories.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return this.memories.get(key) || null;
    }

    async delete(key: string): Promise<void> {
        this.memories.delete(key);
    }

    async clear(): Promise<void> {
        this.memories.clear();
    }

    async getAll(): Promise<Record<string, string>> {
        return Object.fromEntries(this.memories);
    }

    // ---- Task operations ----

    createTask(task: any): void {
        this.tasks.set(task.id, { ...task, createdAt: Date.now() });
    }

    updateTaskStatus(id: string, status: string, summary?: string): void {
        const task = this.tasks.get(id);
        if (task) {
            this.tasks.set(id, { ...task, status, summary });
        }
    }

    completeTask(id: string, summary: string): void {
        const task = this.tasks.get(id);
        if (task) {
            this.tasks.set(id, { ...task, status: 'completed', summary, completedAt: Date.now() });
        }
    }

    getTask(id: string): any {
        return this.tasks.get(id);
    }

    getAllTasks(): any[] {
        return Array.from(this.tasks.values()).sort((a, b) => b.createdAt - a.createdAt);
    }

    // ---- Step operations ----

    createStep(step: any): void {
        this.steps.set(step.id, step);
    }

    updateStepStatus(id: string, status: string, resultSummary?: string): void {
        const step = this.steps.get(id);
        if (step) {
            this.steps.set(id, { ...step, status, resultSummary });
        }
    }

    incrementStepRetry(id: string): void {
        const step = this.steps.get(id);
        if (step) {
            this.steps.set(id, { ...step, retryCount: (step.retryCount || 0) + 1 });
        }
    }

    getStepsForTask(taskId: string): any[] {
        return Array.from(this.steps.values())
            .filter(step => step.taskId === taskId)
            .sort((a, b) => a.stepNumber - b.stepNumber);
    }

    // ---- Action logging ----

    logAction(action: any): void {
        this.actions.set(action.id, { ...action, createdAt: Date.now() });
    }

    getActionsForTask(taskId: string): any[] {
        return Array.from(this.actions.values())
            .filter(action => action.taskId === taskId)
            .sort((a, b) => a.createdAt - b.createdAt);
    }

    // ---- Codebase index ----

    upsertFileIndex(entry: any): void {
        this.codebaseIndex.set(entry.filePath, { ...entry, lastModified: Date.now() });
    }

    searchCodebase(query: string, limit = 20): any[] {
        const results = Array.from(this.codebaseIndex.values())
            .filter(entry => entry.filePath.toLowerCase().includes(query.toLowerCase()));
        return results.slice(0, limit);
    }

    // ---- Patterns ----

    upsertPattern(pattern: any): void {
        const existing = Array.from(this.patterns.values())
            .find(p => p.patternType === pattern.patternType && p.description === pattern.description);

        if (existing) {
            this.patterns.set(existing.id, { ...existing, occurrenceCount: (existing.occurrenceCount || 0) + 1, lastSeen: Date.now() });
        } else {
            this.patterns.set(pattern.id, { ...pattern, occurrenceCount: 1, lastSeen: Date.now() });
        }
    }

    getRelevantPatterns(tags: string[], limit = 10): any[] {
        const results = Array.from(this.patterns.values())
            .filter(pattern => tags.some(tag => pattern.contextTags?.includes(tag)))
            .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
        return results.slice(0, limit);
    }

    close(): void {
        this.memories.clear();
        this.tasks.clear();
        this.steps.clear();
        this.actions.clear();
        this.codebaseIndex.clear();
        this.patterns.clear();
        logger.info('Memory store closed');
    }
}

// Singleton
let store: MemoryStore | null = null;

export function getMemoryStore(): MemoryStore {
    if (!store) {
        store = new MemoryStore();
    }
    return store;
}

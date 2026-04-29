// ============================================================
// PRANU v2 — Short-Term Memory (In-Memory Sliding Window)
// ============================================================

import type { MemoryEntry } from '../types/index.js';

export class ShortTermMemory {
    private window: MemoryEntry[] = [];
    private readonly maxEntries: number;
    private readonly maxTokens: number;

    constructor(maxEntries = 50, maxTokens = 8000) {
        this.maxEntries = maxEntries;
        this.maxTokens = maxTokens;
    }

    add(entry: MemoryEntry): void {
        this.window.push(entry);
        this.truncate();
    }

    getWindow(): MemoryEntry[] {
        return [...this.window];
    }

    clear(): void {
        this.window = [];
    }

    getMessages(): Array<{ role: string; content: string }> {
        return this.window.map((entry) => ({
            role: entry.role,
            content: entry.content,
        }));
    }

    getSystemContext(): string {
        // Build a condensed context string from recent entries
        const recent = this.window.slice(-20);
        return recent
            .map((entry) => {
                const prefix = entry.metadata?.toolName
                    ? `[${entry.metadata.toolName}]`
                    : `[${entry.role}]`;
                return `${prefix} ${entry.content.substring(0, 500)}`;
            })
            .join('\n');
    }

    private truncate(): void {
        // Remove oldest entries if over max entries
        while (this.window.length > this.maxEntries) {
            this.window.shift();
        }

        // Estimate token count (rough: 1 token ≈ 4 chars)
        let totalChars = this.window.reduce((sum, e) => sum + e.content.length, 0);
        while (totalChars > this.maxTokens * 4 && this.window.length > 5) {
            const removed = this.window.shift();
            if (removed) totalChars -= removed.content.length;
        }
    }
}

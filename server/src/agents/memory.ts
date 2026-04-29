// ============================================================
// PRANU v2 — Memory Agent
// Background agent for context retrieval and storage
// ============================================================

import { BaseAgent, type AgentConfig } from './base.js';
import { AgentRole } from '../types/index.js';

const MEMORY_SYSTEM_PROMPT = `You are a memory management agent. Your job is to store and retrieve relevant context for other agents.

When storing: Extract key information, patterns, and lessons from task execution.
When retrieving: Find the most relevant past context for the current task.

Be concise and focus on actionable information.`;

export class MemoryAgent extends BaseAgent {
    constructor(config: Omit<AgentConfig, 'role' | 'systemPrompt' | 'maxIterations' | 'stepTimeout'>) {
        super({
            ...config,
            role: AgentRole.MEMORY,
            systemPrompt: MEMORY_SYSTEM_PROMPT,
            maxIterations: 1,
            stepTimeout: 30000,
        });
    }

    async run(taskId: string, input: string, context?: string): Promise<string> {
        this.startRun(taskId);

        try {
            const relevantContext = this.retrieveRelevantContext(input);
            return relevantContext;
        } finally {
            this.endRun();
        }
    }

    retrieveRelevantContext(taskDescription: string): string {
        const parts: string[] = [];

        const pastTasks = this.memoryStore.getAllTasks();
        const completedTasks = pastTasks.filter(
            (t: any) => t.status === 'completed' && t.description
        );

        if (completedTasks.length > 0) {
            const keywords = taskDescription.toLowerCase().split(/\s+/);
            const relevant = completedTasks.filter((t: any) => {
                const desc = String(t.description).toLowerCase();
                return keywords.some((kw: string) => kw.length > 3 && desc.includes(kw));
            }).slice(0, 3);

            if (relevant.length > 0) {
                parts.push('### Relevant past tasks:');
                for (const t of relevant) {
                    parts.push(`- "${t.description}" → ${t.summary ?? 'completed'}`);
                }
            }
        }

        const codebaseEntries = this.memoryStore.searchCodebase('', 10);
        if (codebaseEntries.length > 0) {
            parts.push('### Codebase files:');
            for (const entry of codebaseEntries.slice(0, 10)) {
                parts.push(`- ${entry.file_path} (${entry.language}, ${entry.line_count} lines)`);
            }
        }

        const tags = taskDescription.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const patterns = this.memoryStore.getRelevantPatterns(tags);
        if (patterns.length > 0) {
            parts.push('### Learned patterns:');
            for (const p of patterns.slice(0, 5)) {
                parts.push(`- [${p.pattern_type}] ${p.description}`);
            }
        }

        return parts.length > 0 ? parts.join('\n') : 'No relevant context found.';
    }

    storeTaskResult(taskId: string, description: string, summary: string): void {
        const keywords = description.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        this.memoryStore.upsertPattern({
            id: `pattern-${taskId}`,
            patternType: 'successful_approach',
            description: `Task "${description}" → ${summary}`,
            contextTags: JSON.stringify(keywords.slice(0, 5)),
        });
    }

    storeCodebaseIndex(filePath: string, language: string, lineCount: number, contentHash: string): void {
        this.memoryStore.upsertFileIndex({
            id: `idx-${filePath.replace(/[^a-zA-Z0-9]/g, '_')}`,
            filePath,
            language,
            lineCount,
            contentHash,
        });
    }
}

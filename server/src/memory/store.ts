// ============================================================
// PRANU v2 — Memory Store (SQLite-backed)
// ============================================================

import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { config } from '../config.js';

export class MemoryStore {
    private db: Database.Database;

    constructor(dbPath?: string) {
        const path = dbPath ?? config.DB_PATH;
        // Ensure directory exists
        mkdirSync(dirname(path), { recursive: true });

        this.db = new Database(path);
        this.db.pragma('journal_mode = WAL');
        this.initialize();
    }

    private initialize(): void {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        workspace_path TEXT,
        plan_json TEXT,
        summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS task_steps (
        id TEXT PRIMARY KEY,
        task_id TEXT REFERENCES tasks(id),
        step_number INTEGER,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        acceptance_criteria TEXT,
        tool_hint TEXT,
        result_summary TEXT,
        retry_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS agent_actions (
        id TEXT PRIMARY KEY,
        task_id TEXT REFERENCES tasks(id),
        step_id TEXT REFERENCES task_steps(id),
        agent_name TEXT NOT NULL,
        action_type TEXT NOT NULL,
        tool_name TEXT,
        input_json TEXT,
        output_json TEXT,
        duration_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS codebase_index (
        id TEXT PRIMARY KEY,
        file_path TEXT NOT NULL UNIQUE,
        language TEXT,
        line_count INTEGER,
        imports_json TEXT,
        last_modified DATETIME,
        content_hash TEXT
      );

      CREATE TABLE IF NOT EXISTS patterns (
        id TEXT PRIMARY KEY,
        pattern_type TEXT NOT NULL,
        description TEXT NOT NULL,
        context_tags TEXT,
        occurrence_count INTEGER DEFAULT 1,
        last_seen DATETIME,
        example_json TEXT
      );
    `);
    }

    // ---- Task operations ----

    createTask(task: {
        id: string;
        description: string;
        status: string;
        workspacePath: string;
    }): void {
        this.db
            .prepare('INSERT INTO tasks (id, description, status, workspace_path) VALUES (?, ?, ?, ?)')
            .run(task.id, task.description, task.status, task.workspacePath);
    }

    updateTaskStatus(id: string, status: string, summary?: string): void {
        if (summary) {
            this.db
                .prepare('UPDATE tasks SET status = ?, summary = ? WHERE id = ?')
                .run(status, summary, id);
        } else {
            this.db
                .prepare('UPDATE tasks SET status = ? WHERE id = ?')
                .run(status, id);
        }
    }

    completeTask(id: string, summary: string): void {
        this.db
            .prepare('UPDATE tasks SET status = ?, summary = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run('completed', summary, id);
    }

    getTask(id: string): Record<string, unknown> | undefined {
        return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    }

    getAllTasks(): Record<string, unknown>[] {
        return this.db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as Record<string, unknown>[];
    }

    // ---- Step operations ----

    createStep(step: {
        id: string;
        taskId: string;
        stepNumber: number;
        description: string;
        status: string;
        acceptanceCriteria: string;
        toolHint: string;
    }): void {
        this.db
            .prepare(`INSERT INTO task_steps (id, task_id, step_number, description, status, acceptance_criteria, tool_hint)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
            .run(step.id, step.taskId, step.stepNumber, step.description, step.status, step.acceptanceCriteria, step.toolHint);
    }

    updateStepStatus(id: string, status: string, resultSummary?: string): void {
        if (resultSummary) {
            this.db
                .prepare('UPDATE task_steps SET status = ?, result_summary = ? WHERE id = ?')
                .run(status, resultSummary, id);
        } else {
            this.db
                .prepare('UPDATE task_steps SET status = ? WHERE id = ?')
                .run(status, id);
        }
    }

    incrementStepRetry(id: string): void {
        this.db
            .prepare('UPDATE task_steps SET retry_count = retry_count + 1 WHERE id = ?')
            .run(id);
    }

    getStepsForTask(taskId: string): Record<string, unknown>[] {
        return this.db
            .prepare('SELECT * FROM task_steps WHERE task_id = ? ORDER BY step_number')
            .all(taskId) as Record<string, unknown>[];
    }

    // ---- Action logging ----

    logAction(action: {
        id: string;
        taskId: string;
        stepId: string;
        agentName: string;
        actionType: string;
        toolName?: string;
        inputJson?: string;
        outputJson?: string;
        durationMs?: number;
    }): void {
        this.db
            .prepare(`INSERT INTO agent_actions (id, task_id, step_id, agent_name, action_type, tool_name, input_json, output_json, duration_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(
                action.id,
                action.taskId,
                action.stepId,
                action.agentName,
                action.actionType,
                action.toolName ?? null,
                action.inputJson ?? null,
                action.outputJson ?? null,
                action.durationMs ?? null
            );
    }

    getActionsForTask(taskId: string): Record<string, unknown>[] {
        return this.db
            .prepare('SELECT * FROM agent_actions WHERE task_id = ? ORDER BY created_at')
            .all(taskId) as Record<string, unknown>[];
    }

    // ---- Codebase index ----

    upsertFileIndex(entry: {
        id: string;
        filePath: string;
        language: string;
        lineCount: number;
        importsJson?: string;
        contentHash: string;
    }): void {
        this.db
            .prepare(`INSERT INTO codebase_index (id, file_path, language, line_count, imports_json, last_modified, content_hash)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        ON CONFLICT(file_path) DO UPDATE SET
          language = excluded.language,
          line_count = excluded.line_count,
          imports_json = excluded.imports_json,
          last_modified = CURRENT_TIMESTAMP,
          content_hash = excluded.content_hash`)
            .run(entry.id, entry.filePath, entry.language, entry.lineCount, entry.importsJson ?? null, entry.contentHash);
    }

    searchCodebase(query: string, limit = 20): Record<string, unknown>[] {
        return this.db
            .prepare('SELECT * FROM codebase_index WHERE file_path LIKE ? LIMIT ?')
            .all(`%${query}%`, limit) as Record<string, unknown>[];
    }

    // ---- Patterns ----

    upsertPattern(pattern: {
        id: string;
        patternType: string;
        description: string;
        contextTags?: string;
        exampleJson?: string;
    }): void {
        const existing = this.db
            .prepare('SELECT id, occurrence_count FROM patterns WHERE pattern_type = ? AND description = ?')
            .get(pattern.patternType, pattern.description) as Record<string, unknown> | undefined;

        if (existing) {
            this.db
                .prepare('UPDATE patterns SET occurrence_count = occurrence_count + 1, last_seen = CURRENT_TIMESTAMP WHERE id = ?')
                .run(existing.id as string);
        } else {
            this.db
                .prepare(`INSERT INTO patterns (id, pattern_type, description, context_tags, example_json)
          VALUES (?, ?, ?, ?, ?)`)
                .run(pattern.id, pattern.patternType, pattern.description, pattern.contextTags ?? null, pattern.exampleJson ?? null);
        }
    }

    getRelevantPatterns(tags: string[], limit = 10): Record<string, unknown>[] {
        const placeholders = tags.map(() => 'context_tags LIKE ?').join(' OR ');
        if (!placeholders) return [];
        return this.db
            .prepare(`SELECT * FROM patterns WHERE ${placeholders} ORDER BY occurrence_count DESC LIMIT ?`)
            .all(...tags.map((t) => `%${t}%`), limit) as Record<string, unknown>[];
    }

    close(): void {
        this.db.close();
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

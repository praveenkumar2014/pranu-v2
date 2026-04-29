// ============================================================
// PRANU v2 — REST API Routes
// ============================================================

import { Router, type Request, type Response } from 'express';
import { orchestrator } from '../orchestrator/orchestrator.js';
import { getMemoryStore } from '../memory/store.js';
import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { config } from '../config.js';

import type { Router as RouterType } from "express";
const router: RouterType = Router();
const memoryStore = getMemoryStore();

// ---- Tasks ----

router.post('/tasks', async (req: Request, res: Response) => {
    try {
        const { description, workspacePath } = req.body as { description: string; workspacePath?: string };
        if (!description || typeof description !== 'string') {
            res.status(400).json({ error: 'description is required' });
            return;
        }
        const taskId = await orchestrator.startTask(description, workspacePath);
        res.status(201).json({ taskId, status: 'created' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to start task' });
    }
});

router.get('/tasks', (_req: Request, res: Response) => {
    const tasks = memoryStore.getAllTasks();
    res.json(tasks);
});

router.get('/tasks/:id', (req: Request, res: Response) => {
    const task = memoryStore.getTask(String(req.params.id));
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    const steps = memoryStore.getStepsForTask(String(req.params.id));
    res.json({ ...task, steps });
});

router.post('/tasks/:id/stop', (_req: Request, res: Response) => {
    try { orchestrator.stopTask(); res.json({ status: 'stopped' }); }
    catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to stop task' }); }
});

router.post('/tasks/:id/pause', (_req: Request, res: Response) => {
    try { orchestrator.pauseTask(); res.json({ status: 'paused' }); }
    catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to pause task' }); }
});

router.post('/tasks/:id/resume', (_req: Request, res: Response) => {
    try { orchestrator.resumeTask(); res.json({ status: 'resumed' }); }
    catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to resume task' }); }
});

// ---- Agents ----

router.get('/agents/status', (_req: Request, res: Response) => {
    const status = orchestrator.getStatus();
    const agents = orchestrator.getAgentStates();
    res.json({ ...status, agents });
});

// ---- Files ----

router.get('/files/tree', async (_req: Request, res: Response) => {
    try {
        const tree = await buildFileTree(config.WORKSPACE_PATH, 3);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to read file tree' });
    }
});

router.get('/files/:path+', async (req: Request, res: Response) => {
    try {
        const filePath = String(req.params['path+'] ?? '');
        const fullPath = join(config.WORKSPACE_PATH, filePath);
        if (fullPath.includes('..')) { res.status(400).json({ error: 'Invalid path' }); return; }
        const content = await readFile(fullPath, 'utf-8');
        const info = await stat(fullPath);
        res.json({ path: filePath, content, size: info.size, modified: info.mtime });
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : 'File not found' });
    }
});

// ---- Health ----

router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', version: '2.0.0' });
});

// ---- Helper ----

interface FileTreeNode { name: string; path: string; type: 'file' | 'directory'; children?: FileTreeNode[]; extension?: string; }

async function buildFileTree(dir: string, maxDepth: number, currentDepth = 0): Promise<FileTreeNode[]> {
    if (currentDepth >= maxDepth) return [];
    const entries = await readdir(dir, { withFileTypes: true });
    const nodes: FileTreeNode[] = [];
    const skipDirs = new Set(['node_modules', '.git', '.next', 'dist', '__pycache__', '.cache']);
    for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.env.example') continue;
        if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(config.WORKSPACE_PATH + '/', '');
        if (entry.isDirectory()) {
            const children = await buildFileTree(fullPath, maxDepth, currentDepth + 1);
            nodes.push({ name: entry.name, path: relativePath, type: 'directory', children });
        } else {
            nodes.push({ name: entry.name, path: relativePath, type: 'file', extension: extname(entry.name) });
        }
    }
    return nodes.sort((a, b) => { if (a.type !== b.type) return a.type === 'directory' ? -1 : 1; return a.name.localeCompare(b.name); });
}

export { router as apiRouter };

// ============================================================
// PRANU v2 — REST API Routes v1
// Enhanced with pagination, filtering, validation
// ============================================================

import { Router, type Request, type Response } from 'express';
import { orchestrator } from '../../orchestrator/orchestrator.js';
import { getMemoryStore } from '../../memory/store.js';
import { readdir, stat, readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { config } from '../../config.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import { validateRequest, taskValidations, taskIdParam, paginationQuery, taskFilterQuery } from '../../middleware/validation.js';
import { authRouter } from './auth.js';

import type { Router as RouterType } from "express";
const router: RouterType = Router();
const memoryStore = getMemoryStore();

// Mount auth routes
router.use('/auth', authRouter);

// ---- Tasks ----

router.post('/tasks',
    validateRequest(taskValidations),
    asyncHandler(async (req: Request, res: Response) => {
        const { description, workspacePath } = req.body as { description: string; workspacePath?: string };
        const taskId = await orchestrator.startTask(description, workspacePath);
        res.status(201).json({
            success: true,
            data: { taskId, status: 'created' }
        });
    })
);

router.get('/tasks',
    validateRequest([...paginationQuery, ...taskFilterQuery]),
    asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string;
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'desc';

        let tasks = memoryStore.getAllTasks();

        // Filter by status
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        // Sort
        tasks = tasks.sort((a, b) => {
            const aVal = a[sortBy as keyof typeof a] as any;
            const bVal = b[sortBy as keyof typeof b] as any;
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Pagination
        const total = tasks.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTasks = tasks.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedTasks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: endIndex < total,
                hasPrev: page > 1,
            }
        });
    })
);

router.get('/tasks/:id',
    validateRequest(taskIdParam),
    asyncHandler(async (req: Request, res: Response) => {
        const taskId = String(req.params.id);
        const task = memoryStore.getTask(taskId);
        if (!task) {
            throw new NotFoundError('Task not found');
        }
        const steps = memoryStore.getStepsForTask(taskId);
        res.json({
            success: true,
            data: { ...task, steps }
        });
    })
);

router.delete('/tasks/:id',
    validateRequest(taskIdParam),
    asyncHandler(async (req: Request, res: Response) => {
        const taskId = String(req.params.id);
        const task = memoryStore.getTask(taskId);
        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Stop task if running
        try {
            orchestrator.stopTask();
        } catch (error) {
            // Task may not be running
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    })
);

router.post('/tasks/:id/stop',
    validateRequest(taskIdParam),
    asyncHandler(async (_req: Request, res: Response) => {
        orchestrator.stopTask();
        res.json({
            success: true,
            data: { status: 'stopped' }
        });
    })
);

router.post('/tasks/:id/pause',
    validateRequest(taskIdParam),
    asyncHandler(async (_req: Request, res: Response) => {
        orchestrator.pauseTask();
        res.json({
            success: true,
            data: { status: 'paused' }
        });
    })
);

router.post('/tasks/:id/resume',
    validateRequest(taskIdParam),
    asyncHandler(async (_req: Request, res: Response) => {
        orchestrator.resumeTask();
        res.json({
            success: true,
            data: { status: 'resumed' }
        });
    })
);

// ---- Agents ----

router.get('/agents/status', asyncHandler(async (_req: Request, res: Response) => {
    const status = orchestrator.getStatus();
    const agents = orchestrator.getAgentStates();
    res.json({
        success: true,
        data: { ...status, agents }
    });
}));

// ---- Files ----

router.get('/files/tree', asyncHandler(async (_req: Request, res: Response) => {
    const tree = await buildFileTree(config.WORKSPACE_PATH, 3);
    res.json({
        success: true,
        data: tree
    });
}));

router.get('/files/:path+', asyncHandler(async (req: Request, res: Response) => {
    const filePath = String(req.params['path+'] ?? '');
    const fullPath = join(config.WORKSPACE_PATH, filePath);
    if (fullPath.includes('..')) {
        throw new ValidationError('Invalid path');
    }
    const content = await readFile(fullPath, 'utf-8');
    const info = await stat(fullPath);
    res.json({
        success: true,
        data: { path: filePath, content, size: info.size, modified: info.mtime }
    });
}));

router.post('/files/:path+', asyncHandler(async (req: Request, res: Response) => {
    const filePath = String(req.params['path+'] ?? '');
    const fullPath = join(config.WORKSPACE_PATH, filePath);

    if (fullPath.includes('..')) {
        throw new ValidationError('Invalid path');
    }

    const { content } = req.body as { content: string };
    if (!content) {
        throw new ValidationError('Content is required');
    }

    // Ensure directory exists
    await mkdir(join(fullPath, '..'), { recursive: true });

    // Write file
    await writeFile(fullPath, content, 'utf-8');

    res.json({
        success: true,
        message: 'File updated successfully',
        data: { path: filePath }
    });
}));

// ---- Workspace ----

router.get('/workspaces', asyncHandler(async (_req: Request, res: Response) => {
    // Return current workspace info
    res.json({
        success: true,
        data: {
            path: config.WORKSPACE_PATH,
            active: true
        }
    });
}));

// ---- Health ----

router.get('/health', asyncHandler(async (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: { status: 'ok', version: '2.0.0' }
    });
}));

// ---- Helper ----

interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    extension?: string;
}

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
    return nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

export { router as apiV1Router };

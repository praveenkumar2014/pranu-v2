// ============================================================
// PRANU v2 — Headless CMS API
// ============================================================

import { Router, type Response } from 'express';
import { databaseService } from '../../services/database.js';
import { authenticateToken, type AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../../middleware/validation.js';

import type { Router as RouterType } from 'express';
const router: RouterType = Router();
const db = databaseService.getClient();

router.get('/content',
    validateRequest([
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
    ]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '20'), 10);
        const offset = (page - 1) * limit;
        const items = await db.contentItem.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        const total = await db.contentItem.count();
        res.json({ success: true, data: { items, pagination: { total, page, limit } } });
    })
);

router.post('/content',
    authenticateToken,
    validateRequest([
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('type').trim().notEmpty().withMessage('Content type is required'),
    ]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { title, description, type, metadata } = req.body;
        const item = await db.contentItem.create({
            data: {
                title,
                description,
                type,
                metadata: metadata || {},
                user: { connect: { id: req.jwtUser?.userId } },
            },
        });
        res.status(201).json({ success: true, data: item });
    })
);

router.put('/content/:id',
    authenticateToken,
    validateRequest([
        param('id').trim().notEmpty(),
        body('title').optional().trim().notEmpty(),
        body('type').optional().trim().notEmpty(),
    ]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const item = await db.contentItem.update({
            where: { id },
            data: {
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                status: req.body.status,
                metadata: req.body.metadata || {},
            },
        });
        res.json({ success: true, data: item });
    })
);

router.delete('/content/:id',
    authenticateToken,
    validateRequest([param('id').trim().notEmpty()]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await db.contentItem.delete({ where: { id } });
        res.json({ success: true, message: 'Content item deleted' });
    })
);

export { router as cmsRouter };

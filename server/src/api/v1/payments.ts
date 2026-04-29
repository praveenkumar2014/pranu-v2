// ============================================================
// PRANU v2 — Billing API
// Subscription and payment tracking.
// ============================================================

import { Router, type Response } from 'express';
import { databaseService } from '../../services/database.js';
import { authenticateToken, type AuthRequest } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validation.js';

import type { Router as RouterType } from 'express';
const router: RouterType = Router();
const db = databaseService.getClient();

router.post('/subscriptions',
    authenticateToken,
    validateRequest([
        body('plan').trim().notEmpty().withMessage('Plan is required'),
        body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
        body('currency').trim().notEmpty().withMessage('Currency is required'),
    ]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { plan, amount, currency, provider } = req.body;
        const subscription = await db.paymentSubscription.create({
            data: {
                provider: provider || 'upi',
                plan,
                status: 'pending',
                amount: Number(amount),
                currency,
                metadata: { source: 'frontend' },
                user: { connect: { id: req.jwtUser!.userId } },
            },
        });
        res.status(201).json({ success: true, data: subscription });
    })
);

router.get('/subscriptions',
    authenticateToken,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const subscriptions = await db.paymentSubscription.findMany({
            where: { userId: req.jwtUser!.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: subscriptions });
    })
);

router.post('/subscriptions/:id/confirm',
    authenticateToken,
    validateRequest([body('status').trim().notEmpty().withMessage('Status is required')]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const updated = await db.paymentSubscription.update({
            where: { id },
            data: { status: req.body.status },
        });
        res.json({ success: true, data: updated });
    })
);

export { router as paymentsRouter };

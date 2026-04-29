// ============================================================
// PRANU v2 — AI API
// Chat and content generation endpoints.
// ============================================================

import { Router, type Request, type Response } from 'express';
import { aiService } from '../../services/aiService.js';
import { authenticateToken } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validation.js';

import type { Router as RouterType } from 'express';
const router: RouterType = Router();

router.get('/models', asyncHandler(async (_req: Request, res: Response) => {
    const models = aiService.getAvailableModels();
    res.json({ success: true, data: models });
}));

router.post('/chat',
    authenticateToken,
    validateRequest([
        body('messages').isArray({ min: 1 }).withMessage('Messages array is required'),
        body('provider').optional().isString(),
        body('model').optional().isString(),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const { messages, provider, model } = req.body;
        const result = await aiService.createChat({ provider, model, messages });
        res.json({ success: true, data: result });
    })
);

router.post('/generate',
    authenticateToken,
    validateRequest([
        body('prompt').trim().notEmpty().withMessage('Prompt is required'),
        body('type').trim().notEmpty().withMessage('Content type is required'),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const { prompt, type } = req.body;
        const result = await aiService.generateContent(prompt, type);
        res.json({ success: true, data: result });
    })
);

export { router as aiRouter };

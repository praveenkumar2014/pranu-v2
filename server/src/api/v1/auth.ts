// ============================================================
// PRANU v2 — Authentication Routes
// ============================================================

import { Router, Request, Response } from 'express';
import { authService } from '../../services/authService.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken, AuthRequest } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/security.js';
import { body } from 'express-validator';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Register
router.post('/register',
    authRateLimiter,
    validateRequest(registerValidation),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, password, name } = req.body;
        const result = await authService.register({ email, password, name });

        res.status(201).json({
            success: true,
            data: {
                user: result.user,
                tokens: result.tokens,
            },
        });
    })
);

// Login
router.post('/login',
    authRateLimiter,
    validateRequest(loginValidation),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });

        res.json({
            success: true,
            data: {
                user: result.user,
                tokens: result.tokens,
            },
        });
    })
);

// Refresh token
router.post('/refresh',
    asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' },
            });
            return;
        }

        const tokens = await authService.refreshToken(refreshToken);

        res.json({
            success: true,
            data: tokens,
        });
    })
);

// Logout
router.post('/logout',
    asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    })
);

// Logout from all devices
router.post('/logout-all',
    authenticateToken,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.jwtUser!.userId;
        await authService.logoutAll(userId);

        res.json({
            success: true,
            message: 'Logged out from all devices',
        });
    })
);

// Get current user profile
router.get('/profile',
    authenticateToken,
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.jwtUser!.userId;
        const profile = await authService.getProfile(userId);

        res.json({
            success: true,
            data: profile,
        });
    })
);

// Update profile
router.put('/profile',
    authenticateToken,
    validateRequest([
        body('email').optional().isEmail().withMessage('Valid email required'),
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    ]),
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.jwtUser!.userId;
        const updates = req.body;

        const updatedProfile = await authService.updateProfile(userId, updates);

        res.json({
            success: true,
            data: updatedProfile,
        });
    })
);

export { router as authRouter };

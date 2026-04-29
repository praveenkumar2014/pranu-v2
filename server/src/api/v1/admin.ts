// ============================================================
// PRANU v2 — Admin & Role Management API
// ============================================================

import { Router, type Request, type Response } from 'express';
import { userService } from '../../services/userService.js';
import { roleService } from '../../services/roleService.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../../middleware/validation.js';

import type { Router as RouterType } from 'express';
const router: RouterType = Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Roles
router.get('/roles', asyncHandler(async (_req: Request, res: Response) => {
    const roles = await roleService.listRoles();
    res.json({ success: true, data: roles });
}));

router.post('/roles',
    validateRequest([
        body('name').trim().notEmpty().withMessage('Role name is required'),
        body('description').trim().notEmpty().withMessage('Role description is required'),
        body('permissions').isArray().withMessage('Permissions must be an array of strings'),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const { name, description, permissions } = req.body;
        const role = await roleService.createRole(name, description, permissions);
        res.status(201).json({ success: true, data: role });
    })
);

router.put('/roles/:id',
    validateRequest([
        param('id').trim().notEmpty(),
        body('permissions').isArray().withMessage('Permissions must be an array of strings'),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { permissions } = req.body;
        const role = await roleService.updateRolePermissions(id, permissions);
        res.json({ success: true, data: role });
    })
);

// Users
router.get('/users',
    validateRequest([
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '20'), 10);
        const offset = (page - 1) * limit;
        const users = await userService.listUsers(limit, offset);
        res.json({ success: true, data: users });
    })
);

router.get('/users/:id',
    validateRequest([param('id').trim().notEmpty()]),
    asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: { message: 'User not found' } });
        }
        res.json({ success: true, data: user });
    })
);

router.put('/users/:id',
    validateRequest([
        param('id').trim().notEmpty(),
        body('name').optional().trim().notEmpty(),
        body('email').optional().isEmail(),
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json({ success: true, data: user });
    })
);

export { router as adminRouter };

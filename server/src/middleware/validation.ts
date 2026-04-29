// ============================================================
// PRANU v2 — Request Validation Middleware
// ============================================================

import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './errorHandler.js';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export function validateRequest(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError('Validation failed', errors.array());
        }

        next();
    };
}

// Common validation rules
import { body, param, query } from 'express-validator';

export const taskValidations = [
    body('description')
        .trim()
        .isString()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Description must be between 1 and 5000 characters'),
    body('workspacePath')
        .optional()
        .trim()
        .isString()
        .isLength({ min: 1, max: 500 })
        .withMessage('Workspace path must be a valid string'),
];

export const taskIdParam = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('Task ID is required')
        .isString()
        .withMessage('Task ID must be a string'),
];

export const paginationQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

export const taskFilterQuery = [
    query('status')
        .optional()
        .isIn(['pending', 'planning', 'executing', 'reviewing', 'completed', 'failed', 'stopped', 'paused'])
        .withMessage('Invalid status filter'),
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'completedAt', 'status'])
        .withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
];

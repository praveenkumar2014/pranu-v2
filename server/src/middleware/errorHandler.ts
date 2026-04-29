// ============================================================
// PRANU v2 — Centralized Error Handling
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;
    public details?: any;

    constructor(message: string, statusCode: number, code?: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Validation error
export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

// Authentication error
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

// Authorization error
export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

// Not found error
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

// Error handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    // Log the error
    if (err instanceof AppError) {
        logger.warn(`${err.code}: ${err.message}`, {
            statusCode: err.statusCode,
            path: req.originalUrl,
            method: req.method,
            details: err.details,
        });

        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        });
    } else {
        // Unexpected error
        logger.error(`Unexpected error: ${err.message}`, {
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
        });

        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: config.NODE_ENV === 'production' 
                    ? 'Internal server error' 
                    : err.message,
            },
        });
    }
}

// Async error handler wrapper
export function asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// 404 handler
export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.originalUrl} not found`,
        },
    });
}

import { config } from '../config.js';

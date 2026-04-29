// ============================================================
// PRANU v2 — Authentication Middleware
// JWT verification and role-based access control
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AuthenticationError, AuthorizationError } from './errorHandler.js';
import { roleService } from '../services/roleService.js';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    jwtUser?: JwtPayload;
}

// Verify JWT token
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        throw new AuthenticationError('Access token required');
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        req.jwtUser = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthenticationError('Token expired');
        }
        throw new AuthenticationError('Invalid token');
    }
}

// Optional authentication (doesn't fail if no token)
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        req.jwtUser = decoded;
    } catch (error) {
        // Invalid token, but continue without user
    }

    next();
}

// Role-based access control
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.jwtUser) {
            throw new AuthenticationError('Authentication required');
        }

        if (!roles.includes(req.jwtUser.role)) {
            throw new AuthorizationError('Insufficient permissions');
        }

        next();
    };
}

export function requirePermission(permission: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.jwtUser) {
            throw new AuthenticationError('Authentication required');
        }

        const hasPermission = await roleService.userHasPermission(req.jwtUser.userId, permission);
        if (!hasPermission) {
            throw new AuthorizationError('Insufficient permissions');
        }

        next();
    };
}

// Admin only
export const requireAdmin = requireRole('ADMIN');

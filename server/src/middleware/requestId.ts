// ============================================================
// PRANU v2 — Request ID Middleware
// Adds unique request ID for tracking
// ============================================================

import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] as string || uuid();
    
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    
    next();
}

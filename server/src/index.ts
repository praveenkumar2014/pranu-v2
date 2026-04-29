// ============================================================
// PRANU v2 — Server Entry Point
// Starts Express HTTP server and WebSocket server
// ============================================================

import express from 'express';
import { mkdirSync } from 'fs';
import { config } from './config.js';
import { apiV1Router } from './api/v1/routes.js';
import { WSServer } from './websocket/server.js';
import { sandboxManager } from './sandbox/manager.js';
import { securityHeaders, rateLimiter, corsConfig, requestSizeLimit } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './utils/logger.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { databaseService } from './services/database.js';

// Declare xss-clean module (no types available)
declare function xss(): any;

async function main() {
    console.log('🚀 Starting PRANU v2...');

    // Initialize database
    databaseService.initialize();

    // Initialize sandbox
    await sandboxManager.initialize();

    // Create logs directory
    try {
        mkdirSync('logs', { recursive: true });
    } catch (error) {
        // Directory may already exist
    }

    // Express server
    const app = express();

    // Trust proxy (for rate limiting behind reverse proxy)
    app.set('trust proxy', 1);

    // Middleware
    app.use(requestIdMiddleware); // Add request ID tracking
    app.use(corsConfig); // CORS
    app.use(securityHeaders); // Helmet security headers
    app.use(xss()); // XSS protection
    app.use(rateLimiter); // Rate limiting
    app.use(requestSizeLimit); // Request size limit
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(requestLogger); // Request logging

    // API routes v1
    app.use('/api/v1', apiV1Router);

    // Keep old routes for backward compatibility (deprecated)
    const { apiRouter } = await import('./api/routes.js');
    app.use('/api', apiRouter);

    // 404 handler
    app.use(notFoundHandler);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start HTTP server
    app.listen(config.PORT, () => {
        console.log(`📡 API server started on http://localhost:${config.PORT}`);
        console.log(`📝 API v1: http://localhost:${config.PORT}/api/v1`);
    });

    // Start WebSocket server
    const wsServer = new WSServer(config.WS_PORT);

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down...');
        wsServer.close();
        await sandboxManager.destroyAll();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🛑 Shutting down...');
        wsServer.close();
        await sandboxManager.destroyAll();
        process.exit(0);
    });

    console.log('✅ PRANU v2 is ready');
}

main().catch((error) => {
    console.error('Failed to start PRANU v2:', error);
    process.exit(1);
});

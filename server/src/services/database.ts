// ============================================================
// PRANU v2 — Database Service
// Uses Prisma for PostgreSQL / SQLite support
// ============================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

class DatabaseService {
    private prisma: PrismaClient | null = null;

    initialize(): PrismaClient {
        if (this.prisma) {
            return this.prisma;
        }

        this.prisma = new PrismaClient({
            log: [{ level: 'warn', emit: 'stdout' }, { level: 'error', emit: 'stdout' }],
        });

        logger.info('Prisma client initialized');
        return this.prisma;
    }

    getClient(): PrismaClient {
        if (!this.prisma) {
            return this.initialize();
        }
        return this.prisma;
    }

    async disconnect(): Promise<void> {
        if (this.prisma) {
            await this.prisma.$disconnect();
            logger.info('Prisma connection closed');
        }
    }
}

export const databaseService = new DatabaseService();

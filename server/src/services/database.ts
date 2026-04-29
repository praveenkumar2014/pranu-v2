// ============================================================
// PRANU v2 — Database Service
// Centralized database connection and management
// ============================================================

import Database from 'better-sqlite3';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

class DatabaseService {
    private db: Database.Database | null = null;

    initialize(): Database.Database {
        if (this.db) {
            return this.db;
        }

        // Ensure data directory exists
        const dbPath = config.DB_PATH;
        const dbDir = dirname(dbPath);

        if (!existsSync(dbDir)) {
            mkdirSync(dbDir, { recursive: true });
            logger.info(`Created database directory: ${dbDir}`);
        }

        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');

        logger.info(`Database initialized: ${dbPath}`);
        return this.db;
    }

    getDatabase(): Database.Database {
        if (!this.db) {
            return this.initialize();
        }
        return this.db;
    }

    close(): void {
        if (this.db) {
            this.db.close();
            logger.info('Database connection closed');
        }
    }
}

export const databaseService = new DatabaseService();

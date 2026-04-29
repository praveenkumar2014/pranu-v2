// ============================================================
// PRANU v2 — User Model & Database
// ============================================================

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { databaseService } from './database.js';
import { logger } from '../utils/logger.js';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'user';
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserInput {
    email: string;
    password: string;
    name: string;
    role?: 'admin' | 'user';
}

export class UserService {
    private db: Database.Database;

    constructor() {
        this.db = databaseService.getDatabase();
        this.initializeTables();
    }

    private initializeTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                email_verified INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        logger.info('User tables initialized');
    }

    // Create user
    async createUser(input: UserInput): Promise<Omit<User, 'password'>> {
        const existingUser = this.db.prepare('SELECT id FROM users WHERE email = ?').get(input.email);

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const id = uuid();
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const role = input.role || 'user';

        this.db.prepare(`
            INSERT INTO users (id, email, password, name, role)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, input.email, hashedPassword, input.name, role);

        logger.info(`User created: ${input.email}`);

        return this.getUserById(id)!;
    }

    // Get user by ID
    getUserById(id: string): Omit<User, 'password'> | null {
        const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;

        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // Get user by email
    getUserByEmail(email: string): User | null {
        return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined || null;
    }

    // Verify password
    async verifyPassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }

    // Update user
    async updateUser(id: string, updates: Partial<Pick<UserInput, 'name' | 'email'>>): Promise<Omit<User, 'password'>> {
        const user = this.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (updates.email) {
            const existing = this.db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(updates.email, id);
            if (existing) {
                throw new Error('Email already in use');
            }
        }

        this.db.prepare(`
            UPDATE users 
            SET email = COALESCE(?, email), 
                name = COALESCE(?, name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(updates.email, updates.name, id);

        logger.info(`User updated: ${id}`);
        return this.getUserById(id)!;
    }

    // Delete user
    deleteUser(id: string): boolean {
        const result = this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return result.changes > 0;
    }

    // List users (with pagination)
    listUsers(limit: number = 20, offset: number = 0): { users: Array<Omit<User, 'password'>>; total: number } {
        const users = this.db.prepare(`
            SELECT * FROM users 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `).all(limit, offset) as User[];

        const total = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

        return {
            users: users.map(({ password, ...user }) => user),
            total: total.count,
        };
    }

    // Refresh token management
    createRefreshToken(userId: string): string {
        const tokenId = uuid();
        const token = uuid();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

        this.db.prepare(`
            INSERT INTO refresh_tokens (id, user_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        `).run(tokenId, userId, token, expiresAt);

        return token;
    }

    verifyRefreshToken(token: string): string | null {
        const refreshToken = this.db.prepare(`
            SELECT * FROM refresh_tokens 
            WHERE token = ? AND expires_at > CURRENT_TIMESTAMP
        `).get(token) as { user_id: string } | undefined;

        if (!refreshToken) return null;

        return refreshToken.user_id;
    }

    revokeRefreshToken(token: string): boolean {
        const result = this.db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
        return result.changes > 0;
    }

    revokeAllUserTokens(userId: string): void {
        this.db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
        logger.info(`All tokens revoked for user: ${userId}`);
    }
}

export const userService = new UserService();

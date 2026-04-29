// ============================================================
// PRANU v2 — User Service
// Uses Prisma for user, refresh token, and RBAC storage.
// ============================================================

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { databaseService } from './database.js';
import { logger } from '../utils/logger.js';

export interface UserInput {
    email: string;
    password?: string;
    name: string;
    role?: string;
}

export class UserService {
    private db: PrismaClient;

    constructor() {
        this.db = databaseService.getClient();
    }

    async createUser(input: UserInput): Promise<Omit<PrismaUser, 'password'>> {
        const existing = await this.db.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw new Error('User with this email already exists');
        }

        const roleName = input.role || 'USER';
        const role = await this.db.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, description: 'Default role', permissions: [] },
        });

        const hashedPassword = input.password ? await bcrypt.hash(input.password, 12) : null;

        const user = await this.db.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                name: input.name,
                role: { connect: { id: role.id } },
            },
            include: { role: true },
        });

        logger.info(`User created: ${input.email}`);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserById(id: string): Promise<Omit<PrismaUser, 'password'> | null> {
        const user = await this.db.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user) return null;
        const { password, ...rest } = user;
        return rest;
    }

    async getUserByEmail(email: string): Promise<PrismaUser | null> {
        return this.db.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }

    async verifyPassword(user: PrismaUser, password: string): Promise<boolean> {
        if (!user.password) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }

    async updateUser(id: string, updates: Partial<Pick<UserInput, 'name' | 'email'>>): Promise<Omit<PrismaUser, 'password'>> {
        const user = await this.db.user.findUnique({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        if (updates.email) {
            const existing = await this.db.user.findUnique({ where: { email: updates.email } });
            if (existing && existing.id !== id) {
                throw new Error('Email already in use');
            }
        }

        const updated = await this.db.user.update({
            where: { id },
            data: {
                email: updates.email ?? undefined,
                name: updates.name ?? undefined,
            },
            include: { role: true },
        });

        const { password, ...userWithoutPassword } = updated;
        logger.info(`User updated: ${id}`);
        return userWithoutPassword;
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.db.user.delete({ where: { id } });
        return !!result;
    }

    async listUsers(limit = 20, offset = 0): Promise<{ users: Array<Omit<PrismaUser, 'password'>>; total: number }> {
        const [users, total] = await Promise.all([
            this.db.user.findMany({
                include: { role: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.db.user.count(),
        ]);

        return {
            users: users.map(({ password, ...user }) => user),
            total,
        };
    }

    async createRefreshToken(userId: string): Promise<string> {
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await this.db.refreshToken.create({
            data: {
                token,
                expiresAt,
                user: { connect: { id: userId } },
            },
        });
        return token;
    }

    async verifyRefreshToken(token: string): Promise<string | null> {
        const refresh = await this.db.refreshToken.findFirst({
            where: {
                token,
                expiresAt: { gt: new Date() },
            },
        });
        return refresh?.userId ?? null;
    }

    async revokeRefreshToken(token: string): Promise<boolean> {
        const result = await this.db.refreshToken.deleteMany({ where: { token } });
        return result.count > 0;
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.db.refreshToken.deleteMany({ where: { userId } });
        logger.info(`All tokens revoked for user: ${userId}`);
    }

    async updatePassword(userId: string, newPassword: string): Promise<Omit<PrismaUser, 'password'>> {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updated = await this.db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
            include: { role: true },
        });
        const { password, ...userWithoutPassword } = updated;
        logger.info(`Password updated for user: ${userId}`);
        return userWithoutPassword;
    }
}

export const userService = new UserService();

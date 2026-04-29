// ============================================================
// PRANU v2 — Authentication Service
// Handles registration, login, token management
// ============================================================

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { userService, UserInput } from './userService.js';
import { ValidationError, AuthenticationError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { JwtPayload } from '../middleware/auth.js';

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    // Register new user
    async register(input: RegisterInput): Promise<{ user: any; tokens: AuthTokens }> {
        // Validate input
        if (!input.email || !input.password || !input.name) {
            throw new ValidationError('Email, password, and name are required');
        }

        if (input.password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
            throw new ValidationError('Invalid email format');
        }

        // Create user
        const user = await userService.createUser({
            email: input.email,
            password: input.password,
            name: input.name,
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, 'user');

        logger.info(`User registered: ${input.email}`);

        return { user, tokens };
    }

    // Login
    async login(input: LoginInput): Promise<{ user: any; tokens: AuthTokens }> {
        const user = await userService.getUserByEmail(input.email);

        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        const isValidPassword = await userService.verifyPassword(user, input.password);

        if (!isValidPassword) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Generate tokens - use 'user' as default role since user object doesn't have role property directly
        const tokens = await this.generateTokens(user.id, user.email, 'user');

        logger.info(`User logged in: ${input.email}`);

        return { user: await userService.getUserById(user.id), tokens };
    }

    // Refresh access token
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const userId = await userService.verifyRefreshToken(refreshToken);

        if (!userId) {
            throw new AuthenticationError('Invalid or expired refresh token');
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        // Revoke old refresh token
        userService.revokeRefreshToken(refreshToken);

        // Generate new tokens - use 'user' as default role
        return this.generateTokens(user.id, user.email, 'user');
    }

    // Logout (revoke refresh token)
    logout(refreshToken: string): void {
        userService.revokeRefreshToken(refreshToken);
        logger.info('User logged out');
    }

    // Logout from all devices
    logoutAll(userId: string): void {
        userService.revokeAllUserTokens(userId);
        logger.info(`User logged out from all devices: ${userId}`);
    }

    // Generate JWT tokens
    private async generateTokens(userId: string, email: string, role: 'admin' | 'user'): Promise<AuthTokens> {
        const payload: JwtPayload = { userId, email, role };

        const accessToken = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN as any,
        });

        const refreshToken = await userService.createRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    // Get current user profile
    async getProfile(userId: string) {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new AuthenticationError('User not found');
        }
        return user;
    }

    // Update profile
    async updateProfile(userId: string, updates: { name?: string; email?: string }) {
        return userService.updateUser(userId, updates);
    }

    // Change password
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new AuthenticationError('User not found');
        }

        // Note: We need the full user with password field
        const fullUser = await userService.getUserByEmail(user.email);
        if (!fullUser) {
            throw new AuthenticationError('User not found');
        }

        const isValid = await userService.verifyPassword(fullUser, currentPassword);
        if (!isValid) {
            throw new ValidationError('Current password is incorrect');
        }

        if (newPassword.length < 8) {
            throw new ValidationError('New password must be at least 8 characters');
        }

        // Update password (need to access database directly)
        await this.updateUserPassword(userId, newPassword);

        // Revoke all tokens
        this.logoutAll(userId);

        logger.info(`Password changed for user: ${userId}`);
    }

    private async updateUserPassword(userId: string, newPassword: string) {
        // This would need to be added to UserService
        // For now, we'll throw an error
        throw new Error('Password update not yet implemented in UserService');
    }
}

export const authService = new AuthService();

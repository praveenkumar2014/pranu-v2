// ============================================================
// PRANU v2 — Authentication Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, tokens: AuthTokens) => void;
    clearAuth: () => void;
    updateUser: (updates: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,

            setAuth: (user, tokens) =>
                set({
                    user,
                    tokens,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            clearAuth: () =>
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),

            setLoading: (loading) =>
                set({ isLoading: loading }),
        }),
        {
            name: 'pranu-auth-storage',
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

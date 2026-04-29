// ============================================================
// PRANU v2 — Login Page
// ============================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { api } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setLoading = useAuthStore((state) => state.setLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        setLoading(true);

        try {
            const response: any = await api.login({ email, password });

            if (response.success && response.data) {
                setAuth(response.data.user, response.data.tokens);
                router.push('/');
            } else {
                setError(response.error?.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pranu-bg px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-pranu-cyan animate-pulse-glow" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-pranu-text">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-pranu-text-muted">
                        Sign in to your PRANU v2 account
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-pranu-text mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-pranu-border rounded-lg bg-pranu-surface text-pranu-text focus:outline-none focus:ring-2 focus:ring-pranu-cyan focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-pranu-text mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-pranu-border rounded-lg bg-pranu-surface text-pranu-text focus:outline-none focus:ring-2 focus:ring-pranu-cyan focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pranu-cyan hover:bg-pranu-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pranu-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-pranu-text-muted">
                            Don't have an account?{' '}
                        </span>
                        <Link href="/register" className="font-medium text-pranu-cyan hover:text-pranu-cyan/80">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

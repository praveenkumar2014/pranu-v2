// ============================================================
// GS Groups AI Studio — Login
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { api } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response: any = await api.login({ email, password });

            if (response.success && response.data) {
                setAuth(response.data.user, response.data.tokens);
                router.push('/dashboard');
            } else {
                setError(response.error?.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-16 text-slate-100">
            <div className="w-full max-w-lg space-y-8 rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-cyan-500/10">
                <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Sign in</p>
                    <h1 className="text-4xl font-semibold text-white">Access your AI workspace</h1>
                    <p className="text-slate-400">Login to manage workflows, content, code, and analytics in one secure platform.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="rounded-3xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                    <div className="grid gap-5">
                        <label className="block text-sm font-medium text-slate-200">
                            Email address
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="you@company.com"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="Enter your password"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-500">
                    New to GS Groups? <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">Create your account</Link>
                </p>
            </div>
        </div>
    );
}

// ============================================================
// GS Groups AI Studio — Register
// ============================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { api } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Valid email is required');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response: any = await api.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (response.success && response.data) {
                setAuth(response.data.user, response.data.tokens);
                router.push('/dashboard');
            } else {
                setError(response.error?.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
            <div className="mx-auto max-w-lg rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-cyan-500/10">
                <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Create account</p>
                    <h1 className="text-4xl font-semibold text-white">Start using the AI studio</h1>
                    <p className="text-slate-400">Register now and unlock workflows, content generation, and admin dashboards.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && <div className="rounded-3xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                    <div className="grid gap-5">
                        <label className="block text-sm font-medium text-slate-200">
                            Full name
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="Asha Patel"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Email address
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="you@company.com"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Password
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="Create a strong password"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Confirm password
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                placeholder="Repeat your password"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already registered?{' '}
                    <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

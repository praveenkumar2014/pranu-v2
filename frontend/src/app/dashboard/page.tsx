// ============================================================
// PRANU v2 — Dashboard Page
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/authStore';
import { api } from '@/lib/api';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        failedTasks: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response: any = await api.getTasks();
            const tasks = response.data || [];

            setStats({
                totalTasks: tasks.length,
                completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
                pendingTasks: tasks.filter((t: any) => t.status === 'pending').length,
                failedTasks: tasks.filter((t: any) => t.status === 'failed').length,
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-pranu-bg p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-pranu-text">Dashboard</h1>
                        <p className="mt-2 text-pranu-text-muted">
                            Welcome back, {user?.name}!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-pranu-surface border border-pranu-border rounded-lg p-6">
                            <div className="text-sm text-pranu-text-muted">Total Tasks</div>
                            <div className="text-3xl font-bold text-pranu-text mt-2">
                                {loading ? '-' : stats.totalTasks}
                            </div>
                        </div>

                        <div className="bg-pranu-surface border border-pranu-border rounded-lg p-6">
                            <div className="text-sm text-pranu-text-muted">Completed</div>
                            <div className="text-3xl font-bold text-green-500 mt-2">
                                {loading ? '-' : stats.completedTasks}
                            </div>
                        </div>

                        <div className="bg-pranu-surface border border-pranu-border rounded-lg p-6">
                            <div className="text-sm text-pranu-text-muted">Pending</div>
                            <div className="text-3xl font-bold text-yellow-500 mt-2">
                                {loading ? '-' : stats.pendingTasks}
                            </div>
                        </div>

                        <div className="bg-pranu-surface border border-pranu-border rounded-lg p-6">
                            <div className="text-sm text-pranu-text-muted">Failed</div>
                            <div className="text-3xl font-bold text-red-500 mt-2">
                                {loading ? '-' : stats.failedTasks}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-pranu-surface border border-pranu-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-pranu-text mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/"
                                className="px-4 py-2 bg-pranu-cyan text-white rounded-lg hover:bg-pranu-cyan/90 transition-colors"
                            >
                                Create New Task
                            </a>
                            <button
                                onClick={loadStats}
                                className="px-4 py-2 border border-pranu-border text-pranu-text rounded-lg hover:bg-pranu-surface/50 transition-colors"
                            >
                                Refresh Stats
                            </button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mt-8 bg-pranu-surface border border-pranu-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-pranu-text mb-4">Account Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-pranu-text-muted">Name</label>
                                <p className="text-pranu-text font-medium">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-pranu-text-muted">Email</label>
                                <p className="text-pranu-text font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-pranu-text-muted">Role</label>
                                <p className="text-pranu-text font-medium capitalize">{user?.role}</p>
                            </div>
                            <div>
                                <label className="text-sm text-pranu-text-muted">Member Since</label>
                                <p className="text-pranu-text font-medium">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

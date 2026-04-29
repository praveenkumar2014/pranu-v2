'use client';

import Link from 'next/link';
import { ShieldCheck, BarChart3, Users2 } from 'lucide-react';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Dashboard</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Manage users, roles, billing, and AI workflows.</h1>
                            <p className="mt-3 text-slate-400">This control center is designed for operators to configure access, audit system activity, and update AI templates.</p>
                        </div>
                        <Link href="/admin/users" className="inline-flex items-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                            View active users
                        </Link>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
                        <div className="flex items-center gap-3 text-cyan-300">
                            <ShieldCheck className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-white">Role controls</h2>
                        </div>
                        <p className="mt-4 text-slate-400">Create and assign roles with fine-grained permissions for AI, CMS, payments, and workflow services.</p>
                        <div className="mt-6 space-y-3 text-sm text-slate-300">
                            <p><span className="font-semibold text-white">Admin</span> - Full control across the platform.</p>
                            <p><span className="font-semibold text-white">Manager</span> - Manage teams, content, and billing.</p>
                        </div>
                    </div>
                    <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
                        <div className="flex items-center gap-3 text-cyan-300">
                            <BarChart3 className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-white">Reports</h2>
                        </div>
                        <p className="mt-4 text-slate-400">Track usage, AI credits, and subscription performance from a single admin console.</p>
                        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-300">
                            <p>System health checks</p>
                            <p>Daily signups</p>
                            <p>Revenue forecast</p>
                        </div>
                    </div>
                    <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
                        <div className="flex items-center gap-3 text-cyan-300">
                            <Users2 className="h-6 w-6" />
                            <h2 className="text-lg font-semibold text-white">User operations</h2>
                        </div>
                        <p className="mt-4 text-slate-400">Review user activity, reset sessions, and onboard new customers with role-based access control.</p>
                        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-300">
                            <p>Invite team members</p>
                            <p>Manage subscriptions</p>
                            <p>Audit logs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

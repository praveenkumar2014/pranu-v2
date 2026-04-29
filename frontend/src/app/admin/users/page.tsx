'use client';

import Link from 'next/link';

export default function AdminUsersPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">User management</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Admin user console</h1>
                            <p className="mt-3 text-slate-400">Manage accounts, monitor roles, and review system access in one place.</p>
                        </div>
                        <Link href="/admin" className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                            Back to admin
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6">
                    <section className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Active Users</h2>
                                <p className="mt-2 text-sm text-slate-400">Preview users, roles, and access levels across the platform.</p>
                            </div>
                            <button className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                Invite team member
                            </button>
                        </div>
                        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
                                <thead className="bg-slate-900/90 text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 bg-slate-950">
                                    <tr>
                                        <td className="px-6 py-4">Anjali S.</td>
                                        <td className="px-6 py-4 text-slate-300">anjali@company.com</td>
                                        <td className="px-6 py-4">Admin</td>
                                        <td className="px-6 py-4 text-emerald-400">Active</td>
                                        <td className="px-6 py-4">
                                            <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-500">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Rohan K.</td>
                                        <td className="px-6 py-4 text-slate-300">rohan@company.com</td>
                                        <td className="px-6 py-4">Manager</td>
                                        <td className="px-6 py-4 text-emerald-400">Active</td>
                                        <td className="px-6 py-4">
                                            <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-500">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Sneha P.</td>
                                        <td className="px-6 py-4 text-slate-300">sneha@company.com</td>
                                        <td className="px-6 py-4">Contributor</td>
                                        <td className="px-6 py-4 text-amber-300">Pending</td>
                                        <td className="px-6 py-4">
                                            <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-500">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

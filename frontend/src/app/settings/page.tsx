// ============================================================
// GS Groups AI Studio — Settings Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Key, Database, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Settings</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">Platform Settings</h1>
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <nav className="space-y-2">
                            {[
                                { icon: User, label: 'Profile', active: true },
                                { icon: Bell, label: 'Notifications' },
                                { icon: Shield, label: 'Security' },
                                { icon: Palette, label: 'Appearance' },
                                { icon: Key, label: 'API Keys' },
                                { icon: Database, label: 'Data' },
                                { icon: Globe, label: 'Integrations' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                                        item.active
                                            ? 'bg-cyan-500/10 text-cyan-400'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                        >
                            <h3 className="mb-6 text-xl font-semibold text-white">Profile Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-400">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm text-slate-400">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm text-slate-400">Bio</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="AI enthusiast and developer"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                                Save Changes
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                        >
                            <h3 className="mb-6 text-xl font-semibold text-white">Notifications</h3>
                            <div className="space-y-4">
                                {['Email notifications', 'Push notifications', 'Workflow completions', 'Error alerts'].map(
                                    (item) => (
                                        <label key={item} className="flex items-center justify-between">
                                            <span className="text-slate-300">{item}</span>
                                            <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500" />
                                        </label>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

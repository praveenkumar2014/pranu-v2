// ============================================================
// GS Groups AI Studio — Billing Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { CreditCard, Download, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Billing</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">Billing & Subscriptions</h1>
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-[24px] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6 lg:col-span-2"
                    >
                        <h3 className="mb-4 text-xl font-semibold text-white">Current Plan</h3>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white">Professional</p>
                                <p className="mt-2 text-slate-400">$49/month • Renews on May 23, 2026</p>
                            </div>
                            <button className="rounded-full border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                                Upgrade Plan
                            </button>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-900/60 p-4">
                                <p className="text-sm text-slate-400">AI Generations</p>
                                <p className="mt-1 text-2xl font-bold text-white">7,234</p>
                                <p className="text-xs text-slate-500">of 10,000 used</p>
                            </div>
                            <div className="rounded-2xl bg-slate-900/60 p-4">
                                <p className="text-sm text-slate-400">Storage</p>
                                <p className="mt-1 text-2xl font-bold text-white">2.4 GB</p>
                                <p className="text-xs text-slate-500">of 10 GB used</p>
                            </div>
                            <div className="rounded-2xl bg-slate-900/60 p-4">
                                <p className="text-sm text-slate-400">Workspaces</p>
                                <p className="mt-1 text-2xl font-bold text-white">5</p>
                                <p className="text-xs text-slate-500">Unlimited</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                    >
                        <h3 className="mb-4 text-xl font-semibold text-white">Payment Method</h3>
                        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-800 p-4">
                            <CreditCard className="h-8 w-8 text-cyan-400" />
                            <div>
                                <p className="font-semibold text-white">•••• •••• •••• 4242</p>
                                <p className="text-sm text-slate-400">Expires 12/27</p>
                            </div>
                        </div>
                        <button className="w-full rounded-full border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                            Update Payment Method
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                >
                    <h3 className="mb-4 text-xl font-semibold text-white">Billing History</h3>
                    <div className="space-y-3">
                        {[
                            { date: 'Apr 23, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-004' },
                            { date: 'Mar 23, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-003' },
                            { date: 'Feb 23, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-002' },
                        ].map((invoice, index) => (
                            <div key={index} className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4">
                                <div className="flex items-center gap-4">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="font-semibold text-white">{invoice.invoice}</p>
                                        <p className="text-sm text-slate-400">{invoice.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                                        {invoice.status}
                                    </span>
                                    <p className="font-semibold text-white">{invoice.amount}</p>
                                    <button className="rounded-full bg-slate-700 p-2 hover:bg-slate-600">
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

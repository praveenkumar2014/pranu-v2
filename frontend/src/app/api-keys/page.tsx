'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ApiKeysPage() {
    const [showKeys, setShowKeys] = useState(false);
    const [keys, setKeys] = useState([
        { id: 1, name: 'Production API Key', key: 'sk-proj-••••••••••••••••', created: 'Jan 15, 2026', lastUsed: '2 hours ago', status: 'active' },
        { id: 2, name: 'Development Key', key: 'sk-dev-••••••••••••••••', created: 'Feb 20, 2026', lastUsed: '1 day ago', status: 'active' },
        { id: 3, name: 'Test Key', key: 'sk-test-••••••••••••••••', created: 'Mar 10, 2026', lastUsed: 'Never', status: 'inactive' },
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">API Keys</p>
                        <h1 className="mt-2 text-4xl font-semibold text-white">Manage API Keys</h1>
                        <p className="mt-4 text-slate-400">Secure access tokens for programmatic API access.</p>
                    </div>
                    <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                        <Plus className="mr-2 inline h-4 w-4" />
                        Generate New Key
                    </button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 rounded-[24px] border border-cyan-500/30 bg-cyan-500/10 p-6">
                    <div className="flex items-start gap-4">
                        <Shield className="h-6 w-6 text-cyan-400 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-white">Security Notice</h3>
                            <p className="mt-2 text-sm text-slate-300">Keep your API keys secure. Never expose them in client-side code or public repositories. Revoke compromised keys immediately.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 space-y-4">
                    {keys.map((apiKey, index) => (
                        <motion.div
                            key={apiKey.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <Key className="h-5 w-5 text-cyan-400" />
                                        <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            apiKey.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                            {apiKey.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <code className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-mono text-slate-300">
                                            {showKeys ? apiKey.key.replace(/•/g, '•') : apiKey.key}
                                        </code>
                                        <button onClick={() => setShowKeys(!showKeys)} className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700">
                                            {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <button className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700">
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <p className="text-slate-500">Created</p>
                                        <p className="font-semibold text-white">{apiKey.created}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Last Used</p>
                                        <p className="font-semibold text-white">{apiKey.lastUsed}</p>
                                    </div>
                                    <button className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

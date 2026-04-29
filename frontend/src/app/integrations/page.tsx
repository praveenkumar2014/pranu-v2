'use client';

import { motion } from 'framer-motion';
import { Check, Plus, Settings2, Database, Cloud, Code2, Mail, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const integrations = [
    { name: 'OpenAI', category: 'AI Models', icon: Code2, connected: true, description: 'GPT-4, GPT-3.5, and more' },
    { name: 'Groq', category: 'AI Models', icon: Code2, connected: true, description: 'Ultra-fast LLM inference' },
    { name: 'Anthropic', category: 'AI Models', icon: Code2, connected: false, description: 'Claude AI models' },
    { name: 'PostgreSQL', category: 'Database', icon: Database, connected: true, description: 'Primary database' },
    { name: 'Redis', category: 'Cache', icon: Cloud, connected: false, description: 'Caching layer' },
    { name: 'AWS S3', category: 'Storage', icon: Cloud, connected: true, description: 'Object storage' },
    { name: 'SendGrid', category: 'Email', icon: Mail, connected: false, description: 'Email delivery' },
    { name: 'Slack', category: 'Communication', icon: MessageSquare, connected: true, description: 'Team notifications' },
];

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Integrations</p>
                        <h1 className="mt-2 text-4xl font-semibold text-white">Connect Your Tools</h1>
                        <p className="mt-4 text-slate-400">Seamlessly integrate with your favorite services and platforms.</p>
                    </div>
                    <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                        <Plus className="mr-2 inline h-4 w-4" />
                        Add Integration
                    </button>
                </motion.div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {integrations.map((integration, index) => (
                        <motion.div
                            key={integration.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`rounded-[24px] border p-6 transition-all hover:shadow-lg ${
                                integration.connected
                                    ? 'border-cyan-500/30 bg-slate-900/80 shadow-cyan-500/10'
                                    : 'border-slate-800 bg-slate-900/50'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                    integration.connected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                    <integration.icon className="h-6 w-6" />
                                </div>
                                {integration.connected ? (
                                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                        <Check className="mr-1 inline h-3 w-3" />
                                        Connected
                                    </span>
                                ) : (
                                    <button className="rounded-full bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                                        Connect
                                    </button>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                            <p className="mt-1 text-sm text-slate-400">{integration.description}</p>
                            <p className="mt-3 text-xs text-slate-500 uppercase tracking-wider">{integration.category}</p>
                            {integration.connected && (
                                <button className="mt-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                                    <Settings2 className="h-4 w-4" />
                                    Configure
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

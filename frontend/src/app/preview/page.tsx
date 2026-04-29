'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Code, Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PreviewPage() {
    const [device, setDevice] = useState('desktop');
    const devices = {
        desktop: { width: 'w-full', icon: Monitor, label: 'Desktop' },
        tablet: { width: 'max-w-3xl', icon: Tablet, label: 'Tablet' },
        mobile: { width: 'max-w-sm', icon: Smartphone, label: 'Mobile' },
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Preview</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">Live Preview Builder</h1>
                    <p className="mt-4 text-slate-400">Preview your content across different devices in real-time.</p>
                </motion.div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex rounded-full bg-slate-800 p-1">
                        {Object.entries(devices).map(([key, { icon: Icon, label }]) => (
                            <button
                                key={key}
                                onClick={() => setDevice(key)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                                    device === key ? 'bg-cyan-500 text-slate-950' : 'text-white hover:bg-slate-700'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                            <Code className="mr-2 inline h-4 w-4" />
                            Source
                        </button>
                        <button className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                            <RefreshCw className="mr-2 inline h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 flex justify-center"
                >
                    <div className={`${devices[device].width} w-full rounded-[24px] border border-slate-800 bg-slate-900/50 p-6`}>
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <div className="ml-4 flex-1 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-400">
                                https://your-site.com/preview
                            </div>
                        </div>
                        <div className="min-h-[400px] rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-8">
                            <div className="mx-auto max-w-2xl space-y-6">
                                <h2 className="text-3xl font-bold text-white">Preview Content</h2>
                                <p className="text-slate-300">This is how your content will appear on {devices[device].label.toLowerCase()} devices.</p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg bg-slate-800/50 p-4">
                                        <div className="h-3 w-3/4 rounded bg-cyan-500/50 mb-2" />
                                        <div className="h-3 w-1/2 rounded bg-slate-700" />
                                    </div>
                                    <div className="rounded-lg bg-slate-800/50 p-4">
                                        <div className="h-3 w-2/3 rounded bg-violet-500/50 mb-2" />
                                        <div className="h-3 w-1/3 rounded bg-slate-700" />
                                    </div>
                                </div>
                                <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950">
                                    Call to Action
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

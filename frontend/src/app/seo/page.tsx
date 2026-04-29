'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Link, FileText, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SEOPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">SEO</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">SEO Automation Engine</h1>
                    <p className="mt-4 text-slate-400">Optimize your content for search engines with AI-powered recommendations.</p>
                </motion.div>

                <div className="mt-8 grid gap-6 sm:grid-cols-4">
                    {[
                        { label: 'SEO Score', value: '87/100', icon: BarChart3, color: 'text-green-400' },
                        { label: 'Keywords Tracked', value: '156', icon: Search, color: 'text-cyan-400' },
                        { label: 'Backlinks', value: '1,234', icon: Link, color: 'text-violet-400' },
                        { label: 'Page Authority', value: '72', icon: TrendingUp, color: 'text-blue-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
                        >
                            <stat.icon className={`mb-3 h-6 w-6 ${stat.color}`} />
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Meta Tags Generator</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm text-slate-400">Page Title</label>
                                <input
                                    type="text"
                                    defaultValue="GS Groups AI Studio - Enterprise AI Platform"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                />
                                <p className="mt-1 text-xs text-slate-500">58/60 characters</p>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-400">Meta Description</label>
                                <textarea
                                    rows={3}
                                    defaultValue="Transform your business with AI-powered code generation, content creation, and workflow automation."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                />
                                <p className="mt-1 text-xs text-slate-500">145/160 characters</p>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-400">Keywords</label>
                                <input
                                    type="text"
                                    defaultValue="AI, automation, SaaS, enterprise, code generation"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                            <button className="w-full rounded-full bg-cyan-500 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                                <FileText className="mr-2 inline h-4 w-4" />
                                Generate Meta Tags
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">SEO Audit Results</h3>
                        <div className="space-y-3">
                            {[
                                { status: 'pass', text: 'SSL certificate is active' },
                                { status: 'pass', text: 'Mobile-friendly design detected' },
                                { status: 'pass', text: 'Page load time: 1.2s (Good)' },
                                { status: 'warning', text: 'Missing alt tags on 3 images' },
                                { status: 'warning', text: 'Consider adding more internal links' },
                                { status: 'pass', text: 'Sitemap.xml found' },
                                { status: 'pass', text: 'Robots.txt configured correctly' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
                                    {item.status === 'pass' ? (
                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                                    ) : (
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                                    )}
                                    <span className="text-sm text-slate-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                >
                    <h3 className="mb-4 text-lg font-semibold text-white">Keyword Rankings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Keyword</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Position</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Change</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[
                                    { keyword: 'AI coding assistant', position: 3, change: '+2', volume: '12K' },
                                    { keyword: 'enterprise AI platform', position: 7, change: '+5', volume: '8K' },
                                    { keyword: 'automated content generation', position: 12, change: '-1', volume: '15K' },
                                    { keyword: 'workflow automation tool', position: 5, change: '+3', volume: '10K' },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="py-3 text-sm text-white">{row.keyword}</td>
                                        <td className="py-3 text-sm text-white">#{row.position}</td>
                                        <td className={`py-3 text-sm ${row.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                            {row.change}
                                        </td>
                                        <td className="py-3 text-sm text-slate-400">{row.volume}/mo</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

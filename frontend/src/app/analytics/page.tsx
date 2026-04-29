'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Analytics</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">Dashboard & Insights</h1>
                    <p className="mt-4 text-slate-400">Real-time metrics and performance analytics for your AI operations.</p>
                </motion.div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Users', value: '12,847', change: '+12%', trend: 'up', icon: Users, color: 'text-cyan-400' },
                        { label: 'AI Generations', value: '2.4M', change: '+28%', trend: 'up', icon: Zap, color: 'text-violet-400' },
                        { label: 'Page Views', value: '847K', change: '+15%', trend: 'up', icon: Eye, color: 'text-blue-400' },
                        { label: 'Revenue', value: '$48.2K', change: '+22%', trend: 'up', icon: TrendingUp, color: 'text-green-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
                        >
                            <div className="flex items-start justify-between">
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                <span className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Usage Trends (Last 7 Days)</h3>
                        <div className="space-y-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                                const usage = [65, 78, 82, 91, 88, 45, 52][i];
                                return (
                                    <div key={day} className="flex items-center gap-4">
                                        <span className="w-8 text-sm text-slate-400">{day}</span>
                                        <div className="flex-1 rounded-full bg-slate-800 h-6 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${usage}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-white w-12 text-right">{usage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Top AI Models</h3>
                        <div className="space-y-4">
                            {[
                                { model: 'GPT-4 Turbo', usage: 4523, percentage: 38 },
                                { model: 'Claude 3 Opus', usage: 3187, percentage: 27 },
                                { model: 'Llama 3 70B', usage: 2456, percentage: 21 },
                                { model: 'GPT-3.5 Turbo', usage: 1678, percentage: 14 },
                            ].map((model, i) => (
                                <div key={model.model} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-white">{model.model}</p>
                                            <p className="text-sm text-slate-400">{model.usage.toLocaleString()} uses</p>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${model.percentage}%` }}
                                                transition={{ delay: i * 0.1 }}
                                                className="h-full bg-cyan-500 rounded-full"
                                            />
                                        </div>
                                    </div>
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
                    <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="pb-3 text-sm font-semibold text-slate-400">User</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Action</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Model</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Time</th>
                                    <th className="pb-3 text-sm font-semibold text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[
                                    { user: 'John Doe', action: 'Generated code', model: 'GPT-4', time: '2m ago', status: 'Success' },
                                    { user: 'Jane Smith', action: 'Created post', model: 'Claude 3', time: '5m ago', status: 'Success' },
                                    { user: 'Mike Johnson', action: 'SEO analysis', model: 'Llama 3', time: '12m ago', status: 'Success' },
                                    { user: 'Sarah Lee', action: 'Workflow run', model: 'GPT-3.5', time: '18m ago', status: 'Failed' },
                                    { user: 'Alex Brown', action: 'Content gen', model: 'GPT-4', time: '25m ago', status: 'Success' },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="py-3 text-sm text-white">{row.user}</td>
                                        <td className="py-3 text-sm text-slate-300">{row.action}</td>
                                        <td className="py-3 text-sm text-slate-400">{row.model}</td>
                                        <td className="py-3 text-sm text-slate-500">{row.time}</td>
                                        <td className="py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs ${
                                                row.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
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

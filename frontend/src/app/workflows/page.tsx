// ============================================================
// GS Groups AI Studio — Workflows Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const workflows = [
    {
        id: 'WF-001',
        name: 'Content Generation Pipeline',
        status: 'running',
        steps: 5,
        completed: 3,
        started: '2 min ago',
        model: 'GPT-4 Turbo',
    },
    {
        id: 'WF-002',
        name: 'Code Review & Refactor',
        status: 'completed',
        steps: 4,
        completed: 4,
        started: '15 min ago',
        model: 'Claude 3',
    },
    {
        id: 'WF-003',
        name: 'Social Media Scheduler',
        status: 'pending',
        steps: 6,
        completed: 0,
        started: 'Scheduled',
        model: 'Llama 3',
    },
    {
        id: 'WF-004',
        name: 'SEO Optimization Batch',
        status: 'failed',
        steps: 3,
        completed: 1,
        started: '1 hour ago',
        model: 'GPT-3.5',
    },
];

const statusIcons = {
    running: { icon: Play, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function WorkflowsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-end justify-between"
                >
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Workflows</p>
                        <h1 className="mt-2 text-4xl font-semibold text-white">Task & Workflow Manager</h1>
                    </div>
                    <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                        + New Workflow
                    </button>
                </motion.div>

                <div className="mb-8 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Total Workflows</p>
                        <p className="mt-2 text-3xl font-bold text-white">24</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Running</p>
                        <p className="mt-2 text-3xl font-bold text-blue-400">3</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Completed Today</p>
                        <p className="mt-2 text-3xl font-bold text-green-400">18</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-sm text-slate-400">Failed</p>
                        <p className="mt-2 text-3xl font-bold text-red-400">3</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {workflows.map((workflow, index) => {
                        const StatusIcon = statusIcons[workflow.status as keyof typeof statusIcons].icon;
                        const statusColor = statusIcons[workflow.status as keyof typeof statusIcons].color;
                        const statusBg = statusIcons[workflow.status as keyof typeof statusIcons].bg;
                        const progress = (workflow.completed / workflow.steps) * 100;

                        return (
                            <motion.div
                                key={workflow.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`inline-flex rounded-full ${statusBg} p-2`}>
                                                <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                                                <p className="text-sm text-slate-400">{workflow.id} • Started {workflow.started}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Model</p>
                                            <p className="text-sm font-semibold text-white">{workflow.model}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Progress</p>
                                            <p className="text-sm font-semibold text-white">
                                                {workflow.completed}/{workflow.steps}
                                            </p>
                                        </div>
                                        <div className="w-32">
                                            <div className="h-2 rounded-full bg-slate-800">
                                                <div
                                                    className={`h-2 rounded-full ${workflow.status === 'failed'
                                                        ? 'bg-red-500'
                                                        : workflow.status === 'completed'
                                                            ? 'bg-green-500'
                                                            : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
                                                <Pause className="h-4 w-4" />
                                            </button>
                                            <button className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
                                                <Square className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
}

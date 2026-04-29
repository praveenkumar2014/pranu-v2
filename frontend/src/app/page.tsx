// ============================================================
// GS Groups AI Studio — Landing Page
// ============================================================

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Activity, Sparkles, ShieldCheck, Layers } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const features = [
    {
        title: 'AI Chat & Multi-Model Orchestration',
        description: 'Tailor prompts, switch between OpenAI and local models, and power intelligent workflows from a single control plane.',
        icon: Sparkles,
    },
    {
        title: 'Browser IDE & Code Automation',
        description: 'Edit files, preview code, and ship AI-assisted development with task pipelines and workflow history.',
        icon: Layers,
    },
    {
        title: 'Content Studio & Social Publishing',
        description: 'Generate blog copy, ads, scripts, and publish directly to social feeds with audit-ready analytics.',
        icon: Activity,
    },
    {
        title: 'Enterprise Security & RBAC',
        description: 'JWT authentication, dynamic role-based ACL, audit logging, and secure S3 storage for user assets.',
        icon: ShieldCheck,
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-10">
                <section className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
                    <div className="space-y-6">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                        >
                            <Sparkles className="h-4 w-4" />
                            Built for enterprise AI teams
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl"
                        >
                            Launch your AI-powered SaaS platform with code, content, and automation in one premium studio.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl text-lg leading-8 text-slate-400"
                        >
                            From AI chat and workflow orchestration to admin analytics and social publishing, GS Groups AI Studio delivers a full-stack SaaS experience built for growth and compliance.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <a href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                Start free trial
                                <ArrowRight size={16} />
                            </a>
                            <a href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                Launch dashboard
                            </a>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-cyan-500/5"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-blue-400 opacity-80" />
                        <div className="flex items-center justify-between gap-4 pb-6">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Workflow</p>
                                <h2 className="mt-3 text-2xl font-semibold text-white">Task pipeline live stream</h2>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">LIVE</span>
                        </div>
                        <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-2">
                            <div className="rounded-3xl bg-slate-950/60 p-4">
                                <p className="font-semibold text-white">AI Code Agent</p>
                                <p className="mt-2 text-slate-400">Planning, generation, and review in a single stream.</p>
                            </div>
                            <div className="rounded-3xl bg-slate-950/60 p-4">
                                <p className="font-semibold text-white">Content Studio</p>
                                <p className="mt-2 text-slate-400">Generate posts, ads, and scripts with one click.</p>
                            </div>
                            <div className="rounded-3xl bg-slate-950/60 p-4">
                                <p className="font-semibold text-white">Multi-model Routing</p>
                                <p className="mt-2 text-slate-400">OpenAI, Together, Groq, and local model support.</p>
                            </div>
                            <div className="rounded-3xl bg-slate-950/60 p-4">
                                <p className="font-semibold text-white">Admin Controls</p>
                                <p className="mt-2 text-slate-400">Dynamic RBAC, audit logs, and analytics.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Why GS Groups</p>
                        <h2 className="text-3xl font-semibold text-white">Premium AI SaaS designed for modern growth teams.</h2>
                        <p className="max-w-2xl text-slate-400">Deliver a complete platform with AI chat, content authoring, marketing automation, team workspaces, and enterprise-grade security in one production-ready experience.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                whileHover={{ y: -4 }}
                                className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                <p className="mt-3 text-slate-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[36px] border border-slate-800 bg-slate-900/80 p-8 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Built for scale</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">Secure, compliant, and extensible by design.</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-slate-950/60 p-5 text-center">
                                <p className="text-3xl font-semibold text-white">99.99%</p>
                                <p className="mt-2 text-sm text-slate-400">Uptime-ready designs</p>
                            </div>
                            <div className="rounded-3xl bg-slate-950/60 p-5 text-center">
                                <p className="text-3xl font-semibold text-white">50+</p>
                                <p className="mt-2 text-sm text-slate-400">AI templates & workflows</p>
                            </div>
                            <div className="rounded-3xl bg-slate-950/60 p-5 text-center">
                                <p className="text-3xl font-semibold text-white">Global</p>
                                <p className="mt-2 text-sm text-slate-400">Multi-region ready</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

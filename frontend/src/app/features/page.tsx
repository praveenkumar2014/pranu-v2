// ============================================================
// GS Groups AI Studio — Features Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Code2, FileText, Share2, Search, Workflow, Shield, BarChart3, Zap, Globe, Cpu } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const features = [
    {
        icon: MessageSquare,
        title: 'AI Chat & Multi-Model',
        description: 'Chat with OpenAI, Groq, Together, and local models. Switch models on-the-fly with intelligent routing.',
        color: 'cyan',
    },
    {
        icon: Code2,
        title: 'AI Code Agent',
        description: 'Browser-based IDE with AI-powered code generation, refactoring, and debugging. Full file system access.',
        color: 'violet',
    },
    {
        icon: FileText,
        title: 'Content Studio',
        description: 'Generate blog posts, ads, scripts, social content. One-click creation with AI-assisted editing.',
        color: 'blue',
    },
    {
        icon: Share2,
        title: 'Social Publishing',
        description: 'Schedule and publish to Twitter, LinkedIn, Facebook. Auto-optimize content per platform.',
        color: 'pink',
    },
    {
        icon: Search,
        title: 'SEO Automation',
        description: 'Auto-generate meta tags, optimize content, track rankings. AI-powered SEO recommendations.',
        color: 'green',
    },
    {
        icon: Workflow,
        title: 'Workflow Engine',
        description: 'Visual workflow builder with triggers, actions, and conditions. Track execution history.',
        color: 'orange',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'JWT auth, dynamic RBAC, audit logs, SSO/SAML. SOC2-ready infrastructure.',
        color: 'red',
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Real-time metrics, usage analytics, team performance. Custom reports and exports.',
        color: 'yellow',
    },
    {
        icon: Zap,
        title: 'Task Automation',
        description: 'Automate repetitive tasks with AI. Smart scheduling and execution pipelines.',
        color: 'cyan',
    },
    {
        icon: Globe,
        title: 'Multi-Region Ready',
        description: 'Deploy globally with edge functions. CDN-optimized for lightning-fast performance.',
        color: 'violet',
    },
    {
        icon: Cpu,
        title: 'Custom AI Models',
        description: 'Fine-tune models on your data. Support for Ollama, LM Studio, and custom endpoints.',
        color: 'blue',
    },
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Features</p>
                    <h1 className="mt-4 text-5xl font-semibold text-white">Everything you need to build with AI</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                        From AI chat to code generation, content creation to automation. One platform, infinite possibilities.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="group rounded-[32px] border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700 hover:bg-slate-900/80"
                        >
                            <div
                                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}-500/10 text-${feature.color}-300 transition-all group-hover:bg-${feature.color}-500/20`}
                            >
                                <feature.icon size={28} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                            <p className="text-slate-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 grid gap-8 lg:grid-cols-2"
                >
                    <div className="rounded-[36px] border border-slate-800 bg-slate-900/80 p-10">
                        <h3 className="mb-4 text-3xl font-semibold text-white">AI-Powered Workflow Automation</h3>
                        <p className="mb-6 text-slate-400">
                            Build complex automation pipelines with our visual workflow builder. Chain AI models, trigger actions, and track execution history in real-time.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Visual drag-and-drop builder',
                                'Multi-step AI pipelines',
                                'Conditional logic & branching',
                                'Real-time execution tracking',
                                'Error handling & retry logic',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                                    <span className="text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-[36px] border border-slate-800 bg-slate-900/80 p-10">
                        <h3 className="mb-4 text-3xl font-semibold text-white">Enterprise-Grade Security</h3>
                        <p className="mb-6 text-slate-400">
                            Built for teams that need compliance and control. Every action is logged, every permission is granular, every connection is encrypted.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'JWT authentication & refresh tokens',
                                'Dynamic role-based access control',
                                'Comprehensive audit logging',
                                'SSO & SAML integration',
                                'End-to-end encryption',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                                    <span className="text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

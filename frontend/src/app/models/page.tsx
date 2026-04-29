// ============================================================
// GS Groups AI Studio — AI Models Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Globe, Shield, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const models = [
    {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: 'Most capable model for complex tasks',
        speed: 'Fast',
        quality: 'Excellent',
        cost: '$$',
        best: 'Code generation, complex reasoning',
    },
    {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: 'Fast and cost-effective',
        speed: 'Very Fast',
        quality: 'Good',
        cost: '$',
        best: 'Chat, simple tasks, high volume',
    },
    {
        name: 'Llama 3 70B',
        provider: 'Groq',
        description: 'Open source, ultra-fast inference',
        speed: 'Ultra Fast',
        quality: 'Very Good',
        cost: '$',
        best: 'Fast responses, cost optimization',
    },
    {
        name: 'Mixtral 8x7B',
        provider: 'Together AI',
        description: 'Mixture of experts architecture',
        speed: 'Fast',
        quality: 'Very Good',
        cost: '$',
        best: 'Balanced performance',
    },
    {
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        description: 'Highest quality reasoning',
        speed: 'Medium',
        quality: 'Outstanding',
        cost: '$$$',
        best: 'Complex analysis, writing',
    },
    {
        name: 'Local Models',
        provider: 'Ollama/LM Studio',
        description: 'Run models locally',
        speed: 'Variable',
        quality: 'Custom',
        cost: 'Free',
        best: 'Privacy, customization',
    },
];

export default function ModelsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">AI Models</p>
                    <h1 className="mt-4 text-5xl font-semibold text-white">Choose the right AI model</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                        Access multiple AI providers and switch models on-the-fly. Optimize for speed, quality, or cost.
                    </p>
                </motion.div>

                <div className="mb-12 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                        <Cpu className="mx-auto mb-4 h-8 w-8 text-cyan-400" />
                        <p className="text-3xl font-bold text-white">6+</p>
                        <p className="mt-2 text-sm text-slate-400">AI Models Available</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                        <Zap className="mx-auto mb-4 h-8 w-8 text-violet-400" />
                        <p className="text-3xl font-bold text-white">5</p>
                        <p className="mt-2 text-sm text-slate-400">AI Providers</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                        <Globe className="mx-auto mb-4 h-8 w-8 text-blue-400" />
                        <p className="text-3xl font-bold text-white">Global</p>
                        <p className="mt-2 text-sm text-slate-400">Multi-Region Support</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {models.map((model, index) => (
                        <motion.div
                            key={model.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group rounded-[24px] border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/80"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-semibold text-white">{model.name}</h3>
                                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                                            {model.provider}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-slate-400">{model.description}</p>
                                    <p className="mt-2 text-sm text-cyan-400">Best for: {model.best}</p>
                                </div>

                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <p className="text-slate-500">Speed</p>
                                        <p className="font-semibold text-white">{model.speed}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Quality</p>
                                        <p className="font-semibold text-white">{model.quality}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Cost</p>
                                        <p className="font-semibold text-white">{model.cost}</p>
                                    </div>
                                </div>

                                <ChevronRight className="h-6 w-6 text-slate-600 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 rounded-[36px] border border-cyan-500/30 bg-cyan-500/10 p-8 text-center"
                >
                    <Shield className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
                    <h3 className="text-2xl font-semibold text-white">Automatic Model Routing</h3>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                        Our intelligent router automatically selects the best model based on your task, balancing speed, quality, and cost. Override anytime or set preferences per workflow.
                    </p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';

const contentTypes = [
    { value: 'POST', label: 'Post' },
    { value: 'AD', label: 'Ad' },
    { value: 'SCRIPT', label: 'Script' },
    { value: 'BLOG', label: 'Blog' },
    { value: 'IMAGE', label: 'Image' },
];

export default function ContentStudioPage() {
    const [prompt, setPrompt] = useState('Create a launch announcement for a new AI productivity feature.');
    const [type, setType] = useState('POST');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateContent = async () => {
        setLoading(true);
        setError('');
        setResult('');

        try {
            const response: any = await api.generateContent({ prompt, type });
            setResult(response.data.output || 'No content generated yet.');
        } catch (err: any) {
            setError(err.message || 'Could not generate content.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Content Studio</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Generate marketing copy, image prompts, and ads instantly.</h1>
                        </div>
                        <div className="rounded-3xl bg-slate-950/70 px-5 py-4 text-slate-300">
                            <p className="text-sm text-slate-400">Create content in seconds</p>
                            <p className="mt-2 text-xl font-semibold text-white">AI-powered workflows</p>
                        </div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10"
                >
                    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                        <div className="space-y-6">
                            <label className="block text-sm font-medium text-slate-300">
                                What would you like to create?
                                <textarea
                                    value={prompt}
                                    onChange={(event) => setPrompt(event.target.value)}
                                    rows={5}
                                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                />
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300">Content type</label>
                                    <select
                                        value={type}
                                        onChange={(event) => setType(event.target.value)}
                                        className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        {contentTypes.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 px-5 py-4">
                                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quick tip</p>
                                    <p className="mt-3 text-slate-300">Use clear audience and tone instructions to make output polished and ready to publish.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={generateContent}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? 'Generating...' : 'Generate content'}
                            </button>
                            {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                        </div>
                        <div className="rounded-[28px] border border-slate-800 bg-slate-950/80 p-6">
                            <div className="flex items-center gap-3 text-slate-300">
                                <ImageIcon className="h-5 w-5 text-cyan-300" />
                                <h2 className="text-lg font-semibold text-white">Output preview</h2>
                            </div>
                            <div className="mt-6 min-h-[220px] rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-200">
                                {result ? <pre className="whitespace-pre-wrap text-sm leading-7">{result}</pre> : <p className="text-slate-500">Your generated content will appear here after you submit the prompt.</p>}
                            </div>
                            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">
                                    <Copy className="h-4 w-4" /> Copy to clipboard
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">Export to workspace</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

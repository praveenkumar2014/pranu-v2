'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { api } from '@/lib/api';

const defaultMessages = [
    { role: 'system', content: 'You are a productivity assistant helping teams build AI workflows.' },
];

export default function AIChatPage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [messages, setMessages] = useState(defaultMessages);
    const [input, setInput] = useState('Create a social media post for a product launch.');
    const [status, setStatus] = useState('Ready to chat');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setStatus('Please sign in to use AI chat.');
        }
    }, [isAuthenticated]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { role: 'user', content: input };
        const updated = [...messages, userMessage];
        setMessages(updated);
        setInput('');
        setStatus('Generating response...');
        setLoading(true);

        try {
            const response: any = await api.chat({ messages: updated });
            const assistant = { role: 'assistant', content: response.data.output || 'No response generated.' };
            setMessages((prev) => [...prev, assistant]);
            setStatus('Ready');
        } catch (error: any) {
            setStatus(error?.message || 'Unable to generate response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">AI Chat</p>
                        <h1 className="mt-3 text-4xl font-semibold text-white">Converse with AI across models and workflows.</h1>
                        <p className="mt-3 text-slate-400">Use prompts, inspect generated content, and route messages through the AI engine.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 px-5 py-4 text-slate-300">
                        <p className="text-sm text-slate-400">Status</p>
                        <p className="mt-2 text-lg font-semibold text-white">{status}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <motion.div
                            key={`${message.role}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-3xl border px-6 py-5 ${message.role === 'assistant' ? 'border-cyan-500/20 bg-slate-900/80' : 'border-slate-800 bg-slate-950/80'}`}
                        >
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{message.role}</p>
                            <p className="mt-3 whitespace-pre-wrap text-slate-100">{message.content}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 rounded-[32px] border border-slate-800 bg-slate-900/95 p-6">
                    <textarea
                        rows={4}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        className="w-full resize-none rounded-3xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                        placeholder="Ask the AI to generate a workflow, copy, or code snippet."
                    />
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-500">Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={!isAuthenticated || loading}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

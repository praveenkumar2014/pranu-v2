'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Moon, Sun, Menu, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : theme;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
                <Link href="/" className="flex items-center gap-3 text-white">
                    <img src="/gslogo.png" alt="GS Groups" className="h-10 w-10 rounded-full border border-slate-700 bg-white/5 p-1" />
                    <div>
                        <p className="text-base font-semibold">GS Groups AI Studio</p>
                        <p className="text-xs text-slate-400">SaaS platform for teams</p>
                    </div>
                </Link>
                <nav className="hidden items-center gap-8 lg:flex">
                    <Link href="/dashboard" className="text-sm font-medium text-slate-300 transition hover:text-white">Dashboard</Link>
                    <Link href="/ai-chat" className="text-sm font-medium text-slate-300 transition hover:text-white">AI Chat</Link>
                    <Link href="/content-studio" className="text-sm font-medium text-slate-300 transition hover:text-white">Content Studio</Link>
                    <Link href="/admin" className="text-sm font-medium text-slate-300 transition hover:text-white">Admin</Link>
                </nav>
                <div className="flex items-center gap-3">
                    <Link href="/login" className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Log in
                    </Link>
                    <Link href="/register" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                        Start Free
                    </Link>
                    <button
                        type="button"
                        aria-label="Toggle theme"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 transition hover:bg-slate-800"
                        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                    >
                        {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>
        </motion.header>
    );
}

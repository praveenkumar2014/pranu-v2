'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-t border-slate-800 bg-slate-950/95 py-10"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-white">GS Groups AI Studio</p>
                    <p className="mt-2 text-slate-400">Built for premium analytics, AI workflows, and team collaboration.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
                    <Link href="/admin" className="transition hover:text-white">Admin</Link>
                    <Link href="/ai-chat" className="transition hover:text-white">Chat</Link>
                    <Link href="/content-studio" className="transition hover:text-white">Content</Link>
                </div>
            </div>
        </motion.footer>
    );
}

// ============================================================
// PRANU v2 — Root Layout
// ============================================================

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'PRANU v2 — Autonomous AI Agent',
    description: 'Multi-agent autonomous AI coding system',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}

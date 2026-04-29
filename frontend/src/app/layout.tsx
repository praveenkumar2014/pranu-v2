// ============================================================
// PRANU v2 — Root Layout
// ============================================================

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
    title: 'GS Groups AI Studio',
    description: 'Enterprise-ready AI SaaS platform for code, content, marketing, and automation.',
    metadataBase: new URL('http://localhost:3000'),
    icons: {
        icon: '/gslogo.png',
        apple: '/gslogo.png',
    },
    openGraph: {
        title: 'GS Groups AI Studio',
        description: 'Enterprise-ready AI SaaS platform for code, content, marketing, and automation.',
        url: 'https://app.gsgroups.net',
        siteName: 'GS Groups AI Studio',
        images: '/gslogo.png',
        locale: 'en_US',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

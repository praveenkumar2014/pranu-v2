// ============================================================
// PRANU v2 — Root Layout
// ============================================================

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
    title: 'GS Groups AI Studio',
    description: 'AI-powered platform for building, deploying, and scaling intelligent applications',
    metadataBase: new URL('http://localhost:3000'),
    icons: {
        icon: 'https://www.gsgroups.net/gslogo.png',
        apple: 'https://www.gsgroups.net/gslogo.png',
    },
    openGraph: {
        title: 'GS Groups AI Studio',
        description: 'AI-powered platform for building, deploying, and scaling intelligent applications',
        url: 'https://app.gsgroups.net',
        siteName: 'GS Groups AI Studio',
        images: [
            {
                url: 'https://www.gsgroups.net/gslogo.png',
                width: 1200,
                height: 630,
            },
        ],
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

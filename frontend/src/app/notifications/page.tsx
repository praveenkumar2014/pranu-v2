'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Settings, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const notifications = [
    { id: 1, type: 'success', title: 'Deployment Successful', message: 'Your app has been deployed to production', time: '2 minutes ago', read: false },
    { id: 2, type: 'warning', title: 'API Limit Approaching', message: 'You have used 85% of your API quota', time: '1 hour ago', read: false },
    { id: 3, type: 'error', title: 'Payment Failed', message: 'Your last payment attempt was declined', time: '3 hours ago', read: true },
    { id: 4, type: 'info', title: 'New Feature Available', message: 'SEO automation is now available', time: '1 day ago', read: true },
    { id: 5, type: 'success', title: 'Workflow Completed', message: 'Content generation workflow finished', time: '2 days ago', read: true },
];

export default function NotificationsPage() {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.read);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-4xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Notifications</p>
                        <h1 className="mt-2 text-4xl font-semibold text-white">Notification Center</h1>
                        <p className="mt-4 text-slate-400">Stay updated with your account activity.</p>
                    </div>
                    <button className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                        <Settings className="mr-2 inline h-4 w-4" />
                        Settings
                    </button>
                </motion.div>

                <div className="mt-8 flex gap-2">
                    <button onClick={() => setFilter('all')} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                        All
                    </button>
                    <button onClick={() => setFilter('unread')} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'unread' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                        Unread ({notifications.filter(n => !n.read).length})
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {filtered.map((notification, index) => {
                        const icons = {
                            success: CheckCircle,
                            warning: AlertCircle,
                            error: XCircle,
                            info: Info,
                        };
                        const colors = {
                            success: 'text-green-400',
                            warning: 'text-yellow-400',
                            error: 'text-red-400',
                            info: 'text-blue-400',
                        };
                        const Icon = icons[notification.type];

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`rounded-[24px] border p-6 ${
                                    notification.read ? 'border-slate-800 bg-slate-900/50' : 'border-cyan-500/30 bg-cyan-500/5'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 rounded-full p-2 ${notification.read ? 'bg-slate-800' : 'bg-cyan-500/10'}`}>
                                        <Icon className={`h-5 w-5 ${colors[notification.type]}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-white">{notification.title}</h3>
                                                <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                                                <p className="mt-2 text-xs text-slate-500">{notification.time}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!notification.read && (
                                                    <button className="rounded-lg p-2 hover:bg-slate-800">
                                                        <Check className="h-4 w-4 text-slate-400" />
                                                    </button>
                                                )}
                                                <button className="rounded-lg p-2 hover:bg-slate-800">
                                                    <Trash2 className="h-4 w-4 text-slate-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Users, Plus, Shield, Mail, MoreVertical } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const teamMembers = [
    { name: 'John Doe', email: 'john@company.com', role: 'Owner', avatar: 'JD', status: 'Active', joined: 'Jan 2026' },
    { name: 'Jane Smith', email: 'jane@company.com', role: 'Admin', avatar: 'JS', status: 'Active', joined: 'Feb 2026' },
    { name: 'Mike Johnson', email: 'mike@company.com', role: 'Developer', avatar: 'MJ', status: 'Active', joined: 'Mar 2026' },
    { name: 'Sarah Lee', email: 'sarah@company.com', role: 'Viewer', avatar: 'SL', status: 'Pending', joined: 'Apr 2026' },
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Team</p>
                        <h1 className="mt-2 text-4xl font-semibold text-white">Team Management</h1>
                        <p className="mt-4 text-slate-400">Manage team members, roles, and permissions.</p>
                    </div>
                    <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                        <Plus className="mr-2 inline h-4 w-4" />
                        Invite Member
                    </button>
                </motion.div>

                <div className="mt-8 grid gap-6 sm:grid-cols-4">
                    {[
                        { label: 'Total Members', value: '12', icon: Users, color: 'text-cyan-400' },
                        { label: 'Active', value: '10', icon: Shield, color: 'text-green-400' },
                        { label: 'Pending', value: '2', icon: Mail, color: 'text-yellow-400' },
                        { label: 'Admins', value: '3', icon: Shield, color: 'text-violet-400' },
                    ].map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                            <stat.icon className={`mb-3 h-6 w-6 ${stat.color}`} />
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 rounded-[24px] border border-slate-800 bg-slate-900/50 overflow-hidden">
                    <div className="divide-y divide-slate-800">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.email}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-6 hover:bg-slate-800/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-semibold text-white">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{member.name}</p>
                                        <p className="text-sm text-slate-400">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">{member.role}</p>
                                        <p className="text-xs text-slate-500">Joined {member.joined}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        member.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                        {member.status}
                                    </span>
                                    <button className="rounded-lg p-2 hover:bg-slate-700">
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

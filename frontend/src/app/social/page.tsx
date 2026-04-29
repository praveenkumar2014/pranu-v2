'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Instagram, Send, Calendar, Clock, Image as ImageIcon, Hash } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const platforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

export default function SocialMediaPage() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
    const [content, setContent] = useState('');
    const [scheduled, setScheduled] = useState(false);

    const togglePlatform = (id: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Social Media</p>
                    <h1 className="mt-2 text-4xl font-semibold text-white">Publish & Schedule Posts</h1>
                    <p className="mt-4 text-slate-400">Create once, publish everywhere. AI-optimized content for each platform.</p>
                </motion.div>

                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-white">Select Platforms</h3>
                            <div className="flex flex-wrap gap-3">
                                {platforms.map((platform) => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => togglePlatform(platform.id)}
                                            className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${isSelected
                                                    ? `${platform.bg} ${platform.color} border-2 border-current`
                                                    : 'border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-sm font-medium">{platform.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-white">Create Post</h3>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post content here..."
                                rows={6}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">
                                        <ImageIcon className="h-4 w-4" />
                                        Add Image
                                    </button>
                                    <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">
                                        <Hash className="h-4 w-4" />
                                        Add Hashtags
                                    </button>
                                </div>
                                <span className="text-sm text-slate-500">{content.length} characters</span>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-white">Schedule Post</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                                    <Calendar className="h-5 w-5 text-cyan-400" />
                                    <input type="date" className="flex-1 bg-transparent text-white focus:outline-none" />
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                                    <Clock className="h-5 w-5 text-cyan-400" />
                                    <input type="time" className="flex-1 bg-transparent text-white focus:outline-none" />
                                </div>
                            </div>
                            <label className="mt-4 flex items-center gap-3">
                                <input type="checkbox" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-cyan-500" />
                                <span className="text-sm text-slate-300">Schedule for later</span>
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 rounded-full bg-cyan-500 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                                <Send className="mr-2 inline h-4 w-4" />
                                {scheduled ? 'Schedule Post' : 'Publish Now'}
                            </button>
                            <button className="rounded-full border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                                Save Draft
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>
                            <div className="rounded-xl bg-slate-800 p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                                    <div>
                                        <p className="font-semibold text-white">Your Brand</p>
                                        <p className="text-xs text-slate-400">Just now</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300">
                                    {content || 'Your post will appear here...'}
                                </p>
                                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                                    <span>❤️ Like</span>
                                    <span>💬 Comment</span>
                                    <span>🔄 Share</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-800 bg-slate-900/50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-white">Recent Posts</h3>
                            <div className="space-y-3">
                                {[
                                    { platform: 'Twitter', status: 'Published', time: '2h ago' },
                                    { platform: 'LinkedIn', status: 'Scheduled', time: 'Tomorrow' },
                                    { platform: 'Facebook', status: 'Draft', time: 'Yesterday' },
                                ].map((post, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-white">{post.platform}</p>
                                            <p className="text-xs text-slate-400">{post.time}</p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-xs ${post.status === 'Published' ? 'bg-green-500/10 text-green-400' :
                                                post.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-slate-700 text-slate-400'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

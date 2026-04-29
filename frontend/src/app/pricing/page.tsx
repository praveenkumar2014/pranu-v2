// ============================================================
// GS Groups AI Studio — Pricing Page
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const plans = [
    {
        name: 'Starter',
        price: '$0',
        period: '/month',
        description: 'Perfect for exploring AI capabilities',
        icon: Sparkles,
        features: [
            '100 AI generations/month',
            'Basic AI chat',
            '1 workspace',
            'Community support',
            'Basic analytics',
        ],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Professional',
        price: '$49',
        period: '/month',
        description: 'For growing teams and businesses',
        icon: Crown,
        features: [
            '10,000 AI generations/month',
            'Multi-model AI chat',
            'Unlimited workspaces',
            'Priority support',
            'Advanced analytics',
            'Content studio',
            'Social media publishing',
            'SEO automation',
            'Custom workflows',
        ],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$199',
        period: '/month',
        description: 'For large-scale AI operations',
        icon: Rocket,
        features: [
            'Unlimited AI generations',
            'All AI models included',
            'Unlimited everything',
            '24/7 dedicated support',
            'Enterprise analytics',
            'Full API access',
            'Custom AI training',
            'SSO & SAML',
            'SLA guarantee',
            'On-premise deployment',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Pricing</p>
                    <h1 className="mt-4 text-5xl font-semibold text-white">Choose your AI power level</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                        From free exploration to enterprise-scale AI operations. Upgrade anytime.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-[32px] border p-8 ${plan.popular
                                ? 'border-cyan-500 bg-slate-900/90 shadow-xl shadow-cyan-500/20'
                                : 'border-slate-800 bg-slate-900/50'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-1 text-xs font-semibold text-slate-950">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                                    <plan.icon size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-400">{plan.period}</span>
                            </div>

                            <ul className="mb-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full rounded-full py-3 text-sm font-semibold transition ${plan.popular
                                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                    : 'border border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 rounded-[36px] border border-slate-800 bg-slate-900/80 p-8 text-center"
                >
                    <h3 className="text-2xl font-semibold text-white">Need a custom plan?</h3>
                    <p className="mt-4 text-slate-400">
                        We offer tailored solutions for large teams and specific requirements.
                    </p>
                    <button className="mt-6 rounded-full bg-slate-800 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                        Contact Sales Team
                    </button>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

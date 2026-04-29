// ============================================================
// PRANU v2 — Agent Timeline Component
// ============================================================

'use client';

import type { TaskStep } from '@/lib/types';
import { CheckCircle2, Circle, Loader2, XCircle, AlertTriangle } from 'lucide-react';

interface AgentTimelineProps {
    steps: TaskStep[];
    currentStepIndex: number;
}

const stepStatusIcon: Record<string, React.ReactNode> = {
    pending: <Circle className="w-3 h-3 text-pranu-text-muted" />,
    executing: <Loader2 className="w-3 h-3 text-pranu-cyan animate-spin" />,
    completed: <CheckCircle2 className="w-3 h-3 text-pranu-green" />,
    rejected: <XCircle className="w-3 h-3 text-pranu-red" />,
    failed: <AlertTriangle className="w-3 h-3 text-pranu-amber" />,
};

export function AgentTimeline({ steps, currentStepIndex }: AgentTimelineProps) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto py-1">
            {steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pranu-surface-2 text-xs">
                        {stepStatusIcon[step.status] ?? stepStatusIcon.pending}
                        <span className={`${i === currentStepIndex ? 'text-pranu-cyan font-medium' :
                                step.status === 'completed' ? 'text-pranu-text-muted' :
                                    'text-pranu-text-muted'
                            }`}>
                            {step.stepNumber}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className="w-4 h-px bg-pranu-border" />
                    )}
                </div>
            ))}
        </div>
    );
}

// ============================================================
// PRANU v2 — Chat Message Component
// Individual log entry display
// ============================================================

'use client';

import type { LogEntry, AgentRole } from '@/lib/types';
import {
    Brain,
    Wrench,
    CheckCircle2,
    AlertCircle,
    Info,
    MessageSquare,
} from 'lucide-react';

interface ChatMessageProps {
    log: LogEntry;
}

const typeConfig: Record<
    string,
    { icon: React.ElementType; colorClass: string; label: string }
> = {
    thought: {
        icon: Brain,
        colorClass: 'text-pranu-blue',
        label: 'Thought',
    },
    action: {
        icon: Wrench,
        colorClass: 'text-pranu-amber',
        label: 'Action',
    },
    result: {
        icon: CheckCircle2,
        colorClass: 'text-pranu-green',
        label: 'Result',
    },
    error: {
        icon: AlertCircle,
        colorClass: 'text-pranu-red',
        label: 'Error',
    },
    system: {
        icon: Info,
        colorClass: 'text-pranu-text-muted',
        label: 'System',
    },
    review: {
        icon: MessageSquare,
        colorClass: 'text-pranu-purple',
        label: 'Review',
    },
};

const agentLabels: Record<AgentRole, string> = {
    planner: 'Planner',
    executor: 'Executor',
    critic: 'Critic',
    memory: 'Memory',
};

export function ChatMessage({ log }: ChatMessageProps) {
    const config = typeConfig[log.type] ?? typeConfig.system;
    const Icon = config.icon;

    return (
        <div className="animate-slide-in flex gap-2 py-1 text-sm group">
            {/* Icon + Agent label */}
            <div className="shrink-0 flex items-start gap-1 pt-0.5">
                <Icon className={`w-3.5 h-3.5 ${config.colorClass}`} />
                {log.agent && (
                    <span className="text-[10px] text-pranu-text-muted font-mono">
                        {agentLabels[log.agent]}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${log.type === 'error' ? 'text-pranu-red' :
                        log.type === 'thought' ? 'text-pranu-text/90' :
                            log.type === 'system' ? 'text-pranu-text-muted' :
                                'text-pranu-text'
                    }`}>
                    {log.content}
                </p>
            </div>

            {/* Timestamp */}
            <span className="shrink-0 text-[10px] text-pranu-text-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(log.timestamp).toLocaleTimeString()}
            </span>
        </div>
    );
}

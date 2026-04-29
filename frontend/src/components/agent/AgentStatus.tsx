// ============================================================
// PRANU v2 — Agent Status Component
// ============================================================

'use client';

import { useStore } from '@/lib/store';
import type { AgentRole, AgentState } from '@/lib/types';

interface AgentStatusProps {
    role: AgentRole;
    label: string;
}

const stateColors: Record<AgentState, string> = {
    idle: 'bg-pranu-text-muted/50',
    thinking: 'bg-pranu-blue animate-pulse-glow',
    acting: 'bg-pranu-amber animate-pulse-glow',
    error: 'bg-pranu-red',
};

const stateLabels: Record<AgentState, string> = {
    idle: 'Idle',
    thinking: 'Thinking',
    acting: 'Acting',
    error: 'Error',
};

export function AgentStatus({ role, label }: AgentStatusProps) {
    const agent = useStore((s) => s.agents[role]);
    const state = agent?.state ?? 'idle';

    return (
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-pranu-surface-2/50">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stateColors[state]}`} />
                <span className="text-xs font-medium text-pranu-text">{label}</span>
            </div>
            <span className={`text-[10px] ${state === 'idle' ? 'text-pranu-text-muted' :
                    state === 'thinking' ? 'text-pranu-blue' :
                        state === 'acting' ? 'text-pranu-amber' :
                            'text-pranu-red'
                }`}>
                {stateLabels[state]}
            </span>
        </div>
    );
}

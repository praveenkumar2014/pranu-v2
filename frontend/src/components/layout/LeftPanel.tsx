// ============================================================
// PRANU v2 — Left Panel
// Task list + Agent status
// ============================================================

'use client';

import { useStore } from '@/lib/store';
import { AgentStatus } from '../agent/AgentStatus';
import { TaskList } from '../task/TaskList';

export function LeftPanel() {
    return (
        <div className="h-full flex flex-col bg-pranu-surface">
            {/* Agent Status Section */}
            <div className="p-3 border-b border-pranu-border">
                <h2 className="text-xs font-semibold text-pranu-text-muted uppercase tracking-wider mb-3">
                    Agents
                </h2>
                <div className="space-y-2">
                    <AgentStatus role="planner" label="Planner" />
                    <AgentStatus role="executor" label="Executor" />
                    <AgentStatus role="critic" label="Critic" />
                    <AgentStatus role="memory" label="Memory" />
                </div>
            </div>

            {/* Task List Section */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="p-3 border-b border-pranu-border">
                    <h2 className="text-xs font-semibold text-pranu-text-muted uppercase tracking-wider">
                        Tasks
                    </h2>
                </div>
                <div className="overflow-y-auto h-full">
                    <TaskList />
                </div>
            </div>
        </div>
    );
}

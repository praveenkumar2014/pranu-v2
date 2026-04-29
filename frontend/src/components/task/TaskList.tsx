// ============================================================
// PRANU v2 — Task List Component
// ============================================================

'use client';

import { useStore } from '@/lib/store';
import type { TaskStatus } from '@/lib/types';

const statusColors: Record<TaskStatus, string> = {
    pending: 'bg-pranu-text-muted/30 text-pranu-text-muted',
    planning: 'bg-pranu-purple/20 text-pranu-purple',
    executing: 'bg-pranu-cyan/20 text-pranu-cyan',
    reviewing: 'bg-pranu-amber/20 text-pranu-amber',
    completed: 'bg-pranu-green/20 text-pranu-green',
    failed: 'bg-pranu-red/20 text-pranu-red',
    stopped: 'bg-pranu-text-muted/20 text-pranu-text-muted',
    paused: 'bg-pranu-amber/20 text-pranu-amber',
};

export function TaskList() {
    const tasks = useStore((s) => s.tasks);
    const activeTask = useStore((s) => s.activeTask);
    const setActiveTask = useStore((s) => s.setActiveTask);

    if (tasks.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-xs text-pranu-text-muted">No tasks yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-1 p-2">
            {tasks.map((task) => (
                <button
                    key={task.id}
                    onClick={() => setActiveTask(task)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTask?.id === task.id
                            ? 'bg-pranu-cyan/10 border border-pranu-cyan/20'
                            : 'hover:bg-pranu-surface-2/50'
                        }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-pranu-text line-clamp-2">{task.description}</p>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                    </div>
                    <p className="text-[10px] text-pranu-text-muted mt-1">
                        {new Date(task.createdAt).toLocaleString()}
                    </p>
                </button>
            ))}
        </div>
    );
}

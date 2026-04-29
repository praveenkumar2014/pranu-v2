// ============================================================
// PRANU v2 — Center Panel
// Chat + logs + command output + task input
// ============================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { createTask, stopTask } from '@/lib/api';
import { ChatLog } from '../chat/ChatLog';
import { AgentTimeline } from '../agent/AgentTimeline';
import { AgentControls } from '../agent/AgentControls';

export function CenterPanel() {
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const activeTask = useStore((s) => s.activeTask);
    const isStreaming = useStore((s) => s.isStreaming);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (!input.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await createTask(input.trim());
            setInput('');
        } catch (error) {
            console.error('Failed to start task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStop = async () => {
        if (!activeTask) return;
        try {
            await stopTask(activeTask.id);
        } catch (error) {
            console.error('Failed to stop task:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="h-full flex flex-col bg-pranu-bg">
            {/* Agent Controls */}
            <div className="shrink-0 px-4 py-2 border-b border-pranu-border bg-pranu-surface">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AgentControls />
                    </div>
                    {activeTask && (
                        <div className="text-xs text-pranu-text-muted">
                            {activeTask.status === 'executing' && (
                                <span className="text-pranu-cyan">Executing...</span>
                            )}
                            {activeTask.status === 'planning' && (
                                <span className="text-pranu-purple">Planning...</span>
                            )}
                            {activeTask.status === 'reviewing' && (
                                <span className="text-pranu-amber">Reviewing...</span>
                            )}
                            {activeTask.status === 'completed' && (
                                <span className="text-pranu-green">Completed</span>
                            )}
                            {activeTask.status === 'failed' && (
                                <span className="text-pranu-red">Failed</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline */}
            {activeTask && activeTask.steps.length > 0 && (
                <div className="shrink-0 px-4 py-2 border-b border-pranu-border">
                    <AgentTimeline steps={activeTask.steps} currentStepIndex={activeTask.currentStepIndex} />
                </div>
            )}

            {/* Chat / Logs */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <ChatLog />
            </div>

            {/* Task Input */}
            <div className="shrink-0 p-3 border-t border-pranu-border bg-pranu-surface">
                <div className="flex gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe a task for the AI agent..."
                        className="flex-1 bg-pranu-surface-2 border border-pranu-border rounded-lg px-3 py-2 text-sm text-pranu-text placeholder:text-pranu-text-muted resize-none focus:outline-none focus:border-pranu-cyan/50"
                        rows={2}
                        disabled={isSubmitting}
                    />
                    <div className="flex flex-col gap-1">
                        {isStreaming ? (
                            <button
                                onClick={handleStop}
                                className="px-4 py-2 bg-pranu-red/20 text-pranu-red border border-pranu-red/30 rounded-lg text-sm font-medium hover:bg-pranu-red/30 transition-colors"
                            >
                                Stop
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isSubmitting}
                                className="px-4 py-2 bg-pranu-cyan/20 text-pranu-cyan border border-pranu-cyan/30 rounded-lg text-sm font-medium hover:bg-pranu-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Run
                            </button>
                        )}
                        <span className="text-[10px] text-pranu-text-muted text-center">
                            Cmd+Enter
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PRANU v2 — Agent Controls Component
// ============================================================

'use client';

import { useStore } from '@/lib/store';
import { stopTask, pauseTask, resumeTask } from '@/lib/api';
import { Play, Pause, Square } from 'lucide-react';

export function AgentControls() {
  const activeTask = useStore((s) => s.activeTask);
  const isStreaming = useStore((s) => s.isStreaming);

  const handleStop = async () => {
    if (!activeTask) return;
    try {
      await stopTask(activeTask.id);
    } catch (err) {
      console.error('Stop failed:', err);
    }
  };

  const handlePause = async () => {
    if (!activeTask) return;
    try {
      await pauseTask(activeTask.id);
    } catch (err) {
      console.error('Pause failed:', err);
    }
  };

  const handleResume = async () => {
    if (!activeTask) return;
    try {
      await resumeTask(activeTask.id);
    } catch (err) {
      console.error('Resume failed:', err);
    }
  };

  const isPaused = activeTask?.status === 'paused';
  const isRunning = isStreaming && !isPaused;

  return (
    <div className="flex items-center gap-1">
      {isRunning && (
        <>
          <button
            onClick={handlePause}
            className="p-1.5 rounded-md hover:bg-pranu-surface-2 text-pranu-text-muted hover:text-pranu-text transition-colors"
            title="Pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleStop}
            className="p-1.5 rounded-md hover:bg-pranu-red/20 text-pranu-text-muted hover:text-pranu-red transition-colors"
            title="Stop"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </>
      )}
      {isPaused && (
        <button
          onClick={handleResume}
          className="p-1.5 rounded-md hover:bg-pranu-green/20 text-pranu-text-muted hover:text-pranu-green transition-colors"
          title="Resume"
        >
          <Play className="w-3.5 h-3.5" />
        </button>
      )}
      {!isStreaming && !isPaused && (
        <span className="text-xs text-pranu-text-muted">Ready</span>
      )}
    </div>
  );
}

// ============================================================
// PRANU v2 — Chat Log Component
// Scrollable log of agent thoughts, actions, and results
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { ChatMessage } from './ChatMessage';

export function ChatLog() {
  const logs = useStore((s) => s.logs);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-pranu-cyan/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-pranu-cyan/50 animate-pulse-glow" />
          </div>
          <div>
            <p className="text-sm text-pranu-text-muted">No activity yet</p>
            <p className="text-xs text-pranu-text-muted/60 mt-1">
              Enter a task below to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-1">
      {logs.map((log) => (
        <ChatMessage key={log.id} log={log} />
      ))}
    </div>
  );
}

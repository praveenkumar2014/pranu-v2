// ============================================================
// PRANU v2 — Workspace Layout
// Three-panel layout shell
// ============================================================

'use client';

import { useWebSocket } from '@/lib/websocket';
import { useStore } from '@/lib/store';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';

export function Workspace() {
  // Initialize WebSocket connection
  useWebSocket();

  return (
    <div className="h-screen flex flex-col bg-pranu-bg">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-pranu-border bg-pranu-surface shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pranu-cyan animate-pulse-glow" />
            <h1 className="text-sm font-semibold tracking-wider text-pranu-cyan">
              PRANU v2
            </h1>
          </div>
          <span className="text-xs text-pranu-text-muted">
            Autonomous AI Agent
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionIndicator />
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel */}
        <div className="w-[280px] shrink-0 border-r border-pranu-border overflow-hidden">
          <LeftPanel />
        </div>

        {/* Center Panel */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <CenterPanel />
        </div>

        {/* Right Panel */}
        <div className="w-[320px] shrink-0 border-l border-pranu-border overflow-hidden">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

function ConnectionIndicator() {
  const connected = useStore((s) => s.wsConnected);
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${connected ? 'bg-pranu-green' : 'bg-pranu-red'
          }`}
      />
      <span className="text-xs text-pranu-text-muted">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

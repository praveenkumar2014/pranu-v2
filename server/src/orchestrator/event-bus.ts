// ============================================================
// PRANU v2 — Event Bus
// Internal event system for agent-to-agent communication
// ============================================================

import { EventEmitter } from 'events';

export type OrchestratorEvent =
    | 'task.created'
    | 'task.planning'
    | 'plan.ready'
    | 'task.executing'
    | 'step.started'
    | 'step.completed'
    | 'step.rejected'
    | 'task.reviewing'
    | 'task.completed'
    | 'task.failed'
    | 'task.stopped'
    | 'task.paused'
    | 'task.resumed'
    | 'agent.state_change'
    | 'agent.thought'
    | 'agent.action_started'
    | 'agent.action_completed'
    | 'file.changed'
    | 'error';

export interface EventPayload {
    taskId?: string;
    stepId?: string;
    agent?: string;
    data?: unknown;
    error?: string;
    timestamp: string;
}

class OrchestratorEventBus extends EventEmitter {
    emit(event: OrchestratorEvent, payload: Omit<EventPayload, 'timestamp'>): boolean {
        const fullPayload: EventPayload = {
            ...payload,
            timestamp: new Date().toISOString(),
        };
        return super.emit(event, fullPayload);
    }

    on(event: OrchestratorEvent, listener: (payload: EventPayload) => void): this {
        return super.on(event, listener);
    }

    once(event: OrchestratorEvent, listener: (payload: EventPayload) => void): this {
        return super.once(event, listener);
    }
}

export const eventBus = new OrchestratorEventBus();

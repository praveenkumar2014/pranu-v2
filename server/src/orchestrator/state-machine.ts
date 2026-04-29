// ============================================================
// PRANU v2 — State Machine
// Manages task state transitions
// ============================================================

import { TaskStatus } from '../types/index.js';

type StateTransition = {
    from: TaskStatus;
    to: TaskStatus;
    allowed: boolean;
};

const TRANSITIONS: StateTransition[] = [
    // Normal flow
    { from: TaskStatus.PENDING, to: TaskStatus.PLANNING, allowed: true },
    { from: TaskStatus.PLANNING, to: TaskStatus.EXECUTING, allowed: true },
    { from: TaskStatus.EXECUTING, to: TaskStatus.REVIEWING, allowed: true },
    { from: TaskStatus.REVIEWING, to: TaskStatus.EXECUTING, allowed: true }, // retry
    { from: TaskStatus.REVIEWING, to: TaskStatus.COMPLETED, allowed: true },

    // From any state
    { from: TaskStatus.PENDING, to: TaskStatus.STOPPED, allowed: true },
    { from: TaskStatus.PLANNING, to: TaskStatus.STOPPED, allowed: true },
    { from: TaskStatus.EXECUTING, to: TaskStatus.STOPPED, allowed: true },
    { from: TaskStatus.REVIEWING, to: TaskStatus.STOPPED, allowed: true },
    { from: TaskStatus.PAUSED, to: TaskStatus.STOPPED, allowed: true },

    // Pause/resume
    { from: TaskStatus.PLANNING, to: TaskStatus.PAUSED, allowed: true },
    { from: TaskStatus.EXECUTING, to: TaskStatus.PAUSED, allowed: true },
    { from: TaskStatus.PAUSED, to: TaskStatus.EXECUTING, allowed: true },
    { from: TaskStatus.PAUSED, to: TaskStatus.PLANNING, allowed: true },

    // Failure
    { from: TaskStatus.PLANNING, to: TaskStatus.FAILED, allowed: true },
    { from: TaskStatus.EXECUTING, to: TaskStatus.FAILED, allowed: true },
    { from: TaskStatus.REVIEWING, to: TaskStatus.FAILED, allowed: true },

    // Restart
    { from: TaskStatus.STOPPED, to: TaskStatus.PENDING, allowed: true },
    { from: TaskStatus.FAILED, to: TaskStatus.PENDING, allowed: true },
    { from: TaskStatus.COMPLETED, to: TaskStatus.PENDING, allowed: true },
];

export class StateMachine {
    private current: TaskStatus;

    constructor(initial: TaskStatus = TaskStatus.PENDING) {
        this.current = initial;
    }

    get state(): TaskStatus {
        return this.current;
    }

    canTransition(to: TaskStatus): boolean {
        if (this.current === to) return true;
        return TRANSITIONS.some(
            (t) => t.from === this.current && t.to === to && t.allowed
        );
    }

    transition(to: TaskStatus): TaskStatus {
        if (!this.canTransition(to)) {
            throw new Error(`Invalid state transition: ${this.current} → ${to}`);
        }
        const prev = this.current;
        this.current = to;
        return prev;
    }

    reset(): void {
        this.current = TaskStatus.PENDING;
    }
}

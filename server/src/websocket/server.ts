// ============================================================
// PRANU v2 — WebSocket Server
// Real-time streaming to frontend clients
// ============================================================

import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';
import { eventBus, type OrchestratorEvent, type EventPayload } from '../orchestrator/event-bus.js';
import { config } from '../config.js';

interface ClientConnection {
    id: string;
    ws: WebSocket;
    isAlive: boolean;
}

export class WSServer {
    private wss: WebSocketServer;
    private clients: Map<string, ClientConnection> = new Map();
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    constructor(port: number = config.WS_PORT) {
        this.wss = new WebSocketServer({ port });

        this.wss.on('connection', (ws) => {
            this.handleConnection(ws);
        });

        // Heartbeat to detect dead connections
        this.heartbeatInterval = setInterval(() => {
            for (const [id, client] of this.clients) {
                if (!client.isAlive) {
                    client.ws.terminate();
                    this.clients.delete(id);
                    continue;
                }
                client.isAlive = false;
                client.ws.ping();
            }
        }, 30000);

        // Wire orchestrator events to broadcast
        this.wireEvents();

        console.log(`🔌 WebSocket server started on port ${port}`);
    }

    private handleConnection(ws: WebSocket): void {
        const clientId = uuid();
        const client: ClientConnection = { id: clientId, ws, isAlive: true };
        this.clients.set(clientId, client);

        // Send connected message
        this.sendTo(ws, 'connected', {
            sessionId: clientId,
            serverVersion: '2.0.0',
        });

        ws.on('pong', () => {
            client.isAlive = true;
        });

        ws.on('message', (data) => {
            this.handleMessage(clientId, data);
        });

        ws.on('close', () => {
            this.clients.delete(clientId);
        });

        ws.on('error', (error) => {
            console.error(`WS client ${clientId} error:`, error.message);
            this.clients.delete(clientId);
        });
    }

    private handleMessage(clientId: string, data: unknown): void {
        try {
            const message = JSON.parse(String(data));
            // Forward client messages to the event bus or handle directly
            // These are handled by the API routes mostly, but WS provides
            // a real-time alternative
            console.log(`WS message from ${clientId}:`, message.type);
        } catch {
            console.warn(`Invalid WS message from ${clientId}`);
        }
    }

    private wireEvents(): void {
        const eventToMessageType: Record<OrchestratorEvent, string> = {
            'task.created': 'task.created',
            'task.planning': 'task.planning',
            'plan.ready': 'plan.ready',
            'task.executing': 'task.executing',
            'step.started': 'step.started',
            'step.completed': 'step.completed',
            'step.rejected': 'step.rejected',
            'task.reviewing': 'task.reviewing',
            'task.completed': 'task.completed',
            'task.failed': 'task.error',
            'task.stopped': 'task.stopped',
            'task.paused': 'task.paused',
            'task.resumed': 'task.resumed',
            'agent.state_change': 'agent.status',
            'agent.thought': 'agent.thought',
            'agent.action_started': 'action.started',
            'agent.action_completed': 'action.completed',
            'file.changed': 'file.changed',
            'error': 'task.error',
        };

        for (const [event, messageType] of Object.entries(eventToMessageType)) {
            eventBus.on(event as OrchestratorEvent, (payload: EventPayload) => {
                this.broadcast(messageType, payload);
            });
        }
    }

    private sendTo(ws: WebSocket, type: string, payload: unknown): void {
        if (ws.readyState !== WebSocket.OPEN) return;

        const message = {
            id: uuid(),
            type,
            timestamp: new Date().toISOString(),
            payload,
        };

        ws.send(JSON.stringify(message));
    }

    broadcast(type: string, payload: unknown): void {
        const message = {
            id: uuid(),
            type,
            timestamp: new Date().toISOString(),
            payload,
        };

        const data = JSON.stringify(message);
        for (const [, client] of this.clients) {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(data);
            }
        }
    }

    close(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        for (const [, client] of this.clients) {
            client.ws.close();
        }
        this.wss.close();
    }
}

// ============================================================
// PRANU v2 — WebSocket Client Hook
// Manages WebSocket connection with auto-reconnect
// ============================================================

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from './store';
import type { WSMessage, WSMessageType } from './types';

const WS_URL = 'ws://localhost:4001';
const RECONNECT_BASE_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export function useWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttemptRef = useRef(0);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleWSMessage = useStore((s) => s.handleWSMessage);
    const setWsConnected = useStore((s) => s.setWsConnected);

    const connect = useCallback(() => {
        // Don't connect on server-side
        if (typeof window === 'undefined') return;

        try {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                reconnectAttemptRef.current = 0;
                setWsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const message: WSMessage = JSON.parse(event.data);
                    handleWSMessage(message.type as WSMessageType, message.payload);
                } catch (err) {
                    console.warn('Failed to parse WS message:', err);
                }
            };

            ws.onclose = () => {
                setWsConnected(false);
                scheduleReconnect();
            };

            ws.onerror = () => {
                ws.close();
            };
        } catch {
            scheduleReconnect();
        }
    }, [handleWSMessage, setWsConnected]);

    const scheduleReconnect = useCallback(() => {
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

        const delay = Math.min(
            RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptRef.current),
            MAX_RECONNECT_DELAY
        );
        reconnectAttemptRef.current += 1;

        reconnectTimerRef.current = setTimeout(() => {
            connect();
        }, delay);
    }, [connect]);

    const sendMessage = useCallback((type: string, payload: Record<string, unknown>) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    id: crypto.randomUUID(),
                    type,
                    timestamp: new Date().toISOString(),
                    payload,
                })
            );
        }
    }, []);

    const disconnect = useCallback(() => {
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectAttemptRef.current = 999; // Prevent reconnect
        wsRef.current?.close();
    }, []);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return { sendMessage, disconnect };
}

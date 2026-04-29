// ============================================================
// PRANU v2 — HTTP Request Tool
// ============================================================

import { z } from 'zod';
import type { ITool, ToolContext } from './registry.js';
import type { ToolResult } from '../types/index.js';

const httpRequestInputSchema = z.object({
    url: z.string().describe('URL to request'),
    method: z.string().optional().default('GET').describe('HTTP method'),
    headers: z.record(z.string(), z.string()).optional().describe('Request headers'),
    body: z.string().optional().describe('Request body'),
    timeout: z.number().optional().default(30000).describe('Timeout in milliseconds'),
});

const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];

function isUrlBlocked(url: string): boolean {
    try {
        const parsed = new URL(url);
        return BLOCKED_HOSTS.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
    } catch { return true; }
}

export class HttpRequestTool implements ITool {
    name = 'http_request';
    description = 'Make an HTTP request to a URL. Returns the response status, headers, and body.';
    inputSchema = httpRequestInputSchema;

    async execute(rawInput: unknown, _context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { url: string; method: string; headers?: Record<string, string>; body?: string; timeout: number };

        if (isUrlBlocked(input.url)) {
            return { success: false, output: '', error: 'Requests to local/internal URLs are not allowed' };
        }

        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), input.timeout);

            const response = await fetch(input.url, {
                method: input.method,
                headers: input.headers,
                body: input.method !== 'GET' ? input.body : undefined,
                signal: controller.signal,
            });

            clearTimeout(timer);

            const responseHeaders: Record<string, string> = {};
            response.headers.forEach((value, key) => { responseHeaders[key] = value; });

            let body = await response.text();
            let truncated = false;

            if (body.length > 100000) {
                body = body.substring(0, 100000) + '\n... [response truncated]';
                truncated = true;
            }

            return {
                success: response.status >= 200 && response.status < 400,
                output: body,
                metadata: { status: response.status, headers: responseHeaders, truncated },
            };
        } catch (error: unknown) {
            return {
                success: false,
                output: '',
                error: `HTTP request failed: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
}

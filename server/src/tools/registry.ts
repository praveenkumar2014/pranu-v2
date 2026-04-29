// ============================================================
// PRANU v2 — Tool Interface & Registry
// ============================================================

import { z } from 'zod';
import type { ToolResult } from '../types/index.js';

export interface ToolContext {
    taskId: string;
    workspacePath: string;
    containerId?: string;
    signal?: AbortSignal;
}

export interface ITool {
    name: string;
    description: string;
    inputSchema: z.ZodTypeAny;
    execute(input: unknown, context: ToolContext): Promise<ToolResult>;
}

export class ToolRegistry {
    private tools: Map<string, ITool> = new Map();

    register(tool: ITool): void {
        this.tools.set(tool.name, tool);
    }

    get(name: string): ITool | undefined {
        return this.tools.get(name);
    }

    has(name: string): boolean {
        return this.tools.has(name);
    }

    list(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
        return Array.from(this.tools.values()).map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: zodToJsonSchema(t.inputSchema),
        }));
    }

    async execute(name: string, input: unknown, context: ToolContext): Promise<ToolResult> {
        const tool = this.tools.get(name);
        if (!tool) {
            return {
                success: false,
                output: '',
                error: `Unknown tool: ${name}`,
            };
        }

        // Validate input
        const parsed = tool.inputSchema.safeParse(input);
        if (!parsed.success) {
            return {
                success: false,
                output: '',
                error: `Invalid input for ${name}: ${parsed.error.flatten()}`,
            };
        }

        try {
            const result = await tool.execute(parsed.data, context);
            // Truncate output to prevent context overflow
            if (result.output && result.output.length > 50000) {
                result.output = result.output.substring(0, 50000) + '\n... [output truncated]';
                result.metadata = { ...result.metadata, truncated: true };
            }
            return result;
        } catch (error: unknown) {
            return {
                success: false,
                output: '',
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
}

// Simple Zod → JSON Schema converter
function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
    if (schema instanceof z.ZodObject) {
        const properties: Record<string, unknown> = {};
        const required: string[] = [];
        for (const [key, value] of Object.entries(schema.shape)) {
            properties[key] = zodToJsonSchema(value as z.ZodTypeAny);
            if (!(value instanceof z.ZodOptional)) {
                required.push(key);
            }
        }
        return {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined,
        };
    }
    if (schema instanceof z.ZodString) return { type: 'string' };
    if (schema instanceof z.ZodNumber) return { type: 'number' };
    if (schema instanceof z.ZodBoolean) return { type: 'boolean' };
    if (schema instanceof z.ZodArray) return { type: 'array', items: zodToJsonSchema(schema.element) };
    if (schema instanceof z.ZodOptional) return zodToJsonSchema(schema.unwrap());
    if (schema instanceof z.ZodDefault) return zodToJsonSchema(schema._def.innerType);
    if (schema instanceof z.ZodEnum) return { type: 'string', enum: schema._def.values };
    return {};
}

// Singleton registry
export const toolRegistry = new ToolRegistry();

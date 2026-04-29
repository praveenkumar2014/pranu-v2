// ============================================================
// PRANU v2 — File Tools (read_file, write_file)
// ============================================================

import { z } from 'zod';
import { readFile, writeFile, mkdir, stat, appendFile } from 'fs/promises';
import { dirname } from 'path';
import type { ITool, ToolContext } from './registry.js';
import type { ToolResult } from '../types/index.js';

const readFileInputSchema = z.object({
    path: z.string().describe('Path to the file to read (relative to workspace)'),
    maxLines: z.number().optional().describe('Maximum number of lines to return'),
});

export class ReadFileTool implements ITool {
    name = 'read_file';
    description = 'Read the contents of a file. Returns the file content with line numbers.';
    inputSchema = readFileInputSchema;

    async execute(rawInput: unknown, context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { path: string; maxLines?: number };
        const fullPath = resolveWorkspacePath(input.path, context.workspacePath);

        try {
            const content = await readFile(fullPath, 'utf-8');
            const lines = content.split('\n');
            const totalLines = lines.length;

            let result = content;
            let truncated = false;

            if (input.maxLines && lines.length > input.maxLines) {
                result = lines.slice(0, input.maxLines).join('\n');
                truncated = true;
            }

            return {
                success: true,
                output: result,
                metadata: { totalLines, truncated, path: input.path },
            };
        } catch (error: unknown) {
            return {
                success: false,
                output: '',
                error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
}

const writeFileInputSchema = z.object({
    path: z.string().describe('Path to the file to write (relative to workspace)'),
    content: z.string().describe('Content to write to the file'),
    mode: z.enum(['create', 'overwrite', 'append']).optional().default('overwrite').describe('Write mode'),
});

export class WriteFileTool implements ITool {
    name = 'write_file';
    description = 'Write content to a file. Creates parent directories if needed. Supports create, overwrite, and append modes.';
    inputSchema = writeFileInputSchema;

    async execute(rawInput: unknown, context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { path: string; content: string; mode: 'create' | 'overwrite' | 'append' };
        const fullPath = resolveWorkspacePath(input.path, context.workspacePath);

        try {
            await mkdir(dirname(fullPath), { recursive: true });

            if (input.mode === 'append') {
                await appendFile(fullPath, input.content, 'utf-8');
            } else {
                if (input.mode === 'create') {
                    try {
                        await stat(fullPath);
                        return {
                            success: false,
                            output: '',
                            error: `File already exists: ${input.path}. Use mode 'overwrite' to replace it.`,
                        };
                    } catch {
                        // File doesn't exist, proceed
                    }
                }
                await writeFile(fullPath, input.content, 'utf-8');
            }

            const bytesWritten = Buffer.byteLength(input.content, 'utf-8');

            return {
                success: true,
                output: `Successfully wrote ${bytesWritten} bytes to ${input.path}`,
                metadata: { path: input.path, bytesWritten, mode: input.mode },
            };
        } catch (error: unknown) {
            return {
                success: false,
                output: '',
                error: `Failed to write file: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
}

function resolveWorkspacePath(inputPath: string, workspacePath: string): string {
    const normalized = inputPath.replace(/\.\./g, '').replace(/\/+/g, '/');
    if (normalized.startsWith('/')) return normalized;
    return `${workspacePath}/${normalized}`.replace(/\/+/g, '/');
}

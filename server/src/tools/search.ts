// ============================================================
// PRANU v2 — Search Code Tool
// ============================================================

import { z } from 'zod';
import { exec } from 'child_process';
import type { ITool, ToolContext } from './registry.js';
import type { ToolResult } from '../types/index.js';

const searchCodeInputSchema = z.object({
    pattern: z.string().describe('Search pattern (regex supported)'),
    path: z.string().optional().describe('Subdirectory to search in'),
    type: z.string().optional().describe('File type filter'),
    caseSensitive: z.boolean().optional().default(false).describe('Case-sensitive search'),
});

export class SearchCodeTool implements ITool {
    name = 'search_code';
    description = 'Search the codebase for a text pattern. Uses ripgrep for fast searching.';
    inputSchema = searchCodeInputSchema;

    async execute(rawInput: unknown, context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { pattern: string; path?: string; type?: string; caseSensitive?: boolean };
        const searchPath = input.path
            ? `${context.workspacePath}/${input.path}`
            : context.workspacePath;

        try {
            return await this.searchWithRg(input, searchPath);
        } catch {
            try {
                return await this.searchWithGrep(input, searchPath);
            } catch {
                return await this.searchWithFs(input, searchPath);
            }
        }
    }

    private searchWithRg(input: { pattern: string; type?: string; caseSensitive?: boolean }, searchPath: string): Promise<ToolResult> {
        const args: string[] = ['--json', '--max-count', '50'];
        if (!input.caseSensitive) args.push('-i');
        if (input.type) args.push('--type', input.type);
        args.push(input.pattern, searchPath);

        return new Promise((resolve) => {
            exec(
                `rg ${args.map((a) => `'${a}'`).join(' ')}`,
                { timeout: 30000, maxBuffer: 1024 * 1024 * 5 },
                (error, stdout) => {
                    if (error && !stdout) {
                        resolve({ success: true, output: 'No matches found', metadata: { matches: [], totalMatches: 0 } });
                        return;
                    }
                    try {
                        const matches = stdout.split('\n').filter((l) => l.trim())
                            .map((line) => { try { return JSON.parse(line); } catch { return null; } })
                            .filter((e) => e?.type === 'match')
                            .map((e) => ({ file: e.data?.path?.text ?? '', line: e.data?.line_number ?? 0, content: e.data?.lines?.text?.trim() ?? '' }));

                        resolve({
                            success: true,
                            output: matches.map((m) => `${m.file}:${m.line}: ${m.content}`).join('\n'),
                            metadata: { matches, totalMatches: matches.length },
                        });
                    } catch {
                        resolve({ success: true, output: stdout || 'No matches found', metadata: { matches: [], totalMatches: 0 } });
                    }
                }
            );
        });
    }

    private searchWithGrep(input: { pattern: string; type?: string; caseSensitive?: boolean }, searchPath: string): Promise<ToolResult> {
        const args: string[] = ['-rn'];
        if (!input.caseSensitive) args.push('-i');
        if (input.type) args.push('--include', `*.${input.type}`);
        args.push(input.pattern, searchPath);

        return new Promise((resolve) => {
            exec(`grep ${args.map((a) => `'${a}'`).join(' ')}`,
                { timeout: 30000, maxBuffer: 1024 * 1024 * 5 },
                (error, stdout) => {
                    if (error && !stdout) {
                        resolve({ success: true, output: 'No matches found', metadata: { matches: [], totalMatches: 0 } });
                        return;
                    }
                    const matches = stdout.split('\n').filter((l) => l.trim()).slice(0, 50).map((line) => {
                        const parts = line.split(':');
                        const file = parts[0] ?? '';
                        const lineNum = parseInt(parts[1] ?? '0', 10);
                        const content = parts.slice(2).join(':').trim();
                        return { file, line: lineNum, content };
                    });
                    resolve({
                        success: true,
                        output: matches.map((m) => `${m.file}:${m.line}: ${m.content}`).join('\n'),
                        metadata: { matches, totalMatches: matches.length },
                    });
                }
            );
        });
    }

    private async searchWithFs(input: { pattern: string; type?: string; caseSensitive?: boolean }, searchPath: string): Promise<ToolResult> {
        const { readdir, stat: statFn, readFile: readFn } = await import('fs/promises');
        const { join } = await import('path');
        const matches: Array<{ file: string; line: number; content: string }> = [];
        const flags = input.caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(input.pattern, flags);

        async function searchDir(dir: string, depth = 0): Promise<void> {
            if (depth > 10 || matches.length >= 50) return;
            try {
                const entries = await readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    if (matches.length >= 50) break;
                    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
                    const fullPath = join(dir, entry.name);
                    if (entry.isDirectory()) { await searchDir(fullPath, depth + 1); }
                    else if (entry.isFile()) {
                        if (input.type && !entry.name.endsWith(`.${input.type}`)) continue;
                        try {
                            const content = await readFn(fullPath, 'utf-8');
                            const lines = content.split('\n');
                            for (let i = 0; i < lines.length && matches.length < 50; i++) {
                                if (regex.test(lines[i])) {
                                    matches.push({ file: fullPath.replace(searchPath + '/', ''), line: i + 1, content: lines[i].trim() });
                                    regex.lastIndex = 0;
                                }
                            }
                        } catch { /* skip */ }
                    }
                }
            } catch { /* skip */ }
        }

        await searchDir(searchPath);
        return {
            success: true,
            output: matches.length > 0 ? matches.map((m) => `${m.file}:${m.line}: ${m.content}`).join('\n') : 'No matches found',
            metadata: { matches, totalMatches: matches.length },
        };
    }
}

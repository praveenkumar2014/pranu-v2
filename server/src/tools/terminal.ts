// ============================================================
// PRANU v2 — Terminal Tool
// Executes shell commands in sandbox or directly
// ============================================================

import { z } from 'zod';
import { exec } from 'child_process';
import type { ITool, ToolContext } from './registry.js';
import type { ToolResult } from '../types/index.js';

const terminalInputSchema = z.object({
    command: z.string().describe('The shell command to execute'),
    cwd: z.string().optional().describe('Working directory for the command'),
    timeout: z.number().optional().describe('Timeout in milliseconds (default 60000)'),
});

// Blocked commands for safety
const BLOCKED_PATTERNS = [
    /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+|.*--no-preserve-root)/,
    /mkfs\./,
    /dd\s+if=/,
    />\s*\/dev\/sda/,
    /:\(\)\{.*;\}/,
    /curl\s+.*\|\s*(ba)?sh/,
    /wget\s+.*\|\s*(ba)?sh/,
];

function isCommandBlocked(command: string): boolean {
    return BLOCKED_PATTERNS.some((pattern) => pattern.test(command));
}

export class TerminalTool implements ITool {
    name = 'run_terminal';
    description = 'Execute a shell command and return the output. Use for running build commands, tests, git operations, and other CLI tools.';
    inputSchema = terminalInputSchema;

    async execute(rawInput: unknown, context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { command: string; cwd?: string; timeout?: number };

        if (isCommandBlocked(input.command)) {
            return {
                success: false,
                output: '',
                error: 'Command blocked for safety reasons',
            };
        }

        const timeout = input.timeout ?? 60000;
        const cwd = input.cwd ?? context.workspacePath;

        if (context.containerId) {
            return this.executeInContainer(input.command, context.containerId, cwd, timeout);
        }

        return this.executeDirectly(input.command, cwd, timeout);
    }

    private executeDirectly(command: string, cwd: string, timeout: number): Promise<ToolResult> {
        return new Promise((resolve) => {
            exec(
                command,
                { cwd, timeout, maxBuffer: 1024 * 1024 * 5 },
                (error, stdout, stderr) => {
                    const output = stdout || '';
                    const errOutput = stderr || '';

                    if (error) {
                        resolve({
                            success: false,
                            output: output + (errOutput ? `\n[stderr]\n${errOutput}` : ''),
                            error: `Exit code ${error.code ?? 'unknown'}: ${error.message}`,
                            metadata: { exitCode: error.code ?? 1, stdout, stderr: errOutput },
                        });
                    } else {
                        resolve({
                            success: true,
                            output: output + (errOutput ? `\n[stderr]\n${errOutput}` : ''),
                            metadata: { exitCode: 0, stdout, stderr: errOutput },
                        });
                    }
                }
            );
        });
    }

    private async executeInContainer(
        command: string, containerId: string, cwd: string, timeout: number
    ): Promise<ToolResult> {
        try {
            const Docker = (await import('dockerode')).default;
            const docker = new Docker();
            const container = docker.getContainer(containerId);

            const execInst = await container.exec({
                Cmd: ['bash', '-c', command],
                WorkingDir: cwd,
                AttachStdout: true,
                AttachStderr: true,
            });

            const stream = await execInst.start({});
            const chunks: Buffer[] = [];

            return new Promise((resolve) => {
                const timer = setTimeout(() => {
                    resolve({
                        success: false,
                        output: Buffer.concat(chunks).toString('utf-8'),
                        error: 'Command timed out',
                        metadata: { exitCode: -1 },
                    });
                }, timeout);

                stream.on('data', (chunk: Buffer) => chunks.push(chunk));
                stream.on('end', () => {
                    clearTimeout(timer);
                    const out = Buffer.concat(chunks).toString('utf-8');
                    resolve({
                        success: true,
                        output: out.replace(/^[\x00-\x08]/gm, ''),
                        metadata: { exitCode: 0 },
                    });
                });
                stream.on('error', (err: Error) => {
                    clearTimeout(timer);
                    resolve({
                        success: false,
                        output: Buffer.concat(chunks).toString('utf-8'),
                        error: err.message,
                    });
                });
            });
        } catch (error: unknown) {
            return {
                success: false,
                output: '',
                error: `Container exec failed: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
}

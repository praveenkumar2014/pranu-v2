// ============================================================
// PRANU v2 — Install Package Tool
// ============================================================

import { z } from 'zod';
import { exec } from 'child_process';
import type { ITool, ToolContext } from './registry.js';
import type { ToolResult } from '../types/index.js';

const installPackageInputSchema = z.object({
    package: z.string().describe('Package name to install'),
    manager: z.enum(['npm', 'pip']).optional().default('npm').describe('Package manager to use'),
    dev: z.boolean().optional().default(false).describe('Install as dev dependency (npm only)'),
});

export class InstallPackageTool implements ITool {
    name = 'install_package';
    description = 'Install a package using npm or pip. Returns the installation output.';
    inputSchema = installPackageInputSchema;

    async execute(rawInput: unknown, context: ToolContext): Promise<ToolResult> {
        const input = rawInput as { package: string; manager: 'npm' | 'pip'; dev: boolean };
        const cwd = context.workspacePath;

        let command: string;
        if (input.manager === 'pip') {
            command = `pip install ${input.package}`;
        } else {
            command = input.dev ? `npm install --save-dev ${input.package}` : `npm install ${input.package}`;
        }

        return new Promise((resolve) => {
            exec(command, { cwd, timeout: 120000, maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
                const output = stdout || '';
                const errOutput = stderr || '';

                if (error) {
                    resolve({
                        success: false,
                        output: output + (errOutput ? `\n[stderr]\n${errOutput}` : ''),
                        error: `Package installation failed: ${error.message}`,
                        metadata: { manager: input.manager, package: input.package },
                    });
                } else {
                    const versionMatch = (output + errOutput).match(/(?:added|updated).*?(\d+\.\d+\.\d+)/);
                    resolve({
                        success: true,
                        output: output || `Package ${input.package} installed successfully`,
                        metadata: { installed: true, version: versionMatch?.[1] ?? 'unknown', manager: input.manager, package: input.package },
                    });
                }
            });
        });
    }
}

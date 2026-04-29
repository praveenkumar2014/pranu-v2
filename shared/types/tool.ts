// ============================================================
// PRANU v2 — Shared Type Definitions: Tool
// ============================================================

export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>; // JSON Schema
}

export interface ToolResult {
    success: boolean;
    output: string;
    error?: string;
    metadata?: Record<string, unknown>;
}

// Tool-specific input types
export interface TerminalInput {
    command: string;
    cwd?: string;
    timeout?: number;
}

export interface TerminalOutput {
    stdout: string;
    stderr: string;
    exitCode: number;
}

export interface WriteFileInput {
    path: string;
    content: string;
    mode?: 'create' | 'overwrite' | 'append';
}

export interface WriteFileOutput {
    path: string;
    bytesWritten: number;
}

export interface ReadFileInput {
    path: string;
    maxLines?: number;
}

export interface ReadFileOutput {
    content: string;
    totalLines: number;
    truncated: boolean;
}

export interface SearchCodeInput {
    pattern: string;
    path?: string;
    type?: string;
    caseSensitive?: boolean;
}

export interface SearchMatch {
    file: string;
    line: number;
    content: string;
}

export interface SearchCodeOutput {
    matches: SearchMatch[];
    totalMatches: number;
}

export interface InstallPackageInput {
    package: string;
    manager?: 'npm' | 'pip';
    dev?: boolean;
}

export interface InstallPackageOutput {
    installed: boolean;
    version: string;
    output: string;
}

export interface HttpRequestInput {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    timeout?: number;
}

export interface HttpRequestOutput {
    status: number;
    headers: Record<string, string>;
    body: string;
    truncated?: boolean;
}

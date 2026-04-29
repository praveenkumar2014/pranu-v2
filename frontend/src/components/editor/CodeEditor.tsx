// ============================================================
// PRANU v2 — Code Editor Component (Monaco)
// ============================================================

'use client';

import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';

const MonacoEditor = dynamic(
    () => import('@monaco-editor/react').then((mod) => mod.default),
    { ssr: false }
);

interface CodeEditorProps {
    path: string;
    content: string;
}

function getLanguage(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, string> = {
        ts: 'typescript',
        tsx: 'typescript',
        js: 'javascript',
        jsx: 'javascript',
        py: 'python',
        json: 'json',
        css: 'css',
        html: 'html',
        md: 'markdown',
        yaml: 'yaml',
        yml: 'yaml',
        sql: 'sql',
        sh: 'shell',
        bash: 'shell',
    };
    return map[ext] ?? 'plaintext';
}

export function CodeEditor({ path, content }: CodeEditorProps) {
    const handleMount: OnMount = (editor, monaco) => {
        // Define PRANU dark theme
        monaco.editor.defineTheme('pranu-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '8888a0' },
                { token: 'keyword', foreground: 'bd00ff' },
                { token: 'string', foreground: '22c55e' },
                { token: 'number', foreground: 'f59e0b' },
                { token: 'type', foreground: '00fff2' },
            ],
            colors: {
                'editor.background': '#0a0a0f',
                'editor.foreground': '#e0e0e8',
                'editorLineNumber.foreground': '#3a3a4a',
                'editor.lineHighlightBackground': '#1a1a28',
                'editor.selectionBackground': '#3b82f630',
                'editorWidget.background': '#12121a',
            },
        });
        monaco.editor.setTheme('pranu-dark');
    };

    return (
        <MonacoEditor
            height="100%"
            language={getLanguage(path)}
            value={content}
            onMount={handleMount}
            options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                renderLineHighlight: 'line',
                padding: { top: 8 },
                automaticLayout: true,
            }}
        />
    );
}

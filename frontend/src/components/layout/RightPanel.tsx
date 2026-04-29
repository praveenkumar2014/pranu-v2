// ============================================================
// PRANU v2 — Right Panel
// File tree + code editor + file tabs
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { getFileTree, getFileContent } from '@/lib/api';
import { FileTree } from '../editor/FileTree';
import { CodeEditor } from '../editor/CodeEditor';
import { FileTab } from '../editor/FileTab';

export function RightPanel() {
    const fileTree = useStore((s) => s.fileTree);
    const setFileTree = useStore((s) => s.setFileTree);
    const openFiles = useStore((s) => s.openFiles);
    const activeFile = useStore((s) => s.activeFile);
    const fileContents = useStore((s) => s.fileContents);
    const openFile = useStore((s) => s.openFile);
    const setFileContent = useStore((s) => s.setFileContent);

    // Load file tree on mount
    useEffect(() => {
        getFileTree()
            .then((tree) => setFileTree(tree as any[]))
            .catch(() => { });
    }, [setFileTree]);

    // Load file content when opening
    useEffect(() => {
        if (activeFile && !fileContents[activeFile]) {
            getFileContent(activeFile)
                .then((data: any) => setFileContent(activeFile, data.content || data.data?.content))
                .catch(() => { });
        }
    }, [activeFile, fileContents, setFileContent]);

    return (
        <div className="h-full flex flex-col bg-pranu-surface">
            {/* Panel header */}
            <div className="shrink-0 px-3 py-2 border-b border-pranu-border">
                <h2 className="text-xs font-semibold text-pranu-text-muted uppercase tracking-wider">
                    Files
                </h2>
            </div>

            {/* File Tree */}
            <div className="shrink-0 max-h-[200px] overflow-y-auto border-b border-pranu-border">
                <FileTree
                    nodes={fileTree}
                    onFileClick={(path) => openFile(path)}
                />
            </div>

            {/* File Tabs */}
            {openFiles.length > 0 && (
                <div className="shrink-0 flex overflow-x-auto border-b border-pranu-border bg-pranu-bg">
                    {openFiles.map((path) => (
                        <FileTab
                            key={path}
                            path={path}
                            isActive={path === activeFile}
                            onClick={() => openFile(path)}
                        />
                    ))}
                </div>
            )}

            {/* Code Editor */}
            <div className="flex-1 min-h-0">
                {activeFile && fileContents[activeFile] ? (
                    <CodeEditor
                        path={activeFile}
                        content={fileContents[activeFile]}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-pranu-text-muted text-sm">
                        Select a file to view
                    </div>
                )}
            </div>
        </div>
    );
}

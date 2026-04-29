// ============================================================
// PRANU v2 — File Tree Component
// ============================================================

'use client';

import { useState } from 'react';
import type { FileTreeNode } from '@/lib/types';
import {
    ChevronRight,
    ChevronDown,
    File,
    Folder,
    FolderOpen,
} from 'lucide-react';

interface FileTreeProps {
    nodes: FileTreeNode[];
    onFileClick: (path: string) => void;
    depth?: number;
}

const extensionIcon: Record<string, string> = {
    '.ts': 'text-pranu-blue',
    '.tsx': 'text-pranu-blue',
    '.js': 'text-pranu-amber',
    '.jsx': 'text-pranu-amber',
    '.py': 'text-pranu-green',
    '.json': 'text-pranu-amber',
    '.css': 'text-pranu-purple',
    '.md': 'text-pranu-text-muted',
};

export function FileTree({ nodes, onFileClick, depth = 0 }: FileTreeProps) {
    return (
        <div className="py-1">
            {nodes.map((node) => (
                <FileTreeNodeComponent
                    key={node.path}
                    node={node}
                    onFileClick={onFileClick}
                    depth={depth}
                />
            ))}
        </div>
    );
}

function FileTreeNodeComponent({
    node,
    onFileClick,
    depth,
}: {
    node: FileTreeNode;
    onFileClick: (path: string) => void;
    depth: number;
}) {
    const [isOpen, setIsOpen] = useState(depth < 1);

    if (node.type === 'directory') {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 w-full px-2 py-0.5 hover:bg-pranu-surface-2/50 rounded-sm text-xs transition-colors"
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                    {isOpen ? (
                        <ChevronDown className="w-3 h-3 text-pranu-text-muted shrink-0" />
                    ) : (
                        <ChevronRight className="w-3 h-3 text-pranu-text-muted shrink-0" />
                    )}
                    {isOpen ? (
                        <FolderOpen className="w-3.5 h-3.5 text-pranu-amber shrink-0" />
                    ) : (
                        <Folder className="w-3.5 h-3.5 text-pranu-amber shrink-0" />
                    )}
                    <span className="text-pranu-text truncate">{node.name}</span>
                </button>
                {isOpen && node.children && (
                    <FileTree
                        nodes={node.children}
                        onFileClick={onFileClick}
                        depth={depth + 1}
                    />
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => onFileClick(node.path)}
            className="flex items-center gap-1.5 w-full px-2 py-0.5 hover:bg-pranu-surface-2/50 rounded-sm text-xs transition-colors"
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
        >
            <File className={`w-3.5 h-3.5 shrink-0 ${extensionIcon[node.extension ?? ''] ?? 'text-pranu-text-muted'}`} />
            <span className="text-pranu-text truncate">{node.name}</span>
        </button>
    );
}

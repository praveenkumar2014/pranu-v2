// ============================================================
// PRANU v2 — File Tab Component
// ============================================================

'use client';

import { useStore } from '@/lib/store';
import { X, File } from 'lucide-react';

interface FileTabProps {
    path: string;
    isActive: boolean;
    onClick: () => void;
}

export function FileTab({ path, isActive, onClick }: FileTabProps) {
    const closeFile = useStore((s) => s.closeFile);
    const fileName = path.split('/').pop() ?? path;

    return (
        <div
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-pranu-border shrink-0 ${isActive
                    ? 'bg-pranu-surface text-pranu-text'
                    : 'bg-pranu-bg text-pranu-text-muted hover:bg-pranu-surface-2/50'
                }`}
            onClick={onClick}
        >
            <File className="w-3 h-3 shrink-0 text-pranu-text-muted" />
            <span className="truncate max-w-[100px]">{fileName}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    closeFile(path);
                }}
                className="ml-1 p-0.5 rounded hover:bg-pranu-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X className="w-2.5 h-2.5" />
            </button>
        </div>
    );
}

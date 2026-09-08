import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath, onNavigate }) => {
    const segments = currentPath.split('/').filter(Boolean);

    if (segments.length === 0) return null;

    return (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto py-1">
            <button
                onClick={() => onNavigate(`/${segments[0]}/dashboard`)}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
            >
                <Home className="w-3.5 h-3.5" />
                <span className="capitalize">{segments[0]}</span>
            </button>

            {segments.slice(1).map((seg, idx) => {
                const path = '/' + segments.slice(0, idx + 2).join('/');
                const isLast = idx === segments.length - 2;

                const formatted = seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {isLast ? (
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
                                {formatted}
                            </span>
                        ) : (
                            <button
                                onClick={() => onNavigate(path)}
                                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors capitalize truncate"
                            >
                                {formatted}
                            </button>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

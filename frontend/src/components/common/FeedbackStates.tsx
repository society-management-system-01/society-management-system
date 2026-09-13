import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
    return (
        <div
            className={`bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}
        />
    );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
        </div>
    );
};

export const EmptyState: React.FC<{
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}> = ({
    title = 'No records found',
    description = 'There are no items to display at this moment.',
    actionLabel,
    onAction,
    icon
}) => {
        return (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
                    {icon || <Inbox className="w-8 h-8" />}
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        );
    };

export const ErrorState: React.FC<{
    title?: string;
    message?: string;
    onRetry?: () => void;
}> = ({
    title = 'Failed to load data',
    message = 'An unexpected error occurred while fetching information.',
    onRetry
}) => {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
                <h4 className="text-base font-bold text-rose-900 dark:text-rose-200">{title}</h4>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-sm">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Request
                    </button>
                )}
            </div>
        );
    };

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { EmptyState, TableSkeleton } from './FeedbackStates';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    searchPlaceholder?: string;
    searchFilter?: (item: T, query: string) => boolean;
    filterOptions?: { label: string; value: string }[];
    selectedFilter?: string;
    onFilterChange?: (value: string) => void;
    actions?: React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    pageSize?: number;
    mobileCardRender?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    isLoading = false,
    searchPlaceholder = 'Search records...',
    searchFilter,
    filterOptions,
    selectedFilter,
    onFilterChange,
    actions,
    emptyTitle = 'No data available',
    emptyDescription = 'No records match the current filter or search criteria.',
    pageSize = 7,
    mobileCardRender
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter logic
    let filteredData = [...data];

    if (searchQuery.trim() && searchFilter) {
        filteredData = filteredData.filter((item) => searchFilter(item, searchQuery.trim()));
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-4">
            {/* Top Bar: Search, Filters & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-2">
                    {searchFilter && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            />
                        </div>
                    )}

                    {filterOptions && onFilterChange && (
                        <div className="relative">
                            <select
                                value={selectedFilter || ''}
                                onChange={(e) => {
                                    onFilterChange(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="appearance-none pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
                            >
                                {filterOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <SlidersHorizontal className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>

            {/* Main Table View */}
            {isLoading ? (
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                    <TableSkeleton rows={pageSize} />
                </div>
            ) : filteredData.length === 0 ? (
                <EmptyState title={emptyTitle} description={emptyDescription} />
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <tr>
                                        {columns.map((col, idx) => (
                                            <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                                                {col.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {paginatedData.map((item) => (
                                        <tr
                                            key={keyExtractor(item)}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            {columns.map((col, idx) => (
                                                <td key={idx} className={`px-5 py-4 ${col.className || ''}`}>
                                                    {col.cell
                                                        ? col.cell(item)
                                                        : col.accessorKey
                                                            ? String(item[col.accessorKey] ?? '')
                                                            : null}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card Grid View */}
                    <div className="block md:hidden space-y-3">
                        {paginatedData.map((item) => (
                            <div
                                key={keyExtractor(item)}
                                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card"
                            >
                                {mobileCardRender
                                    ? mobileCardRender(item)
                                    : columns.map((col, idx) => (
                                        <div key={idx} className="flex justify-between py-1 border-b last:border-0 border-slate-100 dark:border-slate-800">
                                            <span className="font-semibold text-slate-400">{col.header}:</span>
                                            <span>
                                                {col.cell
                                                    ? col.cell(item)
                                                    : col.accessorKey
                                                        ? String(item[col.accessorKey] ?? '')
                                                        : null}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2 px-1 text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Showing <strong className="text-slate-800 dark:text-slate-200">{startIndex + 1}</strong> to{' '}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    {Math.min(startIndex + pageSize, filteredData.length)}
                                </strong>{' '}
                                of <strong className="text-slate-800 dark:text-slate-200">{filteredData.length}</strong> results
                            </span>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage === 1}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
                                    {safeCurrentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

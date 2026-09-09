import React from 'react';
import { ComplaintStatus, Priority, BillStatus, VisitorStatus, DeliveryStatus, MaterialRequestStatus } from '../../types';

interface StatusBadgeProps {
    type?: 'status' | 'priority' | 'bill' | 'visitor' | 'delivery' | 'request';
    value: string;
    size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type = 'status', value, size = 'md' }) => {
    const getBadgeStyle = () => {
        const val = value.toLowerCase();

        // Priority
        if (type === 'priority' || ['urgent', 'high', 'medium', 'low'].includes(val)) {
            switch (val) {
                case 'urgent':
                    return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse';
                case 'high':
                    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                case 'medium':
                    return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800';
                case 'low':
                default:
                    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            }
        }

        // Complaint Status
        if (type === 'status') {
            switch (val as ComplaintStatus) {
                case 'raised':
                    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                case 'acknowledged':
                    return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
                case 'assigned':
                    return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
                case 'accepted':
                    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
                case 'in_progress':
                    return 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800';
                case 'on_hold':
                    return 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800';
                case 'resolved':
                    return 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
                case 'closed':
                    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                default:
                    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            }
        }

        // Bill Status
        if (type === 'bill') {
            switch (val as BillStatus) {
                case 'paid':
                    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                case 'pending':
                    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                case 'overdue':
                    return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
            }
        }

        // Visitor Status
        if (type === 'visitor') {
            switch (val as VisitorStatus) {
                case 'pre_registered':
                case 'approved':
                    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                case 'denied':
                    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
                case 'checked_in':
                    return 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800';
                case 'checked_out':
                    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            }
        }

        // Delivery
        if (type === 'delivery') {
            return val === 'pending_collection'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        }

        // Request
        if (type === 'request') {
            switch (val as MaterialRequestStatus) {
                case 'pending':
                    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                case 'approved':
                    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                case 'rejected':
                    return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
            }
        }

        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs font-medium',
        md: 'px-2.5 py-1 text-xs font-semibold',
        lg: 'px-3 py-1.5 text-sm font-semibold'
    };

    const formattedValue = value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    return (
        <span className={`inline-flex items-center rounded-full border shadow-2xs ${sizeClasses[size]} ${getBadgeStyle()}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
            {formattedValue}
        </span>
    );
};

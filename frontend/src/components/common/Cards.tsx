import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: LucideIcon;
    colorTheme?: 'brand' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet';
    subtitle?: string;
    onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive = true,
    icon: Icon,
    colorTheme = 'brand',
    subtitle,
    onClick
}) => {
    const colorMap = {
        brand: {
            bg: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400',
            border: 'border-brand-100 dark:border-brand-900',
            iconBg: 'bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300'
        },
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-100 dark:border-emerald-900',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
            border: 'border-amber-100 dark:border-amber-900',
            iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300'
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
            border: 'border-rose-100 dark:border-rose-900',
            iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300'
        },
        indigo: {
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
            border: 'border-indigo-100 dark:border-indigo-900',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300'
        },
        violet: {
            bg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
            border: 'border-violet-100 dark:border-violet-900',
            iconBg: 'bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300'
        }
    };

    const theme = colorMap[colorTheme];

    return (
        <div
            onClick={onClick}
            className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-200 ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
                }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                    {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl ${theme.iconBg} shrink-0`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {change && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                    {isPositive ? (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                            {change}
                        </span>
                    ) : (
                        <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-bold">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                            {change}
                        </span>
                    )}
                    <span className="text-slate-400">vs last month</span>
                </div>
            )}
        </div>
    );
};

export const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}> = ({ children, className = '', title, subtitle, action }) => {
    return (
        <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        {title && <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>}
                        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

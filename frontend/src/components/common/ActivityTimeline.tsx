import React from 'react';
import { TimelineStep, ComplaintStatus } from '../../types';
import { CheckCircle2, Clock, Wrench, ShieldCheck, PlayCircle, PauseCircle, CheckCheck, FolderLock } from 'lucide-react';

interface ActivityTimelineProps {
    steps: TimelineStep[];
    currentStatus: ComplaintStatus;
}

const ALL_STATUSES: { status: ComplaintStatus; label: string }[] = [
    { status: 'raised', label: 'Raised' },
    { status: 'acknowledged', label: 'Acknowledged' },
    { status: 'assigned', label: 'Assigned' },
    { status: 'accepted', label: 'Accepted' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'on_hold', label: 'On Hold' },
    { status: 'resolved', label: 'Resolved' },
    { status: 'closed', label: 'Verified & Closed' }
];

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ steps, currentStatus }) => {
    const getStatusIndex = (s: ComplaintStatus) => ALL_STATUSES.findIndex((item) => item.status === s);
    const currentIndex = getStatusIndex(currentStatus);

    const icons = {
        raised: <Clock className="w-4 h-4" />,
        acknowledged: <CheckCircle2 className="w-4 h-4" />,
        assigned: <ShieldCheck className="w-4 h-4" />,
        accepted: <PlayCircle className="w-4 h-4" />,
        in_progress: <Wrench className="w-4 h-4 animate-spin-slow" />,
        on_hold: <PauseCircle className="w-4 h-4" />,
        resolved: <CheckCheck className="w-4 h-4" />,
        closed: <FolderLock className="w-4 h-4" />
    };

    return (
        <div className="space-y-6">
            {/* Horizontal Status Progress Bar */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-brand-500 transition-all duration-500 -translate-y-1/2 z-0"
                        style={{ width: `${(currentIndex / (ALL_STATUSES.length - 1)) * 100}%` }}
                    />

                    {ALL_STATUSES.map((item, idx) => {
                        const isDone = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                            <div key={item.status} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${isCurrent
                                            ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/50 scale-110'
                                            : isDone
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                                        }`}
                                >
                                    {icons[item.status]}
                                </div>
                                <span
                                    className={`mt-2 text-[10px] font-semibold text-center max-w-[70px] ${isCurrent
                                            ? 'text-brand-600 dark:text-brand-400 font-bold'
                                            : isDone
                                                ? 'text-slate-700 dark:text-slate-300'
                                                : 'text-slate-400'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vertical Log Detail List */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {steps.map((step, idx) => {
                    const isLatest = idx === steps.length - 1;
                    const formattedDate = new Date(step.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <div key={idx} className="relative group">
                            <div
                                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${isLatest
                                        ? 'border-brand-500 text-brand-500 ring-2 ring-brand-100 dark:ring-brand-900/50'
                                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-brand-500' : 'bg-slate-400'}`} />
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{step.label}</h5>
                                    <span className="text-[10px] text-slate-400">{formattedDate}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">By {step.updatedBy}</p>
                                {step.note && (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                        "{step.note}"
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

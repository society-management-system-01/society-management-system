import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Complaint, ComplaintStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Textarea, PhotoUploadUI } from '../../components/common/FormFields';
import { Skeleton } from '../../components/common/FeedbackStates';
import {
    Wrench,
    CheckCircle2,
    AlertCircle,
    PlayCircle,
    PauseCircle,
    CheckCheck,
    Boxes,
    Phone,
    ArrowRight
} from 'lucide-react';

export const StaffDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [assignedTasks, setAssignedTasks] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
    const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
    const [actionNote, setActionNote] = useState('');
    const [resolutionPhoto, setResolutionPhoto] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadTasks();
    }, [currentUser]);

    async function loadTasks() {
        setLoading(true);

        const data = await mockApi.getComplaints();

        const tasks = data.filter(
            (c) =>
                c.assignedWorkerId === currentUser.id ||
                c.assignedWorkerName === currentUser.name
        );

        setAssignedTasks(tasks);
        setLoading(false);
    }

    const openTasks = assignedTasks.filter(
        (task) => task.status !== 'closed' && task.status !== 'resolved'
    );

    const urgentTasks = openTasks.filter(
        (task) => task.priority === 'urgent' || task.priority === 'high'
    );

    const resolvedTasks = assignedTasks.filter(
        (task) => task.status === 'resolved' || task.status === 'closed'
    );

    const openStatusModal = (task: Complaint, status: ComplaintStatus) => {
        setSelectedTask(task);
        setNewStatus(status);
        setActionNote('');
        setResolutionPhoto('');
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTask) return;

        setIsUpdating(true);

        try {
            const updated = await mockApi.updateComplaintStatus(
                selectedTask.id,
                newStatus,
                currentUser.name,
                actionNote || undefined,
                resolutionPhoto || undefined
            );

            if (updated) {
                toast.success(
                    'Task Updated',
                    `Ticket #${selectedTask.ticketNumber} moved to ${newStatus.replace('_', ' ')}.`
                );

                setSelectedTask(null);
                loadTasks();
            }
        } catch (err) {
            toast.error('Error', 'Failed to update task status.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-7">

            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Staff Dashboard
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Good morning, {currentUser.name}
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {currentUser.designation || 'Maintenance Staff'}
                        <span className="mx-2 text-slate-300 dark:text-slate-600">
                            •
                        </span>
                        You have{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {loading ? '...' : openTasks.length} open work orders
                        </span>{' '}
                        assigned to you.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onNavigate('/staff/tasks')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                        <Wrench className="w-4 h-4" />
                        View Work Orders
                    </button>

                    <button
                        type="button"
                        onClick={() => onNavigate('/staff/requests')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Boxes className="w-4 h-4" />
                        Request Material
                    </button>
                </div>
            </div>

            {/* Work Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <button
                    type="button"
                    onClick={() => onNavigate('/staff/tasks')}
                    className="text-left p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Open work orders
                            </p>

                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {loading ? '...' : openTasks.length}
                            </p>
                        </div>

                        <Wrench className="w-5 h-5 text-slate-400" />
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                        Tasks requiring action
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onNavigate('/staff/tasks')}
                    className="text-left p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                High priority
                            </p>

                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {loading ? '...' : urgentTasks.length}
                            </p>
                        </div>

                        <AlertCircle className="w-5 h-5 text-slate-400" />
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                        High or urgent work
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onNavigate('/staff/tasks')}
                    className="text-left p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Resolved
                            </p>

                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {loading ? '...' : resolvedTasks.length}
                            </p>
                        </div>

                        <CheckCircle2 className="w-5 h-5 text-slate-400" />
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                        Completed assigned tasks
                    </p>
                </button>
            </div>

            {/* Active Work Queue */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">

                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Active Work Queue
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Review assigned work and update progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onNavigate('/staff/tasks')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Full Task Board
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-5">
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : openTasks.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                        <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />

                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            No open work orders
                        </p>

                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            All assigned tasks are currently resolved.
                        </p>
                    </div>
                ) : (
                    <div>
                        {openTasks.map((task, index) => (
                            <div
                                key={task.id}
                                className={`px-5 py-5 ${
                                    index !== openTasks.length - 1
                                        ? 'border-b border-slate-100 dark:border-slate-800'
                                        : ''
                                }`}
                            >
                                {/* Ticket Header */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-mono font-semibold text-slate-400">
                                                #{task.ticketNumber}
                                            </span>

                                            <StatusBadge
                                                type="priority"
                                                value={task.priority}
                                                size="sm"
                                            />

                                            <StatusBadge
                                                value={task.status}
                                                size="sm"
                                            />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                                            {task.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-3xl">
                                            {task.description}
                                        </p>
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-slate-400 lg:text-right shrink-0">
                                        <p>
                                            <span className="text-slate-400">
                                                Location
                                            </span>
                                        </p>

                                        <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                                            {task.location} ({task.flatNumber})
                                        </p>
                                    </div>
                                </div>

                                {/* Resident Information */}
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                    <div className="text-xs">
                                        <span className="text-slate-400">
                                            Resident
                                        </span>

                                        <span className="ml-2 font-semibold text-slate-700 dark:text-slate-200">
                                            {task.residentName}
                                        </span>
                                    </div>

                                    {task.residentPhone && (
                                        <a
                                            href={`tel:${task.residentPhone}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline w-fit"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            {task.residentPhone}
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">

                                    {task.status === 'assigned' && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openStatusModal(task, 'accepted')
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            Accept Task
                                        </button>
                                    )}

                                    {(task.status === 'assigned' ||
                                        task.status === 'accepted') && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openStatusModal(
                                                    task,
                                                    'in_progress'
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Wrench className="w-3.5 h-3.5" />
                                            Start Work
                                        </button>
                                    )}

                                    {task.status === 'in_progress' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openStatusModal(
                                                        task,
                                                        'on_hold'
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <PauseCircle className="w-3.5 h-3.5" />
                                                Put On Hold
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openStatusModal(
                                                        task,
                                                        'resolved'
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" />
                                                Mark Resolved
                                            </button>
                                        </>
                                    )}

                                    {task.status === 'on_hold' && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openStatusModal(
                                                    task,
                                                    'in_progress'
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            Resume Work
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Status Transition Modal */}
            {selectedTask && (
                <Modal
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    title={`Update Status - Ticket #${selectedTask.ticketNumber}`}
                    subtitle={`Transition status to ${newStatus
                        .replace('_', ' ')
                        .toUpperCase()}`}
                >
                    <form
                        onSubmit={handleUpdateStatus}
                        className="space-y-4"
                    >
                        <Textarea
                            label="Work Log / Status Note"
                            value={actionNote}
                            onChange={(e) =>
                                setActionNote(e.target.value)
                            }
                            placeholder="e.g. Replaced faulty PVC pipe coupling and tested water pressure."
                            required={
                                newStatus === 'on_hold' ||
                                newStatus === 'resolved'
                            }
                        />

                        {newStatus === 'resolved' && (
                            <PhotoUploadUI
                                label="Attach Proof of Completion Photo (Optional)"
                                onImageChange={(url) =>
                                    setResolutionPhoto(url)
                                }
                            />
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {isUpdating && (
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}

                                Confirm Status Update
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
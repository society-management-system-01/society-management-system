import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Complaint, ComplaintStatus } from '../../types';
import { StatCard, Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Textarea, PhotoUploadUI } from '../../components/common/FormFields';
import { Skeleton } from '../../components/common/FeedbackStates';
import {
    Wrench,
    CheckCircle2,
    Clock,
    AlertCircle,
    PlayCircle,
    PauseCircle,
    CheckCheck,
    Boxes,
    Phone,
    ArrowRight,
    PackageCheck
} from 'lucide-react';

export const StaffDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [assignedTasks, setAssignedTasks] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    // Status Action Modal State
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
            (c) => c.assignedWorkerId === currentUser.id || c.assignedWorkerName === currentUser.name
        );
        setAssignedTasks(tasks);
        setLoading(false);
    }

    const openTasks = assignedTasks.filter((t) => t.status !== 'closed' && t.status !== 'resolved');
    const urgentTasks = openTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
    const completedToday = assignedTasks.filter((t) => t.status === 'resolved' || t.status === 'closed');

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
                toast.success('Task Updated', `Ticket #${selectedTask.ticketNumber} moved to ${newStatus.replace('_', ' ')}.`);
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
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-3">
                        <Wrench className="w-3.5 h-3.5" /> Staff Console • {currentUser.designation || 'Senior Technician'}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Hello, {currentUser.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                        You have <strong className="text-amber-400">{openTasks.length} assigned maintenance tasks</strong> pending resolution.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('/staff/tasks')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2"
                    >
                        <Wrench className="w-4 h-4" /> View All Tasks
                    </button>
                    <button
                        onClick={() => onNavigate('/staff/requests')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
                    >
                        <Boxes className="w-4 h-4" /> Request Materials
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Assigned Active Tasks"
                    value={loading ? '...' : openTasks.length}
                    subtitle="Pending technician action"
                    icon={Wrench}
                    colorTheme="brand"
                    onClick={() => onNavigate('/staff/tasks')}
                />
                <StatCard
                    title="Urgent Complaints"
                    value={loading ? '...' : urgentTasks.length}
                    subtitle="High priority callouts"
                    icon={AlertCircle}
                    colorTheme="rose"
                    onClick={() => onNavigate('/staff/tasks')}
                />
                <StatCard
                    title="Resolved Tasks"
                    value={loading ? '...' : completedToday.length}
                    subtitle="Completed tickets"
                    icon={CheckCircle2}
                    colorTheme="emerald"
                    onClick={() => onNavigate('/staff/tasks')}
                />
            </div>

            {/* Active Work Task Cards */}
            <Card
                title="Active Work Queue"
                subtitle="Quickly transition ticket status and log work progress"
                action={
                    <button
                        onClick={() => onNavigate('/staff/tasks')}
                        className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                        Full Task Board <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                }
            >
                {loading ? (
                    <Skeleton className="h-24 w-full" />
                ) : openTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">Great job! No pending tasks assigned to you.</p>
                ) : (
                    <div className="space-y-4">
                        {openTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-slate-400">#{task.ticketNumber}</span>
                                        <StatusBadge type="priority" value={task.priority} size="sm" />
                                        <StatusBadge value={task.status} size="sm" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-500">
                                        Location: <strong className="text-slate-800 dark:text-slate-200">{task.location} ({task.flatNumber})</strong>
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{task.title}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{task.description}</p>
                                </div>

                                {/* Resident Contact Strip */}
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-slate-400">Resident:</span>{' '}
                                        <strong className="text-slate-800 dark:text-slate-200">{task.residentName}</strong>
                                    </div>
                                    <a
                                        href={`tel:${task.residentPhone}`}
                                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500 transition-colors"
                                    >
                                        <Phone className="w-3 h-3" /> {task.residentPhone}
                                    </a>
                                </div>

                                {/* Status Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {task.status === 'assigned' && (
                                        <button
                                            onClick={() => openStatusModal(task, 'accepted')}
                                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" /> Accept Task
                                        </button>
                                    )}

                                    {(task.status === 'assigned' || task.status === 'accepted') && (
                                        <button
                                            onClick={() => openStatusModal(task, 'in_progress')}
                                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5"
                                        >
                                            <Wrench className="w-3.5 h-3.5" /> Start Work
                                        </button>
                                    )}

                                    {task.status === 'in_progress' && (
                                        <>
                                            <button
                                                onClick={() => openStatusModal(task, 'on_hold')}
                                                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5"
                                            >
                                                <PauseCircle className="w-3.5 h-3.5" /> Put On Hold
                                            </button>
                                            <button
                                                onClick={() => openStatusModal(task, 'resolved')}
                                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" /> Mark Resolved
                                            </button>
                                        </>
                                    )}

                                    {task.status === 'on_hold' && (
                                        <button
                                            onClick={() => openStatusModal(task, 'in_progress')}
                                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5"
                                        >
                                            <PlayCircle className="w-3.5 h-3.5" /> Resume Work
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* STATUS TRANSITION MODAL */}
            {selectedTask && (
                <Modal
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    title={`Update Status - Ticket #${selectedTask.ticketNumber}`}
                    subtitle={`Transition status to ${newStatus.replace('_', ' ').toUpperCase()}`}
                >
                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <Textarea
                            label="Work Log / Status Note"
                            value={actionNote}
                            onChange={(e) => setActionNote(e.target.value)}
                            placeholder="e.g. Replaced faulty PVC pipe coupling and tested water pressure."
                            required={newStatus === 'on_hold' || newStatus === 'resolved'}
                        />

                        {newStatus === 'resolved' && (
                            <PhotoUploadUI
                                label="Attach Proof of Completion Photo (Optional)"
                                onImageChange={(url) => setResolutionPhoto(url)}
                            />
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isUpdating && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                Confirm Status Update
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

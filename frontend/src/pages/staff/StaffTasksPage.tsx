import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Complaint, ComplaintStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Textarea, PhotoUploadUI } from '../../components/common/FormFields';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import {
    Wrench,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    Phone,
    PlayCircle,
    PauseCircle,
    CheckCheck,
    Building,
    Image as ImageIcon
} from 'lucide-react';

export const StaffTasksPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [tasks, setTasks] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Active Task Detail Drawer State
    const [activeTask, setActiveTask] = useState<Complaint | null>(null);
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
        const myTasks = data.filter(
            (c) => c.assignedWorkerId === currentUser.id || c.assignedWorkerName === currentUser.name
        );
        setTasks(myTasks);
        setLoading(false);
    }

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTask) return;

        setIsUpdating(true);
        try {
            const updated = await mockApi.updateComplaintStatus(
                activeTask.id,
                newStatus,
                currentUser.name,
                actionNote || undefined,
                resolutionPhoto || undefined
            );

            if (updated) {
                toast.success('Status Updated', `Task #${activeTask.ticketNumber} moved to ${newStatus.replace('_', ' ')}.`);
                setActiveTask(updated);
                loadTasks();
            }
        } catch (err) {
            toast.error('Error', 'Failed to update task.');
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredTasks = tasks.filter((t) => {
        const matchSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.flatNumber.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Assigned Work Orders
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage ticket lifecycle, update status logs, and submit completion proof photos.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ticket #, flat, or title..."
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {['all', 'assigned', 'accepted', 'in_progress', 'on_hold', 'resolved'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${filterStatus === st
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            {st.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : filteredTasks.length === 0 ? (
                <EmptyState title="No assigned work orders" description="Try clearing search filters." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setActiveTask(item);
                                setNewStatus(item.status);
                            }}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-amber-500/50 cursor-pointer transition-all space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-mono font-bold text-slate-400">#{item.ticketNumber}</span>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
                                </div>
                                <StatusBadge value={item.status} size="sm" />
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                                <span>Flat {item.flatNumber} ({item.residentName})</span>
                                <StatusBadge type="priority" value={item.priority} size="sm" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TASK DETAIL DRAWER & STATUS UPDATE MODAL */}
            {activeTask && (
                <Modal
                    isOpen={!!activeTask}
                    onClose={() => setActiveTask(null)}
                    title={`Task #${activeTask.ticketNumber}`}
                    subtitle={activeTask.title}
                    maxWidth="2xl"
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <span className="text-xs text-slate-400">Resident Location</span>
                                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                                    Flat {activeTask.flatNumber} • Contact: {activeTask.residentName} ({activeTask.residentPhone})
                                </p>
                            </div>
                            <a
                                href={`tel:${activeTask.residentPhone}`}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                            >
                                <Phone className="w-3.5 h-3.5" /> Call
                            </a>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Issue Description</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                {activeTask.description}
                            </p>
                        </div>

                        {/* Status Update Form */}
                        <form onSubmit={handleUpdateStatus} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Change Task Status</h4>
                            <div className="flex flex-wrap gap-2">
                                {(['accepted', 'in_progress', 'on_hold', 'resolved'] as const).map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setNewStatus(st)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${newStatus === st
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {st.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>

                            <Textarea
                                label="Update Note"
                                value={actionNote}
                                onChange={(e) => setActionNote(e.target.value)}
                                placeholder="Log work progress notes..."
                            />

                            {newStatus === 'resolved' && (
                                <PhotoUploadUI label="Attach Resolution Photo" onImageChange={(url) => setResolutionPhoto(url)} />
                            )}

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                            >
                                Submit Status Transition
                            </button>
                        </form>

                        <ActivityTimeline steps={activeTask.timeline} currentStatus={activeTask.status} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

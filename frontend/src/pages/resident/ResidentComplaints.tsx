import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Complaint, ComplaintCategory, Priority } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input, Select, Textarea, PhotoUploadUI } from '../../components/common/FormFields';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';
import {
    AlertCircle,
    Plus,
    Search,
    SlidersHorizontal,
    Clock,
    UserCheck,
    CheckCircle2,
    RotateCcw,
    Star,
    Send,
    ArrowRight,
    Phone,
    Image as ImageIcon
} from 'lucide-react';

interface ResidentComplaintsProps {
    onNavigate: (path: string) => void;
    selectedComplaintId?: string;
}

export const ResidentComplaints: React.FC<ResidentComplaintsProps> = ({ onNavigate, selectedComplaintId }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

    // New Complaint Form
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [location, setLocation] = useState('Kitchen Area');
    const [photoUrl, setPhotoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Comment & Feedback States
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [reopenReason, setReopenReason] = useState('');
    const [showReopenInput, setShowReopenInput] = useState(false);

    useEffect(() => {
        loadComplaints();
    }, [currentUser]);

    useEffect(() => {
        if (selectedComplaintId && complaints.length > 0) {
            const match = complaints.find((c) => c.id === selectedComplaintId);
            if (match) setActiveComplaint(match);
        }
    }, [selectedComplaintId, complaints]);

    async function loadComplaints() {
        setLoading(true);
        const data = await mockApi.getComplaints();
        const userComplaints = data.filter((c) => c.flatNumber === currentUser.flatNumber || c.flatNumber === 'Public Area');
        setComplaints(userComplaints);
        setLoading(false);
    }

    const handleCreateComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error('Validation Error', 'Please fill in the title and description.');
            return;
        }

        setIsSubmitting(true);
        try {
            const created = await mockApi.createComplaint({
                title,
                category,
                description,
                priority,
                status: 'raised',
                location,
                flatNumber: currentUser.flatNumber || 'B-402',
                residentName: currentUser.name,
                residentPhone: currentUser.phone,
                photoUrl: photoUrl || undefined
            });

            toast.success('Ticket Created', `Complaint #${created.ticketNumber} logged successfully.`);
            setIsCreateModalOpen(false);
            resetForm();
            loadComplaints();
        } catch (e) {
            toast.error('Error', 'Failed to submit complaint ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('Plumbing');
        setDescription('');
        setPriority('medium');
        setLocation('Kitchen Area');
        setPhotoUrl('');
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeComplaint || !commentText.trim()) return;

        const updated = await mockApi.addComplaintComment(
            activeComplaint.id,
            currentUser.name,
            currentUser.role,
            currentUser.avatar,
            commentText.trim()
        );

        if (updated) {
            setActiveComplaint(updated);
            setCommentText('');
            toast.success('Comment Added');
            loadComplaints();
        }
    };

    const handleReopen = async () => {
        if (!activeComplaint || !reopenReason.trim()) return;
        const updated = await mockApi.reopenComplaint(activeComplaint.id, reopenReason, currentUser.name);
        if (updated) {
            setActiveComplaint(updated);
            setShowReopenInput(false);
            setReopenReason('');
            toast.success('Ticket Reopened', 'The technician has been notified.');
            loadComplaints();
        }
    };

    // Filter Logic
    const filteredComplaints = complaints.filter((c) => {
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'all'
                ? true
                : filterStatus === 'active'
                    ? c.status !== 'closed' && c.status !== 'resolved'
                    : c.status === filterStatus;

        const matchesCategory = filterCategory === 'all' || c.category === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Helpdesk & Complaints
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Log maintenance issues, track technician progress, and give resolution feedback.
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Raise New Complaint
                </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ticket # or title..."
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {/* Status Tabs */}
                    {(['all', 'active', 'in_progress', 'resolved', 'closed'] as const).map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${filterStatus === st
                                    ? 'bg-brand-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {st.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaint Grid List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : filteredComplaints.length === 0 ? (
                <EmptyState
                    title="No complaints found"
                    description="There are no complaint tickets matching your filter criteria."
                    actionLabel="Raise New Ticket"
                    onAction={() => setIsCreateModalOpen(true)}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredComplaints.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveComplaint(item)}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-slate-400">{item.ticketNumber}</span>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge type="priority" value={item.priority} size="sm" />
                                        <StatusBadge value={item.status} size="sm" />
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                                        {item.category}
                                    </span>
                                    <span>• {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400">
                                    <span>View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CREATE COMPLAINT MODAL */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Raise Maintenance Ticket"
                subtitle="Log an issue for society technicians"
            >
                <form onSubmit={handleCreateComplaint} className="space-y-4">
                    <Input
                        label="Issue Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Water Leakage in Main Bath"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                            options={[
                                { label: 'Plumbing', value: 'Plumbing' },
                                { label: 'Electrical', value: 'Electrical' },
                                { label: 'Elevator', value: 'Elevator' },
                                { label: 'Carpentry', value: 'Carpentry' },
                                { label: 'Cleaning & Sanitation', value: 'Cleaning & Sanitation' },
                                { label: 'Security', value: 'Security' },
                                { label: 'Civil Works', value: 'Civil Works' },
                                { label: 'Internet / DTH', value: 'Internet / DTH' },
                                { label: 'Others', value: 'Others' }
                            ]}
                        />

                        <Select
                            label="Priority Level"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            options={[
                                { label: 'Low', value: 'low' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'High', value: 'high' },
                                { label: 'Urgent', value: 'urgent' }
                            ]}
                        />
                    </div>

                    <Input
                        label="Location inside Flat / Society"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Master Bedroom Ceiling"
                        required
                    />

                    <Textarea
                        label="Detailed Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the issue, frequency, symptoms..."
                        required
                    />

                    <PhotoUploadUI label="Attach Photo (Optional)" onImageChange={(url) => setPhotoUrl(url)} />

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                            {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </Modal>

            {/* COMPLAINT DETAIL & TIMELINE DRAWER / MODAL */}
            {activeComplaint && (
                <Modal
                    isOpen={!!activeComplaint}
                    onClose={() => setActiveComplaint(null)}
                    title={`Ticket #${activeComplaint.ticketNumber}`}
                    subtitle={activeComplaint.title}
                    maxWidth="2xl"
                >
                    <div className="space-y-6">
                        {/* Header badges & location */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-[11px] text-slate-400 font-medium">Category & Location</span>
                                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                                    {activeComplaint.category} • Location: {activeComplaint.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge type="priority" value={activeComplaint.priority} />
                                <StatusBadge value={activeComplaint.status} />
                            </div>
                        </div>

                        {/* Description & Attached Photo */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Description</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                {activeComplaint.description}
                            </p>
                            {activeComplaint.photoUrl && (
                                <div className="mt-2">
                                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                                        <ImageIcon className="w-3.5 h-3.5" /> Attached Issue Photo
                                    </span>
                                    <img
                                        src={activeComplaint.photoUrl}
                                        alt="Issue attachment"
                                        className="w-full max-h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Assigned Technician Card */}
                        {activeComplaint.assignedWorkerName && (
                            <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-900/50 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={activeComplaint.assignedWorkerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                                        alt={activeComplaint.assignedWorkerName}
                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/30"
                                    />
                                    <div>
                                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Assigned Staff</span>
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{activeComplaint.assignedWorkerName}</h5>
                                    </div>
                                </div>

                                {activeComplaint.assignedWorkerPhone && (
                                    <a
                                        href={`tel:${activeComplaint.assignedWorkerPhone}`}
                                        className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-brand-500 transition-colors"
                                    >
                                        <Phone className="w-3.5 h-3.5" /> Call Worker
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Status Timeline */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resolution Status Timeline</h4>
                            <ActivityTimeline steps={activeComplaint.timeline} currentStatus={activeComplaint.status} />
                        </div>

                        {/* Reopen Action for Resolved Tickets */}
                        {(activeComplaint.status === 'resolved' || activeComplaint.status === 'closed') && (
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">Is your issue completely fixed?</h5>
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                                            If the problem persists, you can reopen this ticket for the technician.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowReopenInput((prev) => !prev)}
                                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" /> Reopen Ticket
                                    </button>
                                </div>

                                {showReopenInput && (
                                    <div className="pt-2 space-y-2">
                                        <Input
                                            label="Reason for reopening"
                                            value={reopenReason}
                                            onChange={(e) => setReopenReason(e.target.value)}
                                            placeholder="e.g. Water leak started again from joint"
                                        />
                                        <button
                                            onClick={handleReopen}
                                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                                        >
                                            Confirm Reopen Ticket
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Activity Comments Section */}
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Comments & Discussion</h4>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {activeComplaint.comments.length === 0 ? (
                                    <p className="text-xs text-slate-400 text-center py-2">No comments yet. Leave a message below.</p>
                                ) : (
                                    activeComplaint.comments.map((cmt) => (
                                        <div key={cmt.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-slate-900 dark:text-white">{cmt.authorName} ({cmt.authorRole})</span>
                                                <span className="text-slate-400">{new Date(cmt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-xs text-slate-700 dark:text-slate-300">{cmt.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Comment Input */}
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a message to the technician..."
                                    className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-colors flex items-center gap-1"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

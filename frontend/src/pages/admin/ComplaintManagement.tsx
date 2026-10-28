import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Complaint, StaffMember, ComplaintStatus, PriorityLevel } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Select, Textarea } from '../../components/common/FormFields';
import { ActivityTimeline } from '../../components/common/ActivityTimeline';
import { Wrench, UserCheck, AlertCircle, Search, Filter } from 'lucide-react';

export const ComplaintManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Assign Technician Modal
    const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
    const [selectedStaffId, setSelectedStaffId] = useState('');

    // Status Override Modal
    const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
    const [newStatus, setNewStatus] = useState<ComplaintStatus>('assigned');
    const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
    const [overrideNote, setOverrideNote] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const [cmpl, stf] = await Promise.all([mockApi.getComplaints(), mockApi.getStaff()]);
        setComplaints(cmpl);
        setStaff(stf);
        setLoading(false);
    }

    const handleAssignTechnician = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assigningComplaint || !selectedStaffId) return;

        const worker = staff.find((s) => s.id === selectedStaffId);
        if (!worker) return;

        const updated = await mockApi.assignWorker(
            assigningComplaint.id,
            worker.id,
            worker.name,
            worker.designation || 'Technician'
        );

        if (updated) {
            toast.success('Technician Assigned', `${worker.name} assigned to #${assigningComplaint.ticketNumber}.`);
            setAssigningComplaint(null);
            loadData();
        }
    };

    const handleUpdateStatusAndPriority = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeComplaint) return;

        await mockApi.updateComplaintStatus(
            activeComplaint.id,
            newStatus,
            'Admin / Managing Committee',
            overrideNote || 'Admin status override'
        );

        toast.info('Ticket Updated', `Ticket #${activeComplaint.ticketNumber} updated.`);
        setActiveComplaint(null);
        loadData();
    };

    const filtered = complaints.filter((c) => {
        const matchSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
            c.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
            c.residentName.toLowerCase().includes(search.toLowerCase());

        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;

        return matchSearch && matchStatus && matchPriority;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Master Complaints & Ticket Console
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Monitor society-wide issues, assign staff technicians, override SLA priorities, and track resolutions.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ticket #, resident name, or issue title..."
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                        <option value="all">All Statuses</option>
                        <option value="submitted">Submitted</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Complaints Table */}
            <DataTable
                columns={[
                    {
                        header: 'Ticket # & Title',
                        accessorKey: 'ticketNumber',
                        cell: (item: Complaint) => (
                            <div
                                className="cursor-pointer group"
                                onClick={() => {
                                    setActiveComplaint(item);
                                    setNewStatus(item.status);
                                    setNewPriority(item.priority);
                                }}
                            >
                                <span className="text-[11px] font-mono font-bold text-slate-400">#{item.ticketNumber}</span>
                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                    {item.title}
                                </p>
                            </div>
                        )
                    },
                    {
                        header: 'Location & Resident',
                        accessorKey: 'flatNumber',
                        cell: (item: Complaint) => (
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Flat {item.flatNumber}</p>
                                <p className="text-[10px] text-slate-400">{item.residentName}</p>
                            </div>
                        )
                    },
                    {
                        header: 'Category',
                        accessorKey: 'category',
                        cell: (item: Complaint) => (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                {item.category}
                            </span>
                        )
                    },
                    {
                        header: 'Priority',
                        accessorKey: 'priority',
                        cell: (item: Complaint) => <StatusBadge type="priority" value={item.priority} size="sm" />
                    },
                    {
                        header: 'Assigned Worker',
                        accessorKey: 'assignedWorkerName',
                        cell: (item: Complaint) =>
                            item.assignedWorkerName ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{item.assignedWorkerName}</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setAssigningComplaint(item);
                                        setSelectedStaffId(staff[0]?.id || '');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold"
                                >
                                    + Assign Worker
                                </button>
                            )
                    },
                    {
                        header: 'Status',
                        accessorKey: 'status',
                        cell: (item: Complaint) => <StatusBadge value={item.status} size="sm" />
                    }
                ]}
                data={filtered}
                keyExtractor={(item) => item.id}
            />

            {/* ASSIGN TECHNICIAN MODAL */}
            {assigningComplaint && (
                <Modal
                    isOpen={!!assigningComplaint}
                    onClose={() => setAssigningComplaint(null)}
                    title={`Assign Technician - #${assigningComplaint.ticketNumber}`}
                    subtitle={assigningComplaint.title}
                >
                    <form onSubmit={handleAssignTechnician} className="space-y-4">
                        <Select
                            label="Select On-Duty Staff / Technician"
                            value={selectedStaffId}
                            onChange={(e) => setSelectedStaffId(e.target.value)}
                            options={staff.map((s) => ({
                                label: `${s.name} (${s.designation || 'Technician'}) - ${(s.skills || []).join(', ')}`,
                                value: s.id
                            }))}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setAssigningComplaint(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* TICKET DETAIL & STATUS OVERRIDE MODAL */}
            {activeComplaint && (
                <Modal
                    isOpen={!!activeComplaint}
                    onClose={() => setActiveComplaint(null)}
                    title={`Complaint #${activeComplaint.ticketNumber}`}
                    subtitle={activeComplaint.title}
                    maxWidth="2xl"
                >
                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                            <p><strong>Resident:</strong> {activeComplaint.residentName} (Flat {activeComplaint.flatNumber})</p>
                            <p><strong>Phone:</strong> {activeComplaint.residentPhone}</p>
                            <p><strong>Logged Description:</strong> {activeComplaint.description}</p>
                        </div>

                        <form onSubmit={handleUpdateStatusAndPriority} className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-3">
                            <h4 className="text-xs font-bold text-brand-900 dark:text-brand-200">Admin Ticket Override</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                                    options={[
                                        { label: 'Submitted', value: 'submitted' },
                                        { label: 'Assigned', value: 'assigned' },
                                        { label: 'In Progress', value: 'in_progress' },
                                        { label: 'On Hold', value: 'on_hold' },
                                        { label: 'Resolved', value: 'resolved' },
                                        { label: 'Closed', value: 'closed' }
                                    ]}
                                />
                                <Select
                                    label="Priority"
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                                    options={[
                                        { label: 'Low', value: 'low' },
                                        { label: 'Medium', value: 'medium' },
                                        { label: 'High', value: 'high' },
                                        { label: 'Urgent', value: 'urgent' }
                                    ]}
                                />
                            </div>

                            <Textarea
                                label="Admin Note"
                                value={overrideNote}
                                onChange={(e) => setOverrideNote(e.target.value)}
                                placeholder="Log reason for status/priority change..."
                            />

                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                            >
                                Apply Admin Updates
                            </button>
                        </form>

                        <ActivityTimeline steps={activeComplaint.timeline} currentStatus={activeComplaint.status} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

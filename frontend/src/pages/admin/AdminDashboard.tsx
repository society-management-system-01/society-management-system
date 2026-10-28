import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Complaint, Resident, StaffMember, InventoryItem } from '../../types';
import { StatCard, Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
    ComplaintsCategoryChart,
    MonthlyDuesChart,
    TaskPerformanceChart
} from '../../components/common/ReusableCharts';
import { Skeleton } from '../../components/common/FeedbackStates';
import {
    Users,
    AlertCircle,
    CreditCard,
    Wrench,
    Boxes,
    ShieldCheck,
    Building,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Plus
} from 'lucide-react';

export const AdminDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAdminData() {
            setLoading(true);
            const [cmpl, res, stf, inv] = await Promise.all([
                mockApi.getComplaints(),
                mockApi.getResidents(),
                mockApi.getStaff(),
                mockApi.getInventory()
            ]);
            setComplaints(cmpl);
            setResidents(res);
            setStaff(stf);
            setInventory(inv);
            setLoading(false);
        }
        loadAdminData();
    }, []);

    const openComplaints = complaints.filter((c) => c.status !== 'closed' && c.status !== 'resolved');
    const urgentComplaints = openComplaints.filter((c) => c.priority === 'urgent' || c.priority === 'high');
    const lowStockItems = inventory.filter((i) => i.quantity <= i.minThreshold);

    return (
        <div className="space-y-6">
            {/* Admin Executive Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
                        <ShieldCheck className="w-3.5 h-3.5" /> Managing Committee Console
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Grand Horizon Heights Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                        Real-time society analytics, maintenance ticket queues, financial collections, and inventory stock monitor.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => onNavigate('/admin/complaints')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" /> Manage Tickets ({openComplaints.length})
                    </button>
                    <button
                        onClick={() => onNavigate('/admin/residents')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" /> Resident Directory
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Residents"
                    value={loading ? '...' : residents.length}
                    subtitle="348 total flats registered"
                    icon={Users}
                    colorTheme="brand"
                    onClick={() => onNavigate('/admin/residents')}
                />
                <StatCard
                    title="Active Complaints"
                    value={loading ? '...' : openComplaints.length}
                    subtitle={`${urgentComplaints.length} urgent priority`}
                    icon={AlertCircle}
                    colorTheme={urgentComplaints.length > 0 ? 'rose' : 'amber'}
                    onClick={() => onNavigate('/admin/complaints')}
                />
                <StatCard
                    title="Dues Collected (Sept)"
                    value="₹3,90,000"
                    subtitle="82% collection rate"
                    icon={CreditCard}
                    colorTheme="emerald"
                    onClick={() => onNavigate('/admin/bills')}
                />
                <StatCard
                    title="Low Stock Materials"
                    value={loading ? '...' : lowStockItems.length}
                    subtitle={lowStockItems.length > 0 ? 'Reorder needed' : 'Stock level healthy'}
                    icon={Boxes}
                    colorTheme={lowStockItems.length > 0 ? 'rose' : 'indigo'}
                    onClick={() => onNavigate('/admin/inventory')}
                />
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Financial Dues Bar Chart */}
                <Card
                    title="Monthly Financial Dues Collection"
                    subtitle="Collected vs Pending Maintenance Dues (in ₹)"
                >
                    <MonthlyDuesChart />
                </Card>

                {/* Complaints Breakdown Pie Chart */}
                <Card
                    title="Complaints Category Breakdown"
                    subtitle="Distribution of logged issues across society"
                >
                    <ComplaintsCategoryChart />
                </Card>
            </div>

            {/* Task Performance & Urgent Escalations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card
                        title="Technician SLA Performance Trend"
                        subtitle="Complaints raised vs resolved over 4 weeks"
                    >
                        <TaskPerformanceChart />
                    </Card>
                </div>

                {/* Urgent Ticket Escalations */}
                <Card
                    title="Urgent Callouts"
                    subtitle="Tickets requiring immediate assignment"
                    action={
                        <button
                            onClick={() => onNavigate('/admin/complaints')}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                            View all
                        </button>
                    }
                >
                    {loading ? (
                        <Skeleton className="h-20 w-full" />
                    ) : urgentComplaints.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No urgent tickets pending.</p>
                    ) : (
                        <div className="space-y-3">
                            {urgentComplaints.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onNavigate('/admin/complaints')}
                                    className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 cursor-pointer space-y-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-300">
                                            #{item.ticketNumber} • Flat {item.flatNumber}
                                        </span>
                                        <StatusBadge type="priority" value={item.priority} size="sm" />
                                    </div>
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</h5>
                                    <p className="text-[11px] text-slate-500 truncate">Assigned: {item.assignedWorkerName || 'Unassigned'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

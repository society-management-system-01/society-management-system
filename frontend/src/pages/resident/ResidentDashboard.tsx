import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { Complaint, AmenityBooking, Bill, Visitor, Announcement } from '../../types';
import { StatCard, Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/FeedbackStates';
import {
    Building,
    AlertCircle,
    CalendarDays,
    CreditCard,
    UserCheck,
    Megaphone,
    PlusCircle,
    ArrowRight,
    ShieldCheck,
    Package,
    Clock,
    Sparkles
} from 'lucide-react';

interface ResidentDashboardProps {
    onNavigate: (path: string) => void;
    onOpenCreateComplaint?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({ onNavigate, onOpenCreateComplaint }) => {
    const { currentUser } = useAuth();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [bookings, setBookings] = useState<AmenityBooking[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);
            const [cmplData, bkData, billData, visData, annData] = await Promise.all([
                mockApi.getComplaints(),
                mockApi.getBookings(),
                mockApi.getBills(),
                mockApi.getVisitors(),
                mockApi.getAnnouncements()
            ]);

            setComplaints(cmplData.filter((c) => c.flatNumber === currentUser.flatNumber || c.flatNumber === 'Public Area'));
            setBookings(bkData.filter((b) => b.residentId === currentUser.id));
            setBills(billData.filter((b) => b.flatNumber === currentUser.flatNumber));
            setVisitors(visData.filter((v) => v.flatNumber === currentUser.flatNumber));
            setAnnouncements(annData.filter((a) => a.targetAudience === 'all' || a.targetAudience === 'residents'));
            setLoading(false);
        }
        loadDashboardData();
    }, [currentUser]);

    const openComplaintsCount = complaints.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length;
    const pendingBill = bills.find((b) => b.status === 'pending');
    const activeVisitors = visitors.filter((v) => v.status === 'approved' || v.status === 'checked_in');

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-2xl overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-3">
                            <Building className="w-3.5 h-3.5" /> Flat {currentUser.flatNumber} • {currentUser.wing}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {currentUser.name}!
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                            Grand Horizon Heights Resident Portal. Manage your complaints, visitor gate passes, amenity reservations, and society maintenance dues.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => (onOpenCreateComplaint ? onOpenCreateComplaint() : onNavigate('/resident/complaints'))}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" /> Raise Complaint
                        </button>
                        <button
                            onClick={() => onNavigate('/resident/visitors')}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
                        >
                            <UserCheck className="w-4 h-4" /> Pre-register Visitor
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Open Complaints"
                    value={loading ? '...' : openComplaintsCount}
                    subtitle={openComplaintsCount > 0 ? 'Active ticket updates' : 'All issues resolved'}
                    icon={AlertCircle}
                    colorTheme="amber"
                    onClick={() => onNavigate('/resident/complaints')}
                />
                <StatCard
                    title="Amenity Bookings"
                    value={loading ? '...' : bookings.length}
                    subtitle="Confirmed reservations"
                    icon={CalendarDays}
                    colorTheme="brand"
                    onClick={() => onNavigate('/resident/amenities')}
                />
                <StatCard
                    title="Pending Dues"
                    value={loading ? '...' : pendingBill ? `₹${pendingBill.amount.toLocaleString()}` : '₹0'}
                    subtitle={pendingBill ? `Due by ${pendingBill.dueDate}` : 'No outstanding dues'}
                    icon={CreditCard}
                    colorTheme={pendingBill ? 'rose' : 'emerald'}
                    onClick={() => onNavigate('/resident/bills')}
                />
                <StatCard
                    title="Active Visitors"
                    value={loading ? '...' : activeVisitors.length}
                    subtitle="Passes active at gate"
                    icon={UserCheck}
                    colorTheme="indigo"
                    onClick={() => onNavigate('/resident/visitors')}
                />
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                    onClick={() => (onOpenCreateComplaint ? onOpenCreateComplaint() : onNavigate('/resident/complaints'))}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Raise Ticket</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plumbing, Electrical, etc.</p>
                </button>

                <button
                    onClick={() => onNavigate('/resident/amenities')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Book Amenity</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hall, Gym, Tennis Court</p>
                </button>

                <button
                    onClick={() => onNavigate('/resident/visitors')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Visitor Pass</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Guest & Delivery Entry</p>
                </button>

                <button
                    onClick={() => onNavigate('/resident/bills')}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">View Bills</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Maintenance Receipts</p>
                </button>
            </div>

            {/* Main Grid: Recent Activity & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2 cols): Active Complaints & Amenity Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Complaints */}
                    <Card
                        title="Recent Complaints"
                        subtitle="Track live status and assigned technicians"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/complaints')}
                                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                            >
                                View all <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        }
                    >
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : complaints.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No active complaints logged.</p>
                        ) : (
                            <div className="space-y-3">
                                {complaints.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => onNavigate(`/resident/complaints/${item.id}`)}
                                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-brand-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono font-bold text-slate-400">{item.ticketNumber}</span>
                                                <StatusBadge value={item.status} size="sm" />
                                                <StatusBadge type="priority" value={item.priority} size="sm" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                Category: {item.category} • Assigned: {item.assignedWorkerName || 'Unassigned'}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Active Visitor Passes */}
                    <Card
                        title="Active Visitor Passes"
                        subtitle="Pre-approved entry codes for security gate"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/visitors')}
                                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                            >
                                Manage Passes <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        }
                    >
                        {loading ? (
                            <Skeleton className="h-16 w-full" />
                        ) : activeVisitors.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No active visitor passes for today.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {activeVisitors.map((vis) => (
                                    <div
                                        key={vis.id}
                                        className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">{vis.visitorName}</h5>
                                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                                                    {vis.visitorType} • {vis.phone}
                                                </p>
                                            </div>
                                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-emerald-800">
                                                {vis.entryCode}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column (1 col): Announcements Feed */}
                <div className="space-y-6">
                    <Card
                        title="Society Announcements"
                        subtitle="Notices & circulars from management"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/announcements')}
                                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                View all
                            </button>
                        }
                    >
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : announcements.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No recent announcements.</p>
                        ) : (
                            <div className="space-y-4">
                                {announcements.slice(0, 3).map((ann) => (
                                    <div
                                        key={ann.id}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 text-[9px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-md">
                                                {ann.category}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(ann.publishedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</h5>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                            {ann.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

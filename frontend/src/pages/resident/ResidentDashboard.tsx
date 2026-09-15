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
    Sparkles,
    Home,
    MapPin,
    ChevronRight,
    BellRing,
    CheckCircle2,
    Receipt,
    TicketCheck,
    CalendarCheck,
} from 'lucide-react';

interface ResidentDashboardProps {
    onNavigate: (path: string) => void;
    onOpenCreateComplaint?: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
    onNavigate,
    onOpenCreateComplaint
}) => {
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

            setComplaints(
                cmplData.filter(
                    (c) =>
                        c.flatNumber === currentUser.flatNumber ||
                        c.flatNumber === 'Public Area'
                )
            );

            setBookings(bkData.filter((b) => b.residentId === currentUser.id));
            setBills(billData.filter((b) => b.flatNumber === currentUser.flatNumber));
            setVisitors(visData.filter((v) => v.flatNumber === currentUser.flatNumber));

            setAnnouncements(
                annData.filter(
                    (a) =>
                        a.targetAudience === 'all' ||
                        a.targetAudience === 'residents'
                )
            );

            setLoading(false);
        }

        loadDashboardData();
    }, [currentUser]);

    const openComplaintsCount = complaints.filter(
        (c) => c.status !== 'closed' && c.status !== 'resolved'
    ).length;

    const pendingBill = bills.find((b) => b.status === 'pending');

    const activeVisitors = visitors.filter(
        (v) => v.status === 'approved' || v.status === 'checked_in'
    );

    return (
        <div className="relative space-y-6 pb-8">

            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-40 -top-32 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-950/20" />
                <div className="absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-950/20" />
                <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-teal-200/10 blur-3xl dark:bg-teal-950/10" />
            </div>

            {/* ========================================================= */}
            {/* WELCOME / RESIDENT HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.7)] sm:p-8">

                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[32px] border-emerald-400/5" />
                <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full border-[24px] border-sky-400/5" />

                <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                    {/* Resident Identity */}
                    <div className="max-w-2xl">

                        <div className="mb-4 flex flex-wrap items-center gap-2">

                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300">
                                <Home className="h-3.5 w-3.5" />
                                Resident Portal
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-slate-300">
                                <MapPin className="h-3 w-3" />
                                Flat {currentUser.flatNumber} · {currentUser.wing}
                            </span>

                        </div>

                        <div className="flex items-center gap-4">

                            {/* Avatar */}
                            <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800 shadow-xl sm:block">
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    Welcome back, {currentUser.name.split(' ')[0]}!
                                </h1>

                                <p className="mt-2 max-w-xl text-xs leading-5 text-slate-300 sm:text-sm">
                                    Your society at a glance. Stay updated with maintenance,
                                    visitors, amenities, payments and community notices.
                                </p>
                            </div>

                        </div>

                        {/* Community Status */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">

                            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/10 px-3 py-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                </span>

                                <span className="text-[9px] font-bold text-emerald-300">
                                    Society services online
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                Secure resident account
                            </div>

                        </div>
                    </div>

                    {/* Hero Actions */}
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">

                        <button
                            onClick={() =>
                                onOpenCreateComplaint
                                    ? onOpenCreateComplaint()
                                    : onNavigate('/resident/complaints')
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-[10px] font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Raise Complaint
                        </button>

                        <button
                            onClick={() => onNavigate('/resident/visitors')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[10px] font-black text-white backdrop-blur transition-all hover:bg-white/10"
                        >
                            <UserCheck className="h-4 w-4" />
                            Pre-register Visitor
                        </button>

                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* OVERVIEW */}
            {/* ========================================================= */}

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    Your Overview
                </div>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Open Complaints"
                    value={loading ? '...' : openComplaintsCount}
                    subtitle={
                        openComplaintsCount > 0
                            ? 'Active ticket updates'
                            : 'All issues resolved'
                    }
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
                    value={
                        loading
                            ? '...'
                            : pendingBill
                                ? `₹${pendingBill.amount.toLocaleString()}`
                                : '₹0'
                    }
                    subtitle={
                        pendingBill
                            ? `Due by ${pendingBill.dueDate}`
                            : 'No outstanding dues'
                    }
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

            {/* ========================================================= */}
            {/* QUICK ACTIONS */}
            {/* ========================================================= */}

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-slate-900 dark:text-white">
                            Quick Actions
                        </h2>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                            Frequently used resident services
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                    {/* Complaint */}
                    <button
                        onClick={() =>
                            onOpenCreateComplaint
                                ? onOpenCreateComplaint()
                                : onNavigate('/resident/complaints')
                        }
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-800"
                    >
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-100/50 blur-2xl dark:bg-amber-900/20" />

                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-950/40 dark:text-amber-400">
                                <TicketCheck className="h-5 w-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                        Raise Ticket
                                    </h4>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                        Report an issue
                                    </p>
                                </div>

                                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                            </div>
                        </div>
                    </button>

                    {/* Amenity */}
                    <button
                        onClick={() => onNavigate('/resident/amenities')}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800"
                    >
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-900/20" />

                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <CalendarCheck className="h-5 w-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                        Book Amenity
                                    </h4>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                        Hall, gym & courts
                                    </p>
                                </div>

                                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                            </div>
                        </div>
                    </button>

                    {/* Visitor */}
                    <button
                        onClick={() => onNavigate('/resident/visitors')}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800"
                    >
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-100/50 blur-2xl dark:bg-sky-900/20" />

                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-transform group-hover:scale-110 dark:bg-sky-950/40 dark:text-sky-400">
                                <UserCheck className="h-5 w-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                        Visitor Pass
                                    </h4>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                        Guest entry access
                                    </p>
                                </div>

                                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                            </div>
                        </div>
                    </button>

                    {/* Bills */}
                    <button
                        onClick={() => onNavigate('/resident/bills')}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
                    >
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-100/50 blur-2xl dark:bg-violet-900/20" />

                        <div className="relative">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform group-hover:scale-110 dark:bg-violet-950/40 dark:text-violet-400">
                                <Receipt className="h-5 w-5" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                        View Bills
                                    </h4>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                        Dues & receipts
                                    </p>
                                </div>

                                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                            </div>
                        </div>
                    </button>

                </div>
            </section>

            {/* ========================================================= */}
            {/* MAIN CONTENT */}
            {/* ========================================================= */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* ===================================================== */}
                {/* LEFT / MAIN */}
                {/* ===================================================== */}

                <div className="space-y-6 xl:col-span-2">

                    {/* Complaints */}
                    <Card
                        title="Recent Complaints"
                        subtitle="Track live status and assigned technicians"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/complaints')}
                                className="flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                View all
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        }
                    >
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-800">
                                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500" />
                                <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    No active complaints
                                </p>
                                <p className="mt-1 text-[10px] text-slate-400">
                                    Everything looks good right now.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            onNavigate(`/resident/complaints/${item.id}`)
                                        }
                                        className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-emerald-900 dark:hover:bg-slate-800/60"
                                    >
                                        <div className="min-w-0 flex-1">

                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-lg bg-white px-2 py-1 font-mono text-[9px] font-black text-slate-400 dark:bg-slate-900">
                                                    {item.ticketNumber}
                                                </span>

                                                <StatusBadge
                                                    value={item.status}
                                                    size="sm"
                                                />

                                                <StatusBadge
                                                    type="priority"
                                                    value={item.priority}
                                                    size="sm"
                                                />
                                            </div>

                                            <h4 className="truncate text-xs font-black text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {item.title}
                                            </h4>

                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-400">
                                                <span>{item.category}</span>
                                                <span>•</span>
                                                <span>
                                                    {item.assignedWorkerName
                                                        ? `Assigned to ${item.assignedWorkerName}`
                                                        : 'Awaiting assignment'}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-900 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400">
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Visitor Passes */}
                    <Card
                        title="Active Visitor Passes"
                        subtitle="Pre-approved entry codes for the security gate"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/visitors')}
                                className="flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                Manage passes
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        }
                    >
                        {loading ? (
                            <Skeleton className="h-20 w-full" />
                        ) : activeVisitors.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-800">
                                <UserCheck className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
                                <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    No active visitor passes
                                </p>
                                <p className="mt-1 text-[10px] text-slate-400">
                                    Pre-register guests before they arrive.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {activeVisitors.map((vis) => (
                                    <div
                                        key={vis.id}
                                        className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-slate-900"
                                    >
                                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[10px] border-emerald-500/5" />

                                        <div className="relative">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                                                        <UserCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h5 className="truncate text-xs font-black text-emerald-950 dark:text-emerald-200">
                                                            {vis.visitorName}
                                                        </h5>

                                                        <p className="mt-0.5 text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                                                            {vis.visitorType}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="shrink-0 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 font-mono text-[10px] font-black tracking-wider text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                                                    {vis.entryCode}
                                                </span>

                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-3 dark:border-emerald-900/40">

                                                <div className="flex items-center gap-1.5 text-[9px] text-emerald-700 dark:text-emerald-400">
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    Gate access active
                                                </div>

                                                <span className="text-[9px] font-semibold text-slate-400">
                                                    {vis.phone}
                                                </span>

                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                </div>

                {/* ===================================================== */}
                {/* RIGHT / ANNOUNCEMENTS */}
                {/* ===================================================== */}

                <div className="space-y-6">

                    <Card
                        title="Society Announcements"
                        subtitle="Notices and circulars from management"
                        action={
                            <button
                                onClick={() => onNavigate('/resident/announcements')}
                                className="flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                View all
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        }
                    >
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-800">
                                <Megaphone className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
                                <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    No recent announcements
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">

                                {announcements.slice(0, 3).map((ann, index) => (

                                    <div
                                        key={ann.id}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-emerald-900 dark:hover:bg-slate-800/60"
                                    >

                                        <div className="flex items-start gap-3">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                {index === 0 ? (
                                                    <BellRing className="h-4 w-4" />
                                                ) : (
                                                    <Megaphone className="h-4 w-4" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                        {ann.category}
                                                    </span>

                                                    <span className="shrink-0 text-[9px] text-slate-400">
                                                        {new Date(
                                                            ann.publishedAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h5 className="mt-2 text-xs font-black leading-tight text-slate-900 dark:text-white">
                                                    {ann.title}
                                                </h5>

                                                <p className="mt-1.5 line-clamp-3 text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                                                    {ann.content}
                                                </p>

                                            </div>
                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}
                    </Card>

                    {/* Resident Status Card */}
                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/40 blur-2xl dark:bg-emerald-900/20" />

                        <div className="relative">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                        Account Status
                                    </p>

                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                        Active & Verified
                                    </p>
                                </div>

                            </div>

                            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-semibold text-slate-400">
                                        Residence
                                    </span>

                                    <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">
                                        {currentUser.flatNumber} · {currentUser.wing}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[9px] font-semibold text-slate-400">
                                        Community
                                    </span>

                                    <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">
                                        Grand Horizon Heights
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};
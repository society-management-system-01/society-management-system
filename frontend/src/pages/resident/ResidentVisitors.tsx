import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Visitor, VisitorType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/FeedbackStates';
import {
    UserCheck,
    Plus,
    CheckCircle2,
    XCircle,
    ShieldAlert,
    Clock,
    Car,
    ShieldCheck,
    CalendarDays,
    Phone,
    Hash,
    DoorOpen,
    Users,
    ScanLine,
} from 'lucide-react';

export const ResidentVisitors: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    // Pre-register Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visitorName, setVisitorName] = useState('');
    const [visitorType, setVisitorType] = useState<VisitorType>('Guest');
    const [phone, setPhone] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [expectedDate, setExpectedDate] = useState('2026-09-04');
    const [expectedTime, setExpectedTime] = useState('18:00');

    useEffect(() => {
        loadVisitors();
    }, [currentUser]);

    async function loadVisitors() {
        setLoading(true);
        const data = await mockApi.getVisitors();
        setVisitors(data.filter((v) => v.flatNumber === currentUser.flatNumber));
        setLoading(false);
    }

    const handlePreRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitorName.trim() || !phone.trim()) return;

        const pass = await mockApi.preRegisterVisitor({
            visitorName,
            visitorType,
            phone,
            flatNumber: currentUser.flatNumber || 'B-402',
            residentName: currentUser.name || 'Resident',
            vehicleNumber: vehicleNumber || undefined,
            expectedDate,
            expectedTime,
            status: 'approved',
        });

        toast.success('Visitor Pass Created', `Pass Code: ${pass.entryCode}`);
        setIsModalOpen(false);
        resetForm();
        loadVisitors();
    };

    const resetForm = () => {
        setVisitorName('');
        setVisitorType('Guest');
        setPhone('');
        setVehicleNumber('');
    };

    const handleStatusUpdate = async (id: string, status: 'approved' | 'denied') => {
        const updated = await mockApi.updateVisitorStatus(id, status);
        if (updated) {
            toast.info('Pass Status Updated', `Visitor pass set to ${status}.`);
            loadVisitors();
        }
    };

    const activePasses = visitors.filter(
        (v) => v.status === 'approved' || v.status === 'checked_in'
    );

    const checkedInCount = visitors.filter(
        (v) => v.status === 'checked_in'
    ).length;

    const pendingCount = visitors.filter(
        (v) => v.status === 'pending'
    ).length;

    return (
        <div className="space-y-7 pb-8">

            {/* =========================================================
                HEADER
            ========================================================== */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Gate Security Online
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Visitor & Gate Access
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
                        Pre-approve guests, share secure entry passes, and monitor visitor
                        activity linked to your residence.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Pre-Register Visitor
                </button>
            </div>


            {/* =========================================================
                SECURITY OVERVIEW
            ========================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Active */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/10">
                    <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
                    <div className="absolute -right-3 -bottom-12 w-32 h-32 rounded-full bg-white/5" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                                Active Passes
                            </p>

                            <p className="text-3xl font-black mt-2">
                                {activePasses.length}
                            </p>

                            <p className="text-[11px] text-white/70 mt-1">
                                Currently authorized
                            </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Checked In */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Inside Society
                            </p>

                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                {checkedInCount}
                            </p>

                            <p className="text-[11px] text-slate-500 mt-1">
                                Visitors checked in
                            </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            <DoorOpen className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Awaiting Action
                            </p>

                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                {pendingCount}
                            </p>

                            <p className="text-[11px] text-slate-500 mt-1">
                                Passes need approval
                            </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>


            {/* =========================================================
                ACTIVE PASSES
            ========================================================== */}
            <section>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Active Gate Passes
                        </h2>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Authorized visitors associated with your residence
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                        <ScanLine className="w-3.5 h-3.5" />
                        Gate verification enabled
                    </div>
                </div>


                {activePasses.length === 0 ? (

                    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-8">
                        <div className="max-w-sm mx-auto text-center">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-slate-400" />
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-4">
                                No active visitor passes
                            </h3>

                            <p className="text-xs text-slate-500 mt-1.5">
                                Pre-register a guest and they'll receive a secure entry code
                                for gate verification.
                            </p>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
                            >
                                Create Visitor Pass
                            </button>
                        </div>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {activePasses.map((vis) => (

                            <div
                                key={vis.id}
                                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all"
                            >

                                {/* Top security strip */}
                                <div className="h-1 bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400" />

                                <div className="p-5">

                                    {/* Visitor Header */}
                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex items-center gap-3 min-w-0">

                                            <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 flex items-center justify-center shrink-0">
                                                <UserCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                                    {vis.visitorName}
                                                </h3>

                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                                                        {vis.visitorType}
                                                    </span>

                                                    <span className="text-slate-300 dark:text-slate-700">
                                                        •
                                                    </span>

                                                    <span className="text-[10px] text-slate-400">
                                                        {vis.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <StatusBadge value={vis.status} size="sm" />
                                    </div>


                                    {/* Entry Code */}
                                    <div className="mt-5 p-4 rounded-2xl bg-slate-950 dark:bg-slate-950 text-white relative overflow-hidden">

                                        <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-brand-500/10 blur-2xl" />

                                        <div className="relative flex items-center justify-between">

                                            <div>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                                    Gate Entry Code
                                                </p>

                                                <p className="font-mono text-xl font-black tracking-[0.18em] text-white mt-1">
                                                    {vis.entryCode}
                                                </p>
                                            </div>

                                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Hash className="w-4 h-4 text-brand-400" />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-2 mt-4">

                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-wide">
                                                    Date
                                                </span>
                                            </div>

                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                                                {vis.expectedDate}
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-wide">
                                                    Arrival
                                                </span>
                                            </div>

                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                                                {vis.expectedTime}
                                            </p>
                                        </div>

                                    </div>


                                    {/* Vehicle */}
                                    {vis.vehicleNumber && (
                                        <div className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">

                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-slate-400" />

                                                <span className="text-[10px] font-medium text-slate-500">
                                                    Vehicle
                                                </span>
                                            </div>

                                            <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                                {vis.vehicleNumber}
                                            </span>

                                        </div>
                                    )}


                                    {/* Pending Actions */}
                                    {vis.status === 'pending' && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

                                            <button
                                                onClick={() => handleStatusUpdate(vis.id, 'approved')}
                                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleStatusUpdate(vis.id, 'denied')}
                                                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                Deny Entry
                                            </button>

                                        </div>
                                    )}

                                    {/* Checked-in indicator */}
                                    {vis.status === 'checked_in' && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-2">
                                                    <span className="relative flex h-2.5 w-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                                    </span>

                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                        Visitor currently inside
                                                    </span>
                                                </div>

                                                <span className="text-[10px] text-slate-400">
                                                    Gate verified
                                                </span>

                                            </div>

                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>


            {/* =========================================================
                SECURITY INFO STRIP
            ========================================================== */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-5 sm:p-6">

                <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-brand-500/10 blur-3xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">
                            Secure Gate Access
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-1 max-w-2xl">
                            Every visitor receives a unique entry code linked to your flat.
                            Gate security can verify the pass before allowing access.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400">
                            Protected
                        </span>
                    </div>

                </div>
            </div>


            {/* =========================================================
                VISITOR LOG HISTORY
            ========================================================== */}
            <section className="pt-1">

                <div className="flex items-center justify-between mb-4">

                    <div>
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Gate Activity Log
                        </h2>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Visitor history and security verification records
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {visitors.length} total records
                    </div>

                </div>

                <div className="rounded-3xl overflow-hidden">
                    <DataTable
                        columns={[
                            {
                                header: 'Visitor',
                                accessorKey: 'visitorName',
                                cell: (item: Visitor) => (
                                    <div className="flex items-center gap-2.5">

                                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                        </div>

                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                {item.visitorName}
                                            </p>

                                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Phone className="w-2.5 h-2.5" />
                                                {item.phone}
                                            </p>
                                        </div>

                                    </div>
                                )
                            },
                            {
                                header: 'Category',
                                accessorKey: 'visitorType',
                                cell: (item: Visitor) => (
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                        {item.visitorType}
                                    </span>
                                )
                            },
                            {
                                header: 'Entry Code',
                                accessorKey: 'entryCode',
                                cell: (item: Visitor) => (
                                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                                        {item.entryCode}
                                    </span>
                                )
                            },
                            {
                                header: 'Gate Check-In',
                                accessorKey: 'checkInTime',
                                cell: (item: Visitor) => (
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span className={item.checkInTime
                                            ? 'font-semibold text-slate-700 dark:text-slate-200'
                                            : 'text-slate-400'
                                        }>
                                            {item.checkInTime || 'Not checked in'}
                                        </span>
                                    </div>
                                )
                            },
                            {
                                header: 'Status',
                                accessorKey: 'status',
                                cell: (item: Visitor) => (
                                    <StatusBadge value={item.status} size="sm" />
                                )
                            }
                        ]}
                        data={visitors}
                        keyExtractor={(item) => item.id}
                    />
                </div>

            </section>


            {/* =========================================================
                PRE-REGISTER MODAL
            ========================================================== */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Visitor Pass"
                subtitle="Generate a secure entry code for society gate access"
            >

                <form onSubmit={handlePreRegister} className="space-y-5">

                    {/* Modal intro */}
                    <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900">

                        <div className="flex gap-3">

                            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white">
                                    Secure visitor authorization
                                </p>

                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                    The visitor will receive a unique entry code associated
                                    with flat {currentUser.flatNumber || 'B-402'}.
                                </p>
                            </div>

                        </div>
                    </div>


                    <Input
                        label="Guest / Visitor Name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Vikram Verma"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Select
                            label="Visitor Category"
                            value={visitorType}
                            onChange={(e) => setVisitorType(e.target.value as VisitorType)}
                            options={[
                                { label: 'Guest / Personal', value: 'Guest' },
                                { label: 'Delivery / Courier', value: 'Delivery' },
                                { label: 'Cab / Ride', value: 'Cab' },
                                { label: 'Service Technician', value: 'Service Technician' }
                            ]}
                        />

                        <Input
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            required
                        />

                    </div>

                    <Input
                        label="Vehicle Number"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="e.g. MH 02 CD 4820"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Input
                            label="Expected Date"
                            type="date"
                            value={expectedDate}
                            onChange={(e) => setExpectedDate(e.target.value)}
                            required
                        />

                        <Input
                            label="Expected Arrival Time"
                            type="time"
                            value={expectedTime}
                            onChange={(e) => setExpectedTime(e.target.value)}
                            required
                        />

                    </div>


                    {/* Flat security info */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-brand-500" />

                                <span className="text-[10px] font-semibold text-slate-500">
                                    Access will be linked to
                                </span>
                            </div>

                            <span className="text-xs font-black text-slate-800 dark:text-white">
                                Flat {currentUser.flatNumber || 'B-402'}
                            </span>

                        </div>

                    </div>


                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Generate Entry Pass
                        </button>

                    </div>

                </form>
            </Modal>

        </div>
    );
};
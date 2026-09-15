import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { DeliveryPackage } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/FeedbackStates';
import {
    Package,
    CheckCircle2,
    ShieldCheck,
    Clock,
    QrCode,
    Truck,
    MapPin,
    ArrowRight,
    PackageCheck,
    Inbox,
    ScanLine,
    CircleDot,
} from 'lucide-react';

export const ResidentDeliveries: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [deliveries, setDeliveries] = useState<DeliveryPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeliveries();
    }, [currentUser]);

    async function loadDeliveries() {
        setLoading(true);
        const data = await mockApi.getDeliveries();
        setDeliveries(data.filter((d) => d.flatNumber === currentUser.flatNumber));
        setLoading(false);
    }

    const handleMarkCollected = async (id: string) => {
        const updated = await mockApi.markDeliveryCollected(id);
        if (updated) {
            toast.success('Package Collected', 'Marked as picked up from main gate.');
            loadDeliveries();
        }
    };

    const pendingPackages = deliveries.filter((d) => d.status === 'received_at_gate');

    return (
        <div className="relative space-y-6 pb-8">

            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/10" />
                <div className="absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-900/10" />
            </div>

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Package className="h-4 w-4" />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                            Gate Services
                        </span>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Deliveries
                    </h1>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                        Track packages received at the society gate and collect them securely.
                    </p>
                </div>

                {/* Gate Status */}
                <div className="flex items-center gap-3 self-start rounded-2xl border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70 sm:self-auto">

                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Security Gate
                        </p>

                        <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                            Operational
                        </p>
                    </div>
                </div>
            </div>

            {/* Delivery Overview */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                            <Inbox className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Awaiting Pickup
                        </span>
                    </div>

                    <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                        {pendingPackages.length}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                        Package{pendingPackages.length !== 1 ? 's' : ''} at security gate
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/30">
                            <PackageCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Total Records
                        </span>
                    </div>

                    <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                        {deliveries.length}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                        Delivery records for your flat
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Pickup Security
                        </span>
                    </div>

                    <p className="mt-3 text-sm font-black text-emerald-600 dark:text-emerald-400">
                        OTP Protected
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                        Verified at society gate
                    </p>
                </div>

            </div>

            {/* Pending Packages */}
            {pendingPackages.length > 0 ? (

                <section className="relative overflow-hidden rounded-[2rem] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-[0_18px_50px_-30px_rgba(245,158,11,0.4)] dark:border-amber-900/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10 sm:p-6">

                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border-[18px] border-amber-400/10" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full border-[15px] border-orange-400/10" />

                    {/* Alert Header */}
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <Package className="h-5 w-5" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
                                        Packages awaiting pickup
                                    </h2>

                                    <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Action Required
                                    </span>
                                </div>

                                <p className="mt-1 text-[10px] leading-4 text-slate-600 dark:text-slate-400 sm:text-xs">
                                    {pendingPackages.length} package{pendingPackages.length !== 1 ? 's' : ''} currently waiting at the main security gate.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white/70 px-3 py-2 dark:border-amber-900/40 dark:bg-slate-900/50">
                            <QrCode className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
                                OTP required for pickup
                            </span>
                        </div>
                    </div>

                    {/* Package Cards */}
                    <div className="relative mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">

                        {pendingPackages.map((pkg) => (

                            <div
                                key={pkg.id}
                                className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            <Truck className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <span className="inline-flex rounded-md bg-sky-50 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                                                {pkg.courierCompany}
                                            </span>

                                            <p className="mt-1 truncate font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                Tracking · {pkg.trackingNumber || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 dark:bg-amber-950/30">
                                        <CircleDot className="h-3 w-3 text-amber-500" />
                                        <span className="text-[8px] font-black uppercase text-amber-700 dark:text-amber-300">
                                            At Gate
                                        </span>
                                    </div>

                                </div>

                                {/* Delivery Details */}
                                <div className="mt-4 grid grid-cols-2 gap-2">

                                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                                Received
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[10px] font-black text-slate-700 dark:text-slate-300">
                                            {pkg.receivedAt}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/20">
                                        <div className="flex items-center gap-1.5">
                                            <QrCode className="h-3.5 w-3.5 text-amber-500" />
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                Pickup OTP
                                            </span>
                                        </div>

                                        <p className="mt-1 font-mono text-sm font-black tracking-widest text-amber-700 dark:text-amber-300">
                                            {pkg.pickupCode}
                                        </p>
                                    </div>

                                </div>

                                {/* Pickup Action */}
                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">

                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-[9px] font-semibold text-slate-400">
                                            Main Security Gate
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleMarkCollected(pkg.id)}
                                        className="group/btn flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-[9px] font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
                                    >
                                        Mark Picked Up
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                </section>

            ) : (

                /* No Pending Packages */
                <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 text-center dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-slate-900">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-slate-900 dark:text-white">
                        No packages waiting at the gate
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-slate-500 dark:text-slate-400">
                        Everything is clear right now. New deliveries received by security will appear here automatically.
                    </p>

                    <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            Gate monitoring active
                        </span>
                    </div>
                </div>
            )}

            {/* Delivery History */}
            <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-slate-900">

                {/* History Header */}
                <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                            <PackageCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </div>

                        <div>
                            <h2 className="text-sm font-black text-slate-900 dark:text-white">
                                Delivery History
                            </h2>

                            <p className="mt-0.5 text-[9px] text-slate-400">
                                Complete parcel activity for Flat {currentUser.flatNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        <ScanLine className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                            Security logged
                        </span>
                    </div>

                </div>

                {/* Existing DataTable */}
                <div className="p-3 sm:p-5">
                    <DataTable
                        columns={[
                            {
                                header: 'Courier / Vendor',
                                accessorKey: 'courierCompany',
                                cell: (item: DeliveryPackage) => (
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                                            <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>

                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {item.courierCompany}
                                        </span>
                                    </div>
                                )
                            },
                            {
                                header: 'Tracking Number',
                                accessorKey: 'trackingNumber',
                                cell: (item: DeliveryPackage) => (
                                    <span className="rounded-lg bg-slate-50 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {item.trackingNumber || '-'}
                                    </span>
                                )
                            },
                            {
                                header: 'Received Date',
                                accessorKey: 'receivedAt'
                            },
                            {
                                header: 'Status',
                                accessorKey: 'status',
                                cell: (item: DeliveryPackage) => (
                                    <StatusBadge value={item.status} size="sm" />
                                )
                            }
                        ]}
                        data={deliveries}
                        keyExtractor={(item) => item.id}
                    />
                </div>

            </section>

        </div>
    );
};
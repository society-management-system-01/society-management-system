import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { DeliveryPackage } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/FeedbackStates';
import { Package, CheckCircle2, ShieldCheck, Clock, QrCode } from 'lucide-react';

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
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Gate Parcel & Deliveries Log
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Packages received at the society security desk awaiting resident pickup.
                </p>
            </div>

            {/* Pending Pickup Alert Banner */}
            {pendingPackages.length > 0 ? (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-4">
                    <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                {pendingPackages.length} Package(s) Awaiting Pickup at Security Gate
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                Provide your Pickup OTP to the security guard when collecting.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pendingPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                            >
                                <div>
                                    <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                                        {pkg.courierCompany}
                                    </span>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                                        Track #: {pkg.trackingNumber || 'N/A'}
                                    </p>
                                    <p className="text-[10px] text-slate-400">Received: {pkg.receivedAt}</p>
                                </div>

                                <div className="text-right space-y-1">
                                    <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-amber-200 dark:border-slate-700">
                                        OTP: {pkg.pickupCode}
                                    </span>
                                    <button
                                        onClick={() => handleMarkCollected(pkg.id)}
                                        className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        Mark Picked Up
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                    No pending packages at the gate right now.
                </div>
            )}

            {/* All Parcel History */}
            <DataTable
                columns={[
                    {
                        header: 'Courier / Vendor',
                        accessorKey: 'courierCompany',
                        cell: (item: DeliveryPackage) => (
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-brand-500" />
                                <span className="font-bold text-slate-900 dark:text-white">{item.courierCompany}</span>
                            </div>
                        )
                    },
                    {
                        header: 'Tracking Number',
                        accessorKey: 'trackingNumber',
                        cell: (item: DeliveryPackage) => <span className="font-mono text-xs">{item.trackingNumber || '-'}</span>
                    },
                    {
                        header: 'Received Date',
                        accessorKey: 'receivedAt'
                    },
                    {
                        header: 'Status',
                        accessorKey: 'status',
                        cell: (item: DeliveryPackage) => <StatusBadge value={item.status} size="sm" />
                    }
                ]}
                data={deliveries}
                keyExtractor={(item) => item.id}
            />
        </div>
    );
};

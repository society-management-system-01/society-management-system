import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Visitor, DeliveryPackage } from '../../types';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShieldCheck, Package, Clock, Car } from 'lucide-react';

export const VisitorDeliveryAdmin: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [deliveries, setDeliveries] = useState<DeliveryPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGateData() {
            setLoading(true);
            const [vis, del] = await Promise.all([mockApi.getVisitors(), mockApi.getDeliveries()]);
            setVisitors(vis);
            setDeliveries(del);
            setLoading(false);
        }
        loadGateData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Gate Security & Parcel Audit Monitor
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Real-time record of guest entries, vehicle checks, and security guard parcel desk receipts.
                </p>
            </div>

            {/* Visitor Gate Logs */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Gate Visitor Logs
                </h3>
                <DataTable
                    columns={[
                        {
                            header: 'Visitor Name',
                            accessorKey: 'visitorName',
                            cell: (item: Visitor) => (
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.visitorName}</p>
                                    <p className="text-[10px] text-slate-400">{item.phone}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Flat Number',
                            accessorKey: 'flatNumber',
                            cell: (item: Visitor) => <span className="font-bold font-mono">Flat {item.flatNumber}</span>
                        },
                        {
                            header: 'Category',
                            accessorKey: 'visitorType',
                            cell: (item: Visitor) => (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                    {item.visitorType}
                                </span>
                            )
                        },
                        {
                            header: 'Entry Code',
                            accessorKey: 'entryCode',
                            cell: (item: Visitor) => <span className="font-mono text-xs font-bold text-brand-600">{item.entryCode}</span>
                        },
                        {
                            header: 'Status',
                            accessorKey: 'status',
                            cell: (item: Visitor) => <StatusBadge value={item.status} size="sm" />
                        }
                    ]}
                    data={visitors}
                    keyExtractor={(item) => item.id}
                />
            </div>

            {/* Security Gate Deliveries Desk */}
            <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Security Gate Parcel Log
                </h3>
                <DataTable
                    columns={[
                        {
                            header: 'Courier',
                            accessorKey: 'courierCompany',
                            cell: (item: DeliveryPackage) => (
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-brand-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">{item.courierCompany}</span>
                                </div>
                            )
                        },
                        {
                            header: 'Flat Number',
                            accessorKey: 'flatNumber',
                            cell: (item: DeliveryPackage) => <span className="font-mono font-bold text-xs">Flat {item.flatNumber}</span>
                        },
                        {
                            header: 'Resident Name',
                            accessorKey: 'residentName'
                        },
                        {
                            header: 'Tracking #',
                            accessorKey: 'trackingNumber',
                            cell: (item: DeliveryPackage) => <span className="font-mono text-xs">{item.trackingNumber || 'N/A'}</span>
                        },
                        {
                            header: 'Pickup OTP',
                            accessorKey: 'pickupCode',
                            cell: (item: DeliveryPackage) => <span className="font-mono font-bold text-xs text-amber-600">{item.pickupCode}</span>
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
        </div>
    );
};

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
    QrCode,
    ShieldAlert,
    Clock,
    Car
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
            status: 'approved'
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

    const activePasses = visitors.filter((v) => v.status === 'approved' || v.status === 'checked_in');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Visitor Gate Control
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pre-approve guests, delivery personnel, and view live gate check-in alerts.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Pre-Register Guest
                </button>
            </div>

            {/* Active Gate Passes Cards */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Active Passes & Security Check-ins
                </h3>

                {activePasses.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3">No active guest passes registered for today.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activePasses.map((vis) => (
                            <div
                                key={vis.id}
                                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3 flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                                            {vis.visitorType}
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{vis.visitorName}</h4>
                                        <p className="text-xs text-slate-500">{vis.phone}</p>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-mono font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-brand-200 dark:border-slate-700">
                                            {vis.entryCode}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Expected: {vis.expectedTime}</span>
                                    </div>
                                    {vis.vehicleNumber && (
                                        <div className="flex items-center gap-1 font-mono">
                                            <Car className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{vis.vehicleNumber}</span>
                                        </div>
                                    )}
                                </div>

                                {vis.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => handleStatusUpdate(vis.id, 'approved')}
                                            className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(vis.id, 'denied')}
                                            className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                                        >
                                            Deny Entry
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Visitor Log History Table */}
            <div className="pt-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Gate Logs & Past Visitors
                </h3>
                <DataTable
                    columns={[
                        {
                            header: 'Visitor Name & Phone',
                            accessorKey: 'visitorName',
                            cell: (item: Visitor) => (
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.visitorName}</p>
                                    <p className="text-[10px] text-slate-400">{item.phone}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Type',
                            accessorKey: 'visitorType',
                            cell: (item: Visitor) => (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                    {item.visitorType}
                                </span>
                            )
                        },
                        {
                            header: 'Entry Pass Code',
                            accessorKey: 'entryCode',
                            cell: (item: Visitor) => <span className="font-mono text-xs font-bold">{item.entryCode}</span>
                        },
                        {
                            header: 'Gate Check-In',
                            accessorKey: 'checkInTime',
                            cell: (item: Visitor) => item.checkInTime || 'Not checked in'
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

            {/* PRE-REGISTER MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Pre-Register Visitor Pass"
                subtitle="Generate a 6-digit entry code for gate security"
            >
                <form onSubmit={handlePreRegister} className="space-y-4">
                    <Input
                        label="Guest / Visitor Name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Vikram Verma"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                        label="Vehicle Number (Optional)"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="e.g. MH 02 CD 4820"
                    />

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                        >
                            Generate Entry Pass
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

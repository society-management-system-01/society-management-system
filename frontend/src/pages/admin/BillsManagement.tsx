import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Bill } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { StatCard, Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/FormFields';
import { CreditCard, Plus, Receipt, Send, CheckCircle2 } from 'lucide-react';

export const BillsManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    // Batch Generation Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [month, setMonth] = useState('October 2026');
    const [maintenanceRate, setMaintenanceRate] = useState(3500);
    const [sinkingFund, setSinkingFund] = useState(1000);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        loadBills();
    }, []);

    async function loadBills() {
        setLoading(true);
        const data = await mockApi.getBills();
        setBills(data);
        setLoading(false);
    }

    const handleGenerateBatchBills = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        setTimeout(() => {
            toast.success('Batch Bills Generated', `Generated 348 maintenance bills for ${month}.`);
            setIsGenerating(false);
            setIsModalOpen(false);
            loadBills();
        }, 1000);
    };

    const totalCollected = bills
        .filter((b) => b.status === 'paid')
        .reduce((sum, b) => sum + b.amount, 0);

    const totalPending = bills
        .filter((b) => b.status === 'pending')
        .reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Society Maintenance Dues & Billing Console
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Generate monthly maintenance invoices, track collections, and audit paid receipts.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Batch Generate Monthly Bills
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total September Collection"
                    value={`₹${totalCollected.toLocaleString()}`}
                    subtitle="Collected via UPI / NetBanking"
                    icon={CreditCard}
                    colorTheme="emerald"
                />
                <StatCard
                    title="Pending Dues Outstanding"
                    value={`₹${totalPending.toLocaleString()}`}
                    subtitle="Overdue reminder notices dispatched"
                    icon={CreditCard}
                    colorTheme="rose"
                />
                <StatCard
                    title="Total Flats Invoiced"
                    value={bills.length}
                    subtitle="100% flat billing coverage"
                    icon={Receipt}
                    colorTheme="brand"
                />
            </div>

            <DataTable
                columns={[
                    {
                        header: 'Invoice # & Month',
                        accessorKey: 'invoiceNumber',
                        cell: (item: Bill) => (
                            <div>
                                <span className="font-mono font-bold text-xs">#{item.invoiceNumber}</span>
                                <p className="text-[10px] text-slate-400">{item.month}</p>
                            </div>
                        )
                    },
                    {
                        header: 'Resident & Flat',
                        accessorKey: 'residentName',
                        cell: (item: Bill) => (
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{item.residentName}</p>
                                <p className="text-[10px] text-slate-400">Flat {item.flatNumber}</p>
                            </div>
                        )
                    },
                    {
                        header: 'Total Amount Dues',
                        accessorKey: 'amount',
                        cell: (item: Bill) => <span className="font-bold text-slate-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                    },
                    {
                        header: 'Due Date',
                        accessorKey: 'dueDate'
                    },
                    {
                        header: 'Payment Method',
                        accessorKey: 'paymentMethod',
                        cell: (item: Bill) => <span className="font-mono text-xs uppercase">{item.paymentMethod || 'Unpaid'}</span>
                    },
                    {
                        header: 'Status',
                        accessorKey: 'status',
                        cell: (item: Bill) => <StatusBadge value={item.status} size="sm" />
                    }
                ]}
                data={bills}
                keyExtractor={(item) => item.id}
            />

            {/* BATCH GENERATE MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Batch Generate Monthly Bills"
                subtitle="Auto-generate maintenance invoices for all 348 society flats"
            >
                <form onSubmit={handleGenerateBatchBills} className="space-y-4">
                    <Input
                        label="Billing Cycle Month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Standard Maintenance (₹)"
                            type="number"
                            value={maintenanceRate}
                            onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                            required
                        />

                        <Input
                            label="Sinking Fund Allocation (₹)"
                            type="number"
                            value={sinkingFund}
                            onChange={(e) => setSinkingFund(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                        <p className="font-bold text-emerald-900 dark:text-emerald-300">Automatic Breakdown Calculation:</p>
                        <p className="text-slate-600 dark:text-slate-300">Per Flat Maintenance: ₹{maintenanceRate}</p>
                        <p className="text-slate-600 dark:text-slate-300">Sinking Fund: ₹{sinkingFund}</p>
                        <p className="text-slate-600 dark:text-slate-300">Total Per Flat Bill: ₹{maintenanceRate + sinkingFund}</p>
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
                            disabled={isGenerating}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                            {isGenerating && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Generate & Dispatch Invoices
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

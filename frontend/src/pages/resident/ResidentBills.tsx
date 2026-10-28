import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Bill } from '../../types';
import { StatCard, Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import {
    CreditCard,
    Download,
    CheckCircle2,
    Receipt,
    Building,
    QrCode,
    ShieldCheck,
    ArrowRight,
    FileText
} from 'lucide-react';

export const ResidentBills: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment Checkout Modal
    const [payingBill, setPayingBill] = useState<Bill | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    // Receipt Modal
    const [receiptBill, setReceiptBill] = useState<Bill | null>(null);

    useEffect(() => {
        loadBills();
    }, [currentUser]);

    async function loadBills() {
        setLoading(true);
        const data = await mockApi.getBills();
        setBills(data.filter((b) => b.flatNumber === currentUser.flatNumber));
        setLoading(false);
    }

    const pendingBill = bills.find((b) => b.status === 'pending');
    const paidBills = bills.filter((b) => b.status === 'paid');

    const handleProcessPayment = async () => {
        if (!payingBill) return;
        setIsProcessing(true);

        setTimeout(async () => {
            const txId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
            const updated = await mockApi.payBill(payingBill.id, paymentMethod);
            if (updated) {
                toast.success('Payment Successful!', `Transaction #${txId} recorded. Receipt generated.`);
                setPayingBill(null);
                setReceiptBill(updated);
                loadBills();
            }
            setIsProcessing(false);
        }, 1200);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Maintenance Bills & Payments
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review itemized society maintenance dues, pay securely, and download PDF receipts.
                </p>
            </div>

            {/* Dues Hero Banner */}
            {pendingBill ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-900/90 via-slate-900 to-rose-950 text-white shadow-2xl border border-rose-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 uppercase tracking-wider">
                            Pending Dues • Due {pendingBill.dueDate}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black">
                            ₹{pendingBill.amount.toLocaleString()} <span className="text-sm font-normal opacity-80">({pendingBill.monthYear || pendingBill.month})</span>
                        </h2>
                        <p className="text-xs text-rose-200">
                            Includes regular maintenance, sinking fund, water charges, and parking allocations.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={() => setPayingBill(pendingBill)}
                            className="w-full md:w-auto px-6 py-3 rounded-2xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            <CreditCard className="w-4 h-4" /> Pay Maintenance Now
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 flex items-center gap-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
                    <div>
                        <h3 className="text-base font-bold text-white">All Dues Cleared!</h3>
                        <p className="text-xs opacity-80 mt-0.5">
                            You have no pending maintenance bills. Thank you for timely payments.
                        </p>
                    </div>
                </div>
            )}

            {/* Itemized Breakdown of Current Bill */}
            {pendingBill && (
                <Card title="Current Bill Breakdown" subtitle={`Invoice #${pendingBill.billNumber || pendingBill.invoiceNumber || 'INV-2026'}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        {Array.isArray(pendingBill.breakdown) ? (
                            pendingBill.breakdown.map((item, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] text-slate-400 font-medium">{item.description}</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        ₹{item.amount.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] text-slate-400 font-medium">Society Maintenance</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        ₹{(pendingBill.breakdown as any)?.maintenance?.toLocaleString() || '3,500'}
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] text-slate-400 font-medium">Sinking Fund</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        ₹{(pendingBill.breakdown as any)?.sinkingFund?.toLocaleString() || '300'}
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] text-slate-400 font-medium">Water & Utility</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        ₹{(pendingBill.breakdown as any)?.waterCharges?.toLocaleString() || '650'}
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] text-slate-400 font-medium">Clubhouse & Facilities</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                                        ₹{(pendingBill.breakdown as any)?.parkingCharges?.toLocaleString() || '400'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            )}

            {/* Payment History Table */}
            <Card title="Payment History & Receipts" subtitle="Past society maintenance bills">
                <DataTable
                    columns={[
                        {
                            header: 'Month & Invoice',
                            accessorKey: 'monthYear',
                            cell: (item: Bill) => (
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.monthYear || item.month}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">#{item.billNumber || item.invoiceNumber}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Amount Dues',
                            accessorKey: 'amount',
                            cell: (item: Bill) => <span className="font-bold">₹{item.amount.toLocaleString()}</span>
                        },
                        {
                            header: 'Due Date',
                            accessorKey: 'dueDate'
                        },
                        {
                            header: 'Status',
                            accessorKey: 'status',
                            cell: (item: Bill) => <StatusBadge value={item.status} size="sm" />
                        },
                        {
                            header: 'Receipt',
                            accessorKey: 'id',
                            cell: (item: Bill) =>
                                item.status === 'paid' ? (
                                    <button
                                        onClick={() => setReceiptBill(item)}
                                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Receipt className="w-3.5 h-3.5" /> View Receipt
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setPayingBill(item)}
                                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                                    >
                                        Pay Now
                                    </button>
                                )
                        }
                    ]}
                    data={bills}
                    keyExtractor={(item) => item.id}
                    searchPlaceholder="Search invoice number or month..."
                />
            </Card>

            {/* SIMULATED PAYMENT CHECKOUT MODAL */}
            {payingBill && (
                <Modal
                    isOpen={!!payingBill}
                    onClose={() => setPayingBill(null)}
                    title={`Secure Pay - ₹${payingBill.amount.toLocaleString()}`}
                    subtitle={`Invoice #${payingBill.billNumber || payingBill.invoiceNumber || 'INV-2026'} (${payingBill.monthYear || payingBill.month})`}
                >
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                            <span className="text-xs text-slate-500">Selected Payment Method</span>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {(['upi', 'card', 'netbanking'] as const).map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPaymentMethod(m)}
                                        className={`p-3 rounded-xl border text-center font-bold text-xs capitalize transition-all ${paymentMethod === m
                                            ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        {m.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paymentMethod === 'upi' && (
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                                <QrCode className="w-24 h-24 mx-auto text-brand-600 dark:text-brand-400" />
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Scan UPI QR or enter UPI ID</p>
                                <p className="text-[10px] text-slate-400 font-mono">horizonheights@upi</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setPayingBill(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleProcessPayment}
                                disabled={isProcessing}
                                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isProcessing ? (
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Authorize ₹{payingBill.amount.toLocaleString()}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* RECEIPT VIEW MODAL */}
            {receiptBill && (
                <Modal
                    isOpen={!!receiptBill}
                    onClose={() => setReceiptBill(null)}
                    title="Payment Receipt"
                    subtitle={`Transaction Receipt #${receiptBill.transactionId || 'TXN-884920'}`}
                >
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div>
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Grand Horizon Heights</h4>
                                <p className="text-[11px] text-slate-500">Cooperative Housing Society Ltd.</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                                PAID & VERIFIED
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400">Flat Number:</span>
                                <p className="font-bold text-slate-900 dark:text-white">{receiptBill.flatNumber}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Resident Name:</span>
                                <p className="font-bold text-slate-900 dark:text-white">{receiptBill.residentName}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Paid Date:</span>
                                <p className="font-bold text-slate-900 dark:text-white">{receiptBill.paidAt || '2026-09-01'}</p>
                            </div>
                            <div>
                                <span className="text-slate-400">Payment Mode:</span>
                                <p className="font-bold text-slate-900 dark:text-white uppercase">{receiptBill.paymentMethod || 'UPI'}</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center text-sm font-black">
                            <span>Total Paid:</span>
                            <span className="text-emerald-600 dark:text-emerald-400">₹{receiptBill.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

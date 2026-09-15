import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Bill } from '../../types';
import { Card } from '../../components/common/Cards';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { DataTable } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/FeedbackStates';
import {
    CreditCard,
    Download,
    CheckCircle2,
    Receipt,
    Building2,
    QrCode,
    ShieldCheck,
    ArrowUpRight,
    FileText,
    WalletCards,
    CalendarDays,
    CircleDollarSign,
    BadgeCheck,
    Landmark,
    Sparkles,
    ChevronRight,
    AlertCircle,
    Droplets,
    Car,
    Wrench,
} from 'lucide-react';

export const ResidentBills: React.FC<{
    onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment Checkout Modal
    const [payingBill, setPayingBill] = useState<Bill | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<
        'upi' | 'card' | 'netbanking'
    >('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    // Receipt Modal
    const [receiptBill, setReceiptBill] = useState<Bill | null>(null);

    useEffect(() => {
        loadBills();
    }, [currentUser]);

    async function loadBills() {
        setLoading(true);

        const data = await mockApi.getBills();

        setBills(
            data.filter(
                (b) => b.flatNumber === currentUser.flatNumber
            )
        );

        setLoading(false);
    }

    const pendingBill = bills.find(
        (b) => b.status === 'pending'
    );

    const paidBills = bills.filter(
        (b) => b.status === 'paid'
    );

    const totalPaid = paidBills.reduce(
        (sum, bill) => sum + bill.amount,
        0
    );

    const handleProcessPayment = async () => {
        if (!payingBill) return;

        setIsProcessing(true);

        setTimeout(async () => {
            const txId =
                'TXN-' +
                Math.floor(
                    10000000 + Math.random() * 90000000
                );

            const updated = await mockApi.payBill(
                payingBill.id,
                paymentMethod
            );

            if (updated) {
                toast.success(
                    'Payment Successful!',
                    `Transaction #${txId} recorded. Receipt generated.`
                );

                setPayingBill(null);
                setReceiptBill(updated);
                loadBills();
            }

            setIsProcessing(false);
        }, 1200);
    };

    return (
        <div className="min-h-full space-y-7 pb-10">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-7">

                {/* Ambient decoration */}
                <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div className="max-w-2xl">

                        {/* Section label */}
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            <WalletCards className="h-3.5 w-3.5" />
                            Financial Center
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Bills & Payments
                            <span className="text-brand-500">
                                {' '}Center
                            </span>
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Manage your society maintenance dues, review
                            itemized charges, make secure payments, and
                            access your payment receipts.
                        </p>

                        {/* Stats */}
                        <div className="mt-5 flex flex-wrap gap-3">

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <CircleDollarSign className="h-4 w-4 text-rose-500" />

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Outstanding
                                    </span>

                                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                                        ₹
                                        {pendingBill
                                            ? pendingBill.amount.toLocaleString()
                                            : '0'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Paid
                                    </span>

                                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                                        ₹{totalPaid.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <Receipt className="h-4 w-4 text-sky-500" />

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Receipts
                                    </span>

                                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                                        {paidBills.length}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Secure indicator */}
                    <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>

                        <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white">
                                Secure Payments
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Protected transaction flow
                            </p>
                        </div>
                    </div>

                </div>
            </section>


            {/* =========================================================
                PENDING DUES
            ========================================================= */}
            {pendingBill ? (

                <section className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-slate-950 via-rose-950/80 to-slate-950 p-6 text-white shadow-xl sm:p-7">

                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-rose-300">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Payment Due
                                </span>

                                <span className="text-[10px] font-semibold text-slate-400">
                                    Due {pendingBill.dueDate}
                                </span>

                            </div>

                            <p className="mt-4 text-xs font-semibold text-rose-200/80">
                                {pendingBill.monthYear ||
                                    pendingBill.month}{' '}
                                Maintenance
                            </p>

                            <div className="mt-1 flex items-end gap-2">
                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    ₹
                                    {pendingBill.amount.toLocaleString()}
                                </h2>

                                <span className="mb-1.5 text-[10px] font-semibold text-slate-400">
                                    outstanding
                                </span>
                            </div>

                            <p className="mt-3 max-w-xl text-xs leading-5 text-slate-400">
                                Your monthly society dues include regular
                                maintenance, sinking fund, utilities,
                                parking and applicable facility charges.
                            </p>

                        </div>


                        <div className="relative min-w-[190px]">

                            <button
                                onClick={() =>
                                    setPayingBill(pendingBill)
                                }
                                className="group flex w-full items-center justify-between gap-4 rounded-2xl bg-rose-600 px-5 py-4 text-xs font-black text-white shadow-xl shadow-rose-900/30 transition-all hover:bg-rose-500 hover:shadow-2xl"
                            >
                                <span className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Pay Maintenance
                                </span>

                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 transition-transform group-hover:translate-x-0.5">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </button>

                            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-slate-500">
                                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                Secure payment processing
                            </div>

                        </div>

                    </div>
                </section>

            ) : (

                <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-slate-950 p-6 text-emerald-200">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <BadgeCheck className="h-7 w-7 text-emerald-400" />
                        </div>

                        <div>
                            <h3 className="text-base font-black text-white">
                                All Dues Cleared
                            </h3>

                            <p className="mt-1 text-xs text-emerald-200/70">
                                You have no pending maintenance bills.
                                Thank you for keeping your payments up to date.
                            </p>
                        </div>

                    </div>
                </section>
            )}


            {/* =========================================================
                CURRENT BILL BREAKDOWN
            ========================================================= */}
            {pendingBill && (

                <Card
                    title="Current Bill Breakdown"
                    subtitle={`Invoice #${
                        pendingBill.billNumber ||
                        pendingBill.invoiceNumber ||
                        'INV-2026'
                    }`}
                >

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {pendingBill.monthYear ||
                                    pendingBill.month}
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                                Itemized society charges
                            </p>
                        </div>

                        <FileText className="h-5 w-5 text-slate-300 dark:text-slate-700" />

                    </div>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        {Array.isArray(pendingBill.breakdown) ? (

                            pendingBill.breakdown.map((item, idx) => (

                                <div
                                    key={idx}
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/30 dark:border-slate-800 dark:bg-slate-800/40"
                                >

                                    <div className="flex items-center justify-between">

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Charge {idx + 1}
                                        </span>

                                        <CircleDollarSign className="h-4 w-4 text-brand-500/60" />

                                    </div>

                                    <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {item.description}
                                    </p>

                                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                        ₹{item.amount.toLocaleString()}
                                    </p>

                                </div>

                            ))

                        ) : (

                            <>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="h-4 w-4 text-brand-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Maintenance
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                                        ₹
                                        {(pendingBill.breakdown as any)
                                            ?.maintenance
                                            ?.toLocaleString() ||
                                            '3,500'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-4 w-4 text-violet-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Sinking Fund
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                                        ₹
                                        {(pendingBill.breakdown as any)
                                            ?.sinkingFund
                                            ?.toLocaleString() ||
                                            '300'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="h-4 w-4 text-sky-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Water & Utility
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                                        ₹
                                        {(pendingBill.breakdown as any)
                                            ?.waterCharges
                                            ?.toLocaleString() ||
                                            '650'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-amber-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Facilities
                                        </span>
                                    </div>

                                    <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">
                                        ₹
                                        {(pendingBill.breakdown as any)
                                            ?.parkingCharges
                                            ?.toLocaleString() ||
                                            '400'}
                                    </p>
                                </div>
                            </>

                        )}

                    </div>

                </Card>
            )}


            {/* =========================================================
                PAYMENT HISTORY
            ========================================================= */}
            <Card
                title="Payment History & Receipts"
                subtitle="Your society maintenance payment records"
            >

                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                            <Receipt className="h-5 w-5 text-brand-500" />
                        </div>

                        <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white">
                                {bills.length} Payment Records
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Keep track of your society dues and receipts
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified payment records
                    </div>

                </div>


                <DataTable
                    columns={[
                        {
                            header: 'Month & Invoice',
                            accessorKey: 'monthYear',
                            cell: (item: Bill) => (
                                <div className="flex items-center gap-3">

                                    <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 sm:flex">
                                        <CalendarDays className="h-4 w-4 text-brand-500" />
                                    </div>

                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {item.monthYear ||
                                                item.month}
                                        </p>

                                        <p className="text-[10px] font-mono text-slate-400">
                                            #
                                            {item.billNumber ||
                                                item.invoiceNumber}
                                        </p>
                                    </div>

                                </div>
                            ),
                        },

                        {
                            header: 'Amount Due',
                            accessorKey: 'amount',
                            cell: (item: Bill) => (
                                <span className="font-black text-slate-900 dark:text-white">
                                    ₹{item.amount.toLocaleString()}
                                </span>
                            ),
                        },

                        {
                            header: 'Due Date',
                            accessorKey: 'dueDate',
                            cell: (item: Bill) => (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {item.dueDate}
                                </div>
                            ),
                        },

                        {
                            header: 'Status',
                            accessorKey: 'status',
                            cell: (item: Bill) => (
                                <StatusBadge
                                    value={item.status}
                                    size="sm"
                                />
                            ),
                        },

                        {
                            header: 'Receipt',
                            accessorKey: 'id',
                            cell: (item: Bill) =>
                                item.status === 'paid' ? (

                                    <button
                                        onClick={() =>
                                            setReceiptBill(item)
                                        }
                                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-brand-600 transition-all hover:bg-brand-50 dark:bg-slate-800 dark:text-brand-400 dark:hover:bg-slate-700"
                                    >
                                        <Receipt className="h-3.5 w-3.5" />
                                        Receipt
                                        <ChevronRight className="h-3 w-3" />
                                    </button>

                                ) : (

                                    <button
                                        onClick={() =>
                                            setPayingBill(item)
                                        }
                                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-500"
                                    >
                                        <CreditCard className="h-3.5 w-3.5" />
                                        Pay Now
                                    </button>

                                ),
                        },
                    ]}
                    data={bills}
                    keyExtractor={(item) => item.id}
                    searchPlaceholder="Search invoice number or month..."
                />

            </Card>


            {/* =========================================================
                PAYMENT CHECKOUT MODAL
            ========================================================= */}
            {payingBill && (

                <Modal
                    isOpen={!!payingBill}
                    onClose={() => setPayingBill(null)}
                    title={`Secure Pay - ₹${payingBill.amount.toLocaleString()}`}
                    subtitle={`Invoice #${
                        payingBill.billNumber ||
                        payingBill.invoiceNumber ||
                        'INV-2026'
                    } • ${
                        payingBill.monthYear ||
                        payingBill.month
                    }`}
                >

                    <div className="space-y-5">

                        {/* Payment summary */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white">

                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl" />

                            <div className="relative flex items-center justify-between">

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Amount to Pay
                                    </p>

                                    <p className="mt-1 text-2xl font-black">
                                        ₹
                                        {payingBill.amount.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                    <CreditCard className="h-5 w-5 text-brand-400" />
                                </div>

                            </div>

                        </div>


                        {/* Payment method */}
                        <div>

                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Choose payment method
                                </span>

                                <span className="text-[9px] font-semibold text-slate-400">
                                    Secure checkout
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">

                                {(
                                    ['upi', 'card', 'netbanking'] as const
                                ).map((m) => (

                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() =>
                                            setPaymentMethod(m)
                                        }
                                        className={`rounded-xl border p-3 text-center transition-all ${
                                            paymentMethod === m
                                                ? 'border-brand-500 bg-brand-500/10 text-brand-600 shadow-sm dark:text-brand-400'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                                        }`}
                                    >

                                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">

                                            {m === 'upi' && (
                                                <QrCode className="h-4 w-4" />
                                            )}

                                            {m === 'card' && (
                                                <CreditCard className="h-4 w-4" />
                                            )}

                                            {m === 'netbanking' && (
                                                <Landmark className="h-4 w-4" />
                                            )}

                                        </div>

                                        <span className="text-[10px] font-black uppercase">
                                            {m === 'netbanking'
                                                ? 'Net Banking'
                                                : m.toUpperCase()}
                                        </span>

                                    </button>

                                ))}

                            </div>
                        </div>


                        {/* UPI */}
                        {paymentMethod === 'upi' && (

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800 dark:bg-slate-800/40">

                                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">

                                    <QrCode className="h-20 w-20 text-brand-600 dark:text-brand-400" />

                                </div>

                                <p className="mt-4 text-xs font-black text-slate-800 dark:text-white">
                                    Scan to pay using UPI
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    or use
                                </p>

                                <p className="mt-1 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                                    horizonheights@upi
                                </p>

                            </div>
                        )}


                        {/* Card / Net banking placeholder */}
                        {paymentMethod !== 'upi' && (

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                                        {paymentMethod === 'card' ? (
                                            <CreditCard className="h-5 w-5 text-brand-500" />
                                        ) : (
                                            <Landmark className="h-5 w-5 text-brand-500" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">
                                            {paymentMethod === 'card'
                                                ? 'Card Payment'
                                                : 'Net Banking'}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                            Continue with secure authorization
                                        </p>
                                    </div>

                                </div>

                            </div>
                        )}


                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">

                            <button
                                type="button"
                                onClick={() =>
                                    setPayingBill(null)
                                }
                                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleProcessPayment}
                                disabled={isProcessing}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {isProcessing ? (

                                    <>
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Processing...
                                    </>

                                ) : (

                                    <>
                                        <ShieldCheck className="h-4 w-4" />
                                        Authorize ₹
                                        {payingBill.amount.toLocaleString()}
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </Modal>
            )}


            {/* =========================================================
                RECEIPT MODAL
            ========================================================= */}
            {receiptBill && (

                <Modal
                    isOpen={!!receiptBill}
                    onClose={() => setReceiptBill(null)}
                    title="Payment Receipt"
                    subtitle={`Transaction Receipt #${
                        receiptBill.transactionId ||
                        'TXN-884920'
                    }`}
                >

                    <div className="space-y-4">

                        {/* Receipt header */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white">

                            <div className="relative flex items-start justify-between gap-4">

                                <div>

                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                                            <Building2 className="h-5 w-5 text-brand-400" />
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-black">
                                                Grand Horizon Heights
                                            </h4>

                                            <p className="text-[9px] text-slate-400">
                                                Cooperative Housing Society Ltd.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Paid
                                </span>

                            </div>

                        </div>


                        {/* Receipt details */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">

                            <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Flat Number
                                    </span>

                                    <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                                        {receiptBill.flatNumber}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Resident
                                    </span>

                                    <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                                        {receiptBill.residentName}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Paid Date
                                    </span>

                                    <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                                        {receiptBill.paidAt ||
                                            '2026-09-01'}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Payment Mode
                                    </span>

                                    <p className="mt-1 text-xs font-black uppercase text-slate-900 dark:text-white">
                                        {receiptBill.paymentMethod ||
                                            'UPI'}
                                    </p>
                                </div>

                            </div>


                            {/* Amount */}
                            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">

                                <div className="flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-brand-500" />

                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Total Paid
                                    </span>
                                </div>

                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                    ₹
                                    {receiptBill.amount.toLocaleString()}
                                </span>

                            </div>

                        </div>


                        {/* Receipt footer */}
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">

                            <div className="flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4 text-emerald-500" />

                                <span className="text-[10px] font-semibold text-slate-500">
                                    Payment verified successfully
                                </span>
                            </div>

                            <FileText className="h-4 w-4 text-slate-400" />

                        </div>

                    </div>

                </Modal>
            )}

        </div>
    );
};
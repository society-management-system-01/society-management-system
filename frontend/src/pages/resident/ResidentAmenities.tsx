import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Facility, AmenityBooking } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/FeedbackStates';
import {
    CalendarDays,
    Clock,
    Users,
    XCircle,
    Info,
    ArrowUpRight,
    Waves,
    Dumbbell,
    Building2,
    Sparkles,
    CheckCircle2,
    ChevronRight,
    MapPin,
} from 'lucide-react';

export const ResidentAmenities: React.FC<{ onNavigate: (path: string) => void }> = ({
    onNavigate,
}) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [bookings, setBookings] = useState<AmenityBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'explore' | 'my_bookings'>('explore');

    // Booking Modal State
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [date, setDate] = useState('2026-09-12');
    const [startTime, setStartTime] = useState('17:00');
    const [endTime, setEndTime] = useState('21:00');
    const [guestsCount, setGuestsCount] = useState(25);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        loadData();
    }, [currentUser]);

    async function loadData() {
        setLoading(true);

        const [facRes, bkRes] = await Promise.all([
            mockApi.getFacilities(),
            mockApi.getBookings(),
        ]);

        setFacilities(facRes);
        setBookings(bkRes.filter((b) => b.residentId === currentUser.id));

        setLoading(false);
    }

    const calculateTotal = (fac: Facility) => {
        if (fac.hourlyRate === 0) return 0;

        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        const duration = Math.max(1, endHour - startHour);

        return duration * fac.hourlyRate;
    };

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFacility) return;

        setIsBooking(true);

        try {
            const totalAmount = calculateTotal(selectedFacility);

            const newBk = await mockApi.createBooking({
                facilityId: selectedFacility.id,
                facilityName: selectedFacility.name,
                facilityImage: selectedFacility.image,
                residentId: currentUser.id,
                residentName: currentUser.name,
                flatNumber: currentUser.flatNumber || 'B-402',
                date,
                startTime,
                endTime,
                guestsCount,
                totalAmount,
            });

            toast.success(
                'Reservation Confirmed!',
                `Booked ${newBk.facilityName} for ${date}.`
            );

            setSelectedFacility(null);
            loadData();
            setActiveTab('my_bookings');
        } catch (err) {
            toast.error(
                'Booking Failed',
                'Unable to reserve time slot.'
            );
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelBooking = async (id: string) => {
        const success = await mockApi.cancelBooking(id);

        if (success) {
            toast.info(
                'Booking Cancelled',
                'Your reservation slot has been released.'
            );

            loadData();
        }
    };

    const getCategoryIcon = (category: string) => {
        const value = category.toLowerCase();

        if (
            value.includes('pool') ||
            value.includes('sport') ||
            value.includes('wellness')
        ) {
            return Waves;
        }

        if (
            value.includes('fitness') ||
            value.includes('gym')
        ) {
            return Dumbbell;
        }

        if (
            value.includes('hall') ||
            value.includes('event')
        ) {
            return Building2;
        }

        return Sparkles;
    };

    return (
        <div className="min-h-full space-y-7 pb-10">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-7">

                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div className="max-w-2xl">

                        {/* Small label */}
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            Community Spaces
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Amenities & Facility
                            <span className="text-brand-500"> Reservations</span>
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Discover premium spaces within Horizon Heights and reserve
                            them for your next gathering, workout, or relaxing evening.
                        </p>

                        {/* Mini stats */}
                        <div className="mt-5 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <Building2 className="h-4 w-4 text-brand-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    {facilities.length} Facilities
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <CalendarDays className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    {bookings.length} My Bookings
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Easy Booking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="relative flex w-full items-center rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-800 dark:bg-slate-950/70 sm:w-fit">

                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:flex-none ${
                                activeTab === 'explore'
                                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-800 dark:text-brand-400'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Building2 className="h-4 w-4" />
                            Explore
                        </button>

                        <button
                            onClick={() => setActiveTab('my_bookings')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:flex-none ${
                                activeTab === 'my_bookings'
                                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-800 dark:text-brand-400'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            My Bookings

                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-[10px] font-black text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                {bookings.length}
                            </span>
                        </button>
                    </div>
                </div>
            </section>


            {/* =========================================================
                EXPLORE FACILITIES
            ========================================================= */}
            {activeTab === 'explore' && (
                <>
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-[520px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-900"
                                />
                            ))}
                        </div>
                    ) : facilities.length === 0 ? (
                        <EmptyState
                            title="No facilities available"
                            description="There are currently no facilities available for reservation."
                            actionLabel="Refresh"
                            onAction={loadData}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                            {facilities.map((fac, index) => {
                                const CategoryIcon = getCategoryIcon(fac.category);

                                return (
                                    <article
                                        key={fac.id}
                                        className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                                    >

                                        {/* ================= IMAGE ================= */}
                                        <div className="relative h-64 overflow-hidden">

                                            <img
                                                src={fac.image}
                                                alt={fac.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                            {/* Image gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                            {/* Top controls */}
                                            <div className="absolute left-4 right-4 top-4 flex items-start justify-between">

                                                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-white backdrop-blur-md">
                                                    <CategoryIcon className="h-4 w-4 text-brand-400" />

                                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                                        {fac.category}
                                                    </span>
                                                </div>

                                                {index === 0 && (
                                                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-[10px] font-black text-white shadow-lg">
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        POPULAR
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom image content */}
                                            <div className="absolute bottom-5 left-5 right-5">

                                                <div className="flex items-end justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <h2 className="truncate text-xl font-black tracking-tight text-white sm:text-2xl">
                                                            {fac.name}
                                                        </h2>

                                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-200">
                                                            <MapPin className="h-3.5 w-3.5 text-brand-400" />
                                                            Horizon Heights Community
                                                        </div>

                                                    </div>

                                                    <div className="shrink-0 text-right">

                                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-300">
                                                            Reservation
                                                        </p>

                                                        <p className="mt-0.5 text-lg font-black text-emerald-400">
                                                            {fac.hourlyRate === 0
                                                                ? 'FREE'
                                                                : `₹${fac.hourlyRate}`}
                                                        </p>

                                                        {fac.hourlyRate !== 0 && (
                                                            <p className="text-[9px] text-slate-300">
                                                                per hour
                                                            </p>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* ================= CONTENT ================= */}
                                        <div className="space-y-5 p-5">

                                            <p className="min-h-[48px] text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                {fac.description}
                                            </p>


                                            {/* Facility information */}
                                            <div className="grid grid-cols-2 gap-3">

                                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10">
                                                            <Users className="h-4 w-4 text-brand-500" />
                                                        </div>

                                                        <div>
                                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                                Capacity
                                                            </p>

                                                            <p className="mt-0.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                                                                {fac.capacity} Persons
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
                                                            <Clock className="h-4 w-4 text-amber-500" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                                Timings
                                                            </p>

                                                            <p className="mt-0.5 truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                                                                {fac.timing}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Rules */}
                                            <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">

                                                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">

                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
                                                        <Info className="h-3.5 w-3.5 text-sky-500" />
                                                    </div>

                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                        Facility Guidelines
                                                    </span>
                                                </div>

                                                <div className="px-4 py-3">
                                                    <ul className="space-y-2">
                                                        {fac.rules.map((rule, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-start gap-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400"
                                                            >
                                                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                                                                {rule}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>


                                            {/* Book button */}
                                            <button
                                                onClick={() => setSelectedFacility(fac)}
                                                className="group/btn flex w-full items-center justify-between rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-600/30 active:scale-[0.99]"
                                            >

                                                <span className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    Reserve This Facility
                                                </span>

                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 transition-transform group-hover/btn:translate-x-0.5">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </span>

                                            </button>

                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </>
            )}


            {/* =========================================================
                MY BOOKINGS
            ========================================================= */}
            {activeTab === 'my_bookings' && (
                <section>

                    {bookings.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <EmptyState
                                title="No facility bookings yet"
                                description="Explore society facilities and reserve a slot for your next event."
                                actionLabel="Browse Facilities"
                                onAction={() => setActiveTab('explore')}
                            />
                        </div>
                    ) : (
                        <div className="space-y-5">

                            {/* Booking summary */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-500">
                                            Your Reservations
                                        </p>

                                        <h2 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                                            Upcoming facility bookings
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => setActiveTab('explore')}
                                        className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                                    >
                                        Explore more
                                        <ChevronRight className="h-4 w-4" />
                                    </button>

                                </div>
                            </div>


                            {/* Booking cards */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                                {bookings.map((bk) => (
                                    <div
                                        key={bk.id}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                                    >

                                        <div className="flex flex-col sm:flex-row">

                                            {/* Image */}
                                            <div className="relative h-48 shrink-0 overflow-hidden sm:h-auto sm:w-40">

                                                <img
                                                    src={bk.facilityImage}
                                                    alt={bk.facilityName}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />

                                                <div className="absolute bottom-3 left-3">
                                                    <div className="rounded-lg bg-slate-950/60 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-md">
                                                        RESERVATION
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Details */}
                                            <div className="flex flex-1 flex-col justify-between p-5">

                                                <div>

                                                    <div className="flex items-start justify-between gap-3">

                                                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                                            {bk.facilityName}
                                                        </h3>

                                                        <StatusBadge
                                                            value={bk.status}
                                                            size="sm"
                                                        />

                                                    </div>


                                                    <div className="mt-4 space-y-2">

                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
                                                            {bk.date}
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                                                            {bk.startTime} - {bk.endTime}
                                                        </div>

                                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                            <Users className="h-3.5 w-3.5 text-emerald-500" />
                                                            {bk.guestsCount} Guests
                                                        </div>

                                                    </div>
                                                </div>


                                                <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">

                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                            Total Amount
                                                        </p>

                                                        <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                                                            ₹{bk.totalAmount.toLocaleString()}
                                                        </p>
                                                    </div>


                                                    {bk.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(bk.id)}
                                                            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Cancel
                                                        </button>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}

                </section>
            )}


            {/* =========================================================
                BOOKING MODAL
            ========================================================= */}
            {selectedFacility && (
                <Modal
                    isOpen={!!selectedFacility}
                    onClose={() => setSelectedFacility(null)}
                    title={`Reserve ${selectedFacility.name}`}
                    subtitle="Choose your preferred date and time"
                >

                    <form
                        onSubmit={handleCreateBooking}
                        className="space-y-5"
                    >

                        {/* Selected facility preview */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">

                            <div className="relative h-28">

                                <img
                                    src={selectedFacility.image}
                                    alt={selectedFacility.name}
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                                <div className="absolute bottom-3 left-4">
                                    <p className="text-sm font-black text-white">
                                        {selectedFacility.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-300">
                                        {selectedFacility.category}
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center justify-between px-4 py-3">

                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-brand-500" />

                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        Up to {selectedFacility.capacity} guests
                                    </span>
                                </div>

                                <span className="text-sm font-black text-emerald-500">
                                    {selectedFacility.hourlyRate === 0
                                        ? 'FREE'
                                        : `₹${selectedFacility.hourlyRate}/hr`}
                                </span>

                            </div>
                        </div>


                        {/* Date */}
                        <Input
                            label="Reservation Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />


                        {/* Time */}
                        <div className="grid grid-cols-2 gap-4">

                            <Select
                                label="Start Time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                options={[
                                    { label: '07:00 AM', value: '07:00' },
                                    { label: '09:00 AM', value: '09:00' },
                                    { label: '11:00 AM', value: '11:00' },
                                    { label: '03:00 PM', value: '15:00' },
                                    { label: '05:00 PM', value: '17:00' },
                                    { label: '07:00 PM', value: '19:00' },
                                ]}
                            />

                            <Select
                                label="End Time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                options={[
                                    { label: '09:00 AM', value: '09:00' },
                                    { label: '11:00 AM', value: '11:00' },
                                    { label: '01:00 PM', value: '13:00' },
                                    { label: '06:00 PM', value: '18:00' },
                                    { label: '09:00 PM', value: '21:00' },
                                    { label: '11:00 PM', value: '23:00' },
                                ]}
                            />

                        </div>


                        {/* Guests */}
                        <Input
                            label="Expected Guests Count"
                            type="number"
                            value={guestsCount}
                            onChange={(e) =>
                                setGuestsCount(Number(e.target.value))
                            }
                            min={1}
                            max={selectedFacility.capacity}
                            required
                        />


                        {/* Price */}
                        <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Estimated Total
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Based on selected time slot
                                    </p>
                                </div>

                                <span className="text-xl font-black text-brand-600 dark:text-brand-400">
                                    ₹{calculateTotal(selectedFacility).toLocaleString()}
                                </span>

                            </div>

                        </div>


                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">

                            <button
                                type="button"
                                onClick={() => setSelectedFacility(null)}
                                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isBooking}
                                className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {isBooking && (
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}

                                {isBooking
                                    ? 'Confirming...'
                                    : 'Confirm Reservation'}

                            </button>

                        </div>

                    </form>
                </Modal>
            )}

        </div>
    );
};
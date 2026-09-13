import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { Facility, AmenityBooking } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import {
    CalendarDays,
    Clock,
    Users,
    CheckCircle2,
    XCircle,
    Plus,
    Info,
    Building,
    Sparkles
} from 'lucide-react';

export const ResidentAmenities: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
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
        const [facRes, bkRes] = await Promise.all([mockApi.getFacilities(), mockApi.getBookings()]);
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
                totalAmount
            });

            toast.success('Reservation Confirmed!', `Booked ${newBk.facilityName} for ${date}.`);
            setSelectedFacility(null);
            loadData();
            setActiveTab('my_bookings');
        } catch (err) {
            toast.error('Booking Failed', 'Unable to reserve time slot.');
        } finally {
            setIsBooking(false);
        }
    };

    const handleCancelBooking = async (id: string) => {
        const success = await mockApi.cancelBooking(id);
        if (success) {
            toast.info('Booking Cancelled', 'Your reservation slot has been released.');
            loadData();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Amenity & Facility Reservations
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Reserve banquet halls, tennis courts, and society wellness spaces in advance.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'explore'
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        Explore Facilities
                    </button>
                    <button
                        onClick={() => setActiveTab('my_bookings')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'my_bookings'
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span>My Bookings</span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-white/20 dark:bg-slate-700 text-current rounded-full">
                            {bookings.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* EXPLORE TAB */}
            {activeTab === 'explore' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facilities.map((fac) => (
                        <div
                            key={fac.id}
                            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={fac.image}
                                    alt={fac.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                                    <div>
                                        <span className="px-2 py-0.5 rounded-md bg-brand-500/80 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                                            {fac.category}
                                        </span>
                                        <h3 className="text-lg font-bold mt-1 text-white">{fac.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black text-emerald-400">
                                            {fac.hourlyRate === 0 ? 'Free' : `₹${fac.hourlyRate}/hr`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{fac.description}</p>

                                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-brand-500" />
                                        <span>Cap: {fac.capacity} Persons</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        <span>{fac.timing}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-[11px] text-slate-500">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5 text-brand-500" /> Rules:
                                    </span>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {fac.rules.map((rule, idx) => (
                                            <li key={idx}>{rule}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setSelectedFacility(fac)}
                                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <CalendarDays className="w-4 h-4" /> Book Time Slot
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MY BOOKINGS TAB */}
            {activeTab === 'my_bookings' && (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <EmptyState
                            title="No facility bookings yet"
                            description="Explore society facilities and reserve a slot."
                            actionLabel="Browse Facilities"
                            onAction={() => setActiveTab('explore')}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bookings.map((bk) => (
                                <div
                                    key={bk.id}
                                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-start gap-4"
                                >
                                    <img
                                        src={bk.facilityImage}
                                        alt={bk.facilityName}
                                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                                    />
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{bk.facilityName}</h4>
                                            <StatusBadge value={bk.status} size="sm" />
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                            📅 {bk.date} • ⏰ {bk.startTime} - {bk.endTime}
                                        </p>

                                        <p className="text-[11px] text-slate-500">
                                            Guests: {bk.guestsCount} • Total: ₹{bk.totalAmount}
                                        </p>

                                        {bk.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancelBooking(bk.id)}
                                                className="mt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Cancel Reservation
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* BOOKING MODAL */}
            {selectedFacility && (
                <Modal
                    isOpen={!!selectedFacility}
                    onClose={() => setSelectedFacility(null)}
                    title={`Reserve ${selectedFacility.name}`}
                    subtitle="Select date and hour slot"
                >
                    <form onSubmit={handleCreateBooking} className="space-y-4">
                        <Input
                            label="Reservation Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

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
                                    { label: '07:00 PM', value: '19:00' }
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
                                    { label: '11:00 PM', value: '23:00' }
                                ]}
                            />
                        </div>

                        <Input
                            label="Expected Guests Count"
                            type="number"
                            value={guestsCount}
                            onChange={(e) => setGuestsCount(Number(e.target.value))}
                            min={1}
                            max={selectedFacility.capacity}
                            required
                        />

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Total Calculated Dues</span>
                            <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                                ₹{calculateTotal(selectedFacility).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setSelectedFacility(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isBooking}
                                className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isBooking && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                Confirm Reservation
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

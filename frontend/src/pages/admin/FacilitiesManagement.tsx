import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Amenity, FacilityBooking } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Cards';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input, Select, Textarea } from '../../components/common/FormFields';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Building, Plus, Calendar, Clock, Lock, CheckCircle2, XCircle } from 'lucide-react';

export const FacilitiesManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [bookings, setBookings] = useState<FacilityBooking[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Facility Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<'sports' | 'leisure' | 'event'>('leisure');
    const [capacity, setCapacity] = useState(30);
    const [hourlyRate, setHourlyRate] = useState(500);

    useEffect(() => {
        loadFacilities();
    }, []);

    async function loadFacilities() {
        setLoading(true);
        const [ams, bks] = await Promise.all([mockApi.getAmenities(), mockApi.getBookings()]);
        setAmenities(ams);
        setBookings(bks);
        setLoading(false);
    }

    const handleAddFacility = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        await mockApi.addAmenity({
            name,
            category,
            capacity,
            hourlyRate,
            status: 'available',
            operatingHours: '06:00 AM - 10:00 PM',
            rules: ['Prior reservation mandatory', 'Maintain cleanliness'],
            image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&auto=format&fit=crop&q=80'
        });

        toast.success('Facility Added', `${name} created and open for resident bookings.`);
        setIsAddModalOpen(false);
        loadFacilities();
    };

    const handleToggleStatus = async (id: string, status: 'available' | 'maintenance') => {
        const updated = await mockApi.updateAmenityStatus(id, status);
        if (updated) {
            toast.info('Status Updated', `Facility marked as ${status}.`);
            loadFacilities();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Society Facilities & Booking Control
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage clubhouse, tennis courts, party halls, block slots for maintenance, and review bookings.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Facility
                </button>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((item) => (
                    <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3 flex flex-col justify-between"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{item.name}</h4>
                                <StatusBadge value={item.status || 'available'} size="sm" />
                            </div>
                            <p className="text-xs text-slate-500">Cap: {item.capacity} Persons • Rate: ₹{item.hourlyRate}/hr</p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {item.status === 'available' ? (
                                <button
                                    onClick={() => handleToggleStatus(item.id, 'maintenance')}
                                    className="w-full py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                                >
                                    Block for Maintenance
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleToggleStatus(item.id, 'available')}
                                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                                >
                                    Make Available
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bookings Audit Table */}
            <div className="pt-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    All Resident Reservations
                </h3>
                <DataTable
                    columns={[
                        {
                            header: 'Facility Name',
                            accessorKey: 'amenityName',
                            cell: (item: FacilityBooking) => <span className="font-bold">{item.amenityName}</span>
                        },
                        {
                            header: 'Resident & Flat',
                            accessorKey: 'residentName',
                            cell: (item: FacilityBooking) => (
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.residentName}</p>
                                    <p className="text-[10px] text-slate-400">Flat {item.flatNumber}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Booking Date & Slot',
                            accessorKey: 'bookingDate',
                            cell: (item: FacilityBooking) => (
                                <span className="text-xs">{item.bookingDate} ({item.slotTime})</span>
                            )
                        },
                        {
                            header: 'Total Paid',
                            accessorKey: 'totalAmount',
                            cell: (item: FacilityBooking) => <span className="font-bold">₹{item.totalAmount}</span>
                        },
                        {
                            header: 'Status',
                            accessorKey: 'status',
                            cell: (item: FacilityBooking) => <StatusBadge value={item.status} size="sm" />
                        }
                    ]}
                    data={bookings}
                    keyExtractor={(item) => item.id}
                />
            </div>

            {/* ADD FACILITY MODAL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Facility"
                subtitle="Configure new amenity for resident bookings"
            >
                <form onSubmit={handleAddFacility} className="space-y-4">
                    <Input
                        label="Facility Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Squash Court #2"
                        required
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            options={[
                                { label: 'Leisure', value: 'leisure' },
                                { label: 'Sports', value: 'sports' },
                                { label: 'Event', value: 'event' }
                            ]}
                        />
                        <Input
                            label="Max Capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            required
                        />
                        <Input
                            label="Hourly Rate (₹)"
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                        >
                            Create Facility
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Resident } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { Card } from '../../components/common/Cards';
import { Users, Plus, Phone, Mail, Building, Car, Shield, Search } from 'lucide-react';

export const ResidentManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [wingFilter, setWingFilter] = useState('all');

    // Add Resident Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [flatNumber, setFlatNumber] = useState('A-101');
    const [wing, setWing] = useState('Wing A');
    const [occupancyStatus, setOccupancyStatus] = useState<'Owner' | 'Tenant'>('Owner');

    // Detail Drawer
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

    useEffect(() => {
        loadResidents();
    }, []);

    async function loadResidents() {
        setLoading(true);
        const data = await mockApi.getResidents();
        setResidents(data);
        setLoading(false);
    }

    const handleAddResident = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        await mockApi.addResident({
            name,
            email,
            phone,
            flatNumber,
            wing,
            occupancyStatus,
            familyMembersCount: 3,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            vehicles: [{ type: 'Car', number: 'MH 02 XY 9999' }]
        });

        toast.success('Resident Registered', `${name} added to ${flatNumber}.`);
        setIsAddModalOpen(false);
        resetForm();
        loadResidents();
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setFlatNumber('A-101');
    };

    const filtered = residents.filter((r) => {
        const matchSearch =
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
            r.email.toLowerCase().includes(search.toLowerCase());
        const matchWing = wingFilter === 'all' || r.wing === wingFilter;
        return matchSearch && matchWing;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Resident Directory & Flat Assignment
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage society flat owners, tenant registrations, vehicle tags, and occupancy records.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New Resident
                </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, flat number, email..."
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {['all', 'Wing A', 'Wing B', 'Wing C', 'Wing D'].map((w) => (
                        <button
                            key={w}
                            onClick={() => setWingFilter(w)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${wingFilter === w
                                    ? 'bg-brand-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
            </div>

            {/* Residents Table */}
            <DataTable
                columns={[
                    {
                        header: 'Resident Name',
                        accessorKey: 'name',
                        cell: (item: Resident) => (
                            <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => setSelectedResident(item)}
                            >
                                <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/20"
                                />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                        {item.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{item.email}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: 'Flat Number',
                        accessorKey: 'flatNumber',
                        cell: (item: Resident) => (
                            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                                {item.flatNumber} ({item.wing})
                            </span>
                        )
                    },
                    {
                        header: 'Phone',
                        accessorKey: 'phone'
                    },
                    {
                        header: 'Occupancy',
                        accessorKey: 'occupancyStatus',
                        cell: (item: Resident) => (
                            <span
                                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md ${item.occupancyStatus === 'Owner'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    }`}
                            >
                                {item.occupancyStatus}
                            </span>
                        )
                    },
                    {
                        header: 'Vehicles',
                        accessorKey: 'vehicles',
                        cell: (item: Resident) => (
                            <span className="text-xs font-semibold">{item.vehicles?.length || 0} Registered</span>
                        )
                    }
                ]}
                data={filtered}
                keyExtractor={(item) => item.id}
            />

            {/* ADD RESIDENT MODAL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Register New Resident"
                subtitle="Add flat owner or tenant to society portal"
            >
                <form onSubmit={handleAddResident} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Roy"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. ananya@horizon.com"
                            required
                        />

                        <Input
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            label="Wing"
                            value={wing}
                            onChange={(e) => setWing(e.target.value)}
                            options={[
                                { label: 'Wing A', value: 'Wing A' },
                                { label: 'Wing B', value: 'Wing B' },
                                { label: 'Wing C', value: 'Wing C' },
                                { label: 'Wing D', value: 'Wing D' }
                            ]}
                        />

                        <Input
                            label="Flat Number"
                            value={flatNumber}
                            onChange={(e) => setFlatNumber(e.target.value)}
                            placeholder="e.g. A-101"
                            required
                        />

                        <Select
                            label="Occupancy"
                            value={occupancyStatus}
                            onChange={(e) => setOccupancyStatus(e.target.value as any)}
                            options={[
                                { label: 'Owner', value: 'Owner' },
                                { label: 'Tenant', value: 'Tenant' }
                            ]}
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
                            Save Resident
                        </button>
                    </div>
                </form>
            </Modal>

            {/* DETAIL DRAWER */}
            {selectedResident && (
                <Modal
                    isOpen={!!selectedResident}
                    onClose={() => setSelectedResident(null)}
                    title={`Resident Profile - Flat ${selectedResident.flatNumber}`}
                    subtitle={selectedResident.name}
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                            <img
                                src={selectedResident.avatar}
                                alt={selectedResident.name}
                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
                            />
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedResident.name}</h3>
                                <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                                    {selectedResident.flatNumber} • {selectedResident.wing}
                                </p>
                                <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-md">
                                    {selectedResident.occupancyStatus}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400">Email:</span>
                                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">{selectedResident.email}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400">Phone:</span>
                                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedResident.phone}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Registered Parking Vehicles</h4>
                            {selectedResident.vehicles && selectedResident.vehicles.length > 0 ? (
                                <div className="space-y-1.5">
                                    {selectedResident.vehicles.map((v, i) => (
                                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between text-xs">
                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{v.number}</span>
                                            <span className="text-slate-400">{v.type}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400">No vehicle registered.</p>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

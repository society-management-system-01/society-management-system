import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Cards';
import { Input } from '../../components/common/FormFields';
import { User, Building, Phone, Mail, Car, Shield, Plus, Trash2 } from 'lucide-react';

export const ResidentProfile: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [phone, setPhone] = useState(currentUser.phone);
    const [vehicles, setVehicles] = useState([
        { type: 'Car', number: 'MH 02 CD 4820', slot: 'P2-402' },
        { type: 'Two-Wheeler', number: 'MH 02 AB 9102', slot: 'S-12' }
    ]);

    const [newVehicleNo, setNewVehicleNo] = useState('');
    const [newVehicleType, setNewVehicleType] = useState('Car');

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVehicleNo.trim()) return;
        setVehicles([...vehicles, { type: newVehicleType, number: newVehicleNo.toUpperCase(), slot: 'P-Unassigned' }]);
        setNewVehicleNo('');
        toast.success('Vehicle Registered', 'Added to security gate database.');
    };

    const handleRemoveVehicle = (idx: number) => {
        setVehicles(vehicles.filter((_, i) => i !== idx));
        toast.info('Vehicle Removed');
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Profile Saved', 'Personal details updated.');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    My Resident Profile
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage flat ownership details, family members, and registered parking vehicles.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card Summary */}
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card text-center space-y-4">
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-brand-500/20 shadow-xl"
                        />
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{currentUser.name}</h3>
                            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider mt-0.5">
                                Flat {currentUser.flatNumber} • {currentUser.wing}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                                Primary Owner
                            </span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                <span className="text-[10px] text-slate-400">Occupancy Status</span>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Owner Residing</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                <span className="text-[10px] text-slate-400">Society Member ID</span>
                                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">GHH-8842</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details & Vehicles */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Personal Information" subtitle="Update contact details for society alerts">
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <Input
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="w-4 h-4" />}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="w-4 h-4" />}
                                    required
                                />
                                <Input
                                    label="Primary Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    icon={<Phone className="w-4 h-4" />}
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all"
                                >
                                    Save Profile Changes
                                </button>
                            </div>
                        </form>
                    </Card>

                    {/* Vehicles List */}
                    <Card title="Registered Parking Vehicles" subtitle="RFI Gate tags and parking bay allocations">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {vehicles.map((v, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                                                <Car className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">{v.number}</h5>
                                                <p className="text-[10px] text-slate-500">
                                                    {v.type} • Allocated Bay: <strong className="text-slate-700 dark:text-slate-300">{v.slot}</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveVehicle(idx)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleAddVehicle} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <input
                                    type="text"
                                    value={newVehicleNo}
                                    onChange={(e) => setNewVehicleNo(e.target.value)}
                                    placeholder="Enter vehicle reg # (e.g. MH 02 XY 1234)"
                                    className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Register Vehicle
                                </button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

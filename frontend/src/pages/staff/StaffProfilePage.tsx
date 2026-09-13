import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Cards';
import { Input } from '../../components/common/FormFields';
import { Wrench, User, Phone, Mail, Shield, CheckCircle2 } from 'lucide-react';

export const StaffProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [phone, setPhone] = useState(currentUser.phone);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Profile Saved', 'Staff account details updated.');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Staff Account Profile
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    View assigned skill category, supervisor contact, and work availability status.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card text-center space-y-4">
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-amber-500/20 shadow-xl"
                    />
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{currentUser.name}</h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                            {currentUser.designation || 'Senior Plumbing Specialist'}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full">
                            On-Duty Maintenance
                        </span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left text-xs space-y-2 text-slate-600 dark:text-slate-300">
                        <p className="flex justify-between">
                            <span className="text-slate-400">Supervisor:</span>
                            <strong className="text-slate-800 dark:text-slate-200">Suresh Patel (Facility Head)</strong>
                        </p>
                        <p className="flex justify-between">
                            <span className="text-slate-400">Staff Employee ID:</span>
                            <strong className="font-mono text-slate-800 dark:text-slate-200">EMP-209</strong>
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Technician Details" subtitle="Contact & Shift Timings">
                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="w-4 h-4" />}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="w-4 h-4" />}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    icon={<Phone className="w-4 h-4" />}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all"
                            >
                                Save Staff Info
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

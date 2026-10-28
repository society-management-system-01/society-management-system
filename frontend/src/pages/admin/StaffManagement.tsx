import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { StaffMember } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Wrench, Plus, Phone, Mail, UserCheck, Shield } from 'lucide-react';

export const StaffManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Staff Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('Senior Plumber');
    const [role, setRole] = useState<'Staff' | 'Vendor'>('Staff');

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        setLoading(true);
        const data = await mockApi.getStaff();
        setStaff(data);
        setLoading(false);
    }

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        await mockApi.addStaffMember({
            name,
            email,
            phone,
            designation,
            role: 'staff',
            skills: [designation],
            status: 'active',
            activeTaskCount: 0,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        });

        toast.success('Staff Added', `${name} registered as ${designation}.`);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        loadStaff();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Society Maintenance Staff & Vendors
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage electricians, plumbers, security guards, housekeepers, and assigned task workloads.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Staff Member
                </button>
            </div>

            <DataTable
                columns={[
                    {
                        header: 'Staff Member',
                        accessorKey: 'name',
                        cell: (item: StaffMember) => (
                            <div className="flex items-center gap-3">
                                <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/20"
                                />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                    <p className="text-[10px] text-slate-400">{item.designation || 'Technician'}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: 'Specialized Skills',
                        accessorKey: 'skills',
                        cell: (item: StaffMember) => (
                            <div className="flex flex-wrap gap-1">
                                {(item.skills || []).map((sk, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                                        {sk}
                                    </span>
                                ))}
                            </div>
                        )
                    },
                    {
                        header: 'Contact Phone',
                        accessorKey: 'phone'
                    },
                    {
                        header: 'Active Tasks Load',
                        accessorKey: 'activeTaskCount',
                        cell: (item: StaffMember) => (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold text-xs">
                                {item.activeTaskCount || 0} Open Tickets
                            </span>
                        )
                    },
                    {
                        header: 'Work Status',
                        accessorKey: 'status',
                        cell: (item: StaffMember) => <StatusBadge value={item.status} size="sm" />
                    }
                ]}
                data={staff}
                keyExtractor={(item) => item.id}
            />

            {/* ADD STAFF MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register Maintenance Staff"
                subtitle="Add technician or vendor to society dispatch roster"
            >
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. ramesh@horizon.com"
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

                    <Select
                        label="Skill / Designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        options={[
                            { label: 'Plumbing Specialist', value: 'Plumbing Specialist' },
                            { label: 'Electrical Technician', value: 'Electrical Technician' },
                            { label: 'Elevator Maintenance Engineer', value: 'Elevator Maintenance Engineer' },
                            { label: 'Security Supervisor', value: 'Security Supervisor' },
                            { label: 'Housekeeping In-charge', value: 'Housekeeping In-charge' }
                        ]}
                    />

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
                            Save Staff Member
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

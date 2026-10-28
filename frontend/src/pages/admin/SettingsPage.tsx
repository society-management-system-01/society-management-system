import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Cards';
import { Input, Select, Textarea } from '../../components/common/FormFields';
import { Building, Shield, Bell, Moon, Lock, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [societyName, setSocietyName] = useState('Grand Horizon Heights CHS Ltd.');
    const [address, setAddress] = useState('Plot 42, Sector 18, Palm Beach Road, Navi Mumbai 400705');
    const [secretaryName, setSecretaryName] = useState('Rajesh Sharma');
    const [treasurerName, setTreasurerName] = useState('Amitabh Sen');
    const [maintenanceCycle, setMaintenanceCycle] = useState('monthly');
    const [lateFeePercentage, setLateFeePercentage] = useState(2);

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Settings Updated', 'Society configurations saved successfully.');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Society Profile & Governance Settings
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Configure society legal details, committee office bearers, billing rules, and role permission policies.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Society Registration & Legal Details" subtitle="Official registered office information">
                        <form onSubmit={handleSaveSettings} className="space-y-4">
                            <Input
                                label="Registered Society Name"
                                value={societyName}
                                onChange={(e) => setSocietyName(e.target.value)}
                                icon={<Building className="w-4 h-4" />}
                                required
                            />

                            <Textarea
                                label="Registered Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Hon. Secretary Name"
                                    value={secretaryName}
                                    onChange={(e) => setSecretaryName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Hon. Treasurer Name"
                                    value={treasurerName}
                                    onChange={(e) => setTreasurerName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Billing Cycle"
                                    value={maintenanceCycle}
                                    onChange={(e) => setMaintenanceCycle(e.target.value)}
                                    options={[
                                        { label: 'Monthly Invoicing', value: 'monthly' },
                                        { label: 'Quarterly Invoicing', value: 'quarterly' }
                                    ]}
                                />
                                <Input
                                    label="Late Payment Interest (% p.a.)"
                                    type="number"
                                    value={lateFeePercentage}
                                    onChange={(e) => setLateFeePercentage(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all"
                                >
                                    Save Society Profile
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Role Permissions Card */}
                <div className="space-y-6">
                    <Card title="Role Access Policy" subtitle="Active portal capabilities">
                        <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">Resident Portal</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Complaints, Gate Passes, Facility Bookings, Online Bill Pay
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">Staff / Worker Portal</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Assigned Task Kanban, Status Updates, Material Requisitioning
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-brand-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">Committee / Admin Portal</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Full Analytics, Directory Control, Financial Invoicing, Gate Logs
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

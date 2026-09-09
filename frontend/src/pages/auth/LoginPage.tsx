import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Input } from '../../components/common/FormFields';
import { Building2, Lock, Mail, Shield, UserCheck, Wrench, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
    onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { loginWithCredentials, loginAsRole } = useAuth();

    const [selectedRole, setSelectedRole] = useState<UserRole>('resident');
    const [email, setEmail] = useState('aarav.sharma@horizon.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const rolePresets = {
        resident: {
            email: 'aarav.sharma@horizon.com',
            name: 'Aarav Sharma (Flat B-402)',
            color: 'from-brand-500 to-indigo-600'
        },
        staff: {
            email: 'rajesh.kumar@horizon.com',
            name: 'Rajesh Kumar (Senior Plumber)',
            color: 'from-amber-500 to-orange-600'
        },
        admin: {
            email: 'priya.admin@horizon.com',
            name: 'Priya Mukherjee (Secretary)',
            color: 'from-emerald-500 to-teal-600'
        }
    };

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        setEmail(rolePresets[role].email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            loginWithCredentials(email, selectedRole);
            onNavigate(`/${selectedRole}/dashboard`);
        }, 400);
    };

    const handleQuickDemoLogin = (role: UserRole) => {
        loginAsRole(role);
        onNavigate(`/${role}/dashboard`);
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
            {/* Left Column: Form & Role Selector */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10">
                <div>
                    {/* Brand Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-white">
                                Horizon<span className="text-brand-400">Heights</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Society Management Portal
                            </p>
                        </div>
                    </div>

                    {/* Role Quick Selector Banner */}
                    <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    Interactive Role Demo Selector
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Click to log in instantly</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickDemoLogin('resident')}
                                className={`p-3 rounded-xl border text-left transition-all group ${selectedRole === 'resident'
                                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white'
                                    }`}
                            >
                                <UserCheck className="w-5 h-5 mb-1.5 text-brand-400 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold leading-tight">Resident</p>
                                <p className="text-[10px] opacity-75 mt-0.5 truncate">Aarav (B-402)</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickDemoLogin('staff')}
                                className={`p-3 rounded-xl border text-left transition-all group ${selectedRole === 'staff'
                                        ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white'
                                    }`}
                            >
                                <Wrench className="w-5 h-5 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold leading-tight">Staff / Worker</p>
                                <p className="text-[10px] opacity-75 mt-0.5 truncate">Rajesh (Plumber)</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickDemoLogin('admin')}
                                className={`p-3 rounded-xl border text-left transition-all group ${selectedRole === 'admin'
                                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white'
                                    }`}
                            >
                                <Shield className="w-5 h-5 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold leading-tight">Admin</p>
                                <p className="text-[10px] opacity-75 mt-0.5 truncate">Priya (Secretary)</p>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign in to your account</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Select your role above or enter your credentials below.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <Input
                                label="Email / Phone Number"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email or phone"
                                icon={<Mail className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={<Lock className="w-4 h-4" />}
                                required
                            />

                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500/20"
                                    />
                                    <span>Remember me</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => onNavigate('/forgot-password')}
                                    className="font-semibold text-brand-400 hover:text-brand-300 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-600/20 transition-all flex items-center justify-center gap-2 group mt-2"
                            >
                                {isLoading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Continue as {selectedRole.toUpperCase()}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-8 text-center text-xs text-slate-500">
                    © 2026 Grand Horizon Heights Society. Designed with React + Tailwind.
                </div>
            </div>

            {/* Right Column: Visual Feature Showcase */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-slate-950 to-slate-950 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

                <div className="relative z-10 max-w-lg space-y-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-brand-400 text-xs font-semibold">
                        <Building2 className="w-4 h-4" /> Next-Gen Smart Housing Platform
                    </div>

                    <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                        Streamlined Community Living & Maintenance
                    </h2>

                    <p className="text-sm text-slate-400 leading-relaxed">
                        Real-time complaint tracking, automated bill generation, digital visitor gates, facility reservations, and stock inventory management all under one unified portal.
                    </p>

                    <div className="grid grid-cols-3 gap-4 text-left pt-4">
                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                            <h4 className="text-xl font-bold text-white">348+</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Active Residents</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                            <h4 className="text-xl font-bold text-emerald-400">98.5%</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Ticket Resolution</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                            <h4 className="text-xl font-bold text-brand-400">Instant</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Gate Pass Codes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
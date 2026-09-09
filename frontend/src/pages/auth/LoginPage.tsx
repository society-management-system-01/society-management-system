import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Input } from '../../components/common/FormFields';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    Sparkles,
    UserCheck,
    Users,
    Wrench,
} from 'lucide-react';

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
    const [showPassword, setShowPassword] = useState(false);

    const rolePresets = {
        resident: {
            email: 'aarav.sharma@horizon.com',
            name: 'Aarav Sharma',
        },
        staff: {
            email: 'rajesh.kumar@horizon.com',
            name: 'Rajesh Kumar',
        },
        admin: {
            email: 'priya.admin@horizon.com',
            name: 'Priya Mukherjee',
        },
    };

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        setEmail(rolePresets[role].email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) return;

        setIsLoading(true);

        setTimeout(() => {
            loginWithCredentials(email, selectedRole);
            onNavigate(`/${selectedRole}/dashboard`);
        }, 400);
    };

    const handleQuickDemoLogin = (role: UserRole) => {
        setSelectedRole(role);
        loginAsRole(role);
        onNavigate(`/${role}/dashboard`);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* =========================================================
                MAIN CONTAINER
            ========================================================== */}

            <div className="min-h-screen flex">

                {/* =====================================================
                    LEFT SIDE — VISUAL / BRANDING
                ====================================================== */}

                <section className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#251047] via-[#4b1f78] to-[#792b91]">

                    {/* Background glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(196,181,253,0.25),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.15),transparent_30%)]" />

                    {/* Decorative circles */}
                    <div className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full border border-white/10" />
                    <div className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full border border-white/10" />

                    {/* Stars */}
                    <span className="absolute top-[15%] left-[13%] w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                    <span className="absolute top-[25%] left-[28%] w-1 h-1 rounded-full bg-white/60" />
                    <span className="absolute top-[12%] right-[22%] w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                    <span className="absolute top-[38%] right-[14%] w-1 h-1 rounded-full bg-white/60" />
                    <span className="absolute top-[55%] left-[10%] w-1 h-1 rounded-full bg-white/60" />
                    <span className="absolute top-[46%] left-[42%] w-1 h-1 rounded-full bg-white/50" />

                    {/* Shooting stars */}
                    <div className="absolute top-[18%] right-[30%] w-16 h-px rotate-[-35deg] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                    <div className="absolute top-[32%] left-[20%] w-12 h-px rotate-[-50deg] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between px-10 py-10 xl:px-16 xl:py-12">

                        {/* Brand */}
                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>

                            <div>
                                <h1 className="text-lg font-black tracking-tight text-white">
                                    Horizon<span className="text-violet-300">Heights</span>
                                </h1>

                                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">
                                    Society Management
                                </p>
                            </div>

                        </div>

                        {/* Hero */}
                        <div className="relative max-w-xl">

                            {/* Small badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                                <Sparkles className="w-3.5 h-3.5 text-violet-200" />
                                <span className="text-[10px] font-semibold tracking-wide text-white/70">
                                    SMART COMMUNITY PLATFORM
                                </span>
                            </div>

                            <h2 className="text-4xl xl:text-6xl font-black tracking-tight leading-[1.05] text-white">
                                Your community,
                                <br />
                                <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-blue-200 bg-clip-text text-transparent">
                                    beautifully connected.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
                                Manage your home, complaints, visitors, amenities,
                                payments and community updates from one simple platform.
                            </p>

                            {/* Feature pills */}
                            <div className="mt-8 flex flex-wrap gap-2">

                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                    <span className="text-[11px] font-medium text-white/70">
                                        Easy Management
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                                    <Users className="w-4 h-4 text-blue-300" />
                                    <span className="text-[11px] font-medium text-white/70">
                                        Connected Community
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                                    <Shield className="w-4 h-4 text-violet-300" />
                                    <span className="text-[11px] font-medium text-white/70">
                                        Secure Access
                                    </span>
                                </div>

                            </div>

                            {/* Floating status card */}
                            <div className="absolute -right-2 -top-16 hidden xl:block w-48 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-2xl">

                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-400/15 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                    </div>

                                    <span className="px-2 py-1 rounded-full bg-emerald-400/10 text-[9px] font-bold text-emerald-300">
                                        LIVE
                                    </span>
                                </div>

                                <p className="text-xs font-bold text-white">
                                    Community connected
                                </p>

                                <p className="mt-1 text-[10px] text-white/40">
                                    Everything is running smoothly.
                                </p>

                            </div>

                        </div>

                        {/* =================================================
                            SOCIETY BUILDING ILLUSTRATION
                        ================================================== */}

                        <div className="relative h-40 -mx-10 xl:-mx-16 mt-8">

                            {/* Moon */}
                            <div className="absolute right-[17%] top-0 w-20 h-20 rounded-full bg-white/10 shadow-[0_0_70px_rgba(221,214,254,0.15)]" />

                            {/* Ground glow */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Buildings */}
                            <div className="absolute bottom-0 left-[5%] w-20 h-24 rounded-t-2xl bg-white/[0.07]" />
                            <div className="absolute bottom-0 left-[17%] w-24 h-32 rounded-t-2xl bg-white/[0.10]" />
                            <div className="absolute bottom-0 left-[32%] w-28 h-24 rounded-t-2xl bg-white/[0.07]" />
                            <div className="absolute bottom-0 left-[49%] w-24 h-40 rounded-t-2xl bg-white/[0.11]" />
                            <div className="absolute bottom-0 right-[20%] w-24 h-32 rounded-t-2xl bg-white/[0.08]" />
                            <div className="absolute bottom-0 right-[7%] w-20 h-24 rounded-t-2xl bg-white/[0.07]" />

                            {/* Windows */}
                            <div className="absolute bottom-10 left-[20%] grid grid-cols-3 gap-3 opacity-40">
                                <span className="w-2 h-2 rounded-sm bg-violet-200" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                                <span className="w-2 h-2 rounded-sm bg-violet-200" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                                <span className="w-2 h-2 rounded-sm bg-violet-200" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                            </div>

                            <div className="absolute bottom-14 left-[52%] grid grid-cols-2 gap-4 opacity-40">
                                <span className="w-2 h-2 rounded-sm bg-blue-200" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                                <span className="w-2 h-2 rounded-sm bg-blue-200" />
                                <span className="w-2 h-2 rounded-sm bg-white" />
                                <span className="w-2 h-2 rounded-sm bg-blue-200" />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="text-[10px] text-white/30">
                            © 2026 Horizon Heights Society
                        </div>

                    </div>
                </section>

                {/* =========================================================
                    RIGHT SIDE — LOGIN
                ========================================================== */}

                <section className="relative flex w-full lg:w-[45%] min-h-screen items-center justify-center px-5 py-8 sm:px-10">

                    {/* Mobile background decoration */}
                    <div className="absolute inset-0 overflow-hidden lg:hidden">
                        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />
                    </div>

                    <div className="relative z-10 w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center justify-center gap-3 mb-10">

                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>

                            <div>
                                <h1 className="text-lg font-black tracking-tight">
                                    Horizon<span className="text-violet-600">Heights</span>
                                </h1>

                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Society Management
                                </p>
                            </div>

                        </div>

                        {/* Login card */}
                        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_25px_80px_rgba(15,23,42,0.10)] p-6 sm:p-8">

                            {/* Header */}
                            <div className="mb-7">

                                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
                                    <Lock className="w-5 h-5 text-violet-600" />
                                </div>

                                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                                    Welcome back.
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Sign in to manage your community and stay connected.
                                </p>

                            </div>

                            {/* Role selector */}
                            <div className="mb-7">

                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Continue as
                                    </p>

                                    <p className="text-[10px] text-slate-400">
                                        Demo access
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">

                                    {/* Resident */}
                                    <button
                                        type="button"
                                        onClick={() => handleRoleChange('resident')}
                                        className={`relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 transition-all duration-200 ${
                                            selectedRole === 'resident'
                                                ? 'border-violet-300 bg-violet-50 text-violet-700 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <UserCheck
                                            className={`w-5 h-5 ${
                                                selectedRole === 'resident'
                                                    ? 'text-violet-600'
                                                    : 'text-slate-400'
                                            }`}
                                        />

                                        <span className="text-[11px] font-bold">
                                            Resident
                                        </span>

                                        {selectedRole === 'resident' && (
                                            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-violet-600" />
                                        )}
                                    </button>

                                    {/* Staff */}
                                    <button
                                        type="button"
                                        onClick={() => handleRoleChange('staff')}
                                        className={`relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 transition-all duration-200 ${
                                            selectedRole === 'staff'
                                                ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Wrench
                                            className={`w-5 h-5 ${
                                                selectedRole === 'staff'
                                                    ? 'text-amber-600'
                                                    : 'text-slate-400'
                                            }`}
                                        />

                                        <span className="text-[11px] font-bold">
                                            Staff
                                        </span>

                                        {selectedRole === 'staff' && (
                                            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        )}
                                    </button>

                                    {/* Admin */}
                                    <button
                                        type="button"
                                        onClick={() => handleRoleChange('admin')}
                                        className={`relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 transition-all duration-200 ${
                                            selectedRole === 'admin'
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Shield
                                            className={`w-5 h-5 ${
                                                selectedRole === 'admin'
                                                    ? 'text-emerald-600'
                                                    : 'text-slate-400'
                                            }`}
                                        />

                                        <span className="text-[11px] font-bold">
                                            Admin
                                        </span>

                                        {selectedRole === 'admin' && (
                                            <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Email */}
                                <Input
                                    label="Email / Phone Number"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    icon={<Mail className="w-4 h-4" />}
                                    required
                                />

                                {/* Password */}
                                <div className="relative">

                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        icon={<Lock className="w-4 h-4" />}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 bottom-2.5 p-2 text-slate-400 hover:text-slate-700 transition-colors"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>

                                </div>

                                {/* Options */}
                                <div className="flex items-center justify-between">

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(e.target.checked)
                                            }
                                            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                        />

                                        <span className="text-xs font-medium text-slate-500">
                                            Remember me
                                        </span>

                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onNavigate('/forgot-password')
                                        }
                                        className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Signing you in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                            </form>

                            {/* Security message */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                                <Shield className="w-3.5 h-3.5" />
                                Secure community access
                            </div>

                        </div>

                        {/* Demo login */}
                        <div className="mt-5 text-center">

                            <p className="text-[10px] font-medium text-slate-400 mb-2">
                                Quick demo access
                            </p>

                            <div className="flex justify-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickDemoLogin('resident')
                                    }
                                    className="text-[10px] font-semibold text-slate-400 hover:text-violet-600 transition-colors"
                                >
                                    Resident
                                </button>

                                <span className="text-slate-300">•</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickDemoLogin('staff')
                                    }
                                    className="text-[10px] font-semibold text-slate-400 hover:text-amber-600 transition-colors"
                                >
                                    Staff
                                </button>

                                <span className="text-slate-300">•</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleQuickDemoLogin('admin')
                                    }
                                    className="text-[10px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    Admin
                                </button>

                            </div>

                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};
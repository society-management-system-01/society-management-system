import React, { useState } from 'react';
import { Input } from '../../components/common/FormFields';
import {
    Building2,
    Lock,
    ArrowLeft,
    CheckCircle2,
} from 'lucide-react';

export const ResetPasswordPage: React.FC<{
    onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [completed, setCompleted] = useState(false);

    // Password must:
    // - Contain only letters and numbers
    // - Have at least 6 characters
    const isValidPassword = (password: string) => {
        return /^[A-Za-z0-9]{6,}$/.test(password);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidPassword(password)) {
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        setCompleted(true);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#061525] via-[#0B2745] to-[#123B5D] text-slate-100 p-4">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#174A78]/30 blur-[130px]" />

                <div className="absolute top-[15%] -right-40 w-[500px] h-[500px] rounded-full bg-[#25618F]/20 blur-[140px]" />

                <div className="absolute -bottom-48 left-[35%] w-[550px] h-[550px] rounded-full bg-[#0E7490]/10 blur-[150px]" />

                <div className="absolute top-[18%] left-[18%] w-2 h-2 rounded-full bg-white/25 blur-sm" />

                <div className="absolute top-[30%] right-[22%] w-2 h-2 rounded-full bg-blue-200/30 blur-sm" />

                <div className="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full bg-blue-300/30 blur-sm" />

            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md px-7 py-7 sm:px-8 sm:py-8 rounded-[28px] bg-[#0A2035]/75 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40">

                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.05] via-transparent to-[#1D4F7A]/[0.08] pointer-events-none" />

                <div className="relative z-10">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#16466D] to-[#0E3150] flex items-center justify-center shadow-lg shadow-black/25 border border-white/10">

                            <Building2
                                className="w-[21px] h-[21px] text-white"
                                strokeWidth={1.8}
                            />

                        </div>

                        <div className="leading-tight">

                            <h1 className="text-[17px] font-extrabold tracking-tight text-white">
                                Horizon
                                <span className="text-blue-200">
                                    Heights
                                </span>
                            </h1>

                            <p className="mt-1 text-[9px] text-blue-200/50 font-bold uppercase tracking-[0.14em]">
                                Set New Password
                            </p>

                        </div>

                    </div>

                    {/* Success State */}
                    {completed ? (

                        <div className="p-6 text-center space-y-4 bg-emerald-500/[0.08] border border-emerald-300/15 rounded-2xl backdrop-blur-xl">

                            <CheckCircle2
                                className="w-11 h-11 text-emerald-400 mx-auto"
                                strokeWidth={1.8}
                            />

                            <h3 className="text-base font-bold text-white">
                                Password Updated!
                            </h3>

                            <p className="text-xs leading-5 text-slate-300">
                                Your society account password has been
                                updated successfully.
                            </p>

                            <button
                                onClick={() => onNavigate('/login')}
                                className="mt-2 px-4 py-3 w-full text-xs font-bold text-white bg-gradient-to-r from-[#123F63] to-[#18557F] hover:from-[#18557F] hover:to-[#1D638F] rounded-xl transition-all shadow-lg shadow-black/25"
                            >
                                Proceed to Login
                            </button>

                        </div>

                    ) : (

                        /* Reset Password Form */
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Heading */}
                            <div className="space-y-1.5">

                                <h2 className="text-[22px] font-bold tracking-tight text-white">
                                    Reset your password
                                </h2>

                                <p className="text-xs leading-5 text-blue-100/55">
                                    Create a new password for your society
                                    account.
                                </p>

                            </div>

                            {/* New Password */}
                            <div className="pt-1">

                                <Input
                                    label="New Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your new password"
                                    icon={<Lock className="w-4 h-4" />}
                                    error={
                                        password.length > 0 &&
                                        !isValidPassword(password)
                                            ? 'Password must be at least 6 characters and contain only letters and numbers'
                                            : undefined
                                    }
                                    required
                                />

                            </div>

                            {/* Password Requirement */}
                            <div className="px-1 -mt-2">

                                <p
                                    className={`text-[10px] ${
                                        password.length > 0 &&
                                        !isValidPassword(password)
                                            ? 'text-rose-300'
                                            : 'text-blue-200/50'
                                    }`}
                                >
                                    Password must contain at least 6
                                    characters using only letters and numbers.
                                </p>

                            </div>

                            {/* Confirm Password */}
                            <div>

                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Re-enter your password"
                                    icon={<Lock className="w-4 h-4" />}
                                    error={
                                        password &&
                                        confirmPassword &&
                                        password !== confirmPassword
                                            ? 'Passwords do not match'
                                            : undefined
                                    }
                                    required
                                />

                            </div>

                            {/* Update Password Button */}
                            <button
                                type="submit"
                                disabled={
                                    !isValidPassword(password) ||
                                    password !== confirmPassword
                                }
                                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#123F63] to-[#18557F] hover:from-[#18557F] hover:to-[#1D638F] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-black/25 transition-all duration-200"
                            >
                                Update Password
                            </button>

                        </form>

                    )}

                    {/* Back to Login */}
                    <div className="mt-7 pt-1">

                        <button
                            onClick={() => onNavigate('/login')}
                            className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-blue-200/55 hover:text-white transition-colors"
                        >

                            <ArrowLeft
                                className="w-4 h-4"
                                strokeWidth={1.8}
                            />

                            Back to Login

                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};
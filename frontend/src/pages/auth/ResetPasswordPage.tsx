import React, { useState } from 'react';
import { Input } from '../../components/common/FormFields';
import { Building2, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmPassword && password.length >= 6) {
            setCompleted(true);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-fuchsia-950 text-slate-100 p-4">

            {/* Background blur / glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Violet glow */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/35 blur-[130px]" />

                {/* Pink glow */}
                <div className="absolute top-[15%] -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-600/25 blur-[140px]" />

                {/* Indigo glow */}
                <div className="absolute -bottom-48 left-[35%] w-[550px] h-[550px] rounded-full bg-indigo-500/25 blur-[150px]" />

                {/* Small lights */}
                <div className="absolute top-[18%] left-[18%] w-2 h-2 rounded-full bg-white/30 blur-sm" />
                <div className="absolute top-[30%] right-[22%] w-2 h-2 rounded-full bg-fuchsia-300/40 blur-sm" />
                <div className="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full bg-violet-300/40 blur-sm" />

            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md px-7 py-7 sm:px-8 sm:py-8 rounded-[28px] bg-white/[0.08] backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/30">

                {/* Subtle card glow */}
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/[0.06] via-transparent to-fuchsia-500/[0.05] pointer-events-none" />

                <div className="relative z-10">

                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25 border border-white/15">
                            <Building2
                                className="w-[21px] h-[21px] text-white"
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="leading-tight">
                            <h1 className="text-[17px] font-extrabold tracking-tight text-white">
                                HorizonHeights
                            </h1>

                            <p className="mt-1 text-[9px] text-violet-200/60 font-bold uppercase tracking-[0.14em]">
                                Set New Password
                            </p>
                        </div>

                    </div>

                    {/* Content */}
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
                                Your society account password has been updated successfully.
                            </p>

                            <button
                                onClick={() => onNavigate('/login')}
                                className="mt-2 px-4 py-3 w-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-400 rounded-xl transition-all shadow-lg shadow-violet-500/20"
                            >
                                Proceed to Login
                            </button>

                        </div>

                    ) : (

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Heading */}
                            <div className="space-y-1.5">

                                <h2 className="text-[22px] font-bold tracking-tight text-white">
                                    Reset your password
                                </h2>

                                <p className="text-xs leading-5 text-violet-100/60">
                                    Enter your new password below. Must be at least 6 characters long.
                                </p>

                            </div>

                            {/* New Password */}
                            <div className="pt-1">

                                <Input
                                    label="New Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={<Lock className="w-4 h-4" />}
                                    required
                                />

                            </div>

                            {/* Confirm Password */}
                            <div>

                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
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

                            {/* Update Button */}
                            <button
                                type="submit"
                                disabled={!password || password !== confirmPassword}
                                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 transition-all duration-200"
                            >
                                Update Password
                            </button>

                        </form>

                    )}

                    {/* Back to Login */}
                    <div className="mt-7 pt-1">

                        <button
                            onClick={() => onNavigate('/login')}
                            className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-violet-200/60 hover:text-white transition-colors"
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
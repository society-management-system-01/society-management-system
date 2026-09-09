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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4">
            <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white">HorizonHeights</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Set New Password</p>
                    </div>
                </div>

                {completed ? (
                    <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-800 rounded-2xl">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h3 className="text-base font-bold text-white">Password Updated!</h3>
                        <p className="text-xs text-slate-300">
                            Your society account password has been updated successfully.
                        </p>
                        <button
                            onClick={() => onNavigate('/login')}
                            className="mt-4 px-4 py-2.5 w-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors"
                        >
                            Proceed to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">Reset your password</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Enter your new password below. Must be at least 6 characters long.
                            </p>
                        </div>

                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={<Lock className="w-4 h-4" />}
                            error={password && confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                            required
                        />

                        <button
                            type="submit"
                            disabled={!password || password !== confirmPassword}
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20 transition-all"
                        >
                            Update Password
                        </button>
                    </form>
                )}

                <button
                    onClick={() => onNavigate('/login')}
                    className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
            </div>
        </div>
    );
};

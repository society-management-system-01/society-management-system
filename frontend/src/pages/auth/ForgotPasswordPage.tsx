import React, { useState } from 'react';
import { Input } from '../../components/common/FormFields';
import { Building2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reset Account Password</p>
                    </div>
                </div>

                {submitted ? (
                    <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-800 rounded-2xl">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h3 className="text-base font-bold text-white">Verification Link Sent</h3>
                        <p className="text-xs text-slate-300">
                            We have dispatched password recovery instructions to <strong className="text-white">{email}</strong>.
                        </p>
                        <button
                            onClick={() => onNavigate('/reset-password')}
                            className="mt-4 px-4 py-2.5 w-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors"
                        >
                            Simulate Opening Reset Link
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">Forgot password?</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Enter your registered society email or phone number to receive a secure recovery code.
                            </p>
                        </div>

                        <Input
                            label="Email Address / Mobile"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. resident@horizon.com"
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all"
                        >
                            Send Recovery Instructions
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

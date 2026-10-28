import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings, Shield, Building } from 'lucide-react';

interface UserMenuProps {
    onNavigate: (path: string) => void;
    onClose: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate, onClose }) => {
    const { currentUser, role, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onNavigate('/login');
        onClose();
    };

    return (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header Info */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/30"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-md">
                            {role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Menu Links */}
            <div className="p-2 space-y-0.5">
                <button
                    onClick={() => {
                        onNavigate(`/${role}/profile`);
                        onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                </button>

                {role === 'resident' && (
                    <div className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl my-1 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <Building className="w-3.5 h-3.5 text-brand-500" /> Flat Info
                        </div>
                        <p className="mt-0.5">{currentUser.flatNumber} ({currentUser.wing})</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

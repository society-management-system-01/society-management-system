import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { UserMenu } from './UserMenu';
import {
    Menu,
    Sun,
    Moon,
    Bell,
    Search,
    PlusCircle,
    Shield,
    UserCheck,
    Building2,
    Sparkles
} from 'lucide-react';

interface NavbarProps {
    onToggleSidebar: () => void;
    onNavigate: (path: string) => void;
    onOpenQuickAction?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate, onOpenQuickAction }) => {
    const { role, currentUser, loginAsRole } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                {/* Left Side: Mobile Menu Button & Brand Indicator */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Quick Search Launcher */}
                    <div
                        onClick={() => onNavigate('/resident/complaints')}
                        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 text-xs font-medium cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all w-64"
                    >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>Search tickets, flat numbers...</span>
                        <kbd className="ml-auto text-[10px] font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Quick Action Button */}
                    <button
                        onClick={onOpenQuickAction}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all hover:scale-102"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>{role === 'resident' ? 'Raise Issue' : role === 'staff' ? 'Add Notes' : 'New Action'}</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    </button>

                    {/* Notifications Button */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications((prev) => !prev);
                                setShowUserMenu(false);
                            }}
                            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
                        </button>
                        {showNotifications && (
                            <NotificationDropdown
                                onNavigate={onNavigate}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                    {/* User Avatar & Menu */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu((prev) => !prev);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/30"
                            />
                            <span className="hidden lg:inline-block text-xs font-bold text-slate-800 dark:text-slate-200">
                                {currentUser.name.split(' ')[0]}
                            </span>
                        </button>
                        {showUserMenu && <UserMenu onNavigate={onNavigate} onClose={() => setShowUserMenu(false)} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

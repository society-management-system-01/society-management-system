import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    AlertCircle,
    CalendarDays,
    CreditCard,
    User,
    Wrench,
    Boxes,
    Users
} from 'lucide-react';

interface MobileNavProps {
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate }) => {
    const { role } = useAuth();

    const getMobileItems = () => {
        switch (role) {
            case 'resident':
                return [
                    { label: 'Home', path: '/resident/dashboard', icon: LayoutDashboard },
                    { label: 'Tickets', path: '/resident/complaints', icon: AlertCircle },
                    { label: 'Bookings', path: '/resident/amenities', icon: CalendarDays },
                    { label: 'Bills', path: '/resident/bills', icon: CreditCard },
                    { label: 'Profile', path: '/resident/profile', icon: User }
                ];

            case 'staff':
                return [
                    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
                    { label: 'My Tasks', path: '/staff/tasks', icon: Wrench },
                    { label: 'Materials', path: '/staff/materials', icon: Boxes },
                    { label: 'Profile', path: '/staff/profile', icon: User }
                ];

            case 'admin':
                return [
                    { label: 'Console', path: '/admin/dashboard', icon: LayoutDashboard },
                    { label: 'Residents', path: '/admin/residents', icon: Users },
                    { label: 'Complaints', path: '/admin/complaints', icon: AlertCircle },
                    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
                    { label: 'Settings', path: '/admin/settings', icon: User }
                ];
        }
    };

    const items = getMobileItems();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden px-2 py-1.5 shadow-lg">
            <div className="flex items-center justify-around">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);

                    return (
                        <button
                            key={item.path}
                            onClick={() => onNavigate(item.path)}
                            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive
                                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-[10px] tracking-tight">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

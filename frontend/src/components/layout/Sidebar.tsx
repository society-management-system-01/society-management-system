import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    AlertCircle,
    CalendarDays,
    CreditCard,
    UserCheck,
    Package,
    Megaphone,
    User,
    Wrench,
    PackageCheck,
    Boxes,
    Users,
    Building2,
    FileSpreadsheet,
    Bell,
    Settings,
    ShieldAlert,
    Sparkles
} from 'lucide-react';

interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    isOpen: boolean;
    onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentPath,
    onNavigate,
    isOpen,
    onCloseMobile
}) => {
    const { role, currentUser, loginAsRole } = useAuth();

    // Navigation Items per Role
    const getNavItems = () => {
        switch (role) {
            case 'resident':
                return [
                    { label: 'Dashboard', path: '/resident/dashboard', icon: LayoutDashboard },
                    { label: 'Complaints', path: '/resident/complaints', icon: AlertCircle, badge: '2' },
                    { label: 'Amenity Bookings', path: '/resident/amenities', icon: CalendarDays },
                    { label: 'Bills & Payments', path: '/resident/bills', icon: CreditCard, badge: '1' },
                    { label: 'Visitor Passes', path: '/resident/visitors', icon: UserCheck },
                    { label: 'Deliveries', path: '/resident/deliveries', icon: Package, badge: '1' },
                    { label: 'Announcements', path: '/resident/announcements', icon: Megaphone },
                    { label: 'My Profile', path: '/resident/profile', icon: User }
                ];

            case 'staff':
                return [
                    { label: 'Staff Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
                    { label: 'Assigned Tasks', path: '/staff/tasks', icon: Wrench, badge: '2' },
                    { label: 'Material Usage', path: '/staff/materials', icon: PackageCheck },
                    { label: 'Material Requests', path: '/staff/requests', icon: Boxes },
                    { label: 'My Profile', path: '/staff/profile', icon: User }
                ];

            case 'admin':
                return [
                    { label: 'Admin Console', path: '/admin/dashboard', icon: LayoutDashboard },
                    { label: 'Resident Directory', path: '/admin/residents', icon: Users },
                    { label: 'All Complaints', path: '/admin/complaints', icon: AlertCircle, badge: '4' },
                    { label: 'Staff & Tasks', path: '/admin/staff', icon: Wrench },
                    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes, badge: 'Alert' },
                    { label: 'Facilities Control', path: '/admin/facilities', icon: Building2 },
                    { label: 'Bills & Dues', path: '/admin/bills', icon: FileSpreadsheet },
                    { label: 'Visitor & Gate Log', path: '/admin/visitors', icon: UserCheck },
                    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
                    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
                    { label: 'Society Settings', path: '/admin/settings', icon: Settings }
                ];
        }
    };

    const navItems = getNavItems();

    const handleItemClick = (path: string) => {
        onNavigate(path);
        onCloseMobile();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } border-r border-slate-800 shadow-2xl md:shadow-none`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                            Horizon<span className="text-brand-400">Heights</span>
                        </h1>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                            Society System
                        </p>
                    </div>
                </div>

                {/* User Role Quick Switcher Widget */}
                <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Demo Role Switcher</span>
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-lg">
                        {(['resident', 'staff', 'admin'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => {
                                    loginAsRole(r);
                                    onNavigate(`/${r}/dashboard`);
                                }}
                                className={`py-1 text-[11px] font-semibold capitalize rounded-md transition-all ${role === r
                                        ? 'bg-brand-600 text-white shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);

                        return (
                            <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badge === 'Alert'
                                                ? 'bg-rose-500 text-white animate-pulse'
                                                : isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-800 text-brand-400 border border-slate-700'
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Active User Footer Card */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/90">
                    <div className="flex items-center gap-3">
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-slate-400 truncate capitalize">
                                {role === 'resident' ? currentUser.flatNumber : currentUser.designation || role}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

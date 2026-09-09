import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { NotificationItem } from '../../types';
import { Bell, Check, ExternalLink, Inbox } from 'lucide-react';

interface NotificationDropdownProps {
    onNavigate: (path: string) => void;
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigate, onClose }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApi.getNotifications().then((res) => {
            setNotifications(res);
            setLoading(false);
        });
    }, []);

    const handleMarkAllRead = async () => {
        await mockApi.markAllNotificationsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleItemClick = async (n: NotificationItem) => {
        await mockApi.markNotificationRead(n.id);
        if (n.linkRoute) {
            onNavigate(n.linkRoute);
        }
        onClose();
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-500 text-white rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                        <Check className="w-3 h-3" /> Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                    <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                        <Inbox className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs font-semibold">No notifications</p>
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${!item.isRead ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
                                }`}
                        >
                            <div
                                className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!item.isRead ? 'bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-900/50' : 'bg-transparent'
                                    }`}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                                    <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                                    {item.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

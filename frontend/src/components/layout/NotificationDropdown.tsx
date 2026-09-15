import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { NotificationItem } from '../../types';
import { Check, Inbox } from 'lucide-react';

interface NotificationDropdownProps {
    onNavigate: (path: string) => void;
    onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    onNavigate,
    onClose,
}) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const res = await mockApi.getNotifications();
                setNotifications(res);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAllRead = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (unreadCount === 0 || markingAllRead) {
            return;
        }

        setMarkingAllRead(true);

        try {
            await mockApi.markAllNotificationsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } finally {
            setMarkingAllRead(false);
        }
    };

    const handleItemClick = async (notification: NotificationItem) => {
        if (!notification.isRead) {
            await mockApi.markNotificationRead(notification.id);

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? { ...item, isRead: true }
                        : item
                )
            );
        }

        if (notification.linkRoute) {
            onNavigate(notification.linkRoute);
        }

        onClose();
    };

    return (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Notifications
                    </h4>

                    {!loading && unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-500 text-white rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>

                {/* Mark all as read */}
                {!loading && unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        disabled={markingAllRead}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-3.5 h-3.5" />

                        {markingAllRead ? 'Marking...' : 'Mark all as read'}
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">

                {/* Loading */}
                {loading ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                        Loading notifications...
                    </div>

                ) : notifications.length === 0 ? (
                    /* Empty */
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                        <Inbox className="w-8 h-8 mb-2 opacity-50" />

                        <p className="text-xs font-semibold">
                            No notifications
                        </p>

                        <p className="text-[11px] mt-1">
                            You're all caught up.
                        </p>
                    </div>

                ) : (
                    /* Notifications */
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                !item.isRead
                                    ? 'bg-brand-50/30 dark:bg-brand-950/20'
                                    : ''
                            }`}
                        >
                            {/* Unread indicator */}
                            <div
                                className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                    !item.isRead
                                        ? 'bg-brand-500'
                                        : 'bg-transparent'
                                }`}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                        {item.title}
                                    </p>

                                    <span className="text-[10px] text-slate-400 shrink-0">
                                        {item.timestamp}
                                    </span>
                                </div>

                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
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
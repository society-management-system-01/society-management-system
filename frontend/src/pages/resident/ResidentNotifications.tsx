import React, { useEffect, useMemo, useState } from 'react';
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    CreditCard,
    UserCheck,
    Package,
    Megaphone,
    Clock,
    Check,
    Settings
} from 'lucide-react';

import { mockApi } from '../../services/mockApi';
import { NotificationItem } from '../../types';

interface ResidentNotificationsProps {
    onNavigate: (path: string) => void;
}

export const ResidentNotifications: React.FC<ResidentNotificationsProps> = ({
    onNavigate
}) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);

    // Load notifications from the existing mock API
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const data = await mockApi.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to load notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const visibleNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(
                (notification) => !notification.isRead
            );
        }

        return notifications;
    }, [notifications, filter]);

    // Mark one notification as read
    const markAsRead = async (id: string) => {
        try {
            await mockApi.markNotificationRead(id);

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    // Mark every notification as read
    const markAllAsRead = async () => {
        try {
            await mockApi.markAllNotificationsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const getNotificationIcon = (category: string) => {
        switch (category) {
            case 'complaint':
                return AlertCircle;

            case 'bill':
                return CreditCard;

            case 'visitor':
                return UserCheck;

            case 'delivery':
                return Package;

            case 'announcement':
                return Megaphone;

            case 'amenity':
            case 'booking':
                return CalendarDays;

            case 'system':
                return Settings;

            default:
                return Bell;
        }
    };

    const getIconStyle = (category: string) => {
        switch (category) {
            case 'complaint':
                return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400';

            case 'bill':
                return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';

            case 'visitor':
                return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';

            case 'delivery':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';

            case 'announcement':
                return 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400';

            case 'amenity':
            case 'booking':
                return 'bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400';

            case 'system':
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';

            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <div className="space-y-6 pb-8">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </div>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Your updates
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Stay up to date with activity related to your flat and society.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                    >
                        <Check className="h-4 w-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total notifications
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                {notifications.length}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <Bell className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Unread
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                {unreadCount}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <Bell className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Last update
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {notifications.length > 0
                                    ? notifications[0].timestamp
                                    : 'No updates'}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">

                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                        filter === 'all'
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    All
                </button>

                <button
                    type="button"
                    onClick={() => setFilter('unread')}
                    className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                        filter === 'unread'
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    Unread

                    {unreadCount > 0 && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                            {unreadCount}
                        </span>
                    )}
                </button>

            </div>

            {/* Notification List */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                {loading ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <Bell className="h-6 w-6 animate-pulse" />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                            Loading notifications...
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Please wait while we load your latest updates.
                        </p>
                    </div>

                ) : visibleNotifications.length === 0 ? (

                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                            {filter === 'unread'
                                ? "You're all caught up"
                                : 'No notifications yet'}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {filter === 'unread'
                                ? 'There are no unread notifications.'
                                : 'New society activity will appear here.'}
                        </p>
                    </div>

                ) : (

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">

                        {visibleNotifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.category);

                            return (
                                <div
                                    key={notification.id}
                                    className={`flex gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                        !notification.isRead
                                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10'
                                            : ''
                                    }`}
                                >

                                    {/* Icon */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getIconStyle(
                                            notification.category
                                        )}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                                            <div>
                                                <div className="flex items-center gap-2">

                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {notification.title}
                                                    </h3>

                                                    {!notification.isRead && (
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    )}

                                                </div>

                                                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-xs text-slate-400">
                                                {notification.timestamp}
                                            </span>

                                        </div>

                                        {/* Actions */}
                                        {notification.linkRoute && (
                                            <div className="mt-3 flex flex-wrap items-center gap-3">

                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        await markAsRead(notification.id);
                                                        onNavigate(notification.linkRoute!);
                                                    }}
                                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                                >
                                                    View details →
                                                </button>

                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markAsRead(notification.id)
                                                        }
                                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}

                                            </div>
                                        )}

                                        {!notification.linkRoute &&
                                            !notification.isRead && (
                                                <div className="mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markAsRead(notification.id)
                                                        }
                                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                                    >
                                                        Mark as read
                                                    </button>
                                                </div>
                                            )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
};
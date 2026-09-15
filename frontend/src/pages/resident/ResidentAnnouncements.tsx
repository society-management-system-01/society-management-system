import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Announcement } from '../../types';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import {
    Megaphone,
    Pin,
    CalendarDays,
    Search,
    ArrowUpRight,
    AlertTriangle,
    Wrench,
    PartyPopper,
    Info,
    Users,
    Building2,
    Sparkles,
    BellRing,
} from 'lucide-react';

export const ResidentAnnouncements: React.FC<{
    onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        mockApi.getAnnouncements().then((res) => {
            setAnnouncements(res);
            setLoading(false);
        });
    }, []);

    const filtered = announcements.filter((a) => {
        const matchSearch =
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase());

        const matchCat =
            selectedCategory === 'all' ||
            a.category === selectedCategory;

        return matchSearch && matchCat;
    });

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'emergency':
                return AlertTriangle;

            case 'maintenance':
                return Wrench;

            case 'event':
                return PartyPopper;

            default:
                return Info;
        }
    };

    const getCategoryStyle = (category: string) => {
        switch (category.toLowerCase()) {
            case 'emergency':
                return {
                    badge:
                        'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
                    icon:
                        'bg-rose-500/10 text-rose-500',
                };

            case 'maintenance':
                return {
                    badge:
                        'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    icon:
                        'bg-amber-500/10 text-amber-500',
                };

            case 'event':
                return {
                    badge:
                        'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
                    icon:
                        'bg-violet-500/10 text-violet-500',
                };

            default:
                return {
                    badge:
                        'bg-brand-500/10 text-brand-600 border-brand-500/20 dark:text-brand-400',
                    icon:
                        'bg-brand-500/10 text-brand-500',
                };
        }
    };

    return (
        <div className="min-h-full space-y-7 pb-10">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-7">

                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="max-w-2xl">

                        {/* Label */}
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            <BellRing className="h-3.5 w-3.5" />
                            Society Updates
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            Society Circulars &
                            <span className="text-brand-500"> Announcements</span>
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Stay informed about community events, maintenance schedules,
                            important notices, and emergency updates from the society.
                        </p>

                        {/* Quick information */}
                        <div className="mt-5 flex flex-wrap gap-3">

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <Megaphone className="h-4 w-4 text-brand-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    {announcements.length} Notices
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <Building2 className="h-4 w-4 text-sky-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Official Society Updates
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                                <Sparkles className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Stay Updated
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Header icon */}
                    <div className="hidden lg:flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-brand-500/20 bg-brand-500/10">
                        <Megaphone className="h-10 w-10 text-brand-500" />
                    </div>

                </div>
            </section>


            {/* =========================================================
                FILTER TOOLBAR
            ========================================================= */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    {/* Search */}
                    <div className="relative w-full xl:max-w-md">

                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search announcements, notices..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                    </div>


                    {/* Category filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">

                        {['all', 'General', 'Maintenance', 'Event', 'Emergency'].map(
                            (cat) => {

                                const CategoryIcon =
                                    cat === 'all'
                                        ? Megaphone
                                        : getCategoryIcon(cat);

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold capitalize transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <CategoryIcon className="h-3.5 w-3.5" />
                                        {cat}
                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* Result count */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">

                    <p className="text-[10px] font-semibold text-slate-400">
                        Showing{' '}
                        <span className="font-black text-slate-600 dark:text-slate-300">
                            {filtered.length}
                        </span>{' '}
                        {filtered.length === 1 ? 'announcement' : 'announcements'}
                    </p>

                    {(search || selectedCategory !== 'all') && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('all');
                            }}
                            className="text-[10px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                        >
                            Clear filters
                        </button>
                    )}

                </div>

            </section>


            {/* =========================================================
                ANNOUNCEMENTS
            ========================================================= */}
            {loading ? (

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>

            ) : filtered.length === 0 ? (

                <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <EmptyState
                        title="No announcements found"
                        description="Try clearing your search or category filters."
                    />
                </div>

            ) : (

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                    {filtered.map((item) => {

                        const CategoryIcon =
                            getCategoryIcon(item.category);

                        const categoryStyle =
                            getCategoryStyle(item.category);

                        return (
                            <article
                                key={item.id}
                                className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 ${
                                    item.isPinned
                                        ? 'border-brand-500/40 ring-1 ring-brand-500/10'
                                        : 'border-slate-200 dark:border-slate-800'
                                }`}
                            >

                                {/* Pinned accent */}
                                {item.isPinned && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-brand-500" />
                                )}


                                {/* Top section */}
                                <div className="p-5 sm:p-6">

                                    <div className="flex items-start justify-between gap-4">

                                        {/* Category */}
                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${categoryStyle.icon}`}
                                            >
                                                <CategoryIcon className="h-5 w-5" />
                                            </div>

                                            <div>

                                                <div
                                                    className={`inline-flex items-center rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${categoryStyle.badge}`}
                                                >
                                                    {item.category}
                                                </div>

                                                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                                                    <CalendarDays className="h-3 w-3" />

                                                    {new Date(
                                                        item.publishedAt
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </div>

                                            </div>

                                        </div>


                                        {/* Pin */}
                                        {item.isPinned && (
                                            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                                                <Pin className="h-3 w-3 fill-current" />
                                                Pinned
                                            </div>
                                        )}

                                    </div>


                                    {/* Title */}
                                    <h2 className="mt-5 text-lg font-black leading-snug tracking-tight text-slate-950 dark:text-white">
                                        {item.title}
                                    </h2>


                                    {/* Content */}
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {item.content}
                                    </p>

                                </div>


                                {/* Bottom metadata */}
                                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:px-6">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex flex-wrap gap-4">

                                            {/* Issuer */}
                                            <div className="flex items-center gap-2">

                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
                                                    <Users className="h-3.5 w-3.5 text-slate-500" />
                                                </div>

                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                                        Issued by
                                                    </p>

                                                    <p className="mt-0.5 max-w-[130px] truncate text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                        {item.authorName}
                                                    </p>
                                                </div>

                                            </div>


                                            {/* Audience */}
                                            <div className="flex items-center gap-2">

                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
                                                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                                                </div>

                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                                        Audience
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">
                                                        {item.targetAudience}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>


                                        {/* Arrow */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-all group-hover:bg-brand-500 group-hover:text-white dark:bg-slate-800">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </div>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Announcement } from '../../types';
import { Card } from '../../components/common/Cards';
import { EmptyState, CardSkeleton } from '../../components/common/FeedbackStates';
import { Megaphone, Pin, Calendar, Tag, Search } from 'lucide-react';

export const ResidentAnnouncements: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
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
        const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Society Circulars & Announcements
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Official notices, festival events, emergency water shutdown alerts, and AGM circulars.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search circulars..."
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {['all', 'General', 'Maintenance', 'Event', 'Emergency'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-brand-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="No announcements found" description="Try clearing your search filters." />
            ) : (
                <div className="space-y-4">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-card transition-all space-y-3 relative overflow-hidden ${item.isPinned
                                    ? 'border-brand-500/60 ring-2 ring-brand-500/10'
                                    : 'border-slate-200/80 dark:border-slate-800'
                                }`}
                        >
                            {item.isPinned && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-brand-200 dark:border-slate-700">
                                    <Pin className="w-3 h-3 fill-current" /> Pinned Notice
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-md">
                                    {item.category}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                {item.title}
                            </h3>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {item.content}
                            </p>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Issued by: {item.authorName}</span>
                                <span>Audience: {item.targetAudience.toUpperCase()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

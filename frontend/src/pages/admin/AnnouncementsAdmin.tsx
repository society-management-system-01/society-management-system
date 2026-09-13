import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Announcement } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input, Select, Textarea } from '../../components/common/FormFields';
import { Megaphone, Plus, Pin, Trash2 } from 'lucide-react';

export const AnnouncementsAdmin: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Notice Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<'General' | 'Maintenance' | 'Event' | 'Emergency'>('General');
    const [targetAudience, setTargetAudience] = useState<'all' | 'residents' | 'staff'>('all');
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    async function loadAnnouncements() {
        setLoading(true);
        const data = await mockApi.getAnnouncements();
        setAnnouncements(data);
        setLoading(false);
    }

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        await mockApi.createAnnouncement({
            title,
            content,
            category,
            authorName: 'Managing Committee',
            publishedAt: new Date().toISOString(),
            isPinned,
            targetAudience
        });

        toast.success('Notice Published', 'Broadcasted circular to target residents/staff.');
        setIsModalOpen(false);
        resetForm();
        loadAnnouncements();
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsPinned(false);
    };

    const handleDelete = async (id: string) => {
        const updated = await mockApi.deleteAnnouncement(id);
        if (updated) {
            toast.info('Notice Deleted', 'Removed from resident circular feed.');
            loadAnnouncements();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Society Circulars & Broadcast Announcements
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Publish official notices, emergency water shutdown alerts, and event updates to residents.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Issue New Circular
                </button>
            </div>

            <DataTable
                columns={[
                    {
                        header: 'Notice Title',
                        accessorKey: 'title',
                        cell: (item: Announcement) => (
                            <div className="flex items-center gap-2">
                                {item.isPinned && <Pin className="w-3.5 h-3.5 text-brand-500 shrink-0 fill-current" />}
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.content}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: 'Category',
                        accessorKey: 'category',
                        cell: (item: Announcement) => (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                {item.category}
                            </span>
                        )
                    },
                    {
                        header: 'Audience',
                        accessorKey: 'targetAudience',
                        cell: (item: Announcement) => <span className="font-mono text-xs uppercase">{item.targetAudience}</span>
                    },
                    {
                        header: 'Published Date',
                        accessorKey: 'publishedAt',
                        cell: (item: Announcement) => new Date(item.publishedAt).toLocaleDateString()
                    },
                    {
                        header: 'Actions',
                        accessorKey: 'id',
                        cell: (item: Announcement) => (
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )
                    }
                ]}
                data={announcements}
                keyExtractor={(item) => item.id}
            />

            {/* CREATE ANNOUNCEMENT MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Issue Society Circular"
                subtitle="Broadcast announcement to society portal"
            >
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <Input
                        label="Notice Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Mandatory Annual General Meeting (AGM) Notice"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            options={[
                                { label: 'General Notice', value: 'General' },
                                { label: 'Maintenance Shutdown', value: 'Maintenance' },
                                { label: 'Society Event', value: 'Event' },
                                { label: 'Emergency Alert', value: 'Emergency' }
                            ]}
                        />
                        <Select
                            label="Target Audience"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value as any)}
                            options={[
                                { label: 'All Users', value: 'all' },
                                { label: 'Residents Only', value: 'residents' },
                                { label: 'Staff Only', value: 'staff' }
                            ]}
                        />
                    </div>

                    <Textarea
                        label="Circular Body Text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type complete details of the notice..."
                        required
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="pinNotice"
                            checked={isPinned}
                            onChange={(e) => setIsPinned(e.target.checked)}
                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                        />
                        <label htmlFor="pinNotice" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                            Pin to Top of Resident Dashboard Feed
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                        >
                            Publish Notice
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

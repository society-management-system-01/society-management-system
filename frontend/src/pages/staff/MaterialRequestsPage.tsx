import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { MaterialRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input, Select, Textarea } from '../../components/common/FormFields';
import { DataTable } from '../../components/common/DataTable';
import { Boxes, Plus, PackageCheck } from 'lucide-react';

export const MaterialRequestsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [requests, setRequests] = useState<MaterialRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // New Request Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(5);
    const [unit, setUnit] = useState('Pcs');
    const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
    const [reason, setReason] = useState('');

    useEffect(() => {
        loadRequests();
    }, [currentUser]);

    async function loadRequests() {
        setLoading(true);
        const data = await mockApi.getMaterialRequests();
        setRequests(data.filter((r) => r.requestedBy === currentUser.name));
        setLoading(false);
    }

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim()) return;

        await mockApi.createMaterialRequest({
            itemName,
            quantity,
            unit,
            requestedBy: currentUser.name,
            urgency,
            reason,
            status: 'pending'
        });

        toast.success('Requisition Submitted', 'Sent to society store manager for approval.');
        setIsModalOpen(false);
        setItemName('');
        setReason('');
        loadRequests();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Material Requisitions
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Request stock inventory items (cables, pipes, fittings) from store admin.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Request Material
                </button>
            </div>

            <DataTable
                columns={[
                    {
                        header: 'Item Required',
                        accessorKey: 'itemName',
                        cell: (item: MaterialRequest) => (
                            <div className="flex items-center gap-2">
                                <Boxes className="w-4 h-4 text-amber-500" />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{item.itemName}</p>
                                    <p className="text-[10px] text-slate-400">{item.reason}</p>
                                </div>
                            </div>
                        )
                    },
                    {
                        header: 'Quantity',
                        accessorKey: 'quantity',
                        cell: (item: MaterialRequest) => <span className="font-bold">{item.quantity} {item.unit}</span>
                    },
                    {
                        header: 'Urgency',
                        accessorKey: 'urgency',
                        cell: (item: MaterialRequest) => <StatusBadge type="priority" value={(item.urgency || item.priority || 'medium') as any} size="sm" />
                    },
                    {
                        header: 'Date Requested',
                        accessorKey: 'requestedAt'
                    },
                    {
                        header: 'Approval Status',
                        accessorKey: 'status',
                        cell: (item: MaterialRequest) => <StatusBadge value={item.status} size="sm" />
                    }
                ]}
                data={requests}
                keyExtractor={(item) => item.id}
            />

            {/* CREATE REQUISITION MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Material Requisition Form"
                subtitle="Submit request to inventory admin"
            >
                <form onSubmit={handleCreateRequest} className="space-y-4">
                    <Input
                        label="Item Description / Material Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="e.g. 1/2 Inch PVC Pipe Elbow Joint"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={1}
                            required
                        />
                        <Select
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            options={[
                                { label: 'Pcs / Units', value: 'Pcs' },
                                { label: 'Meters', value: 'Meters' },
                                { label: 'Boxes', value: 'Boxes' },
                                { label: 'Liters', value: 'Liters' }
                            ]}
                        />
                    </div>

                    <Select
                        label="Urgency"
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        options={[
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High Priority', value: 'high' }
                        ]}
                    />

                    <Textarea
                        label="Reason / Ticket Reference"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Required for ticket #CMP-1002 plumbing repair"
                        required
                    />

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
                            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition-all"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

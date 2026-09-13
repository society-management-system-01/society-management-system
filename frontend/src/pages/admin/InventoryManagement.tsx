import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { InventoryItem, MaterialRequest } from '../../types';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/FormFields';
import { StatCard } from '../../components/common/Cards';
import { Boxes, Plus, AlertTriangle, CheckCircle2, XCircle, PackageCheck } from 'lucide-react';

export const InventoryManagement: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const toast = useToast();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Item Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [quantity, setQuantity] = useState(10);
    const [unit, setUnit] = useState('Pcs');
    const [minThreshold, setMinThreshold] = useState(5);
    const [unitPrice, setUnitPrice] = useState(150);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const [inv, reqs] = await Promise.all([mockApi.getInventory(), mockApi.getMaterialRequests()]);
        setInventory(inv);
        setMaterialRequests(reqs);
        setLoading(false);
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        await mockApi.addInventoryItem({
            name,
            category,
            quantity,
            unit,
            minThreshold,
            unitPrice,
            supplier: 'Metro Hardware Distributors',
            location: 'Central Store Room B'
        });

        toast.success('Inventory Added', `${name} logged into central store.`);
        setIsAddModalOpen(false);
        loadData();
    };

    const handleApproveRequest = async (id: string, status: 'approved' | 'rejected') => {
        const updated = await mockApi.updateMaterialRequestStatus(id, status);
        if (updated) {
            toast.info('Requisition Updated', `Material request marked as ${status}.`);
            loadData();
        }
    };

    const lowStock = inventory.filter((i) => i.quantity <= i.minThreshold);
    const pendingRequests = materialRequests.filter((r) => r.status === 'pending');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Inventory & Store Room Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Track society hardware stocks, low inventory alerts, and technician material requisitions.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Inventory Item
                </button>
            </div>

            {/* Low Stock & Requisition Alert Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {lowStock.length} Items Below Minimum Threshold
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Items requiring immediate supplier reorder to avoid maintenance delays.
                        </p>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-4">
                    <Boxes className="w-8 h-8 text-brand-500 shrink-0" />
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {pendingRequests.length} Pending Material Requisitions
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Technician requests awaiting committee approval.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pending Material Requisitions Console */}
            {pendingRequests.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Technician Requisition Approval Queue
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pendingRequests.map((req) => (
                            <div
                                key={req.id}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                            >
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400">Req by: {req.requestedBy}</span>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{req.itemName}</h4>
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                        Qty: {req.quantity} {req.unit} • Reason: {req.reason}
                                    </p>
                                </div>

                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => handleApproveRequest(req.id, 'approved')}
                                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleApproveRequest(req.id, 'rejected')}
                                        className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1"
                                    >
                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock Items Table */}
            <DataTable
                columns={[
                    {
                        header: 'Item Description',
                        accessorKey: 'name',
                        cell: (item: InventoryItem) => (
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                <p className="text-[10px] text-slate-400">Loc: {item.location}</p>
                            </div>
                        )
                    },
                    {
                        header: 'Category',
                        accessorKey: 'category',
                        cell: (item: InventoryItem) => (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                {item.category}
                            </span>
                        )
                    },
                    {
                        header: 'Current Stock',
                        accessorKey: 'quantity',
                        cell: (item: InventoryItem) => (
                            <span
                                className={`font-mono text-xs font-bold ${item.quantity <= item.minThreshold ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                                    }`}
                            >
                                {item.quantity} {item.unit}
                            </span>
                        )
                    },
                    {
                        header: 'Min Threshold',
                        accessorKey: 'minThreshold',
                        cell: (item: InventoryItem) => <span className="text-xs text-slate-400">{item.minThreshold} {item.unit}</span>
                    },
                    {
                        header: 'Unit Cost',
                        accessorKey: 'unitPrice',
                        cell: (item: InventoryItem) => <span className="font-bold">₹{item.unitPrice}</span>
                    },
                    {
                        header: 'Stock Status',
                        accessorKey: 'id',
                        cell: (item: InventoryItem) =>
                            item.quantity <= item.minThreshold ? (
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                                    LOW STOCK ALERT
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                                    IN STOCK
                                </span>
                            )
                    }
                ]}
                data={inventory}
                keyExtractor={(item) => item.id}
            />

            {/* ADD ITEM MODAL */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Inventory Item"
                subtitle="Log new hardware item into central store"
            >
                <form onSubmit={handleAddItem} className="space-y-4">
                    <Input
                        label="Item Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Havells 32A Double Pole MCB"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            options={[
                                { label: 'Plumbing', value: 'Plumbing' },
                                { label: 'Electrical', value: 'Electrical' },
                                { label: 'Hardware & Tools', value: 'Hardware & Tools' },
                                { label: 'Paints & Chemicals', value: 'Paints & Chemicals' }
                            ]}
                        />

                        <Input
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={1}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            options={[
                                { label: 'Pcs', value: 'Pcs' },
                                { label: 'Meters', value: 'Meters' },
                                { label: 'Boxes', value: 'Boxes' }
                            ]}
                        />

                        <Input
                            label="Min Threshold"
                            type="number"
                            value={minThreshold}
                            onChange={(e) => setMinThreshold(Number(e.target.value))}
                            required
                        />

                        <Input
                            label="Unit Price (₹)"
                            type="number"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md transition-all"
                        >
                            Save to Inventory
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api, unwrapResponse } from "@/lib/api";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
    const { t } = useTranslation('admin');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const PAGE_SIZE = 15;

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/admin/orders", {
                params: { page, pageSize: PAGE_SIZE, status: statusFilter || undefined },
            });
            const env = unwrapResponse(res.data);
            setOrders(env.data || []);
            setTotalItems(env.totalCount || 0);
            setTotalPages(Math.max(1, Math.ceil((env.totalCount || 0) / PAGE_SIZE)));
        } catch {
            toast.error(t('orders.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [page, statusFilter]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success(t('orders.statusUpdated', { orderId, status: newStatus }));
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        } catch {
            toast.error(t('orders.updateFailed'));
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = search
        ? orders.filter((o) => `#${o.id} ${o.firstName} ${o.lastName}`.toLowerCase().includes(search.toLowerCase()))
        : orders;

    return (
        <AdminLayout>
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('orders.title')}</h2>
                    <p className="text-slate-500 text-sm">{totalItems} {t('orders.subtitle')}</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative max-w-xs flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('orders.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                        <option value="">{t('orders.allStatuses')}</option>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s.toLowerCase()}`)}</option>)}
                    </select>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.order')}</th>
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.customer')}</th>
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.total')}</th>
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.date')}</th>
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.status')}</th>
                                        <th className="px-5 py-3 text-slate-500 font-medium">{t('orders.update')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3 font-mono font-semibold text-slate-700">#{order.id}</td>
                                            <td className="px-5 py-3 text-slate-600">{order.firstName} {order.lastName}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">${(order.totalAmount || 0).toFixed(2)}</td>
                                            <td className="px-5 py-3 text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                                                    {t(`status.${order.status.toLowerCase()}`)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <select
                                                    value={order.status}
                                                    disabled={updatingId === order.id}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary disabled:opacity-50"
                                                >
                                                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s.toLowerCase()}`)}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div className="text-center py-12 text-slate-400">{t('orders.noOrders')}</div>
                            )}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">{t('orders.page')} {page} {t('orders.of')} {totalPages}</p>
                            <div className="flex gap-2">
                                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;

import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api, unwrapResponse } from "@/lib/api";
import { ChevronLeft, ChevronRight, Search, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const AdminUsers = () => {
    const { t } = useTranslation('admin');
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const PAGE_SIZE = 20;

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/admin/users", {
                params: { page, pageSize: PAGE_SIZE, search: search || undefined },
            });
            const env = unwrapResponse(res.data);
            setUsers(env.data || []);
            setTotalItems(env.totalCount || 0);
            setTotalPages(Math.max(1, Math.ceil((env.totalCount || 0) / PAGE_SIZE)));
        } catch {
            toast.error(t('users.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(fetchUsers, 300);
        return () => clearTimeout(t);
    }, [page, search]);

    return (
        <AdminLayout>
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('users.title')}</h2>
                    <p className="text-slate-500 text-sm">{totalItems} {t('users.subtitle')}</p>
                </div>

                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('users.searchPlaceholder')}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
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
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('users.user')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('users.email')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('users.role')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('users.joined')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                        {u.name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {u.role === "Admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {u.role === "Admin" ? t('users.admin') : t('users.customer')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <div className="text-center py-12 text-slate-400">{t('users.noUsers')}</div>
                            )}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">{t('users.page')} {page} {t('users.of')} {totalPages}</p>
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

export default AdminUsers;

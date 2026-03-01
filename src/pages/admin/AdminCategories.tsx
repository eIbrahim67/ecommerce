import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api, unwrapResponse } from "@/lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    parentCategoryId: number | null;
    productCount: number;
}

const EMPTY = { name: "", description: "", imageUrl: "", parentCategoryId: null };

const AdminCategories = () => {
    const { t } = useTranslation('admin');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>(EMPTY);
    const [isSaving, setIsSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/categories");
            const env = unwrapResponse(res.data);
            setCategories(env.data || []);
        } catch {
            toast.error(t('categories.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const openCreate = () => { setEditingId(null); setFormData(EMPTY); setShowModal(true); };
    const openEdit = (c: Category) => { setEditingId(c.id); setFormData({ name: c.name, description: c.description, imageUrl: c.imageUrl, parentCategoryId: c.parentCategoryId }); setShowModal(true); };

    const handleSave = async () => {
        if (!formData.name) return toast.error(t('categories.nameRequired'));
        setIsSaving(true);
        try {
            if (editingId) {
                await api.put(`/admin/categories/${editingId}`, formData);
                toast.success(t('categories.categoryUpdated'));
            } else {
                await api.post("/admin/categories", formData);
                toast.success(t('categories.categoryCreated'));
            }
            setShowModal(false);
            fetchCategories();
        } catch (e: any) {
            toast.error(e.message || t('categories.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('categories.deleteConfirm'))) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success(t('categories.categoryDeleted'));
            fetchCategories();
        } catch {
            toast.error(t('categories.deleteFailed'));
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{t('categories.title')}</h2>
                        <p className="text-slate-500 text-sm">{t('categories.subtitle')}</p>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" /> {t('categories.addCategory')}
                    </button>
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
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('categories.category')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('categories.description')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('categories.products')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('categories.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{c.imageUrl || "🛒"}</span>
                                                    <span className="font-semibold text-slate-800">{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{c.description || "—"}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">{c.productCount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">{editingId ? t('categories.editCategory') : t('categories.createCategory')}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">{t('categories.name')} *</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">{t('categories.description')}</label>
                                <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">{t('categories.imageIcon')}</label>
                                <input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder={t('categories.placeholder')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">{t('categories.cancel')}</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                                {isSaving ? t('categories.saving') : editingId ? t('categories.update') : t('categories.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCategories;

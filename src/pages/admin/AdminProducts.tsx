import { useEffect, useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { api, unwrapResponse } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Upload, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Variant {
    id?: number;
    sku: string;
    color: string;
    weight: number;
    size: string | null;
    stockQuantity: number;
    priceAdjustment: number;
}

interface Product {
    id: number;
    name: string;
    brand: string;
    basePrice: number;
    compareAtPrice: number | null;
    badge: string | null;
    discountPercent: number | null;
    categoryId: number;
    sku: string;
    type: string;
    vendor: string;
    description: string;
    primaryImageUrl: string;
    isDeleted?: boolean;
    variants: Variant[];
}

interface Category {
    id: number;
    name: string;
}

const EMPTY_PRODUCT: Omit<Product, "id" | "primaryImageUrl"> = {
    name: "",
    brand: "",
    basePrice: 0,
    compareAtPrice: null,
    badge: null,
    discountPercent: null,
    categoryId: 1,
    sku: "",
    type: "",
    vendor: "",
    description: "",
    variants: [{ sku: "", color: "Default", weight: 100, size: null, stockQuantity: 10, priceAdjustment: 0 }],
};

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<any>(EMPTY_PRODUCT);
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const PAGE_SIZE = 15;

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/admin/products`, { params: { page, pageSize: PAGE_SIZE, search: search || undefined } });
            const env = unwrapResponse(res.data);
            setProducts(env.data || []);
            setTotalPages(Math.max(1, Math.ceil((env.totalCount || 0) / PAGE_SIZE)));
        } catch (e) {
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(fetchProducts, 300);
        return () => clearTimeout(t);
    }, [page, search]);

    useEffect(() => {
        api.get("/categories").then(res => {
            const env = unwrapResponse(res.data);
            setCategories(env.data || []);
        });
    }, []);

    const openCreate = () => {
        setEditingProduct(null);
        setFormData(EMPTY_PRODUCT);
        setImageUrl("");
        setShowModal(true);
    };

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({
            name: p.name, brand: p.brand, basePrice: p.basePrice, compareAtPrice: p.compareAtPrice,
            badge: p.badge, discountPercent: p.discountPercent, categoryId: p.categoryId,
            sku: p.sku, type: p.type, vendor: p.vendor, description: p.description, variants: p.variants,
        });
        setImageUrl(p.primaryImageUrl || "");
        setShowModal(true);
    };

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await api.post("/admin/products/upload-image", fd, { headers: { "Content-Type": "multipart/form-data" } });
            const env = unwrapResponse(res.data);
            setImageUrl(env.data);
            toast.success("Image uploaded!");
        } catch {
            toast.error("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.brand || !formData.sku) {
            toast.error("Name, brand and SKU are required");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                imageUrls: imageUrl ? [imageUrl] : [],
                mfgDate: new Date().toISOString(),
            };
            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct.id}`, payload);
                toast.success("Product updated!");
            } else {
                await api.post("/admin/products", payload);
                toast.success("Product created!");
            }
            setShowModal(false);
            fetchProducts();
        } catch (e: any) {
            toast.error(e.message || "Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this product?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Products</h2>
                        <p className="text-slate-500 text-sm">Manage your product catalog</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* Table */}
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
                                        <th className="px-4 py-3 text-slate-500 font-medium">Product</th>
                                        <th className="px-4 py-3 text-slate-500 font-medium">SKU</th>
                                        <th className="px-4 py-3 text-slate-500 font-medium">Price</th>
                                        <th className="px-4 py-3 text-slate-500 font-medium">Badge</th>
                                        <th className="px-4 py-3 text-slate-500 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map((p) => (
                                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.isDeleted ? "opacity-50" : ""}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={p.primaryImageUrl || "https://via.placeholder.com/40"}
                                                        alt={p.name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                                                        <p className="text-slate-400 text-xs">{p.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800">${p.basePrice.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                {p.badge ? (
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">{p.badge}</span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEdit(p)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-4">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg">{editingProduct ? "Edit Product" : "Create Product"}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                                <div className="flex items-center gap-3">
                                    {imageUrl && (
                                        <img src={imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {isUploading ? "Uploading..." : "Upload Image"}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                    />
                                    {!imageUrl && (
                                        <input
                                            type="text"
                                            placeholder="Or paste URL"
                                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                                            onBlur={(e) => setImageUrl(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Brand *</label>
                                    <input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Vendor</label>
                                    <input value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">SKU *</label>
                                    <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                                    <input value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Base Price *</label>
                                    <input type="number" step="0.01" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Compare At Price</label>
                                    <input type="number" step="0.01" value={formData.compareAtPrice ?? ""} onChange={e => setFormData({ ...formData, compareAtPrice: e.target.value ? parseFloat(e.target.value) : null })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Badge</label>
                                    <select value={formData.badge ?? ""} onChange={e => setFormData({ ...formData, badge: e.target.value || null })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary">
                                        <option value="">None</option>
                                        <option value="hot">Hot</option>
                                        <option value="new">New</option>
                                        <option value="sale">Sale</option>
                                        <option value="discount">Discount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Discount %</label>
                                    <input type="number" value={formData.discountPercent ?? ""} onChange={e => setFormData({ ...formData, discountPercent: e.target.value ? parseInt(e.target.value) : null })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: parseInt(e.target.value) })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                    <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
                                </div>

                                {/* Variants */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-2">Variants</label>
                                    {formData.variants.map((v: Variant, idx: number) => (
                                        <div key={idx} className="grid grid-cols-3 gap-2 mb-2 p-3 border border-slate-100 rounded-xl">
                                            <input placeholder="Color" value={v.color} onChange={e => { const vs = [...formData.variants]; vs[idx] = { ...vs[idx], color: e.target.value }; setFormData({ ...formData, variants: vs }); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                            <input type="number" placeholder="Weight(g)" value={v.weight} onChange={e => { const vs = [...formData.variants]; vs[idx] = { ...vs[idx], weight: parseInt(e.target.value) }; setFormData({ ...formData, variants: vs }); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                            <input type="number" placeholder="Stock" value={v.stockQuantity} onChange={e => { const vs = [...formData.variants]; vs[idx] = { ...vs[idx], stockQuantity: parseInt(e.target.value) }; setFormData({ ...formData, variants: vs }); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                            <input placeholder="SKU" value={v.sku} onChange={e => { const vs = [...formData.variants]; vs[idx] = { ...vs[idx], sku: e.target.value }; setFormData({ ...formData, variants: vs }); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                            <input type="number" step="0.01" placeholder="Price adj." value={v.priceAdjustment} onChange={e => { const vs = [...formData.variants]; vs[idx] = { ...vs[idx], priceAdjustment: parseFloat(e.target.value) }; setFormData({ ...formData, variants: vs }); }} className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary" />
                                            {formData.variants.length > 1 && (
                                                <button type="button" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_: any, i: number) => i !== idx) })} className="text-red-400 hover:text-red-600 transition-colors text-xs flex items-center gap-1">
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setFormData({ ...formData, variants: [...formData.variants, { sku: "", color: "Default", weight: 100, size: null, stockQuantity: 10, priceAdjustment: 0 }] })} className="text-primary text-xs flex items-center gap-1 mt-1 hover:underline">
                                        <Plus className="w-3 h-3" /> Add variant
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : editingProduct ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;

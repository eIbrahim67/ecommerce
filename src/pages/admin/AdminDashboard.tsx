import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { api, unwrapResponse } from "@/lib/api";
import { Package, ShoppingBag, Users, Tag, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    link: string;
}

const StatCard = ({ label, value, icon: Icon, color, link }: StatCardProps) => (
    <Link
        to={link}
        className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
        </div>
        <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
    </Link>
);

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
    const { t } = useTranslation('admin');
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, users: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
                    api.get("/admin/products?page=1&pageSize=1"),
                    api.get("/categories"),
                    api.get("/admin/orders?page=1&pageSize=5"),
                    api.get("/admin/users?page=1&pageSize=1"),
                ]);

                const productsEnv = unwrapResponse(productsRes.data);
                const categoriesEnv = unwrapResponse(categoriesRes.data);
                const ordersEnv = unwrapResponse(ordersRes.data);
                const usersEnv = unwrapResponse(usersRes.data);

                setStats({
                    products: productsEnv.totalCount || 0,
                    categories: (categoriesEnv.data || []).length,
                    orders: ordersEnv.totalCount || 0,
                    users: usersEnv.totalCount || 0,
                });
                setRecentOrders(ordersEnv.data || []);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('dashboard.title')}</h2>
                    <p className="text-slate-500 text-sm">{t('dashboard.subtitle')}</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard label={t('dashboard.totalProducts')} value={stats.products} icon={Package} color="bg-primary" link="/admin/products" />
                    <StatCard label={t('dashboard.categories')} value={stats.categories} icon={Tag} color="bg-indigo-500" link="/admin/categories" />
                    <StatCard label={t('dashboard.orders')} value={stats.orders} icon={ShoppingBag} color="bg-orange-500" link="/admin/orders" />
                    <StatCard label={t('dashboard.users')} value={stats.users} icon={Users} color="bg-emerald-500" link="/admin/users" />
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">{t('dashboard.recentOrders')}</h3>
                        </div>
                        <Link to="/admin/orders" className="text-sm text-primary hover:underline font-medium">
                            {t('dashboard.viewAll')}
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">{t('dashboard.noOrders')}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('dashboard.orderNumber')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('dashboard.customer')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('dashboard.total')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('dashboard.date')}</th>
                                        <th className="px-6 py-3 text-slate-500 font-medium">{t('dashboard.status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-semibold text-slate-700">#{order.id}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {order.firstName} {order.lastName}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">${(order.totalAmount || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                                                    {t(`status.${order.status.toLowerCase()}`)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

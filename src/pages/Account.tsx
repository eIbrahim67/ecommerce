import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { api, unwrapResponse } from "@/lib/api";
import { User, Package, Settings, LogOut, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Tab = "profile" | "orders" | "settings";

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
};

const Account = () => {
    const { user, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        if (activeTab === "orders") {
            setOrdersLoading(true);
            api.get("/orders").then(res => {
                const env = unwrapResponse(res.data);
                setOrders(env.data || []);
            }).catch(console.error).finally(() => setOrdersLoading(false));
        }
    }, [activeTab]);

    if (!user) return null;

    const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
        { key: "profile", label: "Profile", icon: User },
        { key: "orders", label: "Orders", icon: Package },
        { key: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold font-heading mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                            {tabs.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === key ? "bg-primary/10 text-primary font-bold" : "text-text-body hover:text-primary hover:bg-surface-light"}`}
                                >
                                    <Icon className="w-5 h-5" /> {label}
                                </button>
                            ))}
                            {isAdmin && (
                                <Link to="/admin" className="flex items-center gap-3 w-full text-left px-4 py-3 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium">
                                    <ShieldAlert className="w-5 h-5" /> Admin Dashboard
                                </Link>
                            )}
                            <div className="my-2 border-t border-border" />
                            <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border-2 border-primary/20 flex items-center justify-between shadow-lg">
                            <div>
                                <h2 className="text-2xl font-bold font-heading mb-2">Hello, {user.name}!</h2>
                                <p className="text-text-body mb-4">From your account dashboard you can view your recent orders and manage your settings.</p>
                                <Link 
                                    to="/orders" 
                                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-md"
                                >
                                    <Package className="w-5 h-5" />
                                    View All Orders
                                </Link>
                            </div>
                            <div className="w-16 h-16 bg-primary text-primary-foreground text-2xl font-bold rounded-2xl flex items-center justify-center shrink-0 uppercase shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-bold border-b border-border pb-3 mb-4">Profile Information</h3>
                                <div className="space-y-3 text-sm">
                                    <p><span className="text-text-body">Name:</span> <span className="font-medium text-heading float-right">{user.name}</span></p>
                                    <p><span className="text-text-body">Email:</span> <span className="font-medium text-heading float-right">{user.email}</span></p>
                                    <p>
                                        <span className="text-text-body">Role:</span>
                                        <span className={`float-right px-2 py-0.5 rounded-full text-xs font-bold uppercase ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                            {user.role}
                                        </span>
                                    </p>
                                </div>
                                {isAdmin && (
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <Link to="/admin" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
                                            <ShieldAlert className="w-4 h-4" /> Open Admin Dashboard
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="p-5 border-b border-border">
                                    <h3 className="font-bold">My Orders</h3>
                                </div>
                                {ordersLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10 text-text-body">
                                        <Package className="w-10 h-10 mx-auto mb-3 text-border" />
                                        <p className="text-sm">No orders yet.</p>
                                        <Link to="/shop" className="text-primary hover:underline font-medium text-sm mt-2 inline-block">Start shopping</Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-surface-light text-left">
                                                    <th className="px-5 py-3 text-text-body font-medium">Order #</th>
                                                    <th className="px-5 py-3 text-text-body font-medium">Date</th>
                                                    <th className="px-5 py-3 text-text-body font-medium">Total</th>
                                                    <th className="px-5 py-3 text-text-body font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {orders.map((order: any) => (
                                                    <tr key={order.id} className="hover:bg-surface-light transition-colors">
                                                        <td className="px-5 py-3 font-mono font-semibold">#{order.id}</td>
                                                        <td className="px-5 py-3 text-text-body">{new Date(order.orderDate).toLocaleDateString()}</td>
                                                        <td className="px-5 py-3 font-semibold">${(order.totalAmount || 0).toFixed(2)}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-bold border-b border-border pb-3 mb-4">Account Settings</h3>
                                <p className="text-text-body text-sm mb-4">Want to change your password? Use the forgot password flow.</p>
                                <Link to="/forgot-password" className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                                    Change Password
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Account;

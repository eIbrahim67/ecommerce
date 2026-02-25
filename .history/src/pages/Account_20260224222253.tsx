import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { User, Package, Settings, LogOut, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Account = () => {
    const { user, isAdmin, logout } = useAuth();

    if (!user) return null; // ProtectedRoute will catch this anyway

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-12">
                <h1 className="text-3xl font-bold font-heading mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                            <button className="flex items-center gap-3 w-full text-left px-4 py-3 bg-primary/10 text-primary font-bold rounded-lg transition-colors">
                                <User className="w-5 h-5" /> Profile
                            </button>
                            <button className="flex items-center gap-3 w-full text-left px-4 py-3 text-text-body hover:text-primary hover:bg-surface-light rounded-lg transition-colors">
                                <Package className="w-5 h-5" /> Orders
                            </button>
                            <button className="flex items-center gap-3 w-full text-left px-4 py-3 text-text-body hover:text-primary hover:bg-surface-light rounded-lg transition-colors">
                                <Settings className="w-5 h-5" /> Settings
                            </button>
                            <div className="my-2 border-t border-border"></div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Welcome Banner */}
                        <div className="bg-surface-banner rounded-xl p-8 border border-border flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold font-heading mb-1">Hello, {user.name}!</h2>
                                <p className="text-text-body">From your account dashboard you can view your recent orders and edit your password.</p>
                            </div>
                            <div className="w-16 h-16 bg-primary text-primary-foreground text-2xl font-bold rounded-full flex items-center justify-center shrink-0 uppercase shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-bold border-b border-border pb-3 mb-4 flex items-center justify-between">
                                    <span>Profile Information</span>
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <p><span className="text-text-body">Name:</span> <span className="font-medium text-heading float-right">{user.name}</span></p>
                                    <p><span className="text-text-body">Email:</span> <span className="font-medium text-heading float-right">{user.email}</span></p>
                                    <p>
                                        <span className="text-text-body">Role:</span>
                                        <span className={`float-right px-2 py-0.5 rounded-full text-xs font-bold uppercase ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Admin UI Simulation */}
                            {isAdmin ? (
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                                    <h3 className="font-bold border-b border-purple-200 pb-3 mb-4 flex items-center gap-2 text-purple-900">
                                        <ShieldAlert className="w-4 h-4" /> Admin Controls
                                    </h3>
                                    <p className="text-sm text-purple-800 mb-4">
                                        You have elevated access. From this dashboard, you can oversee platform operations, manage users, and review products.
                                    </p>
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
                                        Open Admin Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-bold border-b border-border pb-3 mb-4">Recent Orders</h3>
                                    <div className="text-center py-6 text-text-body">
                                        <Package className="w-8 h-8 mx-auto mb-2 text-border" />
                                        <p className="text-sm">No recent orders found.</p>
                                        <Link to="/shop" className="text-primary hover:underline font-medium text-sm mt-1 inline-block">Start shopping</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Account;

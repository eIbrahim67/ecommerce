import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ShieldCheck,
    Home,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const useNavItems = () => {
    const { t } = useTranslation('admin');
    return [
        { path: "/admin", label: t('dashboard.title'), icon: LayoutDashboard, exact: true },
        { path: "/admin/products", label: t('products.title'), icon: Package },
        { path: "/admin/categories", label: t('categories.title'), icon: Tag },
        { path: "/admin/orders", label: t('orders.title'), icon: ShoppingBag },
        { path: "/admin/users", label: t('users.title'), icon: Users },
    ];
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation('admin');
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navItems = useNavItems();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (item: (typeof navItems)[number]) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">NestMart</p>
                        <p className="text-white/60 text-xs">{t('menu.adminPanel')}</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {item.label}
                            {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Home className="w-4 h-4" />
                    {t('menu.backToStore')}
                </Link>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                        <p className="text-white/50 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-300 hover:text-white hover:bg-red-500/20 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    {t('menu.logout')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-gradient-to-b from-slate-800 to-slate-900 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-slate-800 font-semibold text-lg capitalize">
                            {navItems.find((n) => isActive(n))?.label ?? t('menu.admin')}
                        </h1>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;

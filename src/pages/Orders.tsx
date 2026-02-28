import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatOrderDate, getStatusColor } from "@/lib/orderService";
import { Package, ChevronRight, Calendar, DollarSign } from "lucide-react";

const Orders = () => {
    const { orders, loading, error, fetchOrders } = useOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-surface-light">
                <Header />
                <main className="flex-1 container mx-auto py-16 px-4">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary"></div>
                            <p className="text-text-body font-medium">Loading your orders...</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-surface-light">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Package className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                My Orders
                            </h1>
                            <p className="text-text-body mt-1">View and track all your orders</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-red-600 text-xl">⚠️</span>
                        </div>
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-border rounded-3xl p-16 text-center shadow-lg">
                        <div className="w-24 h-24 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-text-body/30" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>No Orders Yet</h2>
                        <p className="text-text-body mb-8 text-lg">Start shopping to create your first order</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                        >
                            <Package className="w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="bg-white border-2 border-border rounded-2xl p-6 hover:border-primary hover:shadow-2xl transition-all group block"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    {/* Left Section */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Order #{order.id}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 text-text-body bg-surface-light px-4 py-3 rounded-xl">
                                                <Calendar className="w-5 h-5 flex-shrink-0 text-primary" />
                                                <div>
                                                    <p className="text-xs font-medium text-text-body/70">Order Date</p>
                                                    <p className="font-semibold text-heading text-sm">{formatOrderDate(order.orderDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-text-body bg-surface-light px-4 py-3 rounded-xl">
                                                <Package className="w-5 h-5 flex-shrink-0 text-primary" />
                                                <div>
                                                    <p className="text-xs font-medium text-text-body/70">Items</p>
                                                    <p className="font-semibold text-heading text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-primary/10 px-4 py-3 rounded-xl">
                                                <DollarSign className="w-5 h-5 flex-shrink-0 text-primary" />
                                                <div>
                                                    <p className="text-xs font-medium text-primary/70">Total</p>
                                                    <p className="font-bold text-primary text-lg">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <div className="text-right hidden md:block bg-surface-light px-5 py-3 rounded-xl">
                                            <p className="text-xs text-text-body font-medium mb-1">Shipping to</p>
                                            <p className="text-sm font-bold text-heading truncate max-w-[200px]">
                                                {order.city}, {order.zipCode}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                                            <ChevronRight className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                {/* Item Preview */}
                                <div className="mt-6 pt-6 border-t-2 border-border/50">
                                    <p className="text-xs font-semibold text-text-body mb-3 uppercase tracking-wide">Order Items</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="text-sm bg-surface-light text-heading font-medium px-4 py-2 rounded-lg truncate max-w-[250px] border border-border/50"
                                            >
                                                {item.productName}
                                            </span>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span className="text-sm bg-primary/10 text-primary font-bold px-4 py-2 rounded-lg border border-primary/20">
                                                +{order.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Orders;

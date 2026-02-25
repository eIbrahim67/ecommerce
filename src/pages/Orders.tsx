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
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                        <Package className="w-8 h-8 text-primary" />
                        My Orders
                    </h1>
                    <p className="text-text-body mt-2">View and track all your orders</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center">
                        <Package className="w-16 h-16 text-text-body/30 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
                        <p className="text-text-body mb-6">Start shopping to create your first order</p>
                        <Link
                            to="/shop"
                            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-text-body">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{formatOrderDate(order.orderDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-text-body">
                                                <Package className="w-4 h-4 flex-shrink-0" />
                                                <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 flex-shrink-0 text-primary" />
                                                <span className="font-semibold text-primary">{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-xs text-text-body">Shipping to</p>
                                            <p className="text-sm font-semibold truncate max-w-[200px]">
                                                {order.city}, {order.zipCode}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-text-body group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                    </div>
                                </div>

                                {/* Item Preview */}
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs bg-surface-light text-text-body px-2 py-1 rounded truncate max-w-[200px]"
                                            >
                                                {item.productName}
                                            </span>
                                        ))}
                                        {order.items.length > 3 && (
                                            <span className="text-xs bg-surface-light text-text-body px-2 py-1 rounded">
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

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/lib/orderService";
import { formatCurrency, formatOrderDate, getStatusColor } from "@/lib/orderService";
import { ChevronLeft, Package, MapPin, Mail, Phone, Calendar } from "lucide-react";

const OrderDetail = () => {
    const { orderId: orderIdParam } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { currentOrder, loading, error, fetchOrderById, clearError } = useOrders();
    const [orderId, setOrderId] = useState<number | null>(null);

    useEffect(() => {
        clearError();
        if (orderIdParam && !isNaN(Number(orderIdParam))) {
            const id = Number(orderIdParam);
            setOrderId(id);
            fetchOrderById(id);
        }
    }, [orderIdParam, fetchOrderById, clearError]);

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

    if (error || !currentOrder) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                    <p className="text-text-body mb-6">{error || "The order you're looking for doesn't exist."}</p>
                    <Link
                        to="/orders"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Back to Orders
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/orders")}
                        className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">Order #{currentOrder.id}</h1>
                        <p className="text-text-body mt-1">{formatOrderDate(currentOrder.orderDate)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" /> Order Status
                            </h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentOrder.status)}`}>
                                        {currentOrder.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-text-body">Ordered on</p>
                                    <p className="font-semibold">{formatOrderDate(currentOrder.orderDate)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-lg font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {currentOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.productName}</p>
                                            <p className="text-sm text-text-body">
                                                Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-4 border-t border-border space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(currentOrder.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-primary">{formatCurrency(currentOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold">
                                    {currentOrder.firstName} {currentOrder.lastName}
                                </p>
                                <p>{currentOrder.address}</p>
                                <p>
                                    {currentOrder.city}, {currentOrder.zipCode}
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-bold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-text-body" />
                                    <span>{currentOrder.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-text-body" />
                                    <span>{currentOrder.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-text-body" />
                                    <span>{formatOrderDate(currentOrder.orderDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order ID */}
                        <div className="bg-surface-light border border-border rounded-xl p-4">
                            <p className="text-xs text-text-body mb-1">Order ID</p>
                            <p className="font-mono text-sm font-semibold break-all">{currentOrder.id}</p>
                        </div>
                    </div>
                </div>

                {/* Return Link */}
                <div className="mt-8">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetail;

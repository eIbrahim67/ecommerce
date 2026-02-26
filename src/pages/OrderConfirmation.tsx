import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, Package, Truck, CreditCard, MapPin, Mail, Phone } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { checkPaymentStatus } from "@/lib/paymentService";
import { getOrderById, Order } from "@/lib/orderService";
import SEO from "@/components/SEO";

type PageState = "loading" | "success" | "error";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [state, setState] = useState<PageState>("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("Pending");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    loadOrderData(parseInt(orderId));
  }, [orderId]);

  const loadOrderData = async (id: number) => {
    try {
      setState("loading");

      // Fetch order details
      const orderData = await getOrderById(id);
      setOrder(orderData);

      // Fetch payment status
      try {
        const paymentData = await checkPaymentStatus(id);
        setPaymentStatus(paymentData.paymentStatus);
      } catch (err) {
        console.warn("Could not fetch payment status:", err);
        // Continue anyway, payment status is optional
      }

      // Clear cart on successful order
      await clearCart();

      setState("success");
    } catch (err: any) {
      console.error("Error loading order:", err);
      setError(err.message || "Failed to load order details");
      setState("error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (state === "loading") {
    return (
      <>
        <SEO title="Loading Order..." description="Loading your order confirmation" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (state === "error") {
    return (
      <>
        <SEO title="Order Not Found" description="Order confirmation error" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View All Orders
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <SEO
        title={`Order Confirmation #${order.id}`}
        description="Your order has been confirmed"
      />

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for your order. We've received your payment and will process your order shortly.
              </p>
              <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="font-medium">Payment Status: {paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600 mt-1">Order #{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-gray-900 font-medium">{formatDate(order.orderDate)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                <p className="text-gray-900 font-medium">
                  {order.firstName} {order.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </p>
                <p className="text-gray-900">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </p>
                <p className="text-gray-900">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Shipping Address
                </p>
                <p className="text-gray-900">
                  {order.address}, {order.city} {order.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span className="font-medium text-green-600">Confirmed</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Current Status: <span className="font-semibold text-gray-900">{order.status}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                We'll send you an email confirmation shortly. You can track your order status in your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  to={`/orders/${order.id}`}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium text-center"
                >
                  View Order Details
                </Link>
                <Link
                  to="/orders"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  View All Orders
                </Link>
                <Link
                  to="/shop"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help with your order?{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;

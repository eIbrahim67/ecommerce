import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useCart } from "@/contexts/CartContext";
import { getPendingOrderId, clearPendingOrderId } from "@/lib/paymentService";
import SEO from "@/components/SEO";

type PaymentState = "checking" | "pending" | "success" | "failed" | "timeout";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const { pollPaymentStatus } = usePayment();
  const { clearCart } = useCart();
  const [state, setState] = useState<PaymentState>("checking");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const pendingOrderId = getPendingOrderId();

    if (!pendingOrderId) {
      // No pending order, redirect to home
      navigate("/");
      return;
    }

    setOrderId(pendingOrderId);
    verifyPayment(pendingOrderId);
  }, []);

  const verifyPayment = async (orderId: number) => {
    try {
      setState("pending");
      setMessage("Processing your payment...");

      // Poll for payment status (max 30 attempts, 2 seconds interval = 60 seconds total)
      const status = await pollPaymentStatus(orderId, 30, 2000);

      if (!status) {
        // Timeout or error
        setState("timeout");
        setMessage("Payment verification is taking longer than expected. Please check your order history.");
        return;
      }

      if (status.paymentStatus === "Paid") {
        // Success!
        setState("success");
        setMessage("Payment successful! Your order has been confirmed.");
        
        // Clear the cart
        await clearCart();
        
        // Clear pending order ID
        clearPendingOrderId();
        
        // Redirect to order details after 3 seconds
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 3000);
        
      } else if (status.paymentStatus === "Failed") {
        // Failed
        setState("failed");
        setMessage("Payment failed. Please try again or use a different payment method.");
        clearPendingOrderId();
        
      } else {
        // Other status (shouldn't happen after polling)
        setState("timeout");
        setMessage("Unable to verify payment status. Please check your order history.");
      }
      
    } catch (error) {
      console.error("Payment verification error:", error);
      setState("failed");
      setMessage("An error occurred while verifying your payment. Please contact support.");
    }
  };

  const handleReturnToCart = () => {
    clearPendingOrderId();
    navigate("/cart");
  };

  const handleViewOrders = () => {
    clearPendingOrderId();
    navigate("/orders");
  };

  return (
    <>
      <SEO 
        title="Payment Processing"
        description="Processing your payment"
      />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {state === "checking" || state === "pending" ? (
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <Clock className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              ) : state === "success" ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : state === "failed" ? (
                <XCircle className="h-16 w-16 text-red-500" />
              ) : (
                <Clock className="h-16 w-16 text-yellow-500" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-4">
              {state === "checking" && "Verifying Payment"}
              {state === "pending" && "Processing Payment"}
              {state === "success" && "Payment Successful!"}
              {state === "failed" && "Payment Failed"}
              {state === "timeout" && "Verification Timeout"}
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">{message}</p>

            {/* Order ID */}
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 text-center">
                  Order ID: <span className="font-semibold text-gray-900">#{orderId}</span>
                </p>
              </div>
            )}

            {/* Loading indicator */}
            {(state === "checking" || state === "pending") && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}

            {/* Success actions */}
            {state === "success" && (
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-500">
                  Redirecting to order details...
                </div>
                <button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  View Order Details
                </button>
              </div>
            )}

            {/* Failed actions */}
            {state === "failed" && (
              <div className="space-y-3">
                <button
                  onClick={handleReturnToCart}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Return to Cart
                </button>
                <button
                  onClick={handleViewOrders}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View Order History
                </button>
              </div>
            )}

            {/* Timeout actions */}
            {state === "timeout" && (
              <div className="space-y-3">
                <button
                  onClick={handleViewOrders}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Check Order History
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Return to Home
                </button>
              </div>
            )}

            {/* Help text */}
            {(state === "failed" || state === "timeout") && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Need help? Contact our support team with order ID #{orderId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCallback;

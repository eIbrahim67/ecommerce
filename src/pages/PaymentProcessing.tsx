import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CreditCard, Shield, Lock } from "lucide-react";
import SEO from "@/components/SEO";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(3);
  
  // Get payment URL from navigation state
  const paymentUrl = location.state?.paymentUrl;
  const orderId = location.state?.orderId;

  useEffect(() => {
    // If no payment URL, redirect back to cart
    if (!paymentUrl) {
      navigate("/cart");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to Paymob after countdown
          window.location.href = paymentUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentUrl, navigate]);

  const handleProceedNow = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <>
      <SEO 
        title="Processing Payment"
        description="Redirecting to secure payment gateway"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Animated Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-primary/10 p-6 rounded-full">
                  <CreditCard className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Redirecting to Payment
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8">
              You will be redirected to our secure payment gateway in{" "}
              <span className="font-bold text-primary text-2xl">{countdown}</span> second{countdown !== 1 ? 's' : ''}
            </p>

            {/* Order Info */}
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-500 text-center">
                  Order ID: <span className="font-semibold text-gray-900">#{orderId}</span>
                </p>
              </div>
            )}

            {/* Security Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-green-100 p-2 rounded-full">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span>Secure SSL encrypted payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <span>PCI DSS compliant payment gateway</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-purple-100 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <span>Powered by Paymob</span>
              </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex justify-center mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>

            {/* Manual Proceed Button */}
            <button
              onClick={handleProceedNow}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              Proceed to Payment Now
              <CreditCard className="h-4 w-4" />
            </button>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                If you are not redirected automatically, click the button above
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              You will be redirected to a secure payment page
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentProcessing;

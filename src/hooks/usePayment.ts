import { useState, useCallback } from "react";
import {
  createPayment,
  checkPaymentStatus,
  setPendingOrderId,
  clearPendingOrderId,
  type PaymentResponse,
  type PaymentStatus,
} from "@/lib/paymentService";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  /**
   * Create a payment session and redirect to Paymob
   */
  const initiatePayment = useCallback(async (): Promise<PaymentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const payment = await createPayment();
      
      // Store order ID for status checking after redirect
      setPendingOrderId(payment.orderId);
      
      return payment;
    } catch (err: any) {
      const message = err.message || "Failed to create payment";
      setError(message);
      console.error("Payment initiation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check the status of a payment
   */
  const getPaymentStatus = useCallback(async (orderId: number): Promise<PaymentStatus | null> => {
    setLoading(true);
    setError(null);

    try {
      const status = await checkPaymentStatus(orderId);
      setPaymentStatus(status);
      return status;
    } catch (err: any) {
      const message = err.message || "Failed to check payment status";
      setError(message);
      console.error("Payment status check error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Poll payment status until it's no longer pending
   * @param orderId - The order ID to check
   * @param maxAttempts - Maximum number of polling attempts (default: 30)
   * @param interval - Polling interval in milliseconds (default: 2000)
   * @returns Promise that resolves with final status
   */
  const pollPaymentStatus = useCallback(
    async (
      orderId: number,
      maxAttempts: number = 30,
      interval: number = 2000
    ): Promise<PaymentStatus | null> => {
      let attempts = 0;

      const poll = async (): Promise<PaymentStatus | null> => {
        if (attempts >= maxAttempts) {
          setError("Payment verification timeout. Please check your order history.");
          return null;
        }

        attempts++;
        const status = await getPaymentStatus(orderId);

        if (!status) {
          return null;
        }

        // If payment is still pending, poll again
        if (status.paymentStatus === "Pending") {
          await new Promise((resolve) => setTimeout(resolve, interval));
          return poll();
        }

        // Payment is no longer pending (Paid, Failed, etc.)
        return status;
      };

      return poll();
    },
    [getPaymentStatus]
  );

  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear pending order ID
   */
  const clearPending = useCallback(() => {
    clearPendingOrderId();
  }, []);

  return {
    loading,
    error,
    paymentStatus,
    initiatePayment,
    getPaymentStatus,
    pollPaymentStatus,
    clearError,
    clearPending,
  };
}

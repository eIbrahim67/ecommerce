import { api, unwrapResponse } from "./api";

export interface PaymentResponse {
  success: boolean;
  iframeUrl: string;
  orderId: number;
}

export interface PaymentStatus {
  orderId: number;
  orderStatus: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded" | "NotFound";
  transactionId?: string;
  message?: string;
}

/**
 * Create a payment session for the current cart
 * Requires authentication (JWT token or X-Guest-Id header)
 */
export async function createPayment(): Promise<PaymentResponse> {
  try {
    const res = await api.post("/payments/create", {});
    const envelope = unwrapResponse(res.data);
    return envelope.data || envelope;
  } catch (error: any) {
    console.error("Create payment error:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to create payment");
  }
}

/**
 * Check payment status for a specific order
 * No authentication required (public endpoint)
 */
export async function checkPaymentStatus(orderId: number): Promise<PaymentStatus> {
  try {
    const res = await api.get(`/payments/status/${orderId}`);
    return res.data;
  } catch (error: any) {
    console.error("Check payment status error:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to check payment status");
  }
}

/**
 * Get the pending order ID from localStorage
 */
export function getPendingOrderId(): number | null {
  const orderId = localStorage.getItem("pendingOrderId");
  return orderId ? parseInt(orderId, 10) : null;
}

/**
 * Store the pending order ID in localStorage
 */
export function setPendingOrderId(orderId: number): void {
  localStorage.setItem("pendingOrderId", orderId.toString());
}

/**
 * Clear the pending order ID from localStorage
 */
export function clearPendingOrderId(): void {
  localStorage.removeItem("pendingOrderId");
}

/**
 * Get status badge color based on payment status
 */
export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "Refunded":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Get status icon based on payment status
 */
export function getPaymentStatusIcon(status: string): string {
  switch (status) {
    case "Paid":
      return "✓";
    case "Pending":
      return "⏳";
    case "Failed":
      return "✗";
    case "Refunded":
      return "↩";
    default:
      return "?";
  }
}

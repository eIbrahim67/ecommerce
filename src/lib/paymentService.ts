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
    console.log("Creating payment session...");
    console.log("Request URL:", "/payments/create");
    console.log("Guest ID:", localStorage.getItem("ecommerce_guest_id"));
    console.log("Auth User:", localStorage.getItem("ecommerce_auth_user"));
    
    const res = await api.post("/payments/create", {});
    console.log("Payment response:", res.data);
    const envelope = unwrapResponse(res.data);
    return envelope.data || envelope;
  } catch (error: any) {
    console.error("Create payment error details:", {
      message: error.message,
      response: error.response?.data,
      responseText: error.response?.data?.message,
      detail: error.response?.data?.detail,
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
    });
    
    // Log the full response for debugging
    if (error.response?.data) {
      console.error("Full error response:", JSON.stringify(error.response.data, null, 2));
    }
    
    // Provide more specific error messages
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.message || error.response?.data?.detail;
      throw new Error(errorMsg || "Cart is empty or invalid");
    } else if (error.response?.status === 401) {
      throw new Error("Authentication required. Please login or refresh the page.");
    } else if (error.response?.status === 502) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message;
      throw new Error(errorMsg || "Payment service is temporarily unavailable. Please try again.");
    } else {
      throw new Error(error.response?.data?.message || error.message || "Failed to create payment");
    }
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

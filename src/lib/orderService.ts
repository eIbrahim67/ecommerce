/**
 * Orders API Service
 * Handles all order-related API calls for both authenticated and guest users
 */

import { api, unwrapResponse } from "./api";

export interface CheckoutRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    paymentMethod?: string; // "card" or "cod"
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    userId: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    items: OrderItem[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[] | null;
}

/**
 * Place an order using cart items and shipping information
 * Works for both authenticated and guest users (via X-Guest-Id header)
 */
export async function checkout(request: CheckoutRequest): Promise<number> {
    try {
        console.log("Creating order with data:", request);
        const res = await api.post<ApiResponse<number>>("/orders/checkout", request);
        console.log("Order response:", res.data);
        const env = unwrapResponse(res.data);
        return env.data;
    } catch (error: any) {
        console.error("Checkout error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            request: request,
        });
        
        // Provide specific error messages
        if (error.response?.status === 400) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors?.join(", ");
            throw new Error(errorMsg || "Invalid checkout data. Please check your cart and form.");
        } else if (error.response?.status === 401) {
            throw new Error("Authentication required. Please login or refresh the page.");
        } else {
            throw new Error(error.response?.data?.message || error.message || "Failed to create order");
        }
    }
}

/**
 * Get all orders for the current user (authenticated or guest)
 * Returns orders sorted by most recent first
 */
export async function getOrders(): Promise<Order[]> {
    try {
        const res = await api.get<ApiResponse<Order[]>>("/orders");
        const env = unwrapResponse(res.data);
        return env.data || [];
    } catch (error) {
        throw error;
    }
}

/**
 * Get details for a specific order by ID
 * Users can only view their own orders
 */
export async function getOrderById(orderId: number): Promise<Order> {
    try {
        const res = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
        const env = unwrapResponse(res.data);
        return env.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Get order status (Pending, Processing, Shipped, Delivered, Completed, Cancelled)
 */
export async function getOrderStatus(orderId: number): Promise<string> {
    try {
        const order = await getOrderById(orderId);
        return order.status;
    } catch (error) {
        throw error;
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

/**
 * Format date for display
 */
export function formatOrderDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "processing":
            return "bg-blue-100 text-blue-800";
        case "shipped":
            return "bg-purple-100 text-purple-800";
        case "delivered":
            return "bg-green-100 text-green-800";
        case "completed":
            return "bg-green-100 text-green-800";
        case "cancelled":
            return "bg-red-100 text-red-800";
        case "paymentfailed":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

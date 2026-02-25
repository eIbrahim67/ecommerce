/**
 * useOrders Hook
 * Manages order state and operations for components
 */

import { useState, useCallback } from "react";
import { checkout, getOrders, getOrderById, CheckoutRequest, Order } from "@/lib/orderService";
import { toast } from "sonner";

interface UseOrdersReturn {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
    checkout: (data: CheckoutRequest) => Promise<number | null>;
    fetchOrders: () => Promise<void>;
    fetchOrderById: (orderId: number) => Promise<void>;
    clearError: () => void;
}

/**
 * Hook for managing orders
 * Handles fetching, caching, and state management for order operations
 */
export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleCheckout = useCallback(async (data: CheckoutRequest) => {
        setLoading(true);
        setError(null);
        try {
            const orderId = await checkout(data);
            toast.success("Order placed successfully!");
            // Refresh orders list
            await handleFetchOrders();
            return orderId;
        } catch (err: any) {
            const errorMsg = err.message || "Failed to place order";
            setError(errorMsg);
            toast.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err: any) {
            const errorMsg = err.message || "Failed to fetch orders";
            setError(errorMsg);
            console.error("Fetch orders error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFetchOrderById = useCallback(async (orderId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrderById(orderId);
            setCurrentOrder(data);
        } catch (err: any) {
            const errorMsg = err.message || "Failed to fetch order";
            setError(errorMsg);
            console.error("Fetch order error:", err);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        orders,
        currentOrder,
        loading,
        error,
        checkout: handleCheckout,
        fetchOrders: handleFetchOrders,
        fetchOrderById: handleFetchOrderById,
        clearError,
    };
}

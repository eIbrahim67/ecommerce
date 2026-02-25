import React, { createContext, useContext, useEffect, useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
    id: number;
    productId: number;
    variantId: number | null;
    productName: string;
    variantName: string | null;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (productId: number, variantId?: number, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    cartTotal: number;
    cartCount: number;
    isLoading: boolean;
    isAuthenticated: boolean; // Track if user is logged in
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        // Cart is now available for both authenticated and anonymous users
        try {
            setIsLoading(true);
            const res = await api.get("/cart");
            const env = unwrapResponse(res.data);
            setItems(env.data?.items || []);
            setCartTotal(env.data?.totalPrice || 0);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // On error, clear cart state
            setItems([]);
            setCartTotal(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch cart on mount or when auth state changes
        // Both authenticated and anonymous users can have carts
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId: number, variantId?: number, quantity = 1) => {
        // Anonymous users can now add to cart
        try {
            const body: any = { productId, productVariantId: variantId, quantity };
            const res = await api.post("/cart", body);
            unwrapResponse(res.data);
            await fetchCart();
            toast.success("Added to cart!");
        } catch (error: any) {
            console.error("Add to cart error:", error);
            toast.error(error.message || "Failed to add item to cart.");
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            const res = await api.delete(`/cart/${itemId}`);
            unwrapResponse(res.data);
            await fetchCart();
        } catch (error: any) {
            console.error("Remove from cart error:", error);
            toast.error(error.message || "Failed to remove item.");
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        try {
            const res = await api.put(`/cart/${itemId}`, { quantity });
            unwrapResponse(res.data);
            await fetchCart();
        } catch (error: any) {
            console.error("Update quantity error:", error);
            toast.error(error.message || "Failed to update quantity.");
        }
    };

    const clearCart = async () => {
        try {
            const res = await api.delete("/cart");
            unwrapResponse(res.data);
            await fetchCart();
        } catch (error: any) {
            console.error("Clear cart error:", error);
        }
    };

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
                cartTotal,
                cartCount,
                isLoading,
                isAuthenticated,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};


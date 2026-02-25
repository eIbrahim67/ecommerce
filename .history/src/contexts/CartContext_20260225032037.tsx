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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) {
            setItems([]);
            setCartTotal(0);
            return;
        }

        try {
            setIsLoading(true);
            const res = await api.get("/cart");
            const data = unwrapResponse(res.data);
            setItems(data?.items || []);
            setCartTotal(data?.totalPrice || 0);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Optionally clear cart on 401
            setItems([]);
            setCartTotal(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId: number, variantId?: number, quantity = 1) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to your cart.");
            return;
        }
        try {
            const res = await api.post("/cart", { productId, variantId, quantity });
            unwrapResponse(res.data);
            await fetchCart();
            toast.success("Item added to cart.");
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


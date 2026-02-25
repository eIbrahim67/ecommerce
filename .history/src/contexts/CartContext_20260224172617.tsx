import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
    product: Product;
    quantity: number;
    selectedWeight?: string;
    selectedVariant?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number, selectedWeight?: string, selectedVariant?: string) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity = 1, selectedWeight?: string, selectedVariant?: string) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.product.id === product.id &&
                    item.selectedWeight === selectedWeight &&
                    item.selectedVariant === selectedVariant
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id &&
                        item.selectedWeight === selectedWeight &&
                        item.selectedVariant === selectedVariant
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...currentItems, { product, quantity, selectedWeight, selectedVariant }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems((current) => current.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) return removeFromCart(productId);

        setItems((current) =>
            current.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
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

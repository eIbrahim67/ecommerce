import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

interface WishlistContextType {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Product[]>(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(items));
    }, [items]);

    const addToWishlist = (product: Product) => {
        setItems((current) => {
            if (current.find((item) => item.id === product.id)) return current;
            return [...current, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setItems((current) => current.filter((item) => item.id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return items.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

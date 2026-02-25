import React, { createContext, useContext, useEffect, useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface WishlistItem {
    id: number;
    productId: number;
    productName: string;
    basePrice: number;
    imageUrl: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    fetchWishlist: () => Promise<void>;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = async () => {
        if (!isAuthenticated) {
            setItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const res = await api.get("/wishlist");
            const env = unwrapResponse(res.data);
            setItems(env.data || []);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated]);

    const addToWishlist = async (productId: number) => {
        if (!isAuthenticated) {
            toast.error("Please login to manage your wishlist.");
            return;
        }
        try {
            const res = await api.post(`/wishlist/${productId}`);
            unwrapResponse(res.data);
            await fetchWishlist();
            toast.success("Added to wishlist.");
        } catch (error: any) {
            console.error("Add to wishlist error:", error);
            toast.error(error.message || "Failed to add to wishlist.");
        }
    };

    const removeFromWishlist = async (productId: number) => {
        if (!isAuthenticated) return;
        try {
            const res = await api.delete(`/wishlist/${productId}`);
            unwrapResponse(res.data);
            await fetchWishlist();
        } catch (error: any) {
            console.error("Remove from wishlist error:", error);
            toast.error(error.message || "Failed to remove from wishlist.");
        }
    };

    const isInWishlist = (productId: number) => {
        return items.some((item) => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist, isLoading }}>
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


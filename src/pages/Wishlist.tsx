import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { formatCurrency } from "@/i18n/formatters";
import { getLocalizedText } from "@/utils/localization";

const Wishlist = () => {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());
    const { t, currentLanguage } = useLanguage();

    const handleRemove = async (productId: number) => {
        if (removingItems.has(productId)) return;
        setRemovingItems(prev => new Set(prev).add(productId));
        try {
            await removeFromWishlist(productId);
        } finally {
            setTimeout(() => {
                setRemovingItems(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            }, 500);
        }
    };

    const handleAddToCart = async (productId: number) => {
        if (addingToCart.has(productId)) return;
        setAddingToCart(prev => new Set(prev).add(productId));
        try {
            await addToCart(productId, undefined, 1);
        } finally {
            setTimeout(() => {
                setAddingToCart(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            }, 500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    {t('wishlist:title')} {items.length > 0 && <span className="text-text-body font-normal text-lg">({items.length})</span>}
                </h1>
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-surface-light rounded-xl border border-border">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-xl font-bold mb-2">{t('wishlist:empty.title')}</h2>
                        <p className="text-text-body mb-6">{t('wishlist:empty.message')}</p>
                        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity">
                            {t('wishlist:empty.exploreShop')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {items.map((item) => {
                            const isRemoving = removingItems.has(item.productId);
                            const isAdding = addingToCart.has(item.productId);
                            
                            return (
                                <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all group relative flex flex-col">
                                    {/* Remove button */}
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        disabled={isRemoving}
                                        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-50 text-text-body hover:text-red-500 shadow-sm transition-colors border border-border/40 disabled:opacity-70 disabled:cursor-not-allowed"
                                        title={t('wishlist:buttons.removeFromWishlist')}
                                    >
                                        {isRemoving ? (
                                            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                                        ) : (
                                            <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                                        )}
                                    </button>

                                    <Link to={`/product/${item.productId}`} className="block aspect-square rounded-lg overflow-hidden mb-3 bg-surface-light">
                                        <img src={item.imageUrl} alt={getLocalizedText(item.productName, item.productNameAr, currentLanguage)} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </Link>

                                    <Link to={`/product/${item.productId}`} className="flex-1">
                                        <h3 className="text-sm font-bold leading-tight mb-2 hover:text-primary transition-colors line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                            {getLocalizedText(item.productName, item.productNameAr, currentLanguage)}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        <span className="text-lg font-bold text-primary">{formatCurrency(item.basePrice, currentLanguage)}</span>
                                        <button
                                            onClick={() => handleAddToCart(item.productId)}
                                            disabled={isAdding}
                                            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                                            title={t('wishlist:buttons.addToCart')}
                                        >
                                            {isAdding ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <ShoppingCart className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        disabled={isRemoving}
                                        className="flex items-center justify-center gap-1 mt-2 text-xs text-text-body hover:text-red-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isRemoving ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                                                {t('wishlist:buttons.removing')}
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-3 h-3" /> {t('wishlist:buttons.remove')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";

const Cart = () => {
    const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (updatingItems.has(itemId)) return;
        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            await updateQuantity(itemId, newQuantity);
        } finally {
            setTimeout(() => {
                setUpdatingItems(prev => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
            }, 300);
        }
    };

    const handleRemove = async (itemId: number) => {
        if (removingItems.has(itemId)) return;
        setRemovingItems(prev => new Set(prev).add(itemId));
        try {
            await removeFromCart(itemId);
        } finally {
            setTimeout(() => {
                setRemovingItems(prev => {
                    const next = new Set(prev);
                    next.delete(itemId);
                    return next;
                });
            }, 500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-surface-light">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4">
                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-border shadow-xl">
                        <div className="text-8xl mb-6 animate-bounce">🛒</div>
                        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>Your cart is empty</h2>
                        <p className="text-text-body mb-8 text-lg">Looks like you haven't added any items to the cart yet.</p>
                        <Link to="/shop" className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                            Start Shopping <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-xl">
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                                    <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Shopping Cart</h2>
                                    <p className="text-sm text-text-body mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-light border-b border-border text-sm text-text-body font-bold">
                                            <th className="p-5">Product</th>
                                            <th className="p-5">Unit Price</th>
                                            <th className="p-5">Quantity</th>
                                            <th className="p-5">Subtotal</th>
                                            <th className="p-5">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => {
                                            const isUpdating = updatingItems.has(item.id);
                                            const isRemoving = removingItems.has(item.id);
                                            
                                            return (
                                                <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-surface-light/50 transition-colors ${isRemoving ? 'opacity-50' : ''}`}>
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-5">
                                                            <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 rounded-xl object-cover border-2 border-border shadow-md" />
                                                            <div>
                                                                <Link to={`/product/${item.productId}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                                                                    {item.productName}
                                                                </Link>
                                                                {item.variantName && <p className="text-sm text-text-body mt-1 font-medium">Variant: {item.variantName}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 font-bold text-lg">${item.unitPrice.toFixed(2)}</td>
                                                    <td className="p-5">
                                                        <div className="flex items-center border-2 border-border rounded-xl w-max shrink-0 bg-white shadow-sm">
                                                            <button 
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                                                                disabled={isUpdating || isRemoving}
                                                                className="p-3 text-text-body hover:text-primary hover:bg-surface-light transition-all rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-12 text-center text-base font-bold relative">
                                                                {isUpdating ? (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                                                    </div>
                                                                ) : (
                                                                    item.quantity
                                                                )}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                                                                disabled={isUpdating || isRemoving}
                                                                className="p-3 text-text-body hover:text-primary hover:bg-surface-light transition-all rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 font-bold text-xl text-primary">${item.totalPrice.toFixed(2)}</td>
                                                    <td className="p-5">
                                                        <button 
                                                            onClick={() => handleRemove(item.id)} 
                                                            disabled={isRemoving}
                                                            className="text-red-400 hover:text-red-600 hover:scale-110 transition-all p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isRemoving ? (
                                                                <div className="w-6 h-6 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Trash2 className="w-6 h-6" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-96 shrink-0">
                            <div className="bg-white border border-border rounded-3xl p-8 shadow-xl sticky top-24">
                                <h3 className="text-2xl font-bold mb-6 pb-5 border-b-2 border-border" style={{ fontFamily: "'Quicksand', sans-serif" }}>Order Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-text-body text-base">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-heading text-lg">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-body text-base">
                                        <span>Shipping</span>
                                        <span className="font-bold text-green-600 text-lg">Free</span>
                                    </div>
                                    <div className="flex justify-between text-text-body text-base">
                                        <span>Tax</span>
                                        <span className="font-bold text-heading text-lg">$0.00</span>
                                    </div>
                                    <div className="border-t-2 border-border pt-5 flex justify-between font-bold text-2xl">
                                        <span>Total</span>
                                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link to="/checkout" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg">
                                    Proceed To Checkout <ArrowRight className="w-5 h-5" />
                                </Link>
                                <p className="text-xs text-text-body text-center mt-4">Secure checkout powered by Stripe</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;

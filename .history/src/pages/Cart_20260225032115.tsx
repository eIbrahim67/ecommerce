import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

const Cart = () => {
    const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8">
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-surface-light rounded-xl border border-border">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-text-body mb-6">Looks like you haven't added any items to the cart yet.</p>
                        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity">
                            Return to Shop
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-light border-b border-border text-sm text-text-body font-medium">
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Unit Price</th>
                                            <th className="p-4">Quantity</th>
                                            <th className="p-4">Subtotal</th>
                                            <th className="p-4">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id} className="border-b border-border last:border-0">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-lg object-cover border border-border" />
                                                        <div>
                                                            <Link to={`/product/${item.productId}`} className="font-bold hover:text-primary transition-colors line-clamp-1">
                                                                {item.productName}
                                                            </Link>
                                                            {item.variantName && <p className="text-xs text-text-body mt-1">Variant: {item.variantName}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-semibold">${item.unitPrice.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center border border-border rounded-lg w-max shrink-0">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-text-body hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                                                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-text-body hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-primary">${item.totalPrice.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-96 shrink-0">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 border-b border-border pb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-text-body">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-heading">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-body">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-heading text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-text-body">
                                        <span>Tax (calc at checkout)</span>
                                        <span className="font-semibold text-heading">$0.00</span>
                                    </div>
                                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link to="/checkout" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                    Proceed To Checkout <ArrowRight className="w-4 h-4" />
                                </Link>
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

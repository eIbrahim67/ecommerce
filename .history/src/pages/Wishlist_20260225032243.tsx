import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
    const { items } = useWishlist();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8">
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-surface-light rounded-xl border border-border">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
                        <p className="text-text-body mb-6">You haven't favorited any items yet. Start browsing to add items you love!</p>
                        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity">
                            Explore Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all group relative">
                                <Link to={`/product/${item.productId}`} className="block aspect-square rounded-lg overflow-hidden mb-3 bg-surface-light">
                                    <img src={item.imageUrl} alt={item.productName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </Link>
                                <Link to={`/product/${item.productId}`}>
                                    <h3 className="text-sm font-bold leading-tight mb-2 hover:text-primary transition-colors line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                        {item.productName}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-primary">${item.basePrice.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;

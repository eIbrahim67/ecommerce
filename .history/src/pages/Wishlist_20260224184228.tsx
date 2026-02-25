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
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;

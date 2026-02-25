import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const HeaderActions = () => {
    const { cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();

    return (
        <div className="flex items-center gap-5">
            <Link
                to="/wishlist"
                className="hidden md:flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                aria-label="Go to Wishlist"
            >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Wishlist</span>
                {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-4 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {wishlistItems.length}
                    </span>
                )}
            </Link>

            <Link
                to="/cart"
                className="flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                aria-label="Go to Cart"
            >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline">Cart</span>
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                </span>
            </Link>

            <Link
                to="/about"
                className="hidden md:flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                aria-label="Go to Account"
            >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Account</span>
            </Link>
        </div>
    );
};

export default HeaderActions;

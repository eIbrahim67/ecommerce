import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User, LogIn, UserPlus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const HeaderActions = () => {
    const { cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { user, isAuthenticated } = useAuth();

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

            {isAuthenticated ? (
                <Link
                    to="/account"
                    className="hidden md:flex items-center gap-1.5 text-sm text-text-body hover:text-primary transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    aria-label="Go to Account"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold tracking-wider group-hover:scale-105 transition-transform uppercase text-xs shadow-sm">
                        {user?.name.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold">{user?.name.split(" ")[0]}</span>
                </Link>
            ) : (
                <div className="hidden md:flex items-center gap-4 border-l border-border pl-4">
                    <Link
                        to="/login"
                        className="text-sm font-semibold flex items-center gap-1 text-text-body hover:text-primary transition-colors"
                    >
                        <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-semibold flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <UserPlus className="w-4 h-4" /> Sign Up
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HeaderActions;

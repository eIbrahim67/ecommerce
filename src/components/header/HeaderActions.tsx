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
        <div className="flex items-center gap-2 lg:gap-4">
            <Link
                to="/wishlist"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-text-body hover:text-primary transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-3 py-2 hover:bg-surface-light border border-transparent hover:border-border/50"
                aria-label="Go to Wishlist"
            >
                <Heart className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span>Wishlist</span>
                {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-background shadow-sm">
                        {wishlistItems.length}
                    </span>
                )}
            </Link>

            <Link
                to="/cart"
                className="flex items-center gap-1.5 text-sm font-medium text-text-body hover:text-primary transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-3 py-2 hover:bg-surface-light border border-transparent hover:border-border/50"
                aria-label="Go to Cart"
            >
                <ShoppingCart className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span className="hidden md:inline">Cart</span>
                <span className="absolute -top-1 -right-0 md:-right-1 bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-background shadow-sm">
                    {cartCount}
                </span>
            </Link>

            {isAuthenticated ? (
                <Link
                    to="/account"
                    className="hidden md:flex items-center gap-2 text-sm text-text-body hover:text-primary transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full pl-1 pr-3 py-1 hover:bg-surface-light border border-transparent hover:border-border/50"
                    aria-label="Go to Account"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold tracking-wider group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm border border-primary/20">
                        {user?.name.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold">{user?.name.split(" ")[0]}</span>
                </Link>
            ) : (
                <div className="hidden md:flex items-center gap-3 border-l border-border/50 pl-4 ml-2">
                    <Link
                        to="/login"
                        className="text-sm font-semibold flex items-center gap-1 text-text-body hover:text-primary transition-colors px-2 py-2"
                    >
                        <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-semibold flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors hover:shadow-md hover:-translate-y-0.5 duration-300"
                    >
                        <UserPlus className="w-4 h-4" /> Sign Up
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HeaderActions;

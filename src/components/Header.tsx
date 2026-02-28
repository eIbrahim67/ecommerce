import { Link } from "react-router-dom";
import { MapPin, ShoppingCart } from "lucide-react";
import HeaderSearch from "./header/HeaderSearch";
import HeaderActions from "./header/HeaderActions";
import HeaderNav from "./header/HeaderNav";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const { cartCount } = useCart();
  
  return (
    <header className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-md border-b border-border/50 transition-all duration-300">
      {/* Mobile Header */}
      <div className="md:hidden container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <HeaderNav />
        
        {/* Logo - Centered */}
        <Link
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 group"
          aria-label="Nestmart Home"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">🛒</span>
          <div>
            <h1 className="text-xl font-bold leading-none text-heading group-hover:text-primary transition-colors" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Nest-Mart
            </h1>
            <span className="text-[10px] text-text-body tracking-widest font-semibold uppercase">Grocery</span>
          </div>
        </Link>

        {/* Cart Button */}
        <Link
          to="/cart"
          className="flex items-center gap-1.5 text-sm font-medium text-text-body hover:text-primary transition-all duration-300 relative group"
          aria-label="Go to Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-background shadow-sm">
            {cartCount}
          </span>
        </Link>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex container mx-auto px-4 xl:px-0 py-5 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
          aria-label="Nestmart Home"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">🛒</span>
          <div>
            <h1 className="text-2xl font-bold leading-none text-heading group-hover:text-primary transition-colors" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Nest-Mart
            </h1>
            <span className="text-xs text-text-body tracking-widest font-semibold uppercase">Grocery</span>
          </div>
        </Link>

        {/* Search */}
        <HeaderSearch />

        {/* Actions */}
        <HeaderActions />
      </div>

      {/* Main Navigation - Desktop Only */}
      <div className="hidden md:block">
        <HeaderNav />
      </div>
    </header>
  );
};

export default Header;
 
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-b border-border">
      {/* Top bar */}
      <div className="bg-surface-light">
        <div className="container mx-auto flex items-center justify-between py-2 text-sm text-text-body">
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="hidden md:block text-primary font-medium">100% Secure delivery without contacting the courier</p>
          <div className="flex gap-3 items-center">
            <span>Need help? Call Us: <strong className="text-primary">1900 - 888</strong></span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto py-4 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-3xl">🛒</span>
          <div>
            <h1 className="text-2xl font-bold leading-none" style={{ fontFamily: "'Quicksand', sans-serif" }}>Nest</h1>
            <span className="text-xs text-text-body">MART & GROCERY</span>
          </div>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center border border-border rounded-lg overflow-hidden">
          <select className="px-3 py-2.5 bg-surface-light text-sm text-text-body border-r border-border outline-none">
            <option>All Categories</option>
          </select>
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 outline-none text-sm"
          />
          <button className="px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Location */}
        <div className="hidden lg:flex items-center gap-1 text-sm text-text-body">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Your Location</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </Link>
          <Link to="/shop" className="flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
          <Link to="/about" className="hidden md:flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            <span>Account</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border">
        <div className="container mx-auto flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span>☰</span> Browse All Categories
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="flex items-center gap-1 text-sm text-text-body hover:text-primary transition-colors">🔥 Deals</Link>
              <Link to="/" className="text-sm font-semibold text-primary">Home</Link>
              <Link to="/about" className="text-sm text-text-body hover:text-primary transition-colors">About</Link>
              <Link to="/shop" className="text-sm text-text-body hover:text-primary transition-colors">Shop</Link>
              <Link to="/contact" className="text-sm text-text-body hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span className="font-bold text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>1900 - 888</span>
            <span className="text-text-body text-xs">24/7 Support Center</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

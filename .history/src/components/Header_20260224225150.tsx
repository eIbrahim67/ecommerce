import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import HeaderSearch from "./header/HeaderSearch";
import HeaderActions from "./header/HeaderActions";
import HeaderNav from "./header/HeaderNav";

const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
          aria-label="Nestmart Home"
        >
          <span className="text-3xl group-hover:scale-105 transition-transform" aria-hidden="true">🛒</span>
          <div>
            <h1 className="text-2xl font-bold leading-none text-heading group-hover:text-primary transition-colors" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Nest
            </h1>
            <span className="text-xs text-text-body tracking-wider font-medium">MART & GROCERY</span>
          </div>
        </Link>

        {/* Search */}
        <HeaderSearch />

        {/* Location (hidden on smaller screens) */}
        <div className="hidden xl:flex items-center gap-1.5 text-sm text-text-body bg-surface-light px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-colors cursor-default shadow-sm hover:shadow-md">
          <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="font-medium">Your Location</span>
        </div>

        {/* Actions */}
        <HeaderActions />
      </div>

      {/* Main Navigation */}
      <HeaderNav />
    </header>
  );
};

export default Header;

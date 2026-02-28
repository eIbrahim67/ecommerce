import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, LogIn, UserPlus, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const HeaderNav = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
    ];

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
                className="md:hidden p-2 text-text-body hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation Bar */}
            <div className="hidden md:block border-y border-border/40 bg-background/95 backdrop-blur-sm relative z-40">
                <div className="container mx-auto px-4 xl:px-0 flex items-center justify-between py-3">
                    <nav aria-label="Main Navigation" className="flex items-center gap-2">
                        <ul className="flex items-center gap-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path && item.path !== "/shop"
                                    || (item.path === "/shop" && location.pathname.startsWith("/shop") && item.name === "Shop");

                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className={`text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-4 py-2 ${isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-text-body hover:bg-primary/5 hover:text-primary"
                                                }`}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-text-body hover:text-primary transition-all duration-300 bg-surface-light px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md cursor-pointer">
                            🌐 العربية
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-sm bg-surface-light px-5 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
                            <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                            <span className="font-bold text-heading whitespace-nowrap" style={{ fontFamily: "'Quicksand', sans-serif" }}>1900 - 888</span>
                            <span className="text-text-body text-xs border-l border-border/50 pl-2 ml-1">24/7 Support Center</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-[72px] left-0 right-0 border-t border-border bg-white px-4 py-6 z-50 shadow-2xl max-h-[calc(100vh-72px)] overflow-y-auto">
                    <nav aria-label="Mobile Navigation">
                        <ul className="flex flex-col gap-3 mb-6">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path && item.path !== "/shop"
                                    || (item.path === "/shop" && location.pathname.startsWith("/shop") && item.name === "Shop");

                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block text-base font-bold px-4 py-3 rounded-xl transition-all ${isActive
                                                ? "text-primary bg-primary/10 shadow-sm"
                                                : "text-text-body hover:text-primary hover:bg-surface-light"
                                                }`}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        
                        {/* Auth Section */}
                        <div className="pt-4 border-t-2 border-border/50">
                            {isAuthenticated ? (
                                <Link
                                    to="/account"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 text-base font-bold px-4 py-3 rounded-xl text-text-body hover:text-primary hover:bg-surface-light transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                        {user?.name.charAt(0) || <User className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-heading">{user?.name}</p>
                                        <p className="text-xs text-text-body">View Account</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 text-base font-bold px-4 py-3 rounded-xl text-text-body hover:text-primary hover:bg-surface-light transition-all border-2 border-border"
                                    >
                                        <LogIn className="w-5 h-5" /> Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 text-base font-bold px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
                                    >
                                        <UserPlus className="w-5 h-5" /> Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t-2 border-border/50">
                            <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-text-body hover:text-primary transition-all duration-300 bg-surface-light px-4 py-3 rounded-xl border-2 border-border/50 hover:border-primary/30">
                                🌐 Switch to Arabic (العربية)
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default HeaderNav;

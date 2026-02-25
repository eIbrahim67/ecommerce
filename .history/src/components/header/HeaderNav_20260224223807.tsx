import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

export const HeaderNav = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Shop", path: "/shop" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <div className="border-t border-border">
            <div className="container mx-auto flex items-center justify-between py-3">
                <div className="flex items-center gap-6">
                    <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path && item.path !== "/shop"
                                    || (item.path === "/shop" && location.pathname.startsWith("/shop") && item.name === "Shop");

                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className={`text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5 ${isActive
                                                ? "text-primary"
                                                : "text-text-body hover:text-primary"
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-text-body hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-sm bg-surface-light px-4 py-2 rounded-full border border-border">
                    <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="font-bold text-heading whitespace-nowrap" style={{ fontFamily: "'Quicksand', sans-serif" }}>1900 - 888</span>
                    <span className="text-text-body text-xs border-l border-border pl-2 ml-1">24/7 Support Center</span>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-surface-light px-4 py-4 absolute w-full z-50 left-0 shadow-lg">
                    <nav aria-label="Mobile Navigation">
                        <ul className="flex flex-col gap-4">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path && item.path !== "/shop"
                                    || (item.path === "/shop" && location.pathname.startsWith("/shop") && item.name === "Shop");

                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block text-base font-semibold px-2 py-1.5 rounded-md transition-colors ${isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-text-body hover:text-primary hover:bg-white"
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
                </div>
            )}
        </div>
    );
};

export default HeaderNav;

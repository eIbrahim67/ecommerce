import { Link, useLocation } from "react-router-dom";
import { Phone, Menu } from "lucide-react";

export const HeaderNav = () => {
    const location = useLocation();

    const navItems = [
        { name: "🔥 Deals", path: "/shop" },
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Shop", path: "/shop" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <div className="border-t border-border">
            <div className="container mx-auto flex items-center justify-between py-3">
                <div className="flex items-center gap-6">
                    <button
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        aria-label="Browse All Categories"
                    >
                        <Menu className="w-4 h-4" /> Browse All Categories
                    </button>

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
                </div>

                <div className="hidden lg:flex items-center gap-2 text-sm bg-surface-light px-4 py-2 rounded-full border border-border">
                    <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="font-bold text-heading whitespace-nowrap" style={{ fontFamily: "'Quicksand', sans-serif" }}>1900 - 888</span>
                    <span className="text-text-body text-xs border-l border-border pl-2 ml-1">24/7 Support Center</span>
                </div>
            </div>
        </div>
    );
};

export default HeaderNav;

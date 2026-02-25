import { Link, useLocation } from "react-router-dom";
import { Phone, Menu } from "lucide-react";
import { useMemo } from "react";

export const HeaderNav = () => {
    const location = useLocation();

    // Centralized nav config (scalable for future routes)
    const navItems = useMemo(() => [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Shop", path: "/shop", matchNested: true },
        { label: "Contact", path: "/contact" },
    ], []);

    const isActiveRoute = (path: string, matchNested?: boolean) => {
        if (matchNested) {
            return location.pathname.startsWith(path);
        }
        return location.pathname === path;
    };

    return (
        <header className="border-t border-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex items-center justify-between py-3">

                {/* Left Section - Navigation */}
                <div className="flex items-center gap-8">
                    {/* Mobile Menu Button (future drawer support) */}
                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-body hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <nav
                        aria-label="Primary Navigation"
                        className="hidden md:block"
                    >
                        <ul className="flex items-center gap-8">
                            {navItems.map((item) => {
                                const isActive = isActiveRoute(item.path, item.matchNested);

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            aria-current={isActive ? "page" : undefined}
                                            className={`
                                                relative text-sm font-semibold tracking-wide
                                                transition-all duration-200
                                                px-1 py-1
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md
                                                ${isActive
                                                    ? "text-primary"
                                                    : "text-text-body hover:text-primary"
                                                }
                                            `}
                                        >
                                            {item.label}

                                            {/* Professional Active Indicator */}
                                            <span
                                                className={`
                                                    absolute left-0 -bottom-1 h-[2px] w-full origin-left
                                                    transition-transform duration-300 ease-out
                                                    ${isActive
                                                        ? "scale-x-100 bg-primary"
                                                        : "scale-x-0 bg-primary group-hover:scale-x-100"
                                                    }
                                                `}
                                            />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Right Section - Support CTA */}
                <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-surface-light/60 shadow-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>

                    <div className="flex flex-col leading-tight">
                        <span className="text-xs text-text-body font-medium">
                            24/7 Support Center
                        </span>
                        <span
                            className="text-sm font-bold text-heading tracking-wide"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                            1900 - 888
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderNav;
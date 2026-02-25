import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
    /**
     * Optional mapping of path segments to custom names
     * e.g. { "123": "Organic Quinoa" }
     */
    customSegments?: Record<string, string>;
}

export const Breadcrumbs = ({ customSegments = {} }: BreadcrumbsProps) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // Don't render breadcrumbs on the home page
    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="bg-surface-banner w-full">
            <div className="container mx-auto py-6">
                {/* Render a nice title from the last segment if available */}
                <h2 className="text-3xl font-bold mb-3 capitalize" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    {customSegments[pathnames[pathnames.length - 1]] || pathnames[pathnames.length - 1].replace(/-/g, " ")}
                </h2>

                <ol className="flex items-center gap-2 text-sm text-text-body flex-wrap">
                    <li className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Home</span>
                        </Link>
                    </li>

                    {pathnames.map((value, index) => {
                        const isLast = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                        // Format the readable text: use custom segment if provided, else capitalize and replace hyphens
                        const label = customSegments[value]
                            ? customSegments[value]
                            : value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                        return (
                            <li key={to} className="flex items-center gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-border" aria-hidden="true" />
                                {isLast ? (
                                    <span className="text-primary font-medium" aria-current="page">
                                        {label}
                                    </span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumbs;

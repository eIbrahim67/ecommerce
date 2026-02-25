import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center border border-border rounded-lg overflow-hidden">
            <select
                className="px-3 py-2.5 bg-surface-light text-sm text-text-body border-r border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Select Category"
            >
                <option>All Categories</option>
            </select>
            <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 outline-none text-sm focus:bg-surface-light/50 transition-colors"
                aria-label="Search items"
            />
            <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                aria-label="Search"
            >
                <Search className="w-4 h-4" />
            </button>
        </form>
    );
};

export default HeaderSearch;

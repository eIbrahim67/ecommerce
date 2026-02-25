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
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center border border-border/70 rounded-full overflow-hidden focus-within:shadow-md focus-within:border-primary/50 transition-all duration-300 bg-surface-light/30">
            <select
                className="px-4 py-2.5 bg-transparent text-sm font-medium text-text-body border-r border-border/50 outline-none hover:text-primary cursor-pointer transition-colors"
                aria-label="Select Category"
            >
                <option>All Categories</option>
            </select>
            <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 outline-none text-sm bg-transparent placeholder:text-text-body/60"
                aria-label="Search items"
            />
            <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none flex items-center justify-center"
                aria-label="Search"
            >
                <Search className="w-4 h-4" />
            </button>
        </form>
    );
};

export default HeaderSearch;

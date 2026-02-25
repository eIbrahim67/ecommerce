import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, unwrapResponse } from "@/lib/api";

interface CategoryOption {
    id: number;
    name: string;
}

const HeaderSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/categories").then(res => {
            try {
                const env = unwrapResponse(res.data);
                setCategories((env.data || []).map((c: any) => ({ id: c.id, name: c.name })));
            } catch {
                // silently skip
            }
        }).catch(() => { });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
        navigate(`/shop?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center border border-border/70 rounded-full overflow-hidden focus-within:shadow-md focus-within:border-primary/50 transition-all duration-300 bg-surface-light/30">
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="px-4 py-2.5 bg-transparent text-sm font-medium text-text-body border-r border-border/50 outline-none hover:text-primary cursor-pointer transition-colors"
                aria-label="Select Category"
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
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

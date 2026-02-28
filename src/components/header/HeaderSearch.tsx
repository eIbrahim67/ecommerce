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
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center border-2 border-border/70 rounded-2xl overflow-hidden focus-within:shadow-xl focus-within:border-primary transition-all duration-300 bg-white">
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="px-5 py-3.5 bg-transparent text-sm font-semibold text-heading border-r-2 border-border/50 outline-none hover:text-primary cursor-pointer transition-colors"
                aria-label="Select Category"
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
            </select>
            <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-text-body/50 mr-3" />
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3.5 outline-none text-sm bg-transparent placeholder:text-text-body/60 font-medium"
                    aria-label="Search items"
                />
            </div>
            <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all focus:outline-none flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95"
                aria-label="Search"
            >
                Search
            </button>
        </form>
    );
};

export default HeaderSearch;

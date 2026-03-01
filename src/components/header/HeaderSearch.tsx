import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, unwrapResponse } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { CategoryDto } from "@/types/api";
import { getLocalizedText } from "@/utils/localization";

const HeaderSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const { t, isRTL, direction, currentLanguage } = useLanguage();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        api.get("/categories").then(res => {
            try {
                const env = unwrapResponse(res.data);
                setCategories(env.data || []);
            } catch {
                // silently skip
            }
        }).catch(() => { });
    }, []);

    // Keyboard shortcut: Ctrl/Cmd + K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() && !selectedCategoryId) return;
        
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
        navigate(`/shop?${params.toString()}`);
        
        // Reset loading state after navigation
        setTimeout(() => setIsLoading(false), 500);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setSearchQuery("");
        inputRef.current?.focus();
    };

    return (
        <form 
            onSubmit={handleSearch}
            dir={direction}
            className={`flex-1 max-w-2xl hidden md:flex items-stretch border-2 rounded-2xl overflow-hidden transition-all duration-300 bg-white shadow-sm ${
                isFocused 
                    ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                    : 'border-border/70 hover:border-border'
            }`}
        >
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className={`px-4 py-3.5 bg-transparent text-sm font-semibold text-heading outline-none hover:bg-muted/30 cursor-pointer transition-colors focus:bg-muted/50 ${
                    isRTL 
                        ? 'border-l-2 border-border/50' 
                        : 'border-r-2 border-border/50'
                }`}
                aria-label={t('products:selectCategory', 'Select Category')}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <option value="">{t('products:allCategories', 'All Categories')}</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                        {getLocalizedText(cat.name, cat.nameAr, currentLanguage)}
                    </option>
                ))}
            </select>
            
            <div className="flex-1 flex items-center px-4 relative">
                <Search className={`w-5 h-5 transition-colors ${
                    isFocused ? 'text-primary' : 'text-text-body/50'
                } ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={t('common:buttons.search') + '...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 py-3.5 outline-none text-sm bg-transparent placeholder:text-text-body/60 font-medium"
                    aria-label={t('common:searchPlaceholder', 'Search for products')}
                />
                
                {/* Clear button */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={`p-1 hover:bg-muted rounded-full transition-colors group ${isRTL ? 'mr-2' : 'ml-2'}`}
                        aria-label={t('common:clear', 'Clear search')}
                    >
                        <X className="w-4 h-4 text-text-body/50 group-hover:text-text-body" />
                    </button>
                )}
                
                {/* Keyboard shortcut hint */}
                {!isFocused && !searchQuery && (
                    <kbd className={`hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-text-body/60 bg-muted border border-border/50 rounded ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        <span className="text-[10px]">⌘</span>K
                    </kbd>
                )}
            </div>
            
            <button
                type="submit"
                disabled={isLoading || (!searchQuery.trim() && !selectedCategoryId)}
                className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95 whitespace-nowrap"
                aria-label={t('common:buttons.search', 'Search')}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    t('common:buttons.search', 'Search')
                )}
            </button>
        </form>
    );
};

export default HeaderSearch;

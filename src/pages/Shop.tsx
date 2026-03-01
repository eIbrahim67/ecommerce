import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import { ShopProductListSkeleton, SidebarSkeleton } from "@/components/SkeletonLoader";
import SEO from "@/components/SEO";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, unwrapResponse } from "@/lib/api";
import { ProductSummaryDto, CategoryDto } from "@/types/api";
import { getLocalizedText } from "@/utils/localization";
import { useLanguage } from "@/hooks/useLanguage";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { currentLanguage, t } = useLanguage();

  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number>(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const res = await api.get("/categories");
        const env = unwrapResponse(res.data);
        setCategories(env.data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        const params: any = {
          page: currentPage,
          limit: 12, // 12 items per page for the grid
          maxPrice: priceRange,
        };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategoryId !== null) params.categoryId = selectedCategoryId;

        if (sortBy === "price-low") params.sortBy = "price-asc";
        else if (sortBy === "price-high") params.sortBy = "price-desc";
        else if (sortBy === "newest") params.sortBy = "newest";
        else if (sortBy === "rating") params.sortBy = "rating";

        const res = await api.get("/products", { params });
        const env = unwrapResponse(res.data);
        setProducts(env.data || []);

        // Calculate total pages safely based on pageSize (12) and totalCount
        const totalCount = env.totalCount || 0;
        const limit = params.limit || 12;
        setTotalPages(Math.ceil(totalCount / limit) || 1);
        setTotalItems(totalCount);
      } catch (error) {
        console.error("Failed to load products", error);
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsProductsLoading(false);
      }
    };

    // Slight debounce for price slider
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategoryId, priceRange, sortBy, currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop All Organic Products | NestMart"
        description="Browse our wide selection of fresh organic groceries, snacks, pet foods, and more at the best prices."
      />
      <Header />

      {/* Category Links replacing static breadcrumb links */}
      <section className="bg-gradient-to-br from-surface-light to-white py-10 border-b border-border/50">
        <div className="container mx-auto px-4 xl:px-0 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            {t('products:shopByCategory')}
          </h2>
          <p className="text-text-body mb-8 text-lg">{t('products:findWhatYouNeed')}</p>
          {isCategoriesLoading ? (
            <div className="flex flex-wrap justify-center gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-32 bg-surface-light rounded-full animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setSelectedCategoryId(null); setCurrentPage(1); }}
                className={`text-sm font-bold px-7 py-3 rounded-full transition-all duration-300 ${!selectedCategoryId ? "bg-primary text-primary-foreground shadow-xl scale-110" : "bg-white text-text-body border-2 border-border/50 hover:border-primary hover:text-primary hover:scale-105 hover:shadow-lg"}`}
              >
                {t('products:allProducts')}
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id); setCurrentPage(1); }}
                  className={`text-sm font-bold px-7 py-3 rounded-full transition-all duration-300 ${selectedCategoryId === cat.id ? "bg-primary text-primary-foreground shadow-xl scale-110" : "bg-white text-text-body border-2 border-border/50 hover:border-primary hover:text-primary hover:scale-105 hover:shadow-lg"}`}
                >
                  {getLocalizedText(cat.name, cat.nameAr, currentLanguage)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 xl:px-0 my-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {isCategoriesLoading ? (
            <SidebarSkeleton />
          ) : (
            <aside className="w-full lg:w-72 shrink-0 space-y-6">
              <div className="bg-gradient-to-br from-white to-surface-light border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold mb-5 text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('products:labels.category')}
                </h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => { setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id); setCurrentPage(1); }}
                      className={`flex items-center justify-between text-sm cursor-pointer transition-all p-3 rounded-xl ${selectedCategoryId === cat.id ? "text-primary font-bold bg-primary/10 scale-105" : "text-text-body hover:text-primary hover:bg-surface-light"}`}
                    >
                      <span className="flex items-center gap-3"><span className="text-xl">{cat.imageUrl || "🛒"}</span> {getLocalizedText(cat.name, cat.nameAr, currentLanguage)}</span>
                      <span className="bg-white text-xs px-3 py-1 rounded-full text-text-body font-semibold shadow-sm">{cat.productCount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-white to-surface-light border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold mb-5 text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('products:filterByPrice')}
                </h3>
                <input
                  type="range"
                  className="w-full accent-primary pointer-events-auto h-2 rounded-full"
                  min={0}
                  max={500}
                  step={5}
                  value={priceRange}
                  onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                />
                <div className="flex justify-between text-sm text-text-body mt-3 font-semibold">
                  <span>{t('products:from')}: $0</span>
                  <span className="text-primary text-base">{t('products:to')}: ${priceRange}</span>
                </div>

                <button
                  className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
                  onClick={() => { setSelectedCategoryId(null); setPriceRange(500); setCurrentPage(1); }}
                >
                  {t('products:clearAllFilters')}
                </button>
              </div>
            </aside>
          )}

          {/* Product grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 bg-white border border-border rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-text-body">
                {t('products:weFound')} <span className="text-primary font-bold text-lg">{totalItems}</span> {t('products:itemsForYou')}
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="text-sm border-2 border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary font-semibold transition-all"
                >
                  <option value="featured">{t('products:sorting.sortBy')}: {t('products:sorting.featured')}</option>
                  <option value="newest">{t('products:sorting.newest')}</option>
                  <option value="price-low">{t('products:sorting.priceLowToHigh')}</option>
                  <option value="price-high">{t('products:sorting.priceHighToLow')}</option>
                  <option value="rating">{t('products:sorting.topRated')}</option>
                </select>
              </div>
            </div>

            {isProductsLoading ? (
              <ShopProductListSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-surface-light to-white rounded-2xl border-2 border-dashed border-border">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3">{t('products:noProductsFound')}</h3>
                <p className="text-text-body mb-6">{t('products:tryAdjustingFilters')}</p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setPriceRange(500);
                    setCurrentPage(1);
                  }}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg"
                >
                  {t('products:clearAllFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${i + 1 === currentPage ? "bg-primary text-primary-foreground shadow-lg scale-110" : "bg-white border-2 border-border text-text-body hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-md"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <div className="container mx-auto px-4 xl:px-0">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default Shop;

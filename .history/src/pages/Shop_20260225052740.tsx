import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard, { ProductSummaryDto } from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, unwrapResponse } from "@/lib/api";

interface CategoryDto {
  id: number;
  name: string;
  imageUrl: string | null;
  productCount: number;
}

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number>(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const env = unwrapResponse(res.data);
        setCategories(env.data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
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
      <section className="bg-surface-banner py-8 border-b border-border/50">
        <div className="container mx-auto px-4 xl:px-0 text-center">
          <h2 className="text-2xl font-bold mb-6 text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setSelectedCategoryId(null); setCurrentPage(1); }}
              className={`text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 ${!selectedCategoryId ? "bg-primary text-primary-foreground shadow-md -translate-y-0.5" : "bg-surface-light text-text-body border border-border/50 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-sm"}`}
            >
              All Products
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id); setCurrentPage(1); }}
                className={`text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 ${selectedCategoryId === cat.id ? "bg-primary text-primary-foreground shadow-md -translate-y-0.5" : "bg-surface-light text-text-body border border-border/50 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-sm"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 xl:px-0 my-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Category</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => { setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id); setCurrentPage(1); }}
                    className={`flex items-center justify-between text-sm cursor-pointer transition-colors ${selectedCategoryId === cat.id ? "text-primary font-bold" : "text-text-body hover:text-primary"}`}
                  >
                    <span className="flex items-center gap-2"><span>{cat.imageUrl || "🛒"}</span> {cat.name}</span>
                    <span className="bg-surface-light text-xs px-2 py-0.5 rounded-full text-text-body font-normal">{cat.productCount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Fill by price</h3>
              <input
                type="range"
                className="w-full accent-primary pointer-events-auto"
                min={0}
                max={500}
                step={5}
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              />
              <div className="flex justify-between text-xs text-text-body mt-1">
                <span>From: $0</span>
                <span className="text-primary">To ${priceRange}</span>
              </div>

              <button
                className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                onClick={() => { setSelectedCategoryId(null); setPriceRange(500); setCurrentPage(1); }}
              >
                Clear Filters
              </button>
            </div>

            {/* Omitted "New Products" sidebar block for now to prevent overfetching or using static data, unless we build a dedicated api call. We can just hide it as it's redundant to the main list. */}
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-body">We found <span className="text-primary font-bold">{totalItems}</span> items for you!</p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {isProductsLoading ? (
              <div className="text-center py-20 text-text-body">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-surface-light rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-text-body">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setPriceRange(500);
                    setCurrentPage(1);
                  }}
                  className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${i + 1 === currentPage ? "bg-primary text-primary-foreground" : "bg-surface-light text-text-body hover:bg-primary hover:text-primary-foreground"}`}
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

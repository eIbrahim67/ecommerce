import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { products, categories, type Product } from "@/data/products";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(1000);

  const filterTags = ["Snack", "Vegetables", "Pet Foods", "Drinks", "Fresh Foods"];

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery));
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => {
        // Since categories array has different names than product.category in some cases
        // We'll do a loose match or exact if possible.
        return p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(p.category.toLowerCase());
      });
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "featured":
      default:
        // Keep original order or sort by rating
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

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
              onClick={() => setSelectedCategory(null)}
              className={`text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 ${!selectedCategory ? "bg-primary text-primary-foreground shadow-md -translate-y-0.5" : "bg-surface-light text-text-body border border-border/50 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-sm"}`}
            >
              All Products
            </button>
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedCategory(selectedCategory === tag ? null : tag)}
                className={`text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === tag ? "bg-primary text-primary-foreground shadow-md -translate-y-0.5" : "bg-surface-light text-text-body border border-border/50 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-sm"}`}
              >
                {tag}
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
                    key={cat.name}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={`flex items-center justify-between text-sm cursor-pointer transition-colors ${selectedCategory === cat.name ? "text-primary font-bold" : "text-text-body hover:text-primary"}`}
                  >
                    <span className="flex items-center gap-2"><span>{cat.icon}</span> {cat.name}</span>
                    <span className="bg-surface-light text-xs px-2 py-0.5 rounded-full text-text-body font-normal">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Fill by price</h3>
              <input
                type="range"
                className="w-full accent-primary"
                min={0}
                max={100}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-text-body mt-1">
                <span>From: $0</span>
                <span className="text-primary">To ${priceRange}</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-text-body">Color</p>
                {["Red", "Green", "Blue"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                    <input type="checkbox" className="accent-primary rounded" /> {c}
                  </label>
                ))}
              </div>
              <button className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                🔍 Filter
              </button>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>New products</h3>
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 mb-3 last:mb-0">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary hover:underline cursor-pointer" style={{ fontFamily: "'Quicksand', sans-serif" }}>{p.name.split(" ").slice(0, 2).join(" ")}</h4>
                    <p className="text-xs text-text-body">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-body">We found <span className="text-primary font-bold">{filteredProducts.length}</span> items for you!</p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-surface-light rounded-xl border border-border">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-text-body">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange(100);
                  }}
                  className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3, "...", 6].map((p, i) => (
                <button key={i} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === 2 ? "bg-primary text-primary-foreground" : "bg-surface-light text-text-body hover:bg-primary hover:text-primary-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
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

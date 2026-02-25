import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { useState } from "react";

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");
  const filterTags = ["Cabbage", "Broccoli", "Artichoke", "Celery", "Spinach"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb banner */}
      <section className="bg-surface-banner">
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>Snack</h2>
          <div className="flex items-center gap-2 text-sm text-text-body mb-4">
            <span>🏠 Home</span> <span>/</span> <span>Shop</span> <span>/</span> <span className="text-primary">Snack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => (
              <button key={tag} className="bg-background border border-border text-sm px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto my-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Category</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.name} className="flex items-center justify-between text-sm text-text-body hover:text-primary cursor-pointer transition-colors">
                    <span className="flex items-center gap-2"><span>{cat.icon}</span> {cat.name}</span>
                    <span className="bg-surface-light text-xs px-2 py-0.5 rounded-full">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Fill by price</h3>
              <input type="range" className="w-full accent-primary" min={0} max={1000} />
              <div className="flex justify-between text-xs text-text-body mt-1">
                <span>From: $100</span>
                <span className="text-primary">To $1,000</span>
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
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
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
              <p className="text-sm text-text-body">We found <span className="text-primary font-bold">{products.length}</span> items for you!</p>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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

      <div className="container mx-auto">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default Shop;

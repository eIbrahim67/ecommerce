import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard, { ProductSummaryDto } from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useEffect, useState } from "react";
import { api, unwrapResponse } from "@/lib/api";

interface CategoryDto {
  id: number;
  name: string;
  icon: string | null;
  count: number;
}

const Index = () => {
  const [popularProducts, setPopularProducts] = useState<ProductSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

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
        const params: any = { limit: 10 };
        if (activeCategory !== null) {
          params.categoryId = activeCategory;
        }

        const res = await api.get("/products", { params });
        const env = unwrapResponse(res.data);
        setPopularProducts(env.data || []);
      } catch (error) {
        console.error("Failed to load popular products", error);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="container mx-auto px-4 xl:px-0 my-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(75 80% 70%) 0%, hsl(95 60% 65%) 100%)` }}>
          <div className="flex items-center">
            <div className="hidden md:block flex-1">
              <img src={heroBanner} alt="Fresh Vegetables" className="w-full h-80 object-cover" />
            </div>
            <div className="p-8 md:p-12 flex-1 text-center md:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif", color: 'hsl(0 0% 100%)' }}>
                Fresh Vegetables<br />Big discount
              </h2>
              <p className="text-lg mb-6" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>Sign up for the daily newsletter</p>
              <div className="flex gap-2 justify-center md:justify-start">
                <input type="email" placeholder="Your email address" className="px-4 py-2.5 rounded-lg text-sm outline-none w-64 border-none" />
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4 xl:px-0 my-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Popular Products</h2>
          <div className="hidden md:flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${activeCategory === null ? "bg-primary text-primary-foreground" : "bg-surface-light text-text-body hover:bg-primary hover:text-primary-foreground"}`}
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-sm px-4 py-1.5 rounded-full transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-surface-light text-text-body hover:bg-primary hover:text-primary-foreground"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {popularProducts.length === 0 ? (
          <p className="text-center text-text-body py-8">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Categories */}
      <section className="container mx-auto px-4 xl:px-0 my-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>Shop by Categories</h2>
          <p className="text-text-body">Explore our wide range of fresh and organic products</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?categoryId=${cat.id}`} className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-[140px] sm:w-[160px]">
              <span className="text-4xl mb-4 block drop-shadow-sm">{cat.icon || "🛒"}</span>
              <h4 className="text-sm font-bold mb-1.5 text-heading" style={{ fontFamily: "'Quicksand', sans-serif" }}>{cat.name}</h4>
              <p className="text-xs text-text-body font-medium">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 xl:px-0">
        <NewsletterBanner />
      </div>

      <Footer />
    </div>
  );
};

export default Index;

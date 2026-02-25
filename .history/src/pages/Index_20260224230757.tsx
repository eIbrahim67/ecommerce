import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import { products, dealProducts, categories } from "@/data/products";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const popularProducts = products.slice(0, 10);
  const categoryTabs = ["All", "Fresh Fruits", "Vegetables", "Milks & Dairies", "Snack"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="container mx-auto my-6">
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
      <section className="container mx-auto my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Popular Products</h2>
          <div className="hidden md:flex gap-3">
            {categoryTabs.map((tab) => (
              <button key={tab} className={`text-sm px-4 py-1.5 rounded-full transition-colors ${tab === "All" ? "bg-primary text-primary-foreground" : "bg-surface-light text-text-body hover:bg-primary hover:text-primary-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="container mx-auto my-12">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to="/shop" className="bg-surface-light border border-border rounded-xl p-4 text-center hover:border-primary hover:shadow-md transition-all">
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <h4 className="text-sm font-bold mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>{cat.name}</h4>
              <p className="text-xs text-text-body">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="container mx-auto">
        <NewsletterBanner />
      </div>

      <Footer />
    </div>
  );
};

export default Index;

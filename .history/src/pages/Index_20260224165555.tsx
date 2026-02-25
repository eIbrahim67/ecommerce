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

      {/* Deals of the Day */}
      <section className="container mx-auto my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif" }}>Deals Of The Day</h2>
          <Link to="/shop" className="text-sm text-text-body hover:text-primary transition-colors flex items-center gap-1">
            All Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealProducts.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {["426 Days", "07 Hours", "30 Mins", "56 Sec"].map((t) => (
                    <span key={t} className="bg-background/90 backdrop-blur-sm text-xs font-bold px-1.5 py-1 rounded text-heading">{t}</span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < product.rating ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-xs text-text-body mb-2">By <span className="text-primary">{product.brand}</span></p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="price-current">${product.price.toFixed(2)}</span>
                    <span className="price-old">${product.oldPrice.toFixed(2)}</span>
                  </div>
                  <button className="bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors font-medium">
                    <ShoppingCart className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </div>
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

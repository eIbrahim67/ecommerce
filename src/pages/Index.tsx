import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import { ProductListSkeleton, CategoryListSkeleton } from "@/components/SkeletonLoader";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Truck, Headphones } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useEffect, useState } from "react";
import { api, unwrapResponse } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { ProductSummaryDto, CategoryDto } from "@/types/api";
import { getLocalizedText } from "@/utils/localization";

const Index = () => {
  const [popularProducts, setPopularProducts] = useState<ProductSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await api.get("/categories");
        const env = unwrapResponse(res.data);
        setCategories(env.data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const params: any = { limit: 10 };
        if (activeCategory !== null) {
          params.categoryId = activeCategory;
        }

        const res = await api.get("/products", { params });
        const env = unwrapResponse(res.data);
        setPopularProducts(env.data || []);
      } catch (error) {
        console.error("Failed to load popular products", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="container mx-auto px-4 xl:px-0 my-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
          <img src={heroBanner} alt="Fresh Vegetables" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8 md:px-16">
              <div className="max-w-2xl">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-4">
                  🎉 {t('home:hero.badge')}
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold mb-4 text-white leading-tight" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  {t('home:hero.title')}<br />
                  <span className="text-yellow-300">{t('home:hero.titleHighlight')}</span>
                </h2>
                <p className="text-lg mb-8 text-white/90 max-w-md">{t('home:hero.description')}</p>
                <Link 
                  to="/shop" 
                  className="inline-block bg-white text-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg"
                >
                  {t('home:hero.shopNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 xl:px-0 my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <Truck className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm mb-1 text-heading">{t('home:features.freeShipping.title')}</h4>
            <p className="text-xs text-text-body">{t('home:features.freeShipping.description')}</p>
          </div>
          <div className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <Shield className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm mb-1 text-heading">{t('home:features.securePayment.title')}</h4>
            <p className="text-xs text-text-body">{t('home:features.securePayment.description')}</p>
          </div>
          <div className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm mb-1 text-heading">{t('home:features.bestPrices.title')}</h4>
            <p className="text-xs text-text-body">{t('home:features.bestPrices.description')}</p>
          </div>
          <div className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <Headphones className="w-10 h-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm mb-1 text-heading">{t('home:features.support.title')}</h4>
            <p className="text-xs text-text-body">{t('home:features.support.description')}</p>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4 xl:px-0 my-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{t('home:popularProducts.title')}</h2>
            <p className="text-text-body">{t('home:popularProducts.subtitle')}</p>
          </div>
          {!isLoadingCategories && (
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-sm px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${activeCategory === null ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-surface-light text-text-body hover:bg-primary/10 hover:text-primary hover:scale-105"}`}
              >
                {t('home:popularProducts.all')}
              </button>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-sm px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-surface-light text-text-body hover:bg-primary/10 hover:text-primary hover:scale-105"}`}
                >
                  {cat.imageUrl || ""} {getLocalizedText(cat.name, cat.nameAr, currentLanguage)}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoadingProducts ? (
          <ProductListSkeleton count={10} />
        ) : popularProducts.length === 0 ? (
          <div className="text-center py-16 bg-surface-light rounded-2xl border border-border/50">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-text-body">{t('home:popularProducts.noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Categories */}
      <section className="container mx-auto px-4 xl:px-0 my-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>{t('home:categories.title')}</h2>
          <p className="text-text-body text-lg">{t('home:categories.subtitle')}</p>
        </div>
        {isLoadingCategories ? (
          <CategoryListSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/shop?categoryId=${cat.id}`} 
                className="bg-gradient-to-br from-surface-light to-white border border-border/50 rounded-2xl p-6 text-center hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-5xl mb-4 block drop-shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10">{cat.imageUrl || "🛒"}</span>
                <h4 className="text-sm font-bold mb-1.5 text-heading relative z-10" style={{ fontFamily: "'Quicksand', sans-serif" }}>{getLocalizedText(cat.name, cat.nameAr, currentLanguage)}</h4>
                <p className="text-xs text-text-body font-medium relative z-10">{cat.productCount} {t('home:categories.items')}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 xl:px-0">
        <NewsletterBanner />
      </div>

      <Footer />
    </div>
  );
};

export default Index;

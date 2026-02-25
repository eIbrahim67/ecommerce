import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Star, ShoppingCart, Heart, Shuffle, Minus, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const weights = ["50g", "60g", "100g", "150g"];
  const [selectedWeight, setSelectedWeight] = useState("60g");

  const tabs = ["Description", "Additional info", "Vendor", "Reviews (3)"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto my-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Image */}
              <div className="md:w-1/2">
                <div className="bg-surface-light rounded-xl overflow-hidden aspect-square flex items-center justify-center border border-border">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 mt-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${i === 0 ? "border-primary" : "border-border hover:border-primary"}`}>
                      <img src={product.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="md:w-1/2">
                {product.badge && <span className="badge-sale mb-3 inline-block">Sale Off</span>}
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{product.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < product.rating ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-text-body">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-primary" style={{ fontFamily: "'Quicksand', sans-serif" }}>${product.price.toFixed(0)}</span>
                  <span className="text-lg text-text-price-old line-through">${product.oldPrice.toFixed(0)}</span>
                  <span className="badge-discount text-xs">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% Off
                  </span>
                </div>
                <p className="text-text-body text-sm leading-relaxed mb-4">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti incidunt minima nisi modi, quasi, odio minus dolore impedit fuga eurn eligendi.
                </p>

                {/* Size/Weight */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-text-body">Size / Weight:</span>
                  <div className="flex gap-2 mt-2">
                    {weights.map((w) => (
                      <button key={w} onClick={() => setSelectedWeight(w)} className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${selectedWeight === w ? "bg-primary text-primary-foreground border-primary" : "border-border text-text-body hover:border-primary"}`}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to cart */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-text-body hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 py-2 font-bold text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-text-body hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, qty, selectedWeight);
                      toast.success(`${qty}x ${product.name} added to cart`);
                    }}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to cart
                  </button>
                  <button
                    onClick={() => {
                      if (isWishlisted) {
                        removeFromWishlist(product.id);
                        toast.info("Removed from wishlist");
                      } else {
                        addToWishlist(product);
                        toast.success("Added to wishlist");
                      }
                    }}
                    className={`border p-2.5 rounded-lg transition-colors ${isWishlisted ? "bg-red-50 text-red-500 border-red-200" : "border-border text-text-body hover:text-primary hover:border-primary"}`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button className="border border-border p-2.5 rounded-lg text-text-body hover:text-primary hover:border-primary transition-colors"><Shuffle className="w-4 h-4" /></button>
                </div>

                <div className="text-sm text-text-body space-y-1">
                  <p>Type: <span className="text-primary">Organic</span></p>
                  <p>SKU: <span>FWM15VKT</span></p>
                  <p>MFG: Jun 4, 2021</p>
                  <p>Tags: Snack, Organic, Brown</p>
                  <p>Stock: <span className="text-primary">8 Items In Stock</span></p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().split(" ")[0])}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.toLowerCase().split(" ")[0] ? "border-primary text-primary" : "border-transparent text-text-body hover:text-primary"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="prose prose-sm text-text-body max-w-none mb-12">
              <p>Uninhibited carnally hired played in whimpered dear gorilla koala depending and much yikes off far quetzal goodness and from for grimaced goodness unaccountably and meadowlark near unfathomingly.</p>
              <h3 className="font-bold mt-6 mb-3">Packaging & Delivery</h3>
              <p>Less lion goodness that sympathetically robin expeditiously busted snugly scratched for while thin cardinally rigid after due dive especially less lean.</p>
              <h3 className="font-bold mt-6 mb-3">Suggested Use</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refrigeration not necessary.</li>
                <li>Stir before serving.</li>
              </ul>
            </div>

            {/* Related */}
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>Related products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

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
        </div>
      </div>

      <div className="container mx-auto">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;

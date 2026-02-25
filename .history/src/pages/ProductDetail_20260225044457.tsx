import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import NewsletterBanner from "@/components/NewsletterBanner";
import ProductCard, { ProductSummaryDto } from "@/components/ProductCard";
import { Star, ShoppingCart, Heart, Shuffle, Minus, Plus } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, unwrapResponse } from "@/lib/api";
import { toast } from "sonner";

interface ProductVariantDto {
  id: number;
  variantName: string;
  priceAdjustment: number;
  stockQuantity: number;
}

interface ProductDto {
  id: number;
  name: string;
  brand: string;
  vendor: string;
  type: string;
  categoryId: number;
  compareAtPrice: number | null;
  basePrice: number;
  discountPercent: number | null;
  averageRating: number;
  reviewCount: number;
  imageUrls: string[];
  badge: "hot" | "new" | "sale" | "discount" | null;
  description: string;
  sku: string;
  tags: string[];
  variants: ProductVariantDto[];
}

interface CategoryDto {
  id: number;
  name: string;
  icon: string | null;
  count: number;
}

interface ReviewDto {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [mainImage, setMainImage] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDto | null>(null);

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const tabs = ["Description", "Additional info", "Vendor", "Reviews"];

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/products/${id}`);
        const env = unwrapResponse(res.data);
        const data = env.data;
        setProduct(data);

        if (data.imageUrls && data.imageUrls.length > 0) {
          setMainImage(data.imageUrls[0]);
        }

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        } else {
          setSelectedVariant(null);
        }

        // Fetch related products from same category
        if (data.categoryId) {
          const relRes = await api.get(`/products`, { params: { categoryId: data.categoryId, limit: 4 } });
          const rootRelData = unwrapResponse(relRes.data);
          // filter out the current product
          const filtered = (rootRelData.data || []).filter((p: ProductSummaryDto) => p.id !== data.id).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductAndRelated();
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "reviews" && id) {
      const fetchReviews = async () => {
        try {
          const res = await api.get(`/products/${id}/reviews`);
          setReviews(unwrapResponse(res.data)?.data || []);
        } catch (err) {
          console.error("Failed to load reviews:", err);
        }
      };
      fetchReviews();
    }
  }, [activeTab, id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a review.");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Review comment is required.");
      return;
    }
    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      unwrapResponse(res.data);
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
      // reload reviews
      const reloadRes = await api.get(`/products/${id}/reviews`);
      setReviews(unwrapResponse(reloadRes.data)?.data || []);
    } catch (error: any) {
      console.error("Submit review error:", error);
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">Loading product...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate dynamic price based on selected variant
  const displayPrice = selectedVariant
    ? product.basePrice + (selectedVariant.priceAdjustment || 0)
    : product.basePrice;

  const displayOriginalPrice = selectedVariant && product.compareAtPrice !== null
    ? product.compareAtPrice + (selectedVariant.priceAdjustment || 0)
    : (product.compareAtPrice || product.basePrice);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} | NestMart`}
        description={product.description || `Buy ${product.name} from NestMart.`}
        type="product"
      />
      <Header />

      <div className="container mx-auto px-4 xl:px-0 my-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Image Gallery */}
              <div className="md:w-1/2">
                <div className="bg-surface-light rounded-xl overflow-hidden aspect-square flex items-center justify-center border border-border mb-3">
                  <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.imageUrls.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setMainImage(url)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-colors ${mainImage === url ? "border-primary" : "border-border hover:border-primary"}`}
                      >
                        <img src={url} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="md:w-1/2">
                <div className="flex gap-2 mb-3">
                  {product.badge === "sale" && <span className="badge-sale inline-block">Sale</span>}
                  {product.badge === "hot" && <span className="badge-sale bg-red-500 text-white inline-block">Hot</span>}
                  {product.badge === "new" && <span className="badge-discount bg-brand-green text-primary-foreground">New</span>}
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>{product.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-text-body">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-primary" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    ${displayPrice.toFixed(2)}
                  </span>
                  {displayOriginalPrice > displayPrice && (
                    <span className="text-lg text-text-price-old line-through">
                      ${displayOriginalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercent !== null && product.discountPercent > 0 && (
                    <span className="badge-discount text-xs">
                      {Math.round(product.discountPercent)}% Off
                    </span>
                  )}
                </div>

                <p className="text-text-body text-sm leading-relaxed mb-4">
                  {product.description || "No description provided."}
                </p>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-text-body block mb-2">Options:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${selectedVariant?.id === v.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-text-body hover:border-primary"}`}
                        >
                          {v.variantName} {v.priceAdjustment > 0 ? `(+$${v.priceAdjustment.toFixed(2)})` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to cart */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="flex items-center border border-border rounded-lg h-11">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 h-full text-text-body hover:text-primary transition-colors flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                    <span className="w-8 text-center font-bold text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-3 h-full text-text-body hover:text-primary transition-colors flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      await addToCart(product.id, selectedVariant?.id, qty);
                    }}
                    className="bg-primary text-primary-foreground px-6 h-11 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to cart
                  </button>
                  <button
                    onClick={async () => {
                      if (isWishlisted) {
                        await removeFromWishlist(product.id);
                      } else {
                        await addToWishlist(product.id);
                      }
                    }}
                    className={`border h-11 w-11 flex items-center justify-center rounded-lg transition-colors ${isWishlisted ? "bg-red-50 text-red-500 border-red-200" : "border-border text-text-body hover:text-primary hover:border-primary"}`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button className="border border-border h-11 w-11 flex items-center justify-center rounded-lg text-text-body hover:text-primary hover:border-primary transition-colors"><Shuffle className="w-4 h-4" /></button>
                </div>

                <div className="text-sm text-text-body space-y-1.5 pt-4 border-t border-border">
                  <p>Brand: <span className="font-semibold">{product.brand}</span></p>
                  <p>Type: <span className="text-text-body">{product.type || "N/A"}</span></p>
                  <p>Category: <Link to={`/shop?categoryId=${product.categoryId}`} className="text-primary hover:underline">Category #{product.categoryId}</Link></p>
                  <p>SKU: <span>{product.sku || "N/A"}</span></p>
                  {product.tags && product.tags.length > 0 && (
                    <p>Tags: <span className="text-primary">{product.tags.join(", ")}</span></p>
                  )}
                  {selectedVariant && (
                    <p>Stock: <span className={selectedVariant.stockQuantity > 0 ? "text-brand-green font-semibold" : "text-red-500 font-semibold"}>
                      {selectedVariant.stockQuantity > 0 ? `${selectedVariant.stockQuantity} Items In Stock` : "Out of Stock"}
                    </span></p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const tabKey = tab.toLowerCase().split(" ")[0];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tabKey)}
                      className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === tabKey ? "border-primary text-primary" : "border-transparent text-text-body hover:text-primary"}`}
                    >
                      {tab} {tab === "Reviews" && `(${product.reviewCount})`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="prose prose-sm text-text-body max-w-none mb-12">
              {activeTab === "description" && (
                <div>
                  <p>{product.description || "No description provided."}</p>
                </div>
              )}
              {activeTab === "vendor" && (
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Vendor Information</h3>
                  <p><strong>Vendor Name:</strong> {product.vendor || "N/A"}</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Customer questions & answers</h3>

                  {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review this product!</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((r) => (
                        <div key={r.id} className="border-b border-border pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-heading">{r.userName}</p>
                              <p className="text-xs text-text-body">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-text-body">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 bg-surface-light p-6 rounded-xl border border-border">
                    <h4 className="text-lg font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Add a review</h4>
                    <form onSubmit={submitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Your Rating</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className={`w-6 h-6 cursor-pointer ${star <= reviewRating ? "fill-brand-yellow text-brand-yellow" : "text-border hover:text-brand-yellow"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Your Review</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full h-32 px-4 py-3 rounded-lg border border-border outline-none focus:border-primary resize-none"
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Related */}
            {relatedProducts.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Quicksand', sans-serif" }}>Related products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: "'Quicksand', sans-serif" }}>Category</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between text-sm text-text-body hover:text-primary cursor-pointer transition-colors">
                    <Link to={`/shop?categoryId=${cat.id}`} className="flex items-center gap-2 flex-1">
                      <span>{cat.icon || "🛒"}</span> {cat.name}
                    </Link>
                    <span className="bg-surface-light text-xs px-2 py-0.5 rounded-full">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="container mx-auto px-4 xl:px-0 mt-8">
        <NewsletterBanner />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;

import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export interface ProductSummaryDto {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  compareAtPrice: number | null;
  badge: "hot" | "new" | "sale" | "discount" | null;
  discountPercent: number | null;
  averageRating: number;
  reviewCount: number;
  categoryId: number;
  primaryImageUrl: string;
  variants?: any[];
}

const ProductCard = ({ product }: { product: ProductSummaryDto }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const variantId = product.variants?.[0]?.id;
      await addToCart(product.id, variantId, 1);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-4 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-surface-light to-white border border-border/50">
        <img
          src={product.primaryImageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.badge === "sale" && <span className="badge-sale shadow-lg">Sale</span>}
          {product.badge === "hot" && <span className="badge-discount bg-red-500 text-white shadow-lg">🔥 Hot</span>}
          {product.badge === "new" && <span className="badge-discount bg-brand-green text-primary-foreground shadow-lg">✨ New</span>}
          {product.discountPercent !== null && product.discountPercent > 0 && <span className="badge-discount shadow-lg">-{Math.round(product.discountPercent)}%</span>}
        </div>
      </Link>

      <div className="relative z-10">
        <div className="text-xs text-text-body mb-1.5 font-medium uppercase tracking-wide" style={{ fontFamily: "'Quicksand', sans-serif" }}>{product.brand}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-heading leading-tight mb-2.5 hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
          ))}
          <span className="text-xs font-bold text-heading ml-0.5">{(product.averageRating || 0).toFixed(1)}</span>
          <span className="text-xs text-text-body">({product.reviewCount || 0})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Quicksand', sans-serif" }}>${product.basePrice !== undefined ? product.basePrice.toFixed(2) : "0.00"}</span>
            {product.compareAtPrice !== null && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-text-price-old line-through font-medium">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed relative"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

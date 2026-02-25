import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

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

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
      <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-4 bg-surface-light border border-border/50">
        <img
          src={product.primaryImageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge === "sale" && <span className="badge-sale">Sale</span>}
          {product.badge === "hot" && <span className="badge-discount bg-red-500 text-white">Hot</span>}
          {product.badge === "new" && <span className="badge-discount bg-brand-green text-primary-foreground">New</span>}
          {product.discountPercent !== null && product.discountPercent > 0 && <span className="badge-discount">{Math.round(product.discountPercent)}% Off</span>}
        </div>
      </Link>

      <div>
        <div className="text-xs text-text-body mb-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>{product.brand}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-heading leading-tight mb-2 hover:text-primary transition-colors line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
          ))}
          <span className="text-xs font-semibold text-text-body">{(product.averageRating || 0).toFixed(1)}</span>
          <span className="text-xs text-text-body">({product.reviewCount || 0})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-primary">${product.basePrice !== undefined ? product.basePrice.toFixed(2) : "0.00"}</span>
            {product.compareAtPrice !== null && product.compareAtPrice > product.basePrice && (
              <span className="text-sm text-text-price-old line-through font-medium">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={async (e) => {
              e.preventDefault();
              await addToCart(product.id, undefined, 1);
            }}
            className="bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground p-2 rounded-md transition-colors shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

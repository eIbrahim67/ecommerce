import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const badgeClass = product.badge === "hot" ? "badge-hot"
    : product.badge === "sale" ? "badge-sale"
      : product.badge === "new" ? "badge-new"
        : product.badge === "discount" ? "badge-discount" : "";

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all group">
      {product.badge && (
        <span className={`${badgeClass} inline-block mb-2`}>
          {product.badge === "discount" ? `-${product.discountPercent}%` : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
        </span>
      )}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-surface-light flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <p className="text-xs text-text-body mb-1">{product.category}</p>
      <Link to={`/product/${product.id}`}>
        <h3 className="text-sm font-bold leading-tight mb-1 hover:text-primary transition-colors line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {product.name}
        </h3>
      </Link>
      <div className="flex items-center gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < product.rating ? "fill-brand-yellow text-brand-yellow" : "text-border"}`} />
        ))}
        <span className="text-xs text-text-body">({product.reviews})</span>
      </div>
      <p className="text-xs text-text-body mb-2">By <span className="text-primary font-medium">{product.brand}</span></p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="price-current text-lg">${product.price.toFixed(2)}</span>
          <span className="price-old">${product.oldPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
            toast.success(`${product.name} added to cart`);
          }}
          className="bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground p-2 rounded-md transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

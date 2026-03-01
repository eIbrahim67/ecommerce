/**
 * API Type Definitions with Arabic Language Support
 * 
 * All Arabic fields are nullable as they may not be available for all products/categories
 */

/**
 * Product Summary DTO - Used in product lists
 */
export interface ProductSummaryDto {
  id: number;
  name: string;
  nameAr?: string | null;
  brand: string;
  brandAr?: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  badge: "hot" | "new" | "sale" | "discount" | null;
  badgeAr?: string | null;
  discountPercent: number | null;
  averageRating: number;
  reviewCount: number;
  categoryId: number;
  primaryImageUrl: string;
  variants?: ProductVariant[];
}

/**
 * Product Detail DTO - Used in product detail page
 */
export interface ProductDetailDto {
  id: number;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  brand: string;
  brandAr?: string | null;
  vendor?: string | null;
  sku?: string | null;
  type?: string | null;
  mfgDate?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  badge?: "hot" | "new" | "sale" | "discount" | null;
  badgeAr?: string | null;
  discountPercent?: number | null;
  averageRating: number;
  reviewCount: number;
  categoryId: number;
  imageUrls?: string[];
  variants: ProductVariant[];
  tags?: string[];
}

/**
 * Product Variant
 */
export interface ProductVariant {
  id: number;
  color?: string | null;
  weight?: number | null;
  size?: string | null;
  stockQuantity?: number;
  additionalPrice?: number;
}

/**
 * Category DTO with Arabic support
 */
export interface CategoryDto {
  id: number;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  imageUrl: string | null;
  parentCategoryId?: number | null;
  productCount: number;
}

/**
 * Cart Item DTO
 */
export interface CartItemDto {
  id: number;
  productId: number;
  variantId: number | null;
  productName: string;
  productNameAr?: string | null;
  variantName: string | null;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

/**
 * Standard API Response Envelope
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors?: string[];
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

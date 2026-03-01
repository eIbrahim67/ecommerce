# Arabic Language Integration - Code Examples

## Before & After Comparison

### Example 1: Product Card Component

#### ❌ Before (Without Arabic Support)

```typescript
const ProductCard = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.brand}</p>
      <span>{product.badge}</span>
    </div>
  );
};
```

**Issues:**
- Always shows English, even when user selects Arabic
- No type safety
- No fallback handling

#### ✅ After (With Arabic Support)

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText, getLocalizedBadge } from '@/utils/localization';
import { ProductSummaryDto } from '@/types/api';

const ProductCard = ({ product }: { product: ProductSummaryDto }) => {
  const { currentLanguage } = useLanguage();
  
  const displayName = getLocalizedText(product.name, product.nameAr, currentLanguage);
  const displayBrand = getLocalizedText(product.brand, product.brandAr, currentLanguage);
  const displayBadge = getLocalizedBadge(product.badge, product.badgeAr, currentLanguage);
  
  return (
    <div>
      <h3>{displayName}</h3>
      <p>{displayBrand}</p>
      {displayBadge && <span>{displayBadge}</span>}
    </div>
  );
};
```

**Benefits:**
- ✅ Shows Arabic when available and selected
- ✅ Falls back to English gracefully
- ✅ Full type safety
- ✅ Handles null values properly

---

### Example 2: Category List

#### ❌ Before

```typescript
const CategoryList = ({ categories }) => {
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          <h4>{cat.name}</h4>
          <p>{cat.description}</p>
        </div>
      ))}
    </div>
  );
};
```

#### ✅ After

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { CategoryDto } from '@/types/api';

const CategoryList = ({ categories }: { categories: CategoryDto[] }) => {
  const { currentLanguage } = useLanguage();
  
  return (
    <div>
      {categories.map(cat => {
        const displayName = getLocalizedText(cat.name, cat.nameAr, currentLanguage);
        const displayDescription = getLocalizedText(
          cat.description || '',
          cat.descriptionAr,
          currentLanguage
        );
        
        return (
          <div key={cat.id}>
            <h4>{displayName}</h4>
            <p>{displayDescription}</p>
          </div>
        );
      })}
    </div>
  );
};
```

---

### Example 3: Product Detail Page

#### ❌ Before

```typescript
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  
  return (
    <div>
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <span>Brand: {product?.brand}</span>
    </div>
  );
};
```

#### ✅ After

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { ProductDetailDto } from '@/types/api';

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const { currentLanguage } = useLanguage();
  
  if (!product) return null;
  
  const displayName = getLocalizedText(product.name, product.nameAr, currentLanguage);
  const displayDescription = getLocalizedText(
    product.description || '',
    product.descriptionAr,
    currentLanguage
  );
  const displayBrand = getLocalizedText(product.brand, product.brandAr, currentLanguage);
  
  return (
    <div>
      <h1>{displayName}</h1>
      <p>{displayDescription}</p>
      <span>Brand: {displayBrand}</span>
    </div>
  );
};
```

---

## API Response Examples

### Product API Response

```json
{
  "success": true,
  "data": {
    "id": 40,
    "name": "Simply Lemonade with Raspberry Juice",
    "nameAr": "عصير ليمون مع توت العليق",
    "brand": "Sunkist",
    "brandAr": "سنكست",
    "description": "Refreshing lemonade with natural raspberry flavor",
    "descriptionAr": "عصير ليمون منعش بنكهة التوت الطبيعية",
    "badge": "discount",
    "badgeAr": "خصم",
    "basePrice": 90,
    "primaryImageUrl": "https://example.com/image.jpg"
  }
}
```

### How It Displays

**When English is selected:**
- Name: "Simply Lemonade with Raspberry Juice"
- Brand: "Sunkist"
- Badge: "discount"

**When Arabic is selected:**
- Name: "عصير ليمون مع توت العليق"
- Brand: "سنكست"
- Badge: "خصم"

---

## Common Patterns

### Pattern 1: Simple Text Display

```typescript
const { currentLanguage } = useLanguage();
const displayText = getLocalizedText(item.name, item.nameAr, currentLanguage);
return <span>{displayText}</span>;
```

### Pattern 2: Optional Text with Fallback

```typescript
const { currentLanguage } = useLanguage();
const displayText = getLocalizedText(
  item.description || 'No description',
  item.descriptionAr,
  currentLanguage
);
return <p>{displayText}</p>;
```

### Pattern 3: Badge Display

```typescript
const { currentLanguage } = useLanguage();
const displayBadge = getLocalizedBadge(item.badge, item.badgeAr, currentLanguage);
return displayBadge ? <span className="badge">{displayBadge}</span> : null;
```

### Pattern 4: Multiple Fields

```typescript
const { currentLanguage } = useLanguage();

const displayName = getLocalizedText(product.name, product.nameAr, currentLanguage);
const displayBrand = getLocalizedText(product.brand, product.brandAr, currentLanguage);
const displayDescription = getLocalizedText(
  product.description || '',
  product.descriptionAr,
  currentLanguage
);

return (
  <div>
    <h3>{displayName}</h3>
    <p className="brand">{displayBrand}</p>
    <p className="description">{displayDescription}</p>
  </div>
);
```

---

## Testing Examples

### Test Case 1: Arabic Content Available

```typescript
const product = {
  name: "Orange Juice",
  nameAr: "عصير برتقال",
  brand: "Fresh",
  brandAr: "طازج"
};

// When language is 'ar'
getLocalizedText(product.name, product.nameAr, 'ar')
// Returns: "عصير برتقال"

getLocalizedText(product.brand, product.brandAr, 'ar')
// Returns: "طازج"
```

### Test Case 2: Arabic Content Missing

```typescript
const product = {
  name: "Orange Juice",
  nameAr: null,
  brand: "Fresh",
  brandAr: null
};

// When language is 'ar'
getLocalizedText(product.name, product.nameAr, 'ar')
// Returns: "Orange Juice" (fallback to English)

getLocalizedText(product.brand, product.brandAr, 'ar')
// Returns: "Fresh" (fallback to English)
```

### Test Case 3: English Selected

```typescript
const product = {
  name: "Orange Juice",
  nameAr: "عصير برتقال",
  brand: "Fresh",
  brandAr: "طازج"
};

// When language is 'en'
getLocalizedText(product.name, product.nameAr, 'en')
// Returns: "Orange Juice" (always use English when selected)
```

---

## Migration Checklist

When updating a component to support Arabic:

- [ ] Import `useLanguage` hook
- [ ] Import `getLocalizedText` and/or `getLocalizedBadge` utilities
- [ ] Import types from `@/types/api`
- [ ] Get `currentLanguage` from hook
- [ ] Replace direct field access with `getLocalizedText()` calls
- [ ] Handle nullable fields properly
- [ ] Test with both English and Arabic
- [ ] Test with missing Arabic content (null values)
- [ ] Verify TypeScript types are correct

---

## Quick Reference

```typescript
// 1. Import
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { ProductSummaryDto } from '@/types/api';

// 2. Get language
const { currentLanguage } = useLanguage();

// 3. Localize text
const displayName = getLocalizedText(
  product.name,      // English (required)
  product.nameAr,    // Arabic (optional)
  currentLanguage    // Current language
);

// 4. Display
return <h3>{displayName}</h3>;
```

---

## Need More Examples?

Check these files in the codebase:
- `src/components/ProductCard.tsx` - Product card with full Arabic support
- `src/pages/Shop.tsx` - Shop page with categories and products
- `src/pages/ProductDetail.tsx` - Detailed product view
- `src/pages/Index.tsx` - Home page with categories

All of these are production-ready examples you can reference!

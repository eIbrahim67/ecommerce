# Quick Start: Arabic Language Support

## For Developers

### Using Arabic Content in Your Components

**Step 1:** Import the necessary utilities and types

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { ProductSummaryDto } from '@/types/api';
```

**Step 2:** Get the current language from the hook

```typescript
const { currentLanguage } = useLanguage();
```

**Step 3:** Use the localization utility to display text

```typescript
const displayName = getLocalizedText(
  product.name,      // English (required)
  product.nameAr,    // Arabic (optional)
  currentLanguage    // Current language
);
```

**Step 4:** Render the localized text

```typescript
return <h3>{displayName}</h3>;
```

---

## Complete Example

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { ProductSummaryDto } from '@/types/api';

const ProductItem = ({ product }: { product: ProductSummaryDto }) => {
  const { currentLanguage } = useLanguage();
  
  // Get localized content
  const displayName = getLocalizedText(
    product.name,
    product.nameAr,
    currentLanguage
  );
  
  const displayBrand = getLocalizedText(
    product.brand,
    product.brandAr,
    currentLanguage
  );
  
  return (
    <div>
      <h3>{displayName}</h3>
      <p>{displayBrand}</p>
      <span>${product.basePrice}</span>
    </div>
  );
};
```

---

## Key Points

✅ **Always use English as the base** - It's required and always available  
✅ **Arabic fields are optional** - They may be null, so always provide fallback  
✅ **Use the utility functions** - Don't manually check language, use `getLocalizedText()`  
✅ **Import types from `@/types/api`** - Don't create duplicate interfaces  
✅ **Test both languages** - Switch language and verify content displays correctly  

---

## Available Types

```typescript
// Products
ProductSummaryDto      // For product lists
ProductDetailDto       // For product detail page
ProductVariant         // For product variants

// Categories
CategoryDto            // For categories

// Cart
CartItemDto            // For cart items
```

---

## Language Switcher

The language switcher is already integrated in the header. Users can:

1. Click the globe icon in the header
2. Select English or العربية
3. The entire app switches language instantly
4. Preference is saved to localStorage

---

## Need Help?

- Check `docs/ARABIC_LANGUAGE_INTEGRATION.md` for detailed documentation
- Look at existing components like `ProductCard.tsx` for examples
- Review the API integration guide for backend field reference

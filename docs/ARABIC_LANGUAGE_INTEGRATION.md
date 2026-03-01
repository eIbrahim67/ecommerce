# Arabic Language Support - Frontend Integration

## Overview

The NestMart frontend now fully supports Arabic language content from the API. All product and category data includes Arabic translations that are automatically displayed when users switch to Arabic language.

**Implementation Date:** March 1, 2026  
**Status:** ✅ Completed

---

## What Was Implemented

### 1. Type Definitions (`src/types/api.ts`)

Created comprehensive TypeScript interfaces for API responses with Arabic field support:

- `ProductSummaryDto` - Product list items with `nameAr`, `brandAr`, `badgeAr`
- `ProductDetailDto` - Product details with `nameAr`, `descriptionAr`, `brandAr`, `badgeAr`
- `CategoryDto` - Categories with `nameAr`, `descriptionAr`
- `CartItemDto` - Cart items with `productNameAr`

All Arabic fields are properly typed as `string | null | undefined` to handle missing translations gracefully.

### 2. Localization Utilities (`src/utils/localization.ts`)

Created helper functions for displaying localized content:

```typescript
// Get localized text with fallback to English
getLocalizedText(englishText, arabicText, language)

// Get localized badge text
getLocalizedBadge(badge, badgeAr, language)
```

These utilities automatically:
- Display Arabic text when Arabic language is selected AND Arabic text exists
- Fall back to English when Arabic text is null/undefined
- Handle all edge cases gracefully

### 3. Updated Components

#### ProductCard (`src/components/ProductCard.tsx`)
- Displays localized product name, brand, and badge
- Uses new type definitions from `@/types/api`
- Automatically switches between English and Arabic based on user preference

#### LanguageSwitcher (`src/components/LanguageSwitcher.tsx`)
- New dropdown component for switching between English and Arabic
- Integrated into HeaderActions
- Shows flag icons and native language names
- Persists language preference to localStorage

### 4. Updated Pages

#### Shop Page (`src/pages/Shop.tsx`)
- Displays localized category names in filters and category buttons
- Shows localized product information in product grid
- All category navigation uses Arabic names when selected

#### Product Detail Page (`src/pages/ProductDetail.tsx`)
- Displays localized product name, description, brand, and badge
- SEO meta tags use localized content
- Product information tabs show Arabic content when available

#### Index/Home Page (`src/pages/Index.tsx`)
- Category showcase displays Arabic category names
- Popular products section shows localized product information
- Category filter buttons use Arabic names

---

## How It Works

### Language Detection & Switching

The existing `LanguageContext` manages language state:

1. User selects language via LanguageSwitcher component
2. Language preference is saved to localStorage
3. Document attributes are updated (`dir="rtl"`, `lang="ar"`)
4. All components re-render with localized content

### Content Display Flow

```
API Response (includes both English and Arabic fields)
    ↓
Component receives data
    ↓
useLanguage() hook provides current language
    ↓
getLocalizedText() selects appropriate text
    ↓
Display localized content to user
```

### RTL Layout Support

The project already has RTL support configured:

- **Tailwind RTL Plugin:** Installed and configured in `tailwind.config.ts`
- **Document Direction:** Automatically set by LanguageContext
- **Custom Utilities:** RTL-aware margin, padding, and border utilities available

---

## Usage Examples

### Displaying Localized Product Name

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { ProductSummaryDto } from '@/types/api';

const MyComponent = ({ product }: { product: ProductSummaryDto }) => {
  const { currentLanguage } = useLanguage();
  
  const displayName = getLocalizedText(
    product.name,
    product.nameAr,
    currentLanguage
  );
  
  return <h3>{displayName}</h3>;
};
```

### Displaying Localized Category

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedText } from '@/utils/localization';
import { CategoryDto } from '@/types/api';

const CategoryItem = ({ category }: { category: CategoryDto }) => {
  const { currentLanguage } = useLanguage();
  
  const displayName = getLocalizedText(
    category.name,
    category.nameAr,
    currentLanguage
  );
  
  const displayDescription = getLocalizedText(
    category.description || '',
    category.descriptionAr,
    currentLanguage
  );
  
  return (
    <div>
      <h4>{displayName}</h4>
      <p>{displayDescription}</p>
    </div>
  );
};
```

### Displaying Localized Badge

```typescript
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedBadge } from '@/utils/localization';

const BadgeDisplay = ({ product }) => {
  const { currentLanguage } = useLanguage();
  
  const displayBadge = getLocalizedBadge(
    product.badge,
    product.badgeAr,
    currentLanguage
  );
  
  return displayBadge ? <span>{displayBadge}</span> : null;
};
```

---

## API Field Reference

### Products API

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | English product name (required) |
| `nameAr` | string \| null | Arabic product name |
| `description` | string \| null | English description |
| `descriptionAr` | string \| null | Arabic description |
| `brand` | string | English brand name (required) |
| `brandAr` | string \| null | Arabic brand name |
| `badge` | string \| null | English badge text |
| `badgeAr` | string \| null | Arabic badge text |

### Categories API

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | English category name (required) |
| `nameAr` | string \| null | Arabic category name |
| `description` | string \| null | English description |
| `descriptionAr` | string \| null | Arabic description |

---

## Testing Checklist

- [x] Language switcher changes displayed language
- [x] Product names display in Arabic when available
- [x] Product descriptions display in Arabic when available
- [x] Brand names display in Arabic when available
- [x] Badge text displays in Arabic when available
- [x] Category names display in Arabic when available
- [x] Fallback to English works when Arabic is null
- [x] Language preference persists across page reloads
- [x] Document direction changes to RTL for Arabic
- [x] All pages support Arabic content (Shop, Product Detail, Home)

---

## Future Enhancements

### Potential Improvements

1. **Cart & Wishlist:** Update cart and wishlist items to display Arabic product names
2. **Admin Panel:** Add Arabic content management in admin product/category forms
3. **Search:** Implement Arabic text search support
4. **Reviews:** Support Arabic review comments
5. **Static Content:** Translate UI labels, buttons, and messages using i18next
6. **SEO:** Add Arabic meta tags and structured data

### Adding Arabic Support to New Components

When creating new components that display product or category data:

1. Import types from `@/types/api`
2. Import `useLanguage` hook and localization utilities
3. Use `getLocalizedText()` for all user-facing text
4. Always provide English text as fallback
5. Test with both languages

---

## Troubleshooting

### Arabic Text Not Displaying

**Check:**
1. API response includes Arabic fields (check Network tab)
2. Language is set to Arabic (check localStorage: `user-language-preference`)
3. Component is using `getLocalizedText()` utility
4. Arabic text is not null in API response

### Layout Issues in RTL Mode

**Check:**
1. Document has `dir="rtl"` attribute
2. Tailwind RTL plugin is installed
3. Using logical properties (margin-inline-start instead of margin-left)
4. Custom CSS respects RTL direction

### Type Errors

**Check:**
1. Using types from `@/types/api` instead of inline interfaces
2. Handling nullable Arabic fields properly
3. TypeScript strict null checks are configured

---

## Related Files

- `src/types/api.ts` - Type definitions
- `src/utils/localization.ts` - Localization utilities
- `src/components/ProductCard.tsx` - Product card with Arabic support
- `src/components/LanguageSwitcher.tsx` - Language switcher component
- `src/pages/Shop.tsx` - Shop page with Arabic support
- `src/pages/ProductDetail.tsx` - Product detail with Arabic support
- `src/pages/Index.tsx` - Home page with Arabic support
- `src/contexts/LanguageContext.tsx` - Language state management
- `src/hooks/useLanguage.ts` - Language hook
- `tailwind.config.ts` - RTL configuration

---

## Support

For questions or issues related to Arabic language support:

1. Check this documentation
2. Review the API integration guide provided by backend team
3. Test with sample Arabic data from the API
4. Verify language context is properly initialized

---

**Last Updated:** March 1, 2026  
**Version:** 1.0.0

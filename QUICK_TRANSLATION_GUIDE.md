# Quick Translation Guide - NestMart

## 🚀 Quick Start

### For Users
1. Click the **globe icon (🌐)** in the header
2. Select **"English"** or **"العربية"**
3. Done! The entire site switches instantly

### For Developers
```typescript
import { useLanguage } from '@/hooks/useLanguage';

const MyComponent = () => {
  const { t } = useLanguage();
  return <h1>{t('namespace:key')}</h1>;
};
```

---

## 📋 Translation Namespaces

| Namespace | Use For | Example |
|-----------|---------|---------|
| `common` | Buttons, labels, messages | `t('common:buttons.save')` |
| `navigation` | Header, footer links | `t('navigation:header.home')` |
| `products` | Shop page, filters | `t('products:shopByCategory')` |
| `home` | Home page content | `t('home:hero.title')` |
| `about` | About page | `t('about:welcome.title')` |
| `contact` | Contact page | `t('contact:form.title')` |
| `cart` | Cart page | `t('cart:title')` |
| `checkout` | Checkout page | `t('checkout:title')` |
| `auth` | Login, register | `t('auth:login')` |
| `admin` | Admin panel | `t('admin:dashboard')` |
| `errors` | Error messages | `t('errors:notFound')` |

---

## 🔑 Most Common Translations

### Buttons
```typescript
t('common:buttons.addToCart')    // Add to Cart / أضف إلى السلة
t('common:buttons.checkout')     // Checkout / الدفع
t('common:buttons.save')         // Save / حفظ
t('common:buttons.cancel')       // Cancel / إلغاء
```

### Navigation
```typescript
t('navigation:header.home')      // Home / الرئيسية
t('navigation:header.shop')      // Shop / المتجر
t('navigation:header.about')     // About / من نحن
t('navigation:header.contact')   // Contact / اتصل بنا
```

### Shop Page
```typescript
t('products:shopByCategory')     // Shop by Category / تسوق حسب الفئة
t('products:allProducts')        // All Products / جميع المنتجات
t('products:filterByPrice')      // Filter by Price / تصفية حسب السعر
t('products:sorting.featured')   // Featured / مميز
```

### Forms
```typescript
t('contact:form.namePlaceholder')    // Your Name * / اسمك *
t('contact:form.emailPlaceholder')   // Your Email * / بريدك الإلكتروني *
t('contact:form.sendButton')         // Send message / إرسال الرسالة
```

---

## 🌍 API Data Localization

### Product Names
```typescript
import { getLocalizedText } from '@/utils/localization';
import { useLanguage } from '@/hooks/useLanguage';

const { currentLanguage } = useLanguage();
const displayName = getLocalizedText(
  product.name,      // English
  product.nameAr,    // Arabic
  currentLanguage
);
```

### Category Names
```typescript
const displayCategory = getLocalizedText(
  category.name,
  category.nameAr,
  currentLanguage
);
```

---

## 📁 File Locations

### Translation Files
```
src/i18n/locales/
├── en/              # English translations
│   ├── common.json
│   ├── products.json
│   ├── about.json
│   └── contact.json
└── ar/              # Arabic translations
    ├── common.json
    ├── products.json
    ├── about.json
    └── contact.json
```

### Key Files
- **Config:** `src/i18n/config.ts`
- **Hook:** `src/hooks/useLanguage.ts`
- **Context:** `src/contexts/LanguageContext.tsx`
- **Utils:** `src/utils/localization.ts`
- **Types:** `src/types/api.ts`

---

## ✅ Quick Checklist

### Adding New Translation

1. **Add to English file**
   ```json
   // src/i18n/locales/en/common.json
   {
     "newKey": "New Text"
   }
   ```

2. **Add to Arabic file**
   ```json
   // src/i18n/locales/ar/common.json
   {
     "newKey": "نص جديد"
   }
   ```

3. **Use in component**
   ```typescript
   {t('common:newKey')}
   ```

### Testing Translation

1. Switch to Arabic using language switcher
2. Verify text displays in Arabic
3. Check RTL layout is correct
4. Switch back to English
5. Verify text displays in English

---

## 🐛 Troubleshooting

### Translation Not Showing
- ✅ Check key exists in both `en` and `ar` files
- ✅ Verify namespace is correct (e.g., `products:` not `product:`)
- ✅ Check browser console for errors

### Wrong Language
- ✅ Check localStorage: `user-language-preference`
- ✅ Verify language switcher is working
- ✅ Check `document.documentElement.lang` attribute

### RTL Issues
- ✅ Verify `document.documentElement.dir` is `rtl`
- ✅ Check tailwindcss-rtl plugin is installed
- ✅ Use logical CSS properties

---

## 📚 Documentation

- **Main Guide:** `README_ARABIC_INTEGRATION.md`
- **Quick Start:** `docs/QUICK_START_ARABIC.md`
- **Examples:** `docs/EXAMPLES.md`
- **Reference:** `docs/TRANSLATION_REFERENCE.md`
- **Summary:** `TRANSLATION_COMPLETE_SUMMARY.md`

---

## 💡 Pro Tips

1. **Always use namespaces** - `t('products:key')` not `t('key')`
2. **Test both languages** - Switch and verify
3. **Handle nulls** - API data may be null
4. **Use descriptive keys** - `shopByCategory` not `title1`
5. **Keep it simple** - Break complex text into parts

---

**Quick Help:** Check `docs/TRANSLATION_REFERENCE.md` for complete translation lookup table!

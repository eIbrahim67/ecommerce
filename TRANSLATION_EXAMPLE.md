# Translation Usage Examples

## Basic Translation Usage

### Example 1: Simple Button Translation
```tsx
import { useLanguage } from '@/hooks/useLanguage';

function AddToCartButton() {
  const { t } = useLanguage();
  
  return (
    <button>
      {t('common:buttons.addToCart')}
    </button>
  );
}
```

### Example 2: Navigation Menu
```tsx
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

function Navigation() {
  const { t } = useLanguage();
  
  return (
    <nav>
      <Link to="/">{t('navigation:header.home')}</Link>
      <Link to="/shop">{t('navigation:header.shop')}</Link>
      <Link to="/about">{t('navigation:header.about')}</Link>
      <Link to="/contact">{t('navigation:header.contact')}</Link>
      <Link to="/cart">{t('navigation:header.cart')}</Link>
    </nav>
  );
}
```

### Example 3: Form with Labels
```tsx
import { useLanguage } from '@/hooks/useLanguage';

function LoginForm() {
  const { t } = useLanguage();
  
  return (
    <form>
      <label>
        {t('common:labels.email')}
        <input type="email" />
      </label>
      
      <label>
        {t('common:labels.password')}
        <input type="password" />
      </label>
      
      <button type="submit">
        {t('common:buttons.login')}
      </button>
    </form>
  );
}
```

### Example 4: Loading States
```tsx
import { useLanguage } from '@/hooks/useLanguage';

function ProductList({ isLoading, products }) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return <div>{t('common:messages.loading')}</div>;
  }
  
  if (products.length === 0) {
    return <div>{t('common:messages.noResults')}</div>;
  }
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Example 5: Using Current Language and RTL
```tsx
import { useLanguage } from '@/hooks/useLanguage';

function ProductCard({ product }) {
  const { t, currentLanguage, isRTL } = useLanguage();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h3>{product.name[currentLanguage]}</h3>
      <p>{product.description[currentLanguage]}</p>
      <button>
        {t('common:buttons.addToCart')}
      </button>
    </div>
  );
}
```

### Example 6: Price Formatting
```tsx
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/i18n/formatters';

function PriceDisplay({ price }) {
  const { currentLanguage } = useLanguage();
  
  return (
    <span className="price">
      {formatCurrency(price, currentLanguage, 'USD')}
    </span>
  );
}
```

### Example 7: Date Formatting
```tsx
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/i18n/formatters';

function OrderDate({ date }) {
  const { currentLanguage } = useLanguage();
  
  return (
    <time>
      {formatDate(date, currentLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}
```

## Translation Key Format

The translation keys follow this pattern:
```
namespace:section.key
```

Examples:
- `common:buttons.addToCart` - Common namespace, buttons section, addToCart key
- `navigation:header.home` - Navigation namespace, header section, home key
- `products:category.electronics` - Products namespace, category section, electronics key

## Available Namespaces

1. **common** - Common UI elements
   - buttons (addToCart, checkout, login, register, submit, cancel, save, delete, edit, search)
   - labels (email, password, name, phone, address)
   - messages (loading, success, error, noResults)

2. **navigation** - Navigation elements
   - header (home, shop, about, contact, cart, wishlist, account)
   - footer (quickLinks, customerService, followUs, copyright)

3. **products** - Product-related content
4. **cart** - Shopping cart
5. **checkout** - Checkout process
6. **auth** - Authentication
7. **admin** - Admin panel
8. **errors** - Error messages

## RTL-Aware Styling

Use these Tailwind utilities for RTL support:
```tsx
// Margins
<div className="ms-4">  {/* margin-inline-start */}
<div className="me-4">  {/* margin-inline-end */}

// Padding
<div className="ps-4">  {/* padding-inline-start */}
<div className="pe-4">  {/* padding-inline-end */}

// Text alignment
<div className="text-start">  {/* text-align: start */}
<div className="text-end">    {/* text-align: end */}

// Borders
<div className="border-s">  {/* border-inline-start */}
<div className="border-e">  {/* border-inline-end */}
```

These utilities automatically flip for RTL languages!

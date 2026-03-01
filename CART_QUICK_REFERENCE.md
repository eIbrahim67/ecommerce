# Cart API Quick Reference

## Summary of Changes

✅ **Anonymous cart support** — Guests can now add/view/manage cart without login  
✅ **UUID v4 guestId** — Stable identifier for each guest session  
✅ **Automatic header injection** — `X-Guest-Id` added to all cart requests  
✅ **No auth requirement** — Cart context removed `isAuthenticated` check  
✅ **Backward compatible** — Authenticated users still work as before  

---

## File Changes

### New Files
- **`src/lib/guestId.ts`** — Guest ID generation and storage

### Modified Files
- **`src/lib/api.ts`** — Added `X-Guest-Id` header injection for cart endpoints
- **`src/contexts/CartContext.tsx`** — Removed auth checks, added `isAuthenticated` to context

---

## Key Functions

### guestId.ts
```typescript
getOrCreateGuestId(): string          // Get or create UUID v4 for guest
getGuestId(): string | null           // Get current guest ID
clearGuestId(): void                  // Clear stored guest ID
```

### CartContext.tsx (useCart hook)
```typescript
const {
  items,              // CartItem[]
  addToCart,          // (productId, variantId?, quantity?) => Promise<void>
  removeFromCart,     // (itemId) => Promise<void>
  updateQuantity,     // (itemId, quantity) => Promise<void>
  clearCart,          // () => Promise<void>
  fetchCart,          // () => Promise<void>
  cartTotal,          // number
  cartCount,          // number
  isLoading,          // boolean
  isAuthenticated,    // boolean — NEW: Track auth status
} = useCart();
```

---

## API Endpoints (All Accept Either JWT or X-Guest-Id)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/cart` | Fetch cart contents |
| POST | `/api/v1/cart` | Add item |
| PUT | `/api/v1/cart/{itemId}` | Update quantity |
| DELETE | `/api/v1/cart/{itemId}` | Remove item |
| DELETE | `/api/v1/cart` | Clear cart |

---

## Example: Add to Cart (Works Anonymous)

```tsx
import { useCart } from "@/contexts/CartContext";

function ProductCard({ product }) {
  const { addToCart, isAuthenticated } = useCart();

  const handleClick = async () => {
    // Works for guests AND authenticated users
    await addToCart(product.id, product.variantId, 1);
  };

  return (
    <button onClick={handleClick} disabled={isAuthenticated === null}>
      Add to Cart
    </button>
  );
}
```

---

## How It Works Behind the Scenes

1. User visits site → `getOrCreateGuestId()` → UUID v4 stored in localStorage
2. User adds item → axios interceptor adds `X-Guest-Id` header
3. Backend receives request → creates minimal guest user if needed
4. Cart item saved with `UserId = guestId`
5. On login → authenticated user cart is fetched (guestId no longer used)

---

## Testing Checklist

- [ ] Add item to cart (not logged in) — should work
- [ ] View cart — shows items
- [ ] Update quantity — works
- [ ] Remove item — works
- [ ] Log in — cart still accessible (shows authenticated cart)
- [ ] Log out — can add to cart again
- [ ] DevTools Network tab — see `X-Guest-Id` header in cart requests

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| 401 on cart request | Ensure `X-Guest-Id` in request headers (DevTools) |
| Items not persisting | Check localStorage has `ecommerce_guest_id` |
| Cart empty after login | Call `fetchCart()` to refresh from server |
| Guest user not created | Check backend logs for constraint violations |

---

## Checkout Flow

⚠️ **Checkout remains authenticated-only** (intentional for security)

```tsx
function Checkout() {
  const { isAuthenticated, items, clearCart } = useCart();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  const handleCheckout = async () => {
    // Process order...
    await clearCart();
  };

  return <CheckoutForm onSubmit={handleCheckout} />;
}
```

---

## Future Enhancements

### Recommended Next Steps (Priority Order)

1. **POST /api/v1/cart/merge** — Merge guest cart into user cart on login
2. **Backend cleanup job** — Remove guest users older than 30 days
3. **Analytics** — Track anonymous cart conversions
4. **Login prompt** — Show "Save order by logging in" at checkout

### Optional Schema Change

Current: Guest IDs stored as ApplicationUser rows  
Alternative: Create separate `GuestCart` table (schema change required)

---

## Support

**Documentation:** See `ANONYMOUS_CART_INTEGRATION.md` for detailed guide  
**Codebase:** Check `src/lib/guestId.ts` and `src/lib/api.ts` for implementation details

# Cart Updates Changelog — Feb 25, 2026

## Overview

This update introduces **anonymous guest cart support** to the e-commerce platform. Guests can now browse, add items to cart, and manage cart contents without authentication. Guest identification is handled via a stable UUID v4 stored client-side and sent with every cart request via the `X-Guest-Id` HTTP header.

---

## Changes Summary

### ✅ New Features

1. **Anonymous Cart Operations**
   - Guests can add items to cart
   - Guests can view, update, and remove cart items
   - Guest carts persist across browser sessions (using localStorage)
   - Each guest gets a unique UUID v4 identifier

2. **Automatic X-Guest-Id Header Injection**
   - All cart API requests automatically include guest ID
   - Works seamlessly alongside JWT authentication
   - Transparent to components (handled in axios interceptor)

3. **Dual Authentication Support**
   - Cart endpoints accept either:
     - `Authorization: Bearer <JWT_TOKEN>` (authenticated user)
     - `X-Guest-Id: <UUID_V4>` (anonymous user)
   - Backend auto-creates minimal guest user if needed

### 🔄 Modified Files

#### `src/lib/guestId.ts` (NEW)
**Purpose:** Manage guest ID generation and storage

**Key Functions:**
- `getOrCreateGuestId()` — Returns existing guest ID or creates new UUID v4
- `getGuestId()` — Returns current guest ID (null if none exists)
- `clearGuestId()` — Clears stored guest ID

**Storage:** `localStorage` with key `ecommerce_guest_id`

**Example:**
```typescript
import { getOrCreateGuestId } from "@/lib/guestId";

const guestId = getOrCreateGuestId(); // "7a3c8b9e-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

#### `src/lib/api.ts` (UPDATED)
**Changes:**

1. **Import guestId utility**
   ```typescript
   import { getOrCreateGuestId } from "./guestId";
   ```

2. **Add X-Guest-Id to cart requests**
   ```typescript
   api.interceptors.request.use((config) => {
     // ... existing JWT injection ...
     
     if (config.url?.includes("/cart")) {
       const guestId = getOrCreateGuestId();
       config.headers["X-Guest-Id"] = guestId;
     }
     
     return config;
   });
   ```

**Impact:**
- All `/api/v1/cart/*` requests now include `X-Guest-Id` header
- Automatically handles both authenticated and anonymous users
- No changes needed in component code

---

#### `src/contexts/CartContext.tsx` (UPDATED)
**Changes:**

1. **Removed Authentication Guard**
   - **Before:** Cart operations checked `if (!isAuthenticated)` and blocked
   - **After:** Cart operations work for all users (authenticated or guest)

2. **Updated Interface**
   ```typescript
   interface CartContextType {
     // ... existing properties ...
     isAuthenticated: boolean; // NEW: Track authentication status
   }
   ```

3. **Modified fetchCart()**
   - **Before:** Only fetched if `isAuthenticated === true`
   - **After:** Fetches for all users (guest or authenticated)
   - Still handles 401 errors gracefully

4. **Modified addToCart()**
   - **Before:** Threw toast error "Please login to add items"
   - **After:** No auth check; sends request with guestId header
   - Request succeeds for both authenticated and anonymous users

5. **Updated Body Format**
   - **Before:** `{ productVariantId: variantId, quantity }`
   - **After:** `{ productId, productVariantId: variantId, quantity }`
   - Note: Backend expects `productId` in request body

6. **Provider Value**
   - Added `isAuthenticated` to context provider for UI components to check auth status

**Example Component Usage:**
```tsx
const { addToCart, isAuthenticated } = useCart();

// Works for anyone
await addToCart(productId, variantId, quantity);

// Check auth status if needed
if (!isAuthenticated) {
  console.log("User is browsing as guest");
}
```

---

## Request/Response Examples

### Add Item (Anonymous)

**Request:**
```bash
curl -X POST "https://api.example.com/api/v1/cart" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567" \
  -d '{
    "productId": 123,
    "productVariantId": 456,
    "quantity": 2
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": true,
  "message": "Item added to cart."
}
```

### Get Cart (Authenticated User)

**Request:**
```bash
curl -X GET "https://api.example.com/api/v1/cart" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "auth-user-id-123",
    "items": [
      {
        "id": 1,
        "productId": 123,
        "variantId": 456,
        "productName": "Product Name",
        "variantName": "50g",
        "imageUrl": "https://...",
        "unitPrice": 19.99,
        "quantity": 2,
        "totalPrice": 39.98
      }
    ],
    "totalPrice": 39.98
  }
}
```

---

## Behavior Changes

| Operation | Before | After |
|-----------|--------|-------|
| **Add to cart (guest)** | ❌ Error: "Please login" | ✅ Works, creates guest user |
| **View cart (guest)** | ❌ Empty | ✅ Shows guest cart |
| **Update quantity (guest)** | ❌ Error | ✅ Works |
| **Remove item (guest)** | ❌ Error | ✅ Works |
| **Clear cart (guest)** | ❌ Error | ✅ Works |
| **Cart header (guest)** | ❌ Didn't load | ✅ Shows item count |
| **Add to cart (auth)** | ✅ Works | ✅ Still works |
| **Checkout (guest)** | N/A | ⚠️ Still requires login |
| **Checkout (auth)** | ✅ Works | ✅ Still works |

---

## Database Impact (Backend)

### What Changed (Server-side)

1. **Guest User Auto-Creation**
   - When mutating cart (POST/PUT/DELETE) with guestId
   - Backend creates minimal `AspNetUsers` row with:
     - `Id` = guestId (UUID v4)
     - Minimal required fields
     - No password (guest cannot log in)

2. **CartItems FK**
   - Maintains existing `CartItems.UserId` FK to `AspNetUsers.Id`
   - Works for both authenticated users and guest IDs

3. **No Schema Changes Required**
   - Uses existing database tables
   - No new columns needed
   - Fully backward compatible

### Database Growth Consideration

- Each unique guest creates 1 `AspNetUsers` row
- Estimated 1-5 rows per unique visitor (depending on cleanup)
- **Recommendation:** Implement cleanup job to remove guest users older than 30 days

---

## Migration Guide

### For Component Developers

**Before (restricted to authenticated users):**
```tsx
function ProductCard({ product }) {
  const { addToCart, isAuthenticated } = useCart();

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    await addToCart(product.id);
  };

  return <button onClick={handleClick}>Add</button>;
}
```

**After (works for everyone):**
```tsx
function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleClick = async () => {
    await addToCart(product.id);
  };

  return <button onClick={handleClick}>Add</button>;
}
```

### For Testing

**Before:** Required login to test cart

**After:** Can test with guestId:
```bash
GUEST_ID="7a3c8b9e-1234-4567-89ab-cdef01234567"
curl -X POST "http://localhost:5000/api/v1/cart" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: $GUEST_ID" \
  -d '{"productId": 1, "quantity": 1}'
```

---

## Security Considerations

### Guest ID Security

✅ **Strong Randomness:** UUID v4 (128-bit entropy)  
✅ **Unguessable:** Cryptographically random, not sequential  
✅ **Session-like:** Stored in localStorage, treated as temporary token  
⚠️ **Current:** Stored as ApplicationUser.Id (could be separated in future)  

### Protected Operations

🔒 **Checkout:** Requires authentication (unchanged)  
🔒 **Orders:** Requires authentication (unchanged)  
🔒 **Payments:** Requires authentication (unchanged)  
🔒 **Admin:** Requires authentication + admin role (unchanged)  

### What's NOT Changed

- Authentication mechanisms
- Password handling
- JWT token validation
- Admin authorization
- Checkout security
- Payment processing

---

## Verification Checklist

- [x] Guest ID generated on first visit
- [x] Guest ID stored in localStorage
- [x] Guest ID sent with every cart request
- [x] Anonymous add-to-cart works
- [x] Anonymous get cart works
- [x] Anonymous update quantity works
- [x] Anonymous remove item works
- [x] Anonymous clear cart works
- [x] Authenticated users still work
- [x] Cart persists across page refreshes (guest)
- [x] Cart persists across browser sessions (guest)
- [x] Checkout still requires authentication
- [x] No breaking changes to existing code

---

## Known Limitations & Future Work

### Current Limitations

1. **No Cart Merge on Login**
   - Guest cart and authenticated user cart are separate
   - Merge endpoint not yet implemented
   - Recommendation: User re-adds items after login

2. **Guest Data Persistence**
   - Guest users created in database (will accumulate)
   - No automatic cleanup yet
   - Recommendation: Add background cleanup job

3. **No Guest Wishlist**
   - Anonymous wishlist not implemented
   - Only authenticated users have wishlists

### Recommended Next Steps

1. **Implement POST /api/v1/cart/merge** (High Priority)
   - Merge guest cart into authenticated user cart on login
   - Prevents duplicate items
   - Better UX for converting guests to customers

2. **Backend Cleanup Job** (Medium Priority)
   - Remove guest users inactive for 30+ days
   - Runs daily or weekly
   - Prevents database bloat

3. **Guest Wishlist** (Low Priority)
   - Allow guests to add to wishlist
   - Stored by guestId like cart
   - Merge on login

4. **Analytics & Tracking** (Low Priority)
   - Track guest cart conversions
   - Measure abandonment rates
   - Identify product popularity with guests

---

## Rollback Plan

If issues arise, rollback is straightforward:

1. **Revert `src/lib/api.ts`**
   - Remove guestId header injection
   - Keep JWT injection

2. **Revert `src/contexts/CartContext.tsx`**
   - Restore `if (!isAuthenticated) return` guard
   - Remove `isAuthenticated` from context

3. **Delete `src/lib/guestId.ts`**
   - No longer needed

4. **Clear guest users from DB** (if desired)
   - Query: `DELETE FROM AspNetUsers WHERE Id LIKE '%-%-%-%-'`

Result: Back to authenticated-only cart operations

---

## Testing Instructions

### Manual End-to-End Test

1. **Test as guest:**
   - Open incognito window
   - Navigate to product
   - Add to cart ✅
   - View cart ✅
   - Update quantity ✅
   - Remove item ✅
   - Verify `X-Guest-Id` header in DevTools

2. **Test as authenticated user:**
   - Log in
   - Add to cart ✅
   - Verify `Authorization` header in DevTools
   - Verify `X-Guest-Id` header also present ✅

3. **Test persistence:**
   - Guest: Add item, refresh page → item still there ✅
   - Guest: Add item, close/reopen browser → item still there ✅
   - Guest: Check localStorage → see `ecommerce_guest_id` ✅

### API Testing

```bash
# Set guest ID
GUEST_ID="7a3c8b9e-1234-4567-89ab-cdef01234567"
API="http://localhost:5000/api/v1"

# 1. Add item
curl -X POST "$API/cart" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: $GUEST_ID" \
  -d '{"productId": 1, "quantity": 1}'

# 2. Get cart
curl "$API/cart" -H "X-Guest-Id: $GUEST_ID"

# 3. Update
curl -X PUT "$API/cart/1" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: $GUEST_ID" \
  -d '{"quantity": 2}'

# 4. Delete item
curl -X DELETE "$API/cart/1" -H "X-Guest-Id: $GUEST_ID"

# 5. Clear
curl -X DELETE "$API/cart" -H "X-Guest-Id: $GUEST_ID"
```

---

## FAQ

**Q: Will this break existing authenticated carts?**  
A: No. Authenticated users continue to work as before. The change is purely additive.

**Q: Do guests need to create an account?**  
A: No. Guests can browse, add items, and manage cart without an account. Checkout requires login.

**Q: What happens when a guest logs in?**  
A: The guest becomes authenticated and receives a JWT. Their guest cart is separate from their authenticated cart (merge recommended in future).

**Q: Will the database get bloated with guest users?**  
A: Potentially, yes. Implement a cleanup job to remove guest users older than 30 days (recommended).

**Q: Can guests use the wishlist?**  
A: Not yet. Anonymous wishlist is a recommended future feature.

**Q: Is the guest ID secure?**  
A: Yes. UUID v4 is cryptographically random (128-bit entropy). Treat it like a session token.

**Q: Can I delete a guest?**  
A: Yes, guests are temporary. Backend can auto-delete after 30 days of inactivity.

**Q: Does this work on mobile?**  
A: Yes. Guest ID is stored in localStorage (available on mobile browsers).

**Q: What about checkout?**  
A: Checkout remains authenticated-only (intentional for security and legal reasons).

---

## Commit Message

```
feat: Add anonymous guest cart support

- Add guestId utility (src/lib/guestId.ts) for UUID v4 generation and storage
- Update API interceptor to inject X-Guest-Id header for cart endpoints
- Remove authentication requirement from cart operations (CartContext)
- Guests can now add/view/manage cart without login via stable UUID v4
- Backend auto-creates minimal guest user for cart FK relationship
- Checkout and orders remain authenticated-only
- Add comprehensive documentation (ANONYMOUS_CART_INTEGRATION.md)

BREAKING CHANGE: None
MIGRATION: None required
ROLLBACK: Revert api.ts and CartContext.tsx changes
```

---

## Questions?

See **ANONYMOUS_CART_INTEGRATION.md** for detailed guide and troubleshooting.

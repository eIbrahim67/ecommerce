# Anonymous Cart API Integration Guide

## Overview

The e-commerce application now supports **anonymous (guest) cart operations**. This allows users to add items to their cart, browse, and manage cart contents without being logged in. Each guest is identified by a stable UUID v4 (`guestId`) sent with every cart request via the `X-Guest-Id` header.

## How It Works

### Client-Side (Frontend)

1. **Guest ID Generation & Storage**
   - On first visit, the client generates a strong random UUID v4
   - The ID is stored in `localStorage` under the key `ecommerce_guest_id`
   - On every subsequent visit, the same ID is retrieved and reused
   - The ID is automatically attached to every cart API request

2. **API Integration**
   - Cart requests automatically include:
     - `Authorization: Bearer <token>` (if authenticated), OR
     - `X-Guest-Id: <guestId>` (for anonymous users)
   - The axios interceptor in `src/lib/api.ts` handles this automatically

### Server-Side (Backend)

1. **Request Processing**
   - The CartController accepts either a JWT bearer token or the `X-Guest-Id` header
   - For mutating cart requests (POST, PUT, DELETE) with a `guestId`, the backend:
     - Ensures a minimal `AspNetUsers` row exists for that ID (auto-creates if needed)
     - Preserves the database FK relationship on `CartItems.UserId`
   - Read (GET) operations simply return the cart without creating users

## Implementation Details

### Files Modified

#### 1. `src/lib/guestId.ts` (NEW)
Utility functions for managing guest IDs:

```typescript
getOrCreateGuestId(): string
// Returns existing guest ID from localStorage, or generates and stores a new UUID v4

getGuestId(): string | null
// Returns current guest ID without creating one

clearGuestId(): void
// Clears stored guest ID (for testing or environment switching)
```

#### 2. `src/lib/api.ts` (UPDATED)
- Imports and calls `getOrCreateGuestId()` for cart endpoints
- Automatically adds `X-Guest-Id` header to all cart-related requests
- Also maintains JWT token injection for authenticated requests

**Key change:**
```typescript
if (config.url?.includes("/cart")) {
    const guestId = getOrCreateGuestId();
    config.headers["X-Guest-Id"] = guestId;
}
```

#### 3. `src/contexts/CartContext.tsx` (UPDATED)
- **Removed**: Auth requirement check (`if (!isAuthenticated)`) from cart operations
- **Added**: `isAuthenticated` property to the context type and provider value
- **Changed**: Cart now loads for both authenticated and anonymous users
- Anonymous users can now:
  - Add items to cart
  - View cart contents
  - Update quantities
  - Remove items
  - Clear cart

## API Endpoints Reference

**Base URL:** `/api/v1/cart`

All endpoints accept **either**:
- `Authorization: Bearer <JWT_TOKEN>` (authenticated user), OR
- `X-Guest-Id: <UUID_V4>` (anonymous user)

### GET /api/v1/cart
Retrieve cart contents

```bash
curl -X GET "https://your-api.example.com/api/v1/cart" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "7a3c8b9e-1234-4567-89ab-cdef01234567",
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

### POST /api/v1/cart
Add item to cart

```bash
curl -X POST "https://your-api.example.com/api/v1/cart" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567" \
  -d '{
    "productId": 123,
    "productVariantId": 456,
    "quantity": 2
  }'
```

**Request Body:**
```json
{
  "productId": 123,           // Required: Product ID
  "productVariantId": 456,    // Optional: Variant/Size ID
  "quantity": 2               // Required: Quantity to add
}
```

**Response (200):**
```json
{
  "success": true,
  "data": true,
  "message": "Item added to cart."
}
```

### PUT /api/v1/cart/{itemId}
Update cart item quantity

```bash
curl -X PUT "https://your-api.example.com/api/v1/cart/1" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567" \
  -d '{"quantity": 3}'
```

**Request Body:**
```json
{
  "quantity": 3  // New quantity
}
```

**Response (200):**
```json
{
  "success": true,
  "data": true,
  "message": "Cart item updated."
}
```

### DELETE /api/v1/cart/{itemId}
Remove item from cart

```bash
curl -X DELETE "https://your-api.example.com/api/v1/cart/1" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567"
```

**Response (200):**
```json
{
  "success": true,
  "data": true,
  "message": "Item removed from cart."
}
```

### DELETE /api/v1/cart
Clear entire cart

```bash
curl -X DELETE "https://your-api.example.com/api/v1/cart" \
  -H "X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567"
```

**Response (200):**
```json
{
  "success": true,
  "data": true,
  "message": "Cart cleared."
}
```

## Usage in React Components

### Basic Usage

```tsx
import { useCart } from "@/contexts/CartContext";

export function ProductCard({ product }) {
  const { addToCart, items, cartCount } = useCart();

  const handleAddToCart = async () => {
    // Works for both authenticated and anonymous users
    await addToCart(product.id, product.variantId, 1);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        Add to Cart ({cartCount})
      </button>
    </div>
  );
}
```

### Checking Authentication Status

```tsx
import { useCart } from "@/contexts/CartContext";

export function CheckoutButton() {
  const { items, isAuthenticated } = useCart();

  if (!isAuthenticated) {
    return <p>Please log in to checkout</p>;
  }

  return (
    <button disabled={items.length === 0}>
      Proceed to Checkout
    </button>
  );
}
```

## Guest-to-Authenticated User Flow

When a guest user creates an account or logs in:

1. **Option A - Automatic (Recommended Future Feature)**
   - Call `POST /api/v1/cart/merge` endpoint (backend implementation required)
   - Backend merges guest cart with authenticated user's cart
   - Guest ID can be discarded after merge

2. **Option B - Manual Re-add**
   - Guest items are still available in the guest cart (stored by guest ID)
   - User can manually re-add items after logging in
   - Old guest cart persists separately (can be cleaned up later)

3. **Client-Side Recommendation**
   - After login, call `await fetchCart()` to refresh cart from backend
   - This will fetch the authenticated user's cart
   - The guest ID remains in localStorage but isn't sent when JWT is present

## Error Handling

### Common Error Responses

**401 Unauthorized - Missing Authentication**
```json
{
  "success": false,
  "message": "Authentication token or X-Guest-Id header is required.",
  "errors": []
}
```
*Solution:* Ensure either `Authorization` header or `X-Guest-Id` header is present in the request.

**400 Bad Request - Invalid Quantity**
```json
{
  "success": false,
  "message": "Quantity must be greater than 0.",
  "errors": []
}
```
*Solution:* Ensure quantity parameter is > 0.

**404 Not Found - Product Not Found**
```json
{
  "success": false,
  "message": "Product not found.",
  "errors": []
}
```
*Solution:* Verify the product ID exists in the database.

## Security Considerations

### Guest ID Best Practices

1. **Use UUID v4 (Recommended)**
   - Very low collision probability
   - Cryptographically strong randomness
   - Industry standard for session tokens

2. **Treat as Session Token**
   - Don't expose guest IDs in URLs or unencrypted logs
   - Store in `localStorage` (not in cookies unless needed for cross-domain)
   - Consider adding expiration logic on backend

3. **Avoid ID Collision**
   - Current implementation: `guestId` is used as the `ApplicationUser.Id`
   - Ensure UUIDs don't collide with real user IDs
   - Future improvement: Use separate guest cart table

### What Remains Authenticated-Only

- **Checkout & Orders**: Order creation requires authentication
- **Payment Processing**: Always authenticated
- **Account & Profile**: Authenticated-only
- **Admin Operations**: Requires admin role

## Testing

### Manual Testing with cURL

```bash
# 1. Create a guest ID (using a sample UUID)
GUEST_ID="7a3c8b9e-1234-4567-89ab-cdef01234567"

# 2. Add item to cart
curl -X POST "http://localhost:5000/api/v1/cart" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: $GUEST_ID" \
  -d '{"productId": 1, "quantity": 1}'

# 3. Get cart
curl -X GET "http://localhost:5000/api/v1/cart" \
  -H "X-Guest-Id: $GUEST_ID"

# 4. Update quantity
curl -X PUT "http://localhost:5000/api/v1/cart/1" \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: $GUEST_ID" \
  -d '{"quantity": 2}'

# 5. Remove item
curl -X DELETE "http://localhost:5000/api/v1/cart/1" \
  -H "X-Guest-Id: $GUEST_ID"

# 6. Clear cart
curl -X DELETE "http://localhost:5000/api/v1/cart" \
  -H "X-Guest-Id: $GUEST_ID"
```

### Frontend Integration Testing

```tsx
import { useCart } from "@/contexts/CartContext";
import { getGuestId, clearGuestId } from "@/lib/guestId";

export function CartTestComponent() {
  const { addToCart, fetchCart, items } = useCart();

  const testAnonymousCart = async () => {
    const guestId = getGuestId();
    console.log("Current Guest ID:", guestId);
    
    // Add items
    await addToCart(1, undefined, 1);
    await addToCart(2, undefined, 2);
    
    // Fetch and verify
    await fetchCart();
    console.log("Cart items:", items);
  };

  return (
    <div>
      <button onClick={testAnonymousCart}>Test Anonymous Cart</button>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing header | Add `X-Guest-Id` or `Authorization` header |
| Cart empty after login | User switched sessions | Call `fetchCart()` after login to refresh from server |
| Guest ID changes | localStorage cleared | Implement backup (e.g., cookie) or sync logic |
| Duplicate carts after login | Guest cart not merged | Implement merge endpoint or notify user to re-add items |
| 500 Error on add | User creation failed | Check backend logs; may indicate ID collision or DB constraint |

## Next Steps & Recommendations

### Immediate (Optional)

1. **Test cart flow end-to-end**
   - Create a test guestId
   - Add/update/remove items
   - Verify API calls in browser DevTools Network tab

2. **Monitor guest user creation**
   - Backend logs should show guest user creation
   - Track how many guest users are created per day
   - Monitor database growth

### Short-term (Recommended)

1. **Implement POST /api/v1/cart/merge**
   - Merge guest cart into authenticated user cart on login
   - Delete guest user after merge (optional)
   - Update frontend to call merge endpoint after login

2. **Add backend cleanup job**
   - Remove guest users inactive for N days
   - Prevents database bloat
   - Run nightly or weekly

3. **Add UI messaging**
   - Inform users they can browse/add to cart without logging in
   - Prompt to log in at checkout
   - Show guest ID status in dev tools

### Long-term (Future Consideration)

1. **Schema separation** (if needed)
   - Create separate `GuestCart` table
   - Don't add rows to `AspNetUsers` for guests
   - Cleaner data model but requires migration

2. **Advanced guest features**
   - Guest wishlists
   - Guest reviews
   - Guest order history (encrypted ID)

3. **Cross-device sync**
   - Sync guest cart when user logs in
   - Implement device fingerprinting
   - Handle multi-device browsing

## Support & Questions

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review backend logs for error details
3. Inspect browser DevTools Network tab for API responses
4. Check cart context state in React DevTools

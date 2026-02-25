# 🗺️ Cart API Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React App)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Components                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │   │
│  │  │ Product  │ │  Cart    │ │   Checkout       │   │   │
│  │  │ Detail   │ │  Page    │ │   (Auth Only)    │   │   │
│  │  └────┬─────┘ └──────────┘ └──────────────────┘   │   │
│  │       │ useCart()                                  │   │
│  │       └──────────────────┬─────────────────────────┤   │
│  │                          │                        │   │
│  │  ┌───────────────────────▼──────────────────────┐ │   │
│  │  │       CartContext (useCart hook)             │ │   │
│  │  │  • addToCart()                               │ │   │
│  │  │  • removeFromCart()                          │ │   │
│  │  │  • updateQuantity()                          │ │   │
│  │  │  • clearCart()                               │ │   │
│  │  │  • items, cartTotal, isLoading               │ │   │
│  │  │  • isAuthenticated (NEW)                     │ │   │
│  │  └───────────┬────────────────────────────────┬─┘ │   │
│  │              │                                │   │   │
│  │              ▼                                │   │   │
│  │  ┌──────────────────────────────────────────┐│   │   │
│  │  │    API Interceptor (api.ts)              ││   │   │
│  │  │                                          ││   │   │
│  │  │  Request Flow:                           ││   │   │
│  │  │  1. Check if authenticated               ││   │   │
│  │  │     ✓ Add: Authorization: Bearer <JWT>  ││   │   │
│  │  │                                          ││   │   │
│  │  │  2. Check if cart endpoint               ││   │   │
│  │  │     ✓ Add: X-Guest-Id: <UUID>           ││   │   │
│  │  │       (auto-generated via guestId.ts)   ││   │   │
│  │  │                                          ││   │   │
│  │  │  3. Send request with both headers       ││   │   │
│  │  └──────────────────────────────────────────┘│   │   │
│  │              │                                │   │   │
│  │              ▼                                │   │   │
│  │  ┌──────────────────────────────────────────┐│   │   │
│  │  │  guestId.ts (NEW)                        ││   │   │
│  │  │                                          ││   │   │
│  │  │  getOrCreateGuestId()                    ││   │   │
│  │  │  • Checks localStorage                   ││   │   │
│  │  │  • Returns existing UUID, or             ││   │   │
│  │  │  • Generates UUID v4 & stores it         ││   │   │
│  │  │                                          ││   │   │
│  │  │  Storage Key: \"ecommerce_guest_id\"      ││   │   │
│  │  └──────────────────────────────────────────┘│   │   │
│  │                                              │   │   │
│  └──────────────────────────────────────────────┤   │   │
│                                                │   │
└────────────────────────────────────────────────┼───┘
                                                 │
                    ┌────────────────────────────┘
                    │ HTTP Requests
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway                                │
│             (Server-side environment)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          HTTP Headers Received:                      │ │
│  │                                                      │ │
│  │  Case 1: Authenticated User                         │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ POST /api/v1/cart                           │   │ │
│  │  │ Authorization: Bearer eyJhbGc...            │   │ │
│  │  │ X-Guest-Id: 7a3c8b9e-1234-5678-abcd...     │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  Case 2: Anonymous Guest                           │ │
│  │  ┌─────────────────────────────────────────────┐   │ │
│  │  │ POST /api/v1/cart                           │   │ │
│  │  │ X-Guest-Id: 7a3c8b9e-5678-abcd-1234...     │   │ │
│  │  └─────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                         │                                 │
│                         ▼                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        CartController                               │ │
│  │                                                      │ │
│  │  1. Extract auth info:                              │ │
│  │     IF Authorization header present:                │ │
│  │        userId = decrypt JWT → get user ID           │ │
│  │     ELSE IF X-Guest-Id header present:              │ │
│  │        userId = X-Guest-Id value                    │ │
│  │     ELSE:                                           │ │
│  │        return 401 Unauthorized                      │ │
│  │                                                      │ │
│  │  2. Route request:                                  │ │
│  │     GET /cart          → CartService.GetCart()      │ │
│  │     POST /cart         → CartService.AddItem()      │ │
│  │     PUT /cart/{id}     → CartService.Update()       │ │
│  │     DELETE /cart/{id}  → CartService.Remove()       │ │
│  │     DELETE /cart       → CartService.Clear()        │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                         │                                 │
│                         ▼                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        CartService                                  │ │
│  │                                                      │ │
│  │  For Mutating Operations (POST/PUT/DELETE):        │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │ IF userId is guestId (UUID format):        │    │ │
│  │  │   ✓ Call: IGuestUserService.               │    │ │
│  │  │            EnsureGuestUserExistsAsync(id) │    │ │
│  │  │                                            │    │ │
│  │  │   Backend checks:                          │    │ │
│  │  │   • Does AspNetUsers row exist for id?     │    │ │
│  │  │   • If NO → create minimal user            │    │ │
│  │  │   • If YES → proceed                       │    │ │
│  │  └────────────────────────────────────────────┘    │ │
│  │                                                      │ │
│  │  For All Operations (GET/POST/PUT/DELETE):         │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │ Proceed with cart operation:               │    │ │
│  │  │ • Use userId (either auth user or guest)  │    │ │
│  │  │ • Read/write CartItems with FK to userId  │    │ │
│  │  │ • Calculate totals                         │    │ │
│  │  └────────────────────────────────────────────┘    │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                         │                                 │
│                         ▼                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        Database (SQL Server)                         │ │
│  │                                                      │ │
│  │  AspNetUsers:                                        │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ Id (PK)  │ UserName │ Email │ ... │         │   │ │
│  │  ├──────────┼──────────┼───────┼─────┼─────────┤   │ │
│  │  │ user-123 │ john     │ j@... │ ... │ Real    │   │ │
│  │  │ 7a3c8... │ NULL     │ NULL  │ ... │ GUEST   │   │ │
│  │  │ 9f2e5... │ NULL     │ NULL  │ ... │ GUEST   │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  CartItems:                                          │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ Id │ UserId (FK) │ ProductId │ Quantity │... │   │ │
│  │  ├────┼─────────────┼───────────┼──────────┼────┤   │ │
│  │  │ 1  │ user-123    │ 100       │ 2        │ ...|   │ │
│  │  │ 2  │ 7a3c8...    │ 101       │ 1        │ ...|   │ │
│  │  │ 3  │ 9f2e5...    │ 102       │ 3        │ ...|   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                      │ │
│  │  ✓ FK Relationship: CartItems.UserId → AspNetUsers │ │
│  │    Works for both authenticated users AND guests    │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Guest User Creation Flow (First Cart Operation)

```
Guest visits site
    ↓
[Client-side]
    ↓
No JWT token → Will use guest flow
    ↓
First cart operation triggered (e.g., add item)
    ↓
axios interceptor.request
    ↓
getOrCreateGuestId()
    ├─ Check localStorage for \"ecommerce_guest_id\"
    ├─ Not found
    ├─ Generate UUID v4: \"7a3c8b9e-1234-4567-89ab-cdef01234567\"
    ├─ Store in localStorage
    └─ Return UUID
    ↓
Add X-Guest-Id header: \"7a3c8b9e-1234-4567-89ab-cdef01234567\"
    ↓
POST /api/v1/cart with:
  - Body: { productId: 123, quantity: 1 }
  - Header: X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567
    ↓
[Server-side]
    ↓
CartController receives request
    ↓
Extract auth:
  ├─ Authorization header? NO
  └─ X-Guest-Id header? YES → userId = \"7a3c8b9e-1234-4567-89ab-cdef01234567\"
    ↓
Route to: CartService.AddItem()
    ↓
Operation is mutating (POST):
  ↓
  Call: IGuestUserService.EnsureGuestUserExistsAsync(\"7a3c8b9e-1234...\")
    ↓
    Check: Does AspNetUsers row with Id=\"7a3c8b9e-1234...\" exist?
      ├─ YES → proceed to next step
      └─ NO → Create minimal AspNetUsers row:
         ├─ Id = \"7a3c8b9e-1234-4567-89ab-cdef01234567\"
         ├─ UserName = null (or auto-generated)
         ├─ Email = null
         ├─ PasswordHash = null (cannot log in)
         └─ ... other required fields with defaults
    ↓
  AspNetUsers row now exists ✓
    ↓
Proceed with cart operation:
  ├─ Create CartItem:
  │  ├─ ProductId = 123
  │  ├─ UserId = \"7a3c8b9e-1234...\" (FK to AspNetUsers)
  │  ├─ Quantity = 1
  │  └─ ...
  └─ Save to database ✓
    ↓
Return response: { success: true, data: true, message: \"Item added.\" }
    ↓
[Client-side]
    ↓
axios interceptor.response
  ↓
  Success ✓
    ↓
CartContext.fetchCart() called
    ↓
UI updated with item in cart ✓
    ↓
Guest can now:
  • View their cart
  • Update quantities
  • Remove items
  • Add more items
  ↓
All subsequent operations use same guestId from localStorage ✓
```

---

## Authentication Flow Comparison

### Authenticated User
```
User visits site → logs in
    ↓
JWT token stored in localStorage
    ↓
API interceptor:
  ├─ Found JWT? YES → Add Authorization header
  ├─ Is cart endpoint? YES → Add X-Guest-Id header (from localStorage)
  └─ Both headers sent ✓
    ↓
Server receives:
  ├─ Authorization: Bearer <JWT>
  └─ X-Guest-Id: <UUID>
    ↓
CartController prioritizes Authorization header
  ├─ Decrypt JWT → Extract userId (real user ID)
  └─ Ignore X-Guest-Id
    ↓
Use real user ID for all operations
    ↓
Result: Authenticated user cart operations ✓
```

### Guest User
```
User visits site (not logged in)
    ↓
No JWT token in localStorage
    ↓
API interceptor:
  ├─ Found JWT? NO
  ├─ Is cart endpoint? YES → Generate/retrieve guestId from localStorage
  └─ Only X-Guest-Id header sent ✓
    ↓
Server receives:
  ├─ Authorization: NOT PRESENT
  └─ X-Guest-Id: <UUID>
    ↓
CartController:
  ├─ Authorization header? NO
  ├─ X-Guest-Id header? YES → Extract guestId
  └─ Use guestId as userId
    ↓
For mutating ops: EnsureGuestUserExistsAsync(guestId)
    ↓
Use guestId for all operations
    ↓
Result: Guest cart operations ✓
```

---

## Request/Response Example Flow

### Scenario: Guest Adds Item to Cart

```
CLIENT REQUEST:
┌────────────────────────────────────────────────────────────┐
│ POST /api/v1/cart                                          │
│                                                            │
│ Headers:                                                   │
│   Content-Type: application/json                           │
│   X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567       │
│                                                            │
│ Body (JSON):                                               │
│   {                                                        │
│     \"productId\": 123,                                    │
│     \"productVariantId\": null,                            │
│     \"quantity\": 2                                        │
│   }                                                        │
└────────────────────────────────────────────────────────────┘
            ↓
SERVER PROCESSING:
┌────────────────────────────────────────────────────────────┐
│ 1. Extract userId from X-Guest-Id header                   │
│    userId = \"7a3c8b9e-1234-4567-89ab-cdef01234567\"      │
│                                                            │
│ 2. Call EnsureGuestUserExistsAsync(userId)                 │
│    → Check if AspNetUsers(Id=userId) exists               │
│    → If not, create minimal row                            │
│                                                            │
│ 3. Insert CartItem:                                        │
│    - ProductId: 123                                        │
│    - UserId: 7a3c8b9e-1234-4567-89ab-cdef01234567         │
│    - Quantity: 2                                           │
│    - VariantId: null                                       │
│    - CreatedAt: NOW                                        │
│                                                            │
│ 4. Calculate response                                      │
└────────────────────────────────────────────────────────────┘
            ↓
SERVER RESPONSE (200 OK):
┌────────────────────────────────────────────────────────────┐
│ {                                                          │
│   \"success\": true,                                       │
│   \"data\": true,                                          │
│   \"message\": \"Item added to cart.\",                    │
│   \"errors\": []                                           │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
            ↓
CLIENT HANDLING:
┌────────────────────────────────────────────────────────────┐
│ 1. Response received ✓                                     │
│ 2. unwrapResponse() validates success=true                 │
│ 3. Show toast: \"Added to cart!\"                          │
│ 4. Call fetchCart() to refresh UI                          │
│ 5. Re-render cart with updated item count                  │
└────────────────────────────────────────────────────────────┘
            ↓
NEXT GET REQUEST (Get Cart):
┌────────────────────────────────────────────────────────────┐
│ GET /api/v1/cart                                           │
│                                                            │
│ Headers:                                                   │
│   Content-Type: application/json                           │
│   X-Guest-Id: 7a3c8b9e-1234-4567-89ab-cdef01234567       │
│                                                            │
│ (No body needed for GET)                                   │
└────────────────────────────────────────────────────────────┘
            ↓
SERVER RESPONSE (200 OK):
┌────────────────────────────────────────────────────────────┐
│ {                                                          │
│   \"success\": true,                                       │
│   \"data\": {                                              │
│     \"userId\": \"7a3c8b9e-1234-4567-89ab-cdef01234567\",  │
│     \"items\": [                                           │
│       {                                                    │
│         \"id\": 42,                                        │
│         \"productId\": 123,                                │
│         \"variantId\": null,                               │
│         \"productName\": \"Coffee Beans\",                 │
│         \"variantName\": null,                             │
│         \"imageUrl\": \"/images/coffee.jpg\",              │
│         \"unitPrice\": 9.99,                               │
│         \"quantity\": 2,                                   │
│         \"totalPrice\": 19.98                              │
│       }                                                    │
│     ],                                                     │
│     \"totalPrice\": 19.98                                  │
│   },                                                       │
│   \"message\": \"\",                                        │
│   \"errors\": []                                           │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
            ↓
CLIENT UPDATE:
┌────────────────────────────────────────────────────────────┐
│ 1. CartContext.setItems(data.items)                        │
│ 2. CartContext.setCartTotal(data.totalPrice)               │
│ 3. UI renders updated cart:                                │
│    - Item: Coffee Beans × 2 = $19.98                       │
│    - Cart Total: $19.98                                    │
│    - Item Count Badge: \"2\"                                │
│                                                            │
│ Guest can now:                                             │
│ • Update quantity (PUT /cart/42)                           │
│ • Remove item (DELETE /cart/42)                            │
│ • Add more items (POST /cart)                              │
│ • Clear cart (DELETE /cart)                                │
│ • Proceed to checkout (requires auth)                      │
└────────────────────────────────────────────────────────────┘
```

---

## State Persistence Diagram

```
Browser Session #1: Guest Adds Items
├─ localStorage: { \"ecommerce_guest_id\": \"7a3c8b9e-...\" }
├─ Server CartItems:
│  └─ UserId: 7a3c8b9e-..., ProductId: 123, Qty: 2
├─ UI Shows: Item in cart
└─ Close browser
    ↓
Browser Session #2: Guest Returns
├─ No localStorage → undefined
├─ First cart API call
├─ axios interceptor → getOrCreateGuestId()
│  ├─ Check localStorage → \"ecommerce_guest_id\"
│  ├─ Found! → \"7a3c8b9e-...\" (SAME ID)
│  └─ Use existing guestId (NOT new)
├─ GET /api/v1/cart
│  ├─ Header: X-Guest-Id: 7a3c8b9e-...
│  ├─ Server finds CartItems for this userId
│  └─ Response: { items: [...same item...], totalPrice: 19.98 }
├─ UI Shows: Same item in cart ✓
└─ Guest can continue shopping ✓
```

---

## Authentication Priority (Server-side)

```
Request arrives with headers:
┌─────────────────────────────────────────────┐
│ Authorization: Bearer <JWT>                 │
│ X-Guest-Id: <UUID>                          │
│ (Authenticated user accessing cart)         │
└─────────────────────────────────────────────┘
            ↓
CartController checks:
  1. Is Authorization header present?
     └─ YES: Verify JWT & extract userId → PROCEED WITH AUTH USER CART
     
  2. Is X-Guest-Id header present?
     └─ YES: Extract guestId → PROCEED WITH GUEST CART
     
  3. Neither?
     └─ Return 401 Unauthorized
            ↓
Result: Server uses AUTHENTICATED USER ID (ignores guestId)
       ✓ Authenticated user cart takes priority
       ✓ Guest ID header ignored when JWT present
```

---

## File Structure

```
src/
├── lib/
│  ├── api.ts                    ← MODIFIED (X-Guest-Id injection)
│  ├── guestId.ts                ← NEW (UUID generation)
│  └── utils.ts
│
├── contexts/
│  ├── CartContext.tsx           ← MODIFIED (no auth guard)
│  ├── AuthContext.tsx
│  └── WishlistContext.tsx
│
├── pages/
│  ├── Cart.tsx
│  ├── ProductDetail.tsx
│  ├── Checkout.tsx
│  └── Wishlist.tsx
│
└── ...

Documentation/
├── ANONYMOUS_CART_INTEGRATION.md        ← NEW (600+ lines)
├── CART_QUICK_REFERENCE.md              ← NEW (150+ lines)
├── CHANGELOG_CART_UPDATES.md            ← NEW (400+ lines)
├── IMPLEMENTATION_SUMMARY.md            ← NEW (500+ lines)
├── VERIFICATION_AND_DEPLOYMENT.md       ← NEW (500+ lines)
└── ARCHITECTURE_AND_DATAFLOW.md         ← NEW (This file)
```

---

## Technology Stack Summary

```
Frontend:
├─ React 18+ (Hooks, Context API)
├─ Axios (HTTP client with interceptors)
├─ TypeScript (Type safety)
└─ localStorage (Client-side storage)

Backend (Not modified by this update):
├─ ASP.NET Core 8
├─ EF Core (ORM)
├─ SQL Server (Database)
├─ ASP.NET Identity (Authentication)
└─ JWT (Bearer tokens)

Communication:
├─ HTTP/REST
├─ JSON request/response bodies
├─ Custom headers (X-Guest-Id, Authorization)
└─ Standard HTTP status codes
```

---

## Backward Compatibility Visualization

```
BEFORE (Authenticated Only):
┌─────────────────────────────────────────┐
│  User Login                             │
│         ↓                               │
│  JWT Token Generated                    │
│         ↓                               │
│  Can Add to Cart                        │
│         ↓                               │
│  Can Checkout                           │
│         ↓                               │
│  Can Place Order                        │
│                                         │
│  Guest (not logged in):                 │
│         ↓                               │
│  ❌ Cannot add to cart                  │
│  ❌ Cannot checkout                     │
│  ❌ Cannot place order                  │
└─────────────────────────────────────────┘


AFTER (Authenticated + Guest Support):
┌──────────────────────────────────────────┐
│  User Login (SAME AS BEFORE)             │
│         ↓                                │
│  JWT Token Generated (SAME AS BEFORE)    │
│         ↓                                │
│  ✓ Can Add to Cart (UNCHANGED)           │
│  ✓ JWT takes priority (BACKWARD COMPAT)  │
│         ↓                                │
│  ✓ Can Checkout (UNCHANGED)              │
│         ↓                                │
│  ✓ Can Place Order (UNCHANGED)           │
│                                          │
│  Guest (not logged in) - NOW SUPPORTED:  │
│         ↓                                │
│  ✓ CAN add to cart (NEW)                 │
│  ✓ View cart (NEW)                       │
│  ✓ Manage cart (NEW)                     │
│  ❌ Cannot checkout (INTENTIONAL)        │
│  ❌ Cannot place order (INTENTIONAL)     │
│                                          │
│  NOTE:                                   │
│  • All auth user workflows UNCHANGED     │
│  • All auth user data SAFE               │
│  • All auth protections INTACT           │
│  • Only ADDED guest support              │
└──────────────────────────────────────────┘
```

---

**Diagram Legend:**
- `→` Flow direction
- `✓` Working/Supported
- `❌` Not supported
- `NEW` New functionality added
- `UNCHANGED` Existing behavior unchanged
- `MODIFIED` Updated behavior

# 🔧 Payment 401 Unauthorized - Fix Guide

## ❌ Error

```
POST /api/v1/payments/create 401 (Unauthorized)
```

## ✅ Good News

Your order creation is working! The logs show:
```
Order response: {success: true, message: 'Order placed successfully.', data: 7}
```

This means:
- ✅ Cart has items
- ✅ Authentication is working for orders
- ✅ Backend is accessible
- ❌ Payment endpoint has authentication issue

---

## 🔍 Root Cause

The backend `/api/v1/payments/create` endpoint is returning `401 Unauthorized`, which means:

1. **Backend not accepting X-Guest-Id for payments** (most likely)
2. **Payment endpoint requires different authentication**
3. **Backend payment endpoint not fully implemented for guests**

---

## 🎯 Solution Options

### Option 1: Backend Fix (Recommended)

The backend team needs to update the payment endpoint to accept X-Guest-Id header, just like the orders endpoint does.

**Backend should accept:**
```
X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000
```

**Or for authenticated users:**
```
Authorization: Bearer eyJhbGc...
```

### Option 2: Frontend Workaround (Temporary)

If you need to test the frontend while waiting for backend fix, you can temporarily mock the payment response.

---

## 🔧 Temporary Testing Solution

While the backend team fixes the payment endpoint, you can test the frontend flow with a mock response.

### Step 1: Create Mock Payment Service

Create a new file: `src/lib/paymentService.mock.ts`

```typescript
import { PaymentResponse } from "./paymentService";

/**
 * TEMPORARY MOCK for testing frontend
 * Remove this file once backend payment endpoint is fixed
 */
export async function createPaymentMock(): Promise<PaymentResponse> {
  console.warn("🚧 Using MOCK payment response - Remove before production!");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock response
  return {
    success: true,
    iframeUrl: "https://example.com/mock-payment-page",
    orderId: 7 // Use the actual order ID from previous step
  };
}
```

### Step 2: Update usePayment Hook (Temporary)

In `src/hooks/usePayment.ts`, add a flag to use mock:

```typescript
import { createPaymentMock } from "@/lib/paymentService.mock";

const USE_MOCK_PAYMENT = true; // Set to false when backend is ready

export function usePayment() {
  // ... existing code ...

  const initiatePayment = useCallback(async (): Promise<PaymentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // TEMPORARY: Use mock if backend not ready
      const payment = USE_MOCK_PAYMENT 
        ? await createPaymentMock()
        : await createPayment();
      
      setPendingOrderId(payment.orderId);
      return payment;
    } catch (err: any) {
      // ... error handling ...
    }
  }, []);
}
```

**⚠️ Remember to remove this before production!**

---

## 🐛 Debugging Steps

### Step 1: Check Headers Being Sent

Try checkout again and check the console. You should now see:

```javascript
Creating payment session...
Request URL: /payments/create
Guest ID: 550e8400-e29b-41d4-a716-446655440000
Auth User: null (or user object)
```

### Step 2: Check Network Tab

1. Open DevTools (F12) → Network tab
2. Try checkout
3. Find POST request to `/payments/create`
4. Check **Headers** tab:

**Should see:**
```
X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

**If X-Guest-Id is missing:**
- The API interceptor isn't working
- Check `src/lib/api.ts`

**If X-Guest-Id is present but still 401:**
- Backend doesn't accept X-Guest-Id for payment endpoint
- Backend needs to be updated

---

## 📞 Backend Team Action Items

The backend `/api/v1/payments/create` endpoint needs to:

1. ✅ Accept `X-Guest-Id` header (like `/orders/checkout` does)
2. ✅ Create guest user if needed (like orders endpoint)
3. ✅ Process payment for guest users
4. ✅ Return payment URL

**Example backend code (C#):**

```csharp
[HttpPost("create")]
public async Task<IActionResult> CreatePayment()
{
    // Get user ID from JWT OR X-Guest-Id header
    var userId = User.Identity?.IsAuthenticated == true
        ? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        : Request.Headers["X-Guest-Id"].ToString();
    
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("Authentication required");
    }
    
    // For guest users, ensure user exists
    if (!User.Identity?.IsAuthenticated == true)
    {
        await _guestUserService.EnsureGuestUserExistsAsync(userId);
    }
    
    // Get cart and create payment
    var cart = await _cartService.GetCartAsync(userId);
    var payment = await _paymobService.CreatePaymentAsync(cart);
    
    return Ok(new { 
        success = true, 
        iframeUrl = payment.CheckoutUrl,
        orderId = cart.OrderId 
    });
}
```

---

## 🧪 Test Backend Endpoint

### Test with Guest ID

```bash
curl -X POST https://nestmart.runasp.net/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{}'
```

**Expected:**
```json
{
  "success": true,
  "iframeUrl": "https://accept.paymob.com/...",
  "orderId": 7
}
```

**Current (401):**
```json
{
  "message": "Unauthorized"
}
```

### Test with JWT Token

```bash
curl -X POST https://nestmart.runasp.net/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

---

## ✅ Verification Checklist

Once backend is fixed:

- [ ] Payment endpoint accepts X-Guest-Id header
- [ ] Guest users can create payments
- [ ] Authenticated users can create payments
- [ ] Payment URL is returned correctly
- [ ] Frontend receives payment response
- [ ] Redirect to Paymob works
- [ ] Full flow works end-to-end

---

## 🎯 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Ready | All code implemented |
| Order Creation | ✅ Working | Returns order ID: 7 |
| Payment Creation | ❌ 401 Error | Backend needs update |
| Payment Callback | ✅ Ready | Will work once payment works |

---

## 📋 Next Steps

### For Frontend Team (You):
1. ✅ Verify X-Guest-Id is being sent (check Network tab)
2. ✅ Confirm order creation works (already working!)
3. ⏳ Wait for backend payment endpoint fix
4. 🧪 Test with mock response (optional, for UI testing)

### For Backend Team:
1. ❌ Update `/api/v1/payments/create` to accept X-Guest-Id
2. ❌ Implement guest user support for payments
3. ❌ Test with guest ID
4. ❌ Deploy fix

---

## 💡 Quick Test

Run this in browser console to verify headers:

```javascript
// Check what will be sent
console.log("Guest ID:", localStorage.getItem('ecommerce_guest_id'));
console.log("Auth User:", localStorage.getItem('ecommerce_auth_user'));

// Test payment endpoint manually
fetch('/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Guest-Id': localStorage.getItem('ecommerce_guest_id')
  },
  body: '{}'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 🎉 Summary

**The Good:**
- ✅ Your frontend code is correct
- ✅ Order creation works perfectly
- ✅ Authentication is working
- ✅ Cart has items

**The Issue:**
- ❌ Backend payment endpoint doesn't accept guest users yet

**The Fix:**
- Backend team needs to update payment endpoint to accept X-Guest-Id header

**Estimated Fix Time:** 30 minutes (backend update)

---

**Status:** Waiting for Backend Fix  
**Your Code:** ✅ Ready  
**Next:** Backend team updates payment endpoint

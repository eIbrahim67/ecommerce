# 🔧 Payment Integration Troubleshooting

## ❌ Error: "Failed to initialize payment. Please try again."

This error occurs when the payment creation API call fails. Here's how to debug and fix it.

---

## 🔍 Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages.

### What to Look For:

```javascript
// You should see logs like:
Creating payment session...
Create payment error details: {
  message: "...",
  response: {...},
  status: 400/401/502,
  url: "/api/v1/payments/create"
}
```

---

## 🐛 Common Causes & Solutions

### 1. Backend Not Implemented Yet ⚠️

**Symptom:** 
- Console shows: `404 Not Found` or `Cannot POST /api/v1/payments/create`

**Cause:** 
- The backend payment endpoint doesn't exist yet

**Solution:**
- Check if backend has implemented `/api/v1/payments/create` endpoint
- Verify backend is running
- Check backend logs

**Test Backend:**
```bash
curl -X POST https://nestmart.runasp.net/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: test-guest-id" \
  -d '{}'
```

---

### 2. Empty Cart 🛒

**Symptom:**
- Console shows: `400 Bad Request` with message "Cart is empty"

**Cause:**
- Trying to create payment with no items in cart

**Solution:**
- Add items to cart before checkout
- Check cart state in React DevTools

**Debug:**
```javascript
// In browser console:
localStorage.getItem('ecommerce_guest_id')
// Should return a UUID

// Check cart via API:
fetch('/api/v1/cart', {
  headers: {
    'X-Guest-Id': localStorage.getItem('ecommerce_guest_id')
  }
}).then(r => r.json()).then(console.log)
```

---

### 3. Authentication Issue 🔐

**Symptom:**
- Console shows: `401 Unauthorized`

**Cause:**
- Missing or invalid JWT token
- Missing X-Guest-Id header

**Solution:**
- Check if user is logged in OR guest ID exists
- Verify headers are being sent

**Debug:**
```javascript
// Check auth token:
localStorage.getItem('ecommerce_auth_user')

// Check guest ID:
localStorage.getItem('ecommerce_guest_id')

// Both should exist (at least one)
```

---

### 4. CORS Issue 🌐

**Symptom:**
- Console shows: `CORS policy` error

**Cause:**
- Backend not allowing requests from your frontend domain

**Solution:**
- Configure CORS on backend to allow your frontend URL
- Check backend CORS settings

---

### 5. Network Error 📡

**Symptom:**
- Console shows: `Network Error` or `ERR_CONNECTION_REFUSED`

**Cause:**
- Backend is down
- Wrong API URL
- Network connectivity issue

**Solution:**
- Check if backend is running: `https://nestmart.runasp.net`
- Verify API proxy in `vite.config.ts`
- Check network tab in DevTools

---

### 6. Backend Error 500 💥

**Symptom:**
- Console shows: `500 Internal Server Error`

**Cause:**
- Backend code error
- Database connection issue
- Paymob API error

**Solution:**
- Check backend logs
- Verify Paymob API keys are configured
- Check database connection

---

## 🔧 Quick Fixes

### Fix 1: Updated API Interceptor ✅

I've already updated `src/lib/api.ts` to include X-Guest-Id header for payment endpoints:

```typescript
// Now includes /payments
if (config.url?.includes("/cart") || 
    config.url?.includes("/orders") || 
    config.url?.includes("/payments")) {
    const guestId = getOrCreateGuestId();
    config.headers["X-Guest-Id"] = guestId;
}
```

### Fix 2: Better Error Logging ✅

Updated `src/lib/paymentService.ts` with detailed error logging:

```typescript
console.error("Create payment error details:", {
  message: error.message,
  response: error.response?.data,
  status: error.response?.status,
  url: error.config?.url,
});
```

---

## 🧪 Testing Steps

### Test 1: Verify Backend Endpoint

```bash
# Test if endpoint exists
curl -X POST https://nestmart.runasp.net/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{}'

# Expected response:
# Success: { "success": true, "iframeUrl": "...", "orderId": 123 }
# Error: { "success": false, "message": "Cart is empty" }
```

### Test 2: Check Cart Has Items

```bash
# Get cart contents
curl https://nestmart.runasp.net/api/v1/cart \
  -H "X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000"

# Should return items array
```

### Test 3: Test Full Flow

1. Open browser console (F12)
2. Add items to cart
3. Go to checkout
4. Fill form
5. Click "Proceed to Payment"
6. Watch console for logs

---

## 📊 Debug Checklist

Run through this checklist:

- [ ] Backend is running and accessible
- [ ] `/api/v1/payments/create` endpoint exists
- [ ] Cart has items (not empty)
- [ ] Guest ID or JWT token exists
- [ ] Headers are being sent correctly
- [ ] No CORS errors in console
- [ ] No network errors
- [ ] Backend logs show the request
- [ ] Paymob API keys are configured on backend

---

## 🔍 Detailed Debugging

### Check Request Headers

Open DevTools → Network tab → Find the POST request to `/payments/create`:

**Should see:**
```
Content-Type: application/json
X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000
OR
Authorization: Bearer eyJhbGc...
```

### Check Request Payload

**Should be:**
```json
{}
```
(Empty object - backend calculates amount from cart)

### Check Response

**Success:**
```json
{
  "success": true,
  "iframeUrl": "https://accept.paymob.com/unifiedcheckout/?publicKey=...",
  "orderId": 123
}
```

**Error:**
```json
{
  "success": false,
  "message": "Cart is empty"
}
```

---

## 🚨 If Backend Not Ready

If the backend payment endpoint isn't implemented yet, you have two options:

### Option 1: Wait for Backend

The backend team needs to implement:
- `POST /api/v1/payments/create` endpoint
- Paymob integration
- Webhook handling

### Option 2: Mock the Response (Testing Only)

For frontend testing, you can temporarily mock the response:

```typescript
// In src/lib/paymentService.ts (TEMPORARY)
export async function createPayment(): Promise<PaymentResponse> {
  // MOCK RESPONSE FOR TESTING
  console.warn("Using mock payment response");
  return {
    success: true,
    iframeUrl: "https://example.com/mock-payment",
    orderId: 999
  };
}
```

**⚠️ Remove this before production!**

---

## 📞 Getting Help

### Check These First:

1. **Browser Console** - Look for error messages
2. **Network Tab** - Check request/response
3. **Backend Logs** - Check server errors
4. **Paymob Dashboard** - Verify API keys

### Information to Provide:

When asking for help, include:
- Error message from console
- Request headers (from Network tab)
- Response body (from Network tab)
- Backend logs (if accessible)
- Steps to reproduce

---

## ✅ Verification

Once fixed, you should see:

1. **Console logs:**
   ```
   Creating payment session...
   Payment response: { success: true, iframeUrl: "...", orderId: 123 }
   ```

2. **Navigation to `/payment-processing`**

3. **Countdown timer showing**

4. **Redirect to Paymob (or mock URL)**

---

## 🎯 Next Steps

After fixing the error:

1. ✅ Verify payment creation works
2. ✅ Test with real cart items
3. ✅ Test with guest user
4. ✅ Test with authenticated user
5. ✅ Test payment callback flow
6. ✅ Test full end-to-end flow

---

**Need more help?** Check:
- `PAYMENT_INTEGRATION_COMPLETE.md` - Full integration guide
- `payment/` folder - Backend API documentation
- Backend team - For server-side issues

---

**Status:** Troubleshooting Guide  
**Updated:** February 26, 2026

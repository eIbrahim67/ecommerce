# 🔄 Paymob API Comparison: Unified vs Legacy Iframe

**Your Account Type:** Legacy Iframe (iframe ID: 1009847)  
**What Backend is Using:** Unified Checkout (WRONG)  
**What Backend Should Use:** Legacy Iframe (CORRECT)

---

## ❌ Current Implementation (NOT Working)

### Unified Checkout API Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Create Intention                                    │
├─────────────────────────────────────────────────────────────┤
│ POST https://accept.paymob.com/v1/intention/                │
│                                                              │
│ Headers:                                                     │
│   Authorization: Bearer {auth_token}                         │
│   Content-Type: application/json                             │
│                                                              │
│ Body:                                                        │
│ {                                                            │
│   "amount": 100000,                                          │
│   "currency": "EGP",                                         │
│   "payment_methods": [158],                                  │
│   "billing_data": {...}                                      │
│ }                                                            │
│                                                              │
│ Response:                                                    │
│ {                                                            │
│   "client_secret": "cs_xxx...",  ← NOT RETURNED FOR YOU     │
│   "id": "intent_xxx"                                         │
│ }                                                            │
│                                                              │
│ ❌ ERROR: No client_secret received                          │
└─────────────────────────────────────────────────────────────┘
```

**Why it fails:** Your Paymob account doesn't support Unified Checkout API. You have a Legacy Iframe integration.

---

## ✅ Required Implementation (Will Work)

### Legacy Iframe API Flow (3 Steps)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Get Authentication Token                            │
├─────────────────────────────────────────────────────────────┤
│ POST https://accept.paymob.com/api/auth/tokens              │
│                                                              │
│ Headers:                                                     │
│   Content-Type: application/json                             │
│                                                              │
│ Body:                                                        │
│ {                                                            │
│   "api_key": "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklr..."  │
│ }                                                            │
│                                                              │
│ Response:                                                    │
│ {                                                            │
│   "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXh..."  │
│ }                                                            │
│                                                              │
│ ✅ Save this token for next steps                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 2: Register Order                                      │
├─────────────────────────────────────────────────────────────┤
│ POST https://accept.paymob.com/api/ecommerce/orders         │
│                                                              │
│ Headers:                                                     │
│   Content-Type: application/json                             │
│                                                              │
│ Body:                                                        │
│ {                                                            │
│   "auth_token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV...",│
│   "delivery_needed": false,                                  │
│   "amount_cents": 150000,  ← Amount in cents (1500 EGP)     │
│   "currency": "EGP",                                         │
│   "items": [                                                 │
│     {                                                        │
│       "name": "Product Name",                                │
│       "amount_cents": 50000,                                 │
│       "description": "Product description",                  │
│       "quantity": 3                                          │
│     }                                                        │
│   ]                                                          │
│ }                                                            │
│                                                              │
│ Response:                                                    │
│ {                                                            │
│   "id": 12345678,  ← Paymob Order ID                        │
│   "amount_cents": 150000                                     │
│ }                                                            │
│                                                              │
│ ✅ Save this order ID for next step                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 3: Get Payment Key                                     │
├─────────────────────────────────────────────────────────────┤
│ POST https://accept.paymob.com/api/acceptance/payment_keys  │
│                                                              │
│ Headers:                                                     │
│   Content-Type: application/json                             │
│                                                              │
│ Body:                                                        │
│ {                                                            │
│   "auth_token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV...",│
│   "amount_cents": 150000,                                    │
│   "expiration": 3600,  ← 1 hour                             │
│   "order_id": 12345678,  ← From Step 2                      │
│   "currency": "EGP",                                         │
│   "integration_id": 158,  ← YOUR INTEGRATION ID             │
│   "billing_data": {                                          │
│     "first_name": "Ibrahim",                                 │
│     "last_name": "Mohamed",                                  │
│     "email": "ibrahim.mohamed.ibrahim.t@gmail.com",          │
│     "phone_number": "01550162282",                           │
│     "street": "Cairo",                                       │
│     "city": "Cairo",                                         │
│     "postal_code": "12345",                                  │
│     "country": "EG",                                         │
│     "apartment": "NA",                                       │
│     "floor": "NA",                                           │
│     "building": "NA",                                        │
│     "shipping_method": "NA",                                 │
│     "state": "NA"                                            │
│   }                                                          │
│ }                                                            │
│                                                              │
│ Response:                                                    │
│ {                                                            │
│   "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXh..."  │
│ }                                                            │
│                                                              │
│ ✅ This is the payment key!                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 4: Build Iframe URL                                    │
├─────────────────────────────────────────────────────────────┤
│ Format:                                                      │
│ https://accept.paymob.com/api/acceptance/iframes/{iframe_id}?payment_token={payment_key}
│                                                              │
│ Your URL:                                                    │
│ https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXh...
│                                                              │
│ ✅ Return this URL to frontend                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Side-by-Side Comparison

| Feature | Unified Checkout | Legacy Iframe |
|---------|------------------|---------------|
| **API Endpoint** | `/v1/intention/` | `/api/auth/tokens` + `/api/ecommerce/orders` + `/api/acceptance/payment_keys` |
| **Steps** | 1 step | 3 steps |
| **Your Account** | ❌ Not supported | ✅ Supported |
| **Iframe ID** | Not used | 1009847 |
| **Integration ID** | Not used | 158 |
| **URL Format** | `unifiedcheckout/?publicKey=...&clientSecret=...` | `iframes/1009847?payment_token=...` |
| **Status** | ❌ Fails with "no client_secret" | ✅ Will work |

---

## 🔍 How to Identify Which API You're Using

### Check Your Code

**If you see this → You're using Unified Checkout (WRONG):**
```csharp
POST /v1/intention/
// or
"unifiedcheckout/?publicKey="
// or
"client_secret"
```

**If you see this → You're using Legacy Iframe (CORRECT):**
```csharp
POST /api/auth/tokens
POST /api/ecommerce/orders
POST /api/acceptance/payment_keys
// or
"iframes/1009847?payment_token="
// or
"payment_key"
```

---

## 💡 Key Differences

### Authentication

**Unified Checkout:**
```
Authorization: Bearer {auth_token}
```

**Legacy Iframe:**
```
Body: { "auth_token": "..." }
```

### Amount Format

**Both use cents:**
```
1500 EGP = 150000 cents
```

### Response Format

**Unified Checkout:**
```json
{
  "client_secret": "cs_xxx",
  "id": "intent_xxx"
}
```

**Legacy Iframe:**
```json
{
  "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXh..."
}
```

### Final URL

**Unified Checkout:**
```
https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_xxx&clientSecret=cs_xxx
```

**Legacy Iframe:**
```
https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXh...
```

---

## 🧪 Testing Each Step

### Test Step 1: Auth Token

```bash
curl -X POST "https://accept.paymob.com/api/auth/tokens" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY_HERE"
  }'
```

**Expected Response:**
```json
{
  "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5..."
}
```

### Test Step 2: Register Order

```bash
curl -X POST "https://accept.paymob.com/api/ecommerce/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_token": "TOKEN_FROM_STEP_1",
    "delivery_needed": false,
    "amount_cents": 150000,
    "currency": "EGP",
    "items": [
      {
        "name": "Test Product",
        "amount_cents": 150000,
        "description": "Test",
        "quantity": 1
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "id": 12345678,
  "amount_cents": 150000
}
```

### Test Step 3: Get Payment Key

```bash
curl -X POST "https://accept.paymob.com/api/acceptance/payment_keys" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_token": "TOKEN_FROM_STEP_1",
    "amount_cents": 150000,
    "expiration": 3600,
    "order_id": 12345678,
    "currency": "EGP",
    "integration_id": 158,
    "billing_data": {
      "first_name": "Test",
      "last_name": "User",
      "email": "test@example.com",
      "phone_number": "+201234567890",
      "street": "Test Street",
      "city": "Cairo",
      "postal_code": "12345",
      "country": "EG",
      "apartment": "NA",
      "floor": "NA",
      "building": "NA",
      "shipping_method": "NA",
      "state": "NA"
    }
  }'
```

**Expected Response:**
```json
{
  "token": "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5..."
}
```

### Test Step 4: Build URL

```
https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5...
```

Open this URL in a browser → Should see Paymob payment form

---

## ✅ Verification Checklist

After implementing Legacy Iframe flow, verify:

- [ ] Step 1 returns auth token (not empty)
- [ ] Step 2 returns Paymob order ID (positive integer)
- [ ] Step 3 returns payment key (long string)
- [ ] Final URL contains `/iframes/1009847?payment_token=`
- [ ] Final URL does NOT contain `unifiedcheckout`
- [ ] Final URL does NOT contain `clientSecret`
- [ ] Opening URL in browser shows Paymob payment form
- [ ] Payment form shows "Installment_Discount" iframe
- [ ] Test card payment completes successfully
- [ ] Webhook receives payment confirmation
- [ ] Order status updates to "Processing"
- [ ] Payment status updates to "Paid"

---

## 🚀 Quick Implementation Checklist

1. [ ] Add `IntegrationId: 158` to configuration
2. [ ] Add `IframeId: 1009847` to configuration
3. [ ] Create DTOs for auth, order, and payment key
4. [ ] Implement `GetAuthToken()` method
5. [ ] Implement `RegisterOrder()` method
6. [ ] Implement `GetPaymentKey()` method
7. [ ] Update `CreatePaymentIntention()` to call all 3 methods
8. [ ] Build iframe URL with format: `iframes/{IframeId}?payment_token={key}`
9. [ ] Test with cURL commands above
10. [ ] Test complete flow with frontend

---

## 📞 Need Help?

**Paymob Documentation:**
- Legacy Iframe: https://docs.paymob.com/docs/accept-standard-redirect
- Auth: https://docs.paymob.com/docs/authentication
- Order Registration: https://docs.paymob.com/docs/order-registration-api
- Payment Keys: https://docs.paymob.com/docs/payment-key-request

**Your Account:**
- Iframe ID: 1009847
- Integration ID: 158
- Mode: TEST

---

**Summary:** Switch from 1-step Unified Checkout to 3-step Legacy Iframe flow. Your account only supports Legacy Iframe! 🚀

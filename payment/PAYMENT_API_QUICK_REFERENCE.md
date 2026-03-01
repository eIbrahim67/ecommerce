# 💳 Payment API Quick Reference

## Base URL
```
https://nestmart.runasp.net
```

---

## 🔑 Authentication

**Option 1: JWT Token (Authenticated Users)**
```http
Authorization: Bearer {jwt_token}
```

**Option 2: Guest ID (Guest Users)**
```http
X-Guest-Id: {guest_id}
```

---

## 📍 Endpoints

### 1. Create Order
```http
POST /api/v1/orders/checkout
Content-Type: application/json
Authorization: Bearer {token} OR X-Guest-Id: {guestId}

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+201234567890",
  "address": "123 Main St",
  "city": "Cairo",
  "zipCode": "12345",
  "notes": "Optional"
}

Response:
{
  "success": true,
  "data": {
    "orderId": 123,
    "totalAmount": 1500.00,
    "status": "Pending"
  }
}
```

### 2. Create Payment
```http
POST /api/v1/payments/create
Content-Type: application/json
Authorization: Bearer {token} OR X-Guest-Id: {guestId}

{}

Response:
{
  "success": true,
  "iframeUrl": "https://accept.paymob.com/unifiedcheckout/?publicKey=xxx&clientSecret=xxx",
  "orderId": 123
}
```

### 3. Check Payment Status
```http
GET /api/payments/status/{orderId}

Response:
{
  "orderId": 123,
  "orderStatus": "Processing",
  "paymentStatus": "Paid",
  "transactionId": "999"
}
```

### 4. Get User Orders
```http
GET /api/v1/orders
Authorization: Bearer {token} OR X-Guest-Id: {guestId}

Response:
{
  "success": true,
  "data": [
    {
      "id": 123,
      "orderDate": "2026-02-26T12:00:00Z",
      "status": "Processing",
      "totalAmount": 1500.00
    }
  ]
}
```

### 5. Get Order Details
```http
GET /api/v1/orders/{id}
Authorization: Bearer {token} OR X-Guest-Id: {guestId}

Response:
{
  "success": true,
  "data": {
    "id": 123,
    "status": "Processing",
    "totalAmount": 1500.00,
    "items": [...]
  }
}
```

---

## 🔄 Payment Flow

```
1. User clicks "Checkout"
   ↓
2. POST /api/v1/orders/checkout
   ↓
3. POST /api/v1/payments/create
   ↓
4. Redirect to iframeUrl
   ↓
5. User completes payment on Paymob
   ↓
6. Paymob redirects back to your site
   ↓
7. Poll GET /api/payments/status/{orderId}
   ↓
8. Show confirmation when paymentStatus === "Paid"
```

---

## 📊 Status Values

### Order Status
- `Pending` - Awaiting payment
- `Processing` - Payment confirmed
- `Shipped` - Order shipped
- `Delivered` - Order delivered
- `Cancelled` - Order cancelled

### Payment Status
- `Pending` - Payment initiated
- `Paid` - Payment successful ✅
- `Failed` - Payment failed ❌
- `Refunded` - Payment refunded
- `NotFound` - No payment record

---

## ⚡ Quick Implementation

```javascript
// 1. Create order
const order = await fetch('https://nestmart.runasp.net/api/v1/orders/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(checkoutData)
}).then(r => r.json());

// 2. Create payment
const payment = await fetch('https://nestmart.runasp.net/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({})
}).then(r => r.json());

// 3. Store order ID
localStorage.setItem('pendingOrderId', payment.orderId);

// 4. Redirect to Paymob
window.location.href = payment.iframeUrl;

// 5. On callback page, poll status
async function checkStatus() {
  const orderId = localStorage.getItem('pendingOrderId');
  const status = await fetch(`https://nestmart.runasp.net/api/payments/status/${orderId}`)
    .then(r => r.json());
  
  if (status.paymentStatus === 'Paid') {
    // Success!
    localStorage.removeItem('pendingOrderId');
    window.location.href = `/orders/${orderId}`;
  } else if (status.paymentStatus === 'Pending') {
    // Check again in 2 seconds
    setTimeout(checkStatus, 2000);
  }
}
```

---

## ❌ Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Unauthorized | Add Authorization header or X-Guest-Id |
| 400 | Cart is empty | Redirect to cart page |
| 502 | Payment provider error | Show error, allow retry |
| 404 | Order not found | Verify order ID |

---

## 🧪 Testing

**Test Webhook:**
```bash
curl -X POST https://nestmart.runasp.net/api/payments/webhook/paymob/test \
  -H "Content-Type: application/json" \
  -d '{
    "id": "intent_test_001",
    "success": true,
    "special_reference": "1",
    "transactions": [{"id": 999}]
  }'
```

**Test Cards (Paymob):**
- Success: `4987654321098769`
- Declined: `4000000000000002`

---

## 📚 Full Documentation

See `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md` for:
- Detailed flow diagrams
- Complete code examples (React, Vue, vanilla JS)
- Error handling strategies
- Security best practices
- FAQ

---

**Mode:** TEST (use test cards)  
**Status:** ✅ Ready for Integration

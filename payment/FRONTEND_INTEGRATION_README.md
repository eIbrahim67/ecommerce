# 🎯 Frontend Integration - Start Here

## 📚 Documentation Overview

Your backend payment APIs are ready! Here's everything your frontend team needs:

---

## 🚀 Quick Start (5 Minutes)

### 1. Read This First
**File:** `PAYMENT_API_QUICK_REFERENCE.md`

Quick reference card with:
- All API endpoints
- Request/response examples
- Status codes
- Quick implementation snippet

**Time:** 5 minutes

---

### 2. Understand the Flow
**File:** `PAYMENT_FLOW_DIAGRAM.md`

Visual diagrams showing:
- Complete payment flow
- State transitions
- Timing diagrams
- Error scenarios

**Time:** 10 minutes

---

### 3. Implement Integration
**File:** `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md`

Complete guide with:
- Step-by-step integration
- React/Next.js examples
- Vue.js examples
- Vanilla JavaScript examples
- Error handling
- Security best practices

**Time:** 30-60 minutes to implement

---

## 📋 Documentation Files

| Priority | File | Purpose | Time |
|----------|------|---------|------|
| 🔥 **START** | `PAYMENT_API_QUICK_REFERENCE.md` | Quick reference card | 5 min |
| 1️⃣ | `PAYMENT_FLOW_DIAGRAM.md` | Visual flow diagrams | 10 min |
| 2️⃣ | `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md` | Complete implementation guide | 60 min |
| 3️⃣ | `DEPLOYMENT_SUCCESS.md` | Backend deployment status | 5 min |

---

## 🎯 What You Need to Know

### Base URL
```
https://nestmart.runasp.net
```

### Authentication
**Option 1:** JWT Token (for logged-in users)
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Option 2:** Guest ID (for guest checkout)
```javascript
headers: {
  'X-Guest-Id': `${guestId}`
}
```

### Main Endpoints

1. **Create Order**
   ```
   POST /api/v1/orders/checkout
   ```

2. **Create Payment**
   ```
   POST /api/v1/payments/create
   ```

3. **Check Status**
   ```
   GET /api/payments/status/{orderId}
   ```

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
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+201234567890",
    address: "123 Main St",
    city: "Cairo",
    zipCode: "12345"
  })
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

// 5. On callback page, poll for status
async function checkStatus() {
  const orderId = localStorage.getItem('pendingOrderId');
  const status = await fetch(`https://nestmart.runasp.net/api/payments/status/${orderId}`)
    .then(r => r.json());
  
  if (status.paymentStatus === 'Paid') {
    // Success! Clear cart and show confirmation
    localStorage.removeItem('pendingOrderId');
    window.location.href = `/orders/${orderId}`;
  } else if (status.paymentStatus === 'Pending') {
    // Check again in 2 seconds
    setTimeout(checkStatus, 2000);
  } else if (status.paymentStatus === 'Failed') {
    // Show error
    alert('Payment failed. Please try again.');
  }
}
```

---

## 🔄 Payment Flow Summary

```
1. User clicks "Checkout"
   ↓
2. Frontend calls POST /api/v1/orders/checkout
   ↓
3. Frontend calls POST /api/v1/payments/create
   ↓
4. Frontend redirects to Paymob checkout URL
   ↓
5. User completes payment on Paymob
   ↓
6. Paymob redirects back to your site
   ↓
7. Frontend polls GET /api/payments/status/{orderId}
   ↓
8. When status is "Paid", show confirmation
```

---

## 📊 Status Values

### Order Status
- `Pending` - Awaiting payment
- `Processing` - Payment confirmed ✅
- `Shipped` - Order shipped
- `Delivered` - Order delivered
- `Cancelled` - Order cancelled

### Payment Status
- `Pending` - Payment initiated
- `Paid` - Payment successful ✅
- `Failed` - Payment failed ❌
- `Refunded` - Payment refunded

---

## 🧪 Testing

### Test Mode
The backend is currently in **TEST mode** using Paymob test keys.

### Test Cards
- **Success:** `4987654321098769`
- **Declined:** `4000000000000002`
- **Insufficient Funds:** `4000000000009995`

### Test Webhook
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

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing token/guest ID | Add Authorization header or X-Guest-Id |
| 400 Cart is empty | No items in cart | Redirect to products page |
| 502 Bad Gateway | Paymob unavailable | Show error, allow retry |
| 404 Not Found | Invalid order ID | Verify order ID is correct |

---

## 🔐 Security Checklist

- ✅ Always use HTTPS
- ✅ Never store card details
- ✅ Validate on backend (amounts calculated server-side)
- ✅ Use secure token storage
- ✅ Implement CSRF protection (if using cookies)
- ✅ Clear cart only after payment confirmation

---

## 📱 Mobile Apps

The same APIs work for mobile apps! Use:
- **In-app browser:** Open iframeUrl in WebView
- **External browser:** Use deep links to return to app

---

## 🆘 Need Help?

### For API Questions
1. Check `PAYMENT_API_QUICK_REFERENCE.md`
2. Review `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md`
3. Check code examples in the guide

### For Flow Questions
1. Review `PAYMENT_FLOW_DIAGRAM.md`
2. Check the visual diagrams

### For Backend Issues
1. Check `DEPLOYMENT_SUCCESS.md`
2. Review `TROUBLESHOOTING.md`
3. Contact backend team

---

## ✅ Integration Checklist

### Before You Start
- [ ] Read `PAYMENT_API_QUICK_REFERENCE.md`
- [ ] Review `PAYMENT_FLOW_DIAGRAM.md`
- [ ] Understand authentication (JWT or Guest ID)

### During Implementation
- [ ] Implement checkout form
- [ ] Call order creation API
- [ ] Call payment creation API
- [ ] Handle redirect to Paymob
- [ ] Create callback page
- [ ] Implement status polling
- [ ] Handle success/failure states
- [ ] Clear cart on success

### Testing
- [ ] Test with test cards
- [ ] Test guest checkout
- [ ] Test authenticated checkout
- [ ] Test payment success flow
- [ ] Test payment failure flow
- [ ] Test network errors
- [ ] Test status polling

### Production Ready
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/failure messages
- [ ] Cart clearing on success
- [ ] Order confirmation page
- [ ] Mobile responsive
- [ ] Security review completed

---

## 🎉 You're Ready!

Everything you need is in these documents:

1. **Quick Start:** `PAYMENT_API_QUICK_REFERENCE.md`
2. **Visual Guide:** `PAYMENT_FLOW_DIAGRAM.md`
3. **Complete Guide:** `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md`

**Estimated Integration Time:** 2-4 hours

---

## 📞 Support

**Backend Team:**
- API Base URL: `https://nestmart.runasp.net`
- Status: ✅ Live and Working
- Mode: TEST (use test cards)

**Documentation:**
- All files in `NestMart/` folder
- Updated: February 26, 2026

---

**Happy Coding! 🚀**

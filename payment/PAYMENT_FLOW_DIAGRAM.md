# 🔄 NestMart Payment Flow - Visual Guide

## Complete Payment Flow

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Clicks "Checkout"
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: Checkout Page                                │
│  - Collect shipping info                                │
│  - Validate form                                        │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 2. POST /api/v1/orders/checkout
       │    {firstName, lastName, email, phone, address...}
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: OrdersController                              │
│  - Validate user (JWT or Guest ID)                     │
│  - Get cart items                                       │
│  - Calculate total                                      │
│  - Create Order (Status: Pending)                      │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 3. Returns: {orderId: 123, totalAmount: 1500}
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: Process Order Response                       │
│  - Store order ID                                       │
│  - Prepare for payment                                  │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 4. POST /api/v1/payments/create
       │    {} (empty body)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: PaymentsController                            │
│  - Get cart items                                       │
│  - Calculate amount (server-side validation)           │
│  - Create Payment record (Status: Pending)             │
│  - Call Paymob API                                      │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 5. Calls Paymob API
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Paymob: Create Intention                               │
│  - Generate payment session                             │
│  - Return checkout URL with client secret              │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 6. Returns: {iframeUrl: "https://accept.paymob.com/..."}
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: Return to Frontend                            │
│  - Returns: {success: true, iframeUrl, orderId}        │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 7. Returns payment URL
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend: Redirect to Paymob                           │
│  - Store orderId in localStorage                        │
│  - window.location.href = iframeUrl                     │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 8. Redirect
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Paymob: Checkout Page                                  │
│  - User enters card details                             │
│  - User completes payment                               │
└──────┬──────────────────────────────────────────────────┘
       │
       │ 9. Payment processed
       │
       ├──────────────────────────────────────────────────┐
       │                                                   │
       │ 10a. Webhook (Background)                        │ 10b. Redirect (User)
       │                                                   │
       ▼                                                   ▼
┌──────────────────────────┐                    ┌──────────────────────────┐
│  Backend: Webhook        │                    │  Frontend: Callback Page │
│  - Verify HMAC signature │                    │  - Get orderId from      │
│  - Parse payload         │                    │    localStorage          │
│  - Update Payment status │                    │  - Start polling         │
│  - Update Order status   │                    └──────┬───────────────────┘
└──────────────────────────┘                           │
                                                       │ 11. Poll every 2s
                                                       │
                                                       ▼
                                            ┌──────────────────────────┐
                                            │  GET /api/payments/      │
                                            │  status/{orderId}        │
                                            └──────┬───────────────────┘
                                                   │
                                                   │ 12. Returns status
                                                   │
                                                   ▼
                                            ┌──────────────────────────┐
                                            │  Check Payment Status    │
                                            │  - Paid? → Success!      │
                                            │  - Failed? → Error       │
                                            │  - Pending? → Poll again │
                                            └──────┬───────────────────┘
                                                   │
                                                   │ 13. If Paid
                                                   │
                                                   ▼
                                            ┌──────────────────────────┐
                                            │  Frontend: Success       │
                                            │  - Clear cart            │
                                            │  - Remove orderId        │
                                            │  - Show confirmation     │
                                            │  - Redirect to order     │
                                            └──────────────────────────┘
```

---

## Detailed Step-by-Step

### Step 1-3: Order Creation

```javascript
// Frontend
const checkoutData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+201234567890",
  address: "123 Main St",
  city: "Cairo",
  zipCode: "12345"
};

const orderResponse = await fetch('/api/v1/orders/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(checkoutData)
});

const order = await orderResponse.json();
// order = {success: true, data: {orderId: 123, totalAmount: 1500}}
```

### Step 4-7: Payment Creation

```javascript
// Frontend
const paymentResponse = await fetch('/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({})
});

const payment = await paymentResponse.json();
// payment = {success: true, iframeUrl: "https://...", orderId: 123}

// Store for later
localStorage.setItem('pendingOrderId', payment.orderId);

// Redirect to Paymob
window.location.href = payment.iframeUrl;
```

### Step 8-9: User Payment

```
User is now on Paymob's checkout page:
1. Enters card details
2. Clicks "Pay"
3. Paymob processes payment
4. Paymob sends webhook to backend (background)
5. Paymob redirects user back to your site
```

### Step 10a: Webhook (Background)

```
Paymob → Backend Webhook
POST /api/payments/webhook/paymob
{
  "id": "intent_xxx",
  "success": true,
  "special_reference": "123",  ← Your order ID
  "transactions": [{"id": 999}]
}

Backend:
1. Verifies HMAC signature
2. Extracts order ID (123)
3. Updates Payment status → "Paid"
4. Updates Order status → "Processing"
5. Returns 200 OK
```

### Step 10b-13: Status Polling

```javascript
// Frontend: Callback page
const orderId = localStorage.getItem('pendingOrderId');

async function checkPaymentStatus() {
  const response = await fetch(`/api/payments/status/${orderId}`);
  const status = await response.json();
  
  if (status.paymentStatus === 'Paid') {
    // ✅ Success!
    localStorage.removeItem('pendingOrderId');
    clearCart();
    showSuccessMessage();
    setTimeout(() => {
      window.location.href = `/orders/${orderId}`;
    }, 3000);
    
  } else if (status.paymentStatus === 'Failed') {
    // ❌ Failed
    showErrorMessage();
    
  } else {
    // ⏳ Still pending, check again
    setTimeout(checkPaymentStatus, 2000);
  }
}

checkPaymentStatus();
```

---

## State Diagram

```
Order States:
┌─────────┐
│ Pending │ ← Order created, awaiting payment
└────┬────┘
     │ Payment confirmed
     ▼
┌────────────┐
│ Processing │ ← Payment received, preparing order
└────┬───────┘
     │ Order shipped
     ▼
┌─────────┐
│ Shipped │ ← Order in transit
└────┬────┘
     │ Order delivered
     ▼
┌───────────┐
│ Delivered │ ← Order completed
└───────────┘

Payment States:
┌─────────┐
│ Pending │ ← Payment initiated
└────┬────┘
     │
     ├─────────────┐
     │             │
     ▼             ▼
┌──────┐      ┌────────┐
│ Paid │      │ Failed │
└──────┘      └────────┘
```

---

## Error Scenarios

### Scenario 1: Cart is Empty

```
User → Frontend → Backend
                    │
                    ▼
              Cart is empty
                    │
                    ▼
              400 Bad Request
                    │
                    ▼
              Frontend shows error
              "Please add items to cart"
```

### Scenario 2: Payment Declined

```
User → Paymob (enters card)
         │
         ▼
    Card declined
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
    Webhook:          User redirected
    status=Failed     back to site
         │                 │
         ▼                 ▼
    Backend updates   Frontend polls
    Payment → Failed  status
         │                 │
         └────────┬────────┘
                  ▼
            Show error message
            "Payment failed"
```

### Scenario 3: Network Timeout

```
Frontend → Backend → Paymob
                       │
                       ▼
                  Timeout (30s)
                       │
                       ▼
              502 Bad Gateway
                       │
                       ▼
              Frontend shows error
              "Service unavailable"
              [Retry button]
```

---

## Timing Diagram

```
Time    Frontend              Backend              Paymob
─────────────────────────────────────────────────────────
0s      Create order ────────→
1s                            Process order
2s                   ←──────── Order created
        
3s      Create payment ──────→
4s                            Call Paymob ────────→
5s                                                 Create session
6s                            ←──────────────────── Checkout URL
7s                   ←──────── Payment URL
        
8s      Redirect ─────────────────────────────────→
        
        [User on Paymob page for 10-30 seconds]
        
40s                                                User pays
41s                           ←──────────────────── Webhook
42s                           Update status
        
43s     Redirected ←──────────────────────────────
44s     Poll status ─────────→
45s                  ←──────── Status: Pending
        
47s     Poll status ─────────→
48s                  ←──────── Status: Paid ✅
        
49s     Show success
50s     Redirect to order
```

---

## Security Flow

```
┌──────────────────────────────────────────────────┐
│  1. User Authentication                          │
│  - JWT token OR Guest ID                         │
│  - Validated on every request                    │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  2. Server-Side Validation                       │
│  - Cart items verified                           │
│  - Prices calculated server-side                 │
│  - No client-side price manipulation             │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  3. Paymob Secure Checkout                       │
│  - User enters card on Paymob (not your site)   │
│  - PCI DSS compliant                             │
│  - No card data touches your servers             │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  4. Webhook Verification                         │
│  - HMAC-SHA256 signature verified                │
│  - HTTPS enforced                                │
│  - Idempotent processing                         │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  5. Status Polling (Read-Only)                   │
│  - No authentication required                    │
│  - Only returns status, no sensitive data        │
│  - Rate limited                                  │
└──────────────────────────────────────────────────┘
```

---

## Mobile App Flow

```
┌─────────────┐
│ Mobile App  │
└──────┬──────┘
       │
       │ Same API calls as web
       │
       ▼
┌─────────────────────────────────────┐
│  Option 1: In-App Browser           │
│  - Open iframeUrl in WebView        │
│  - Detect redirect back             │
│  - Poll status                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Option 2: External Browser         │
│  - Open iframeUrl in Safari/Chrome  │
│  - Use deep link to return to app   │
│  - Poll status on app resume        │
└─────────────────────────────────────┘
```

---

## Summary

**Key Points:**
1. ✅ Backend validates everything (security)
2. ✅ User never enters card details on your site (PCI compliance)
3. ✅ Webhook updates status in background (reliability)
4. ✅ Frontend polls for status (user feedback)
5. ✅ Idempotent processing (no duplicate charges)

**Frontend Responsibilities:**
- Collect shipping info
- Call checkout API
- Call payment API
- Redirect to Paymob
- Poll for status
- Show confirmation

**Backend Responsibilities:**
- Validate user
- Calculate amounts
- Create order
- Create payment
- Handle webhook
- Update statuses

**Paymob Responsibilities:**
- Secure checkout page
- Process payment
- Send webhook
- Redirect user

---

**For detailed implementation, see:**
- `FRONTEND_PAYMENT_INTEGRATION_GUIDE.md` - Complete guide
- `PAYMENT_API_QUICK_REFERENCE.md` - Quick reference

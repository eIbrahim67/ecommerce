# 🔧 Backend Update Required - Payment Method & Order Status

**Date:** February 26, 2026  
**Priority:** MEDIUM  
**Feature:** Payment Method Selection & Order Status Logic

---

## 📋 Overview

Frontend now sends payment method ("card" or "cod") with checkout request. Backend needs to:
1. Accept `paymentMethod` field in checkout request
2. Set order status based on payment method
3. Apply COD fee for cash on delivery orders

---

## 🔄 Changes Required

### 1. Update Checkout Request DTO

Add `PaymentMethod` field to the checkout request:

```csharp
public class CheckoutRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string ZipCode { get; set; }
    public string PaymentMethod { get; set; } // NEW: "card" or "cod"
}
```

### 2. Update Order Entity (Optional)

Add `PaymentMethod` field to Order entity if you want to store it:

```csharp
public class Order
{
    // ... existing fields
    public string PaymentMethod { get; set; } // "card" or "cod"
}
```

### 3. Update Order Status Logic

**New Behavior:**

#### For Card Payment (`paymentMethod == "card"`):
```
1. Order created → Status: "Pending"
2. Payment completed (webhook) → Status: "Processing" (if success)
                               → Status: "PaymentFailed" (if failed)
                               → Status: "Cancelled" (if cancelled)
3. Order shipped (admin) → Status: "Shipped"
4. Order delivered (admin) → Status: "Delivered"
```

#### For Cash on Delivery (`paymentMethod == "cod"`):
```
1. Order created → Status: "Pending"
2. Admin confirms → Status: "Processing" (manual via admin dashboard)
3. Order shipped (admin) → Status: "Shipped"
4. Order delivered (admin) → Status: "Delivered"
```

**Key Point:** Both payment methods start with "Pending" status. The difference is:
- **Card:** Automatically changes to "Processing" via webhook when payment succeeds
- **COD:** Stays "Pending" until admin manually changes it to "Processing"

### 4. Apply COD Fee

**COD Fee:** $10 (or 10 EGP)

When `paymentMethod == "cod"`, add COD fee to order total:

```csharp
public async Task<int> CreateOrder(CheckoutRequest request)
{
    // Calculate cart total
    var cartTotal = CalculateCartTotal(cartItems);
    
    // Add COD fee if applicable
    var codFee = request.PaymentMethod == "cod" ? 10m : 0m;
    var finalTotal = cartTotal + codFee;
    
    // All orders start with "Pending" status
    var initialStatus = "Pending";
    
    var order = new Order
    {
        // ... other fields
        TotalAmount = finalTotal,
        Status = initialStatus,
        PaymentMethod = request.PaymentMethod
    };
    
    await _context.Orders.AddAsync(order);
    await _context.SaveChangesAsync();
    
    return order.Id;
}
```

---

## 📊 Order Status Flow

### Card Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Order Created                                               │
│ Status: "Pending"                                           │
│ Payment Status: "Pending"                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Payment Completed (Webhook)                                 │
│ If Success: Status: "Processing"                            │
│ If Failed: Status: "PaymentFailed"                          │
│ If Cancelled: Status: "Cancelled"                           │
│ Payment Status: "Paid" / "Failed"                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Shipped (Admin Dashboard)                             │
│ Status: "Shipped"                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Delivered (Admin Dashboard)                           │
│ Status: "Delivered"                                         │
└─────────────────────────────────────────────────────────────┘
```

### Cash on Delivery Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Order Created                                               │
│ Status: "Pending"                                           │
│ Payment Status: "Pending"                                   │
│ COD Fee: $10 added to total                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Admin Confirms Order (Admin Dashboard)                      │
│ Status: "Processing"                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Shipped (Admin Dashboard)                             │
│ Status: "Shipped"                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Delivered (Admin Dashboard)                           │
│ Status: "Delivered"                                         │
│ Payment Status: "Paid" (after cash received)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Test Card Payment

**Request:**
```json
POST /api/v1/orders/checkout
{
  "firstName": "Ibrahim",
  "lastName": "Mohamed",
  "email": "ibrahim@example.com",
  "phone": "01550162282",
  "address": "Cairo",
  "city": "Cairo",
  "zipCode": "12345",
  "paymentMethod": "card"
}
```

**Expected:**
- Order created with status "Pending"
- Total = cart total (no COD fee)
- After payment webhook: 
  - If success: status changes to "Processing"
  - If failed: status changes to "PaymentFailed"

### Test Cash on Delivery

**Request:**
```json
POST /api/v1/orders/checkout
{
  "firstName": "Ibrahim",
  "lastName": "Mohamed",
  "email": "ibrahim@example.com",
  "phone": "01550162282",
  "address": "Cairo",
  "city": "Cairo",
  "zipCode": "12345",
  "paymentMethod": "cod"
}
```

**Expected:**
- Order created with status "Pending"
- Total = cart total + $10 COD fee
- No payment session created
- User redirected directly to confirmation page
- Admin can manually change status to "Processing" when ready

---

## 📝 Implementation Checklist

### Backend Changes

- [ ] Add `PaymentMethod` field to CheckoutRequest DTO
- [ ] Add `PaymentMethod` field to Order entity (optional)
- [ ] Update order creation logic:
  - [ ] Set status to "Pending" for all orders (both card and COD)
  - [ ] Add $10 COD fee for COD orders
- [ ] Update webhook logic:
  - [ ] Change status to "Processing" for successful card payments
  - [ ] Change status to "PaymentFailed" for failed card payments
  - [ ] Change status to "Cancelled" for cancelled card payments
  - [ ] Don't change status for COD orders (stays "Pending")
- [ ] Admin dashboard:
  - [ ] Allow manual status change from "Pending" to "Processing" for COD orders
  - [ ] Allow status changes: Processing → Shipped → Delivered
- [ ] Test both payment methods

### Frontend Changes (Already Done)

- [x] Add payment method selection UI
- [x] Send `paymentMethod` in checkout request
- [x] Show COD fee in order summary
- [x] Update total calculation
- [x] Handle COD flow (skip payment, go to confirmation)

---

## 💡 Key Points

### Order Status Values

| Status | When | Payment Method |
|--------|------|----------------|
| **Pending** | Order created | Both (initial status) |
| **Processing** | Payment received OR admin confirms | Card (auto via webhook), COD (manual via admin) |
| **PaymentFailed** | Payment failed | Card only |
| **Cancelled** | Payment cancelled | Card only |
| **Shipped** | Order dispatched | Both (via admin) |
| **Delivered** | Order delivered | Both (via admin) |
| **Completed** | Order completed | Both (optional) |

### COD Fee

- **Amount:** $10 (or 10 EGP)
- **Applied:** Only for `paymentMethod == "cod"`
- **Display:** Shown in order summary before checkout
- **Calculation:** `finalTotal = cartTotal + codFee`

### Payment Status

| Payment Status | When | Payment Method |
|---------------|------|----------------|
| **Pending** | Awaiting payment | Both (initially) |
| **Paid** | Payment received | Card (after webhook), COD (after delivery) |
| **Failed** | Payment failed | Card only |

---

## 🔍 Example Code

### Order Creation with Payment Method

```csharp
[HttpPost("checkout")]
public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
{
    try
    {
        // Get user cart
        var cartItems = await GetUserCart();
        
        if (!cartItems.Any())
        {
            return BadRequest(new { success = false, message = "Cart is empty" });
        }
        
        // Calculate totals
        var cartTotal = cartItems.Sum(item => item.TotalPrice);
        var codFee = request.PaymentMethod == "cod" ? 10m : 0m;
        var finalTotal = cartTotal + codFee;
        
        // All orders start with "Pending" status
        var initialStatus = "Pending";
        
        // Create order
        var order = new Order
        {
            UserId = GetUserId(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            City = request.City,
            ZipCode = request.ZipCode,
            TotalAmount = finalTotal,
            Status = initialStatus,
            PaymentMethod = request.PaymentMethod,
            OrderDate = DateTime.UtcNow,
            OrderItems = cartItems.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductVariantId = item.ProductVariantId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            }).ToList()
        };
        
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
        
        // Clear cart
        await ClearUserCart();
        
        return Ok(new { success = true, data = order.Id });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating order");
        return StatusCode(500, new { success = false, message = "Failed to create order" });
    }
}
```

### Webhook Handler Update

```csharp
[HttpPost("webhook/paymob")]
public async Task<IActionResult> PaymobWebhook([FromBody] PaymobWebhookRequest request)
{
    try {
        // Verify HMAC signature
        if (!VerifyHmacSignature(request))
        {
            return Unauthorized();
        }
        
        var orderId = int.Parse(request.SpecialReference);
        var order = await _context.Orders.FindAsync(orderId);
        
        if (order == null)
        {
            return NotFound();
        }
        
        // Only update status for card payments
        if (order.PaymentMethod == "card")
        {
            if (request.Success)
            {
                order.Status = "Processing"; // Card payment successful
                order.PaymentStatus = "Paid";
            }
            else if (request.Failure)
            {
                order.Status = "PaymentFailed"; // Payment failed
                order.PaymentStatus = "Failed";
            }
            else
            {
                order.Status = "Cancelled"; // Payment cancelled
                order.PaymentStatus = "Cancelled";
            }
        }
        // For COD orders, status stays "Pending" until admin manually changes it
        
        await _context.SaveChangesAsync();
        
        return Ok();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error processing webhook");
        return StatusCode(500);
    }
}
```

---

## ✅ Summary

**Changes Required:**
1. Accept `paymentMethod` field in checkout
2. Set status to "Confirmed" for COD, "Pending" for card
3. Add $10 COD fee for COD orders
4. Update webhook to only change status for card payments

**Frontend:**
- ✅ Already updated and ready

**Backend:**
- ⏳ Needs implementation

**Estimated Time:** 1-2 hours

---

**Status:** Waiting for backend implementation  
**Priority:** Medium  
**Impact:** Enables COD payment option for users

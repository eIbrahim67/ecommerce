# 📊 Order Status Flows - Final Specification

**Date:** February 26, 2026  
**Status:** ✅ Finalized  
**Feature:** Order Status Management for Card & COD Payments

---

## 🎯 Overview

Both payment methods (Card and COD) start with the same "Pending" status. The difference is in how they progress:

- **Card Payment:** Automatically progresses via webhook
- **Cash on Delivery:** Manually progressed by admin

---

## 🔄 Complete Flows

### Card Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Order Created                                       │
├─────────────────────────────────────────────────────────────┤
│ Status: "Pending"                                           │
│ Payment Status: "Pending"                                   │
│ Trigger: User completes checkout                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Payment Completed (Webhook)                         │
├─────────────────────────────────────────────────────────────┤
│ IF SUCCESS:                                                 │
│   Status: "Processing"                                      │
│   Payment Status: "Paid"                                    │
│                                                              │
│ IF FAILED:                                                  │
│   Status: "PaymentFailed"                                   │
│   Payment Status: "Failed"                                  │
│                                                              │
│ IF CANCELLED:                                               │
│   Status: "Cancelled"                                       │
│   Payment Status: "Cancelled"                               │
│                                                              │
│ Trigger: Paymob webhook                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓ (if success)
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Order Shipped                                       │
├─────────────────────────────────────────────────────────────┤
│ Status: "Shipped"                                           │
│ Trigger: Admin dashboard                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Order Delivered                                     │
├─────────────────────────────────────────────────────────────┤
│ Status: "Delivered"                                         │
│ Trigger: Admin dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

### Cash on Delivery Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Order Created                                       │
├─────────────────────────────────────────────────────────────┤
│ Status: "Pending"                                           │
│ Payment Status: "Pending"                                   │
│ COD Fee: $10 added to total                                │
│ Trigger: User completes checkout                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Admin Confirms Order                                │
├─────────────────────────────────────────────────────────────┤
│ Status: "Processing"                                        │
│ Trigger: Admin dashboard (manual)                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Order Shipped                                       │
├─────────────────────────────────────────────────────────────┤
│ Status: "Shipped"                                           │
│ Trigger: Admin dashboard                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Order Delivered                                     │
├─────────────────────────────────────────────────────────────┤
│ Status: "Delivered"                                         │
│ Payment Status: "Paid" (after cash received)               │
│ Trigger: Admin dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Status Definitions

### Order Status

| Status | Description | Applies To | Trigger |
|--------|-------------|------------|---------|
| **Pending** | Order created, awaiting payment or confirmation | Both | System (on order creation) |
| **Processing** | Order confirmed, being prepared | Both | Webhook (card) or Admin (COD) |
| **PaymentFailed** | Payment attempt failed | Card only | Webhook |
| **Cancelled** | Payment cancelled by user | Card only | Webhook |
| **Shipped** | Order dispatched for delivery | Both | Admin |
| **Delivered** | Order delivered to customer | Both | Admin |

### Payment Status

| Status | Description | Applies To |
|--------|-------------|------------|
| **Pending** | Awaiting payment | Both (initially) |
| **Paid** | Payment received | Both |
| **Failed** | Payment failed | Card only |
| **Cancelled** | Payment cancelled | Card only |

---

## 🔧 Backend Implementation

### Order Creation

```csharp
// All orders start with "Pending" status
var order = new Order
{
    Status = "Pending",
    PaymentStatus = "Pending",
    PaymentMethod = request.PaymentMethod, // "card" or "cod"
    TotalAmount = cartTotal + (request.PaymentMethod == "cod" ? 10m : 0m)
};
```

### Webhook Handler (Card Payments Only)

```csharp
if (order.PaymentMethod == "card")
{
    if (webhookRequest.Success)
    {
        order.Status = "Processing";
        order.PaymentStatus = "Paid";
    }
    else if (webhookRequest.Failure)
    {
        order.Status = "PaymentFailed";
        order.PaymentStatus = "Failed";
    }
    else // Cancelled
    {
        order.Status = "Cancelled";
        order.PaymentStatus = "Cancelled";
    }
}
// COD orders: Status stays "Pending" (no webhook)
```

### Admin Dashboard Actions

```csharp
// For COD orders in "Pending" status
public async Task ConfirmOrder(int orderId)
{
    var order = await GetOrder(orderId);
    if (order.PaymentMethod == "cod" && order.Status == "Pending")
    {
        order.Status = "Processing";
        await SaveChanges();
    }
}

// For all orders in "Processing" status
public async Task ShipOrder(int orderId)
{
    var order = await GetOrder(orderId);
    if (order.Status == "Processing")
    {
        order.Status = "Shipped";
        await SaveChanges();
    }
}

// For all orders in "Shipped" status
public async Task DeliverOrder(int orderId)
{
    var order = await GetOrder(orderId);
    if (order.Status == "Shipped")
    {
        order.Status = "Delivered";
        
        // For COD, mark payment as received
        if (order.PaymentMethod == "cod")
        {
            order.PaymentStatus = "Paid";
        }
        
        await SaveChanges();
    }
}
```

---

## 🎨 Frontend Display

### Order Status Badge Colors

```typescript
export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "processing":
            return "bg-blue-100 text-blue-800";
        case "paymentfailed":
            return "bg-red-100 text-red-800";
        case "cancelled":
            return "bg-gray-100 text-gray-800";
        case "shipped":
            return "bg-purple-100 text-purple-800";
        case "delivered":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}
```

### Order Status Messages

```typescript
export function getStatusMessage(status: string, paymentMethod: string): string {
    switch (status.toLowerCase()) {
        case "pending":
            return paymentMethod === "cod" 
                ? "Order received. Awaiting confirmation."
                : "Order received. Awaiting payment.";
        case "processing":
            return "Order confirmed. Being prepared for shipment.";
        case "paymentfailed":
            return "Payment failed. Please try again.";
        case "cancelled":
            return "Order cancelled.";
        case "shipped":
            return "Order shipped. On the way to you.";
        case "delivered":
            return "Order delivered successfully.";
        default:
            return "Order status unknown.";
    }
}
```

---

## 🧪 Testing Scenarios

### Test 1: Card Payment Success

1. Create order with `paymentMethod: "card"`
2. Verify status is "Pending"
3. Complete payment on Paymob
4. Verify webhook changes status to "Processing"
5. Admin changes to "Shipped"
6. Admin changes to "Delivered"

### Test 2: Card Payment Failure

1. Create order with `paymentMethod: "card"`
2. Verify status is "Pending"
3. Fail payment on Paymob
4. Verify webhook changes status to "PaymentFailed"

### Test 3: COD Order

1. Create order with `paymentMethod: "cod"`
2. Verify status is "Pending"
3. Verify COD fee ($10) is added
4. Admin manually changes to "Processing"
5. Admin changes to "Shipped"
6. Admin changes to "Delivered"
7. Verify payment status changes to "Paid"

---

## 📊 Status Transition Matrix

| From Status | To Status | Trigger | Payment Method |
|-------------|-----------|---------|----------------|
| Pending | Processing | Webhook (success) | Card |
| Pending | PaymentFailed | Webhook (failed) | Card |
| Pending | Cancelled | Webhook (cancelled) | Card |
| Pending | Processing | Admin action | COD |
| Processing | Shipped | Admin action | Both |
| Shipped | Delivered | Admin action | Both |

---

## 💡 Key Differences

### Card Payment
- ✅ Automatic status updates via webhook
- ✅ Can fail or be cancelled
- ✅ Payment happens before order processing
- ✅ No COD fee

### Cash on Delivery
- ✅ Manual status updates by admin
- ✅ Cannot fail (no online payment)
- ✅ Payment happens after delivery
- ✅ $10 COD fee applied

---

## ✅ Summary

**Initial Status:** "Pending" for both payment methods  
**Card Payment:** Webhook → "Processing" (auto)  
**COD Payment:** Admin → "Processing" (manual)  
**Failed Payments:** "PaymentFailed" or "Cancelled" (card only)  
**COD Fee:** $10 added to total  

**Both flows end at "Delivered" status via admin dashboard.**

---

**Last Updated:** February 26, 2026  
**Status:** ✅ Finalized  
**Ready for:** Implementation

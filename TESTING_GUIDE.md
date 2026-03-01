# 🧪 Payment Methods - Testing Guide

**Date:** February 27, 2026  
**Status:** Ready for Testing

---

## 🎯 Testing Overview

This guide provides step-by-step instructions for testing both payment methods (Card and Cash on Delivery) to ensure the complete flow works correctly.

---

## 🔧 Prerequisites

### Backend Requirements
- [ ] Backend has implemented payment method handling
- [ ] Backend accepts `paymentMethod` field in checkout request
- [ ] Backend applies $10 COD fee for COD orders
- [ ] Backend sets initial status to "Pending" for all orders
- [ ] Webhook handler updates status for Card payments
- [ ] Admin dashboard allows manual status changes

### Frontend Requirements
- [x] Payment method selection UI implemented
- [x] COD fee calculation implemented
- [x] Payment method sent in checkout request
- [x] Order confirmation page ready

### Test Environment
- [ ] Frontend deployed to: https://ecommerce-nest-mart.vercel.app
- [ ] Backend deployed to: https://nestmart.runasp.net
- [ ] Paymob test mode enabled
- [ ] Test cards available

---

## 🧪 Test Scenarios

### Test 1: Card Payment - Success Flow

**Objective:** Verify complete card payment flow with successful payment

**Steps:**
1. Navigate to checkout page
2. Select "Debit/Credit Card" payment method
3. Verify UI changes:
   - ✓ Card option is highlighted
   - ✓ Button shows "Proceed to Payment"
   - ✓ Security badge shows "Secure payment powered by Paymob"
   - ✓ No COD fee in order summary
4. Fill in shipping information:
   - First Name: Ibrahim
   - Last Name: Mohamed
   - Email: ibrahim@example.com
   - Phone: 01550162282
   - Address: 123 Test Street
   - City: Cairo
   - Zip Code: 12345
5. Click "Proceed to Payment"
6. Verify order creation:
   - ✓ Order created successfully
   - ✓ Order status is "Pending"
   - ✓ Payment method is "Card"
7. Verify redirect to Paymob payment page
8. Complete payment using test card:
   - Card Number: 4987654321098769
   - Expiry: 05/25
   - CVV: 123
9. Verify webhook processing:
   - ✓ Order status changes to "Processing"
   - ✓ Payment status is "Paid"
10. Verify redirect to confirmation page
11. Verify confirmation page displays:
    - ✓ Success message
    - ✓ Order details
    - ✓ Order status: "Processing"
    - ✓ Payment method: "Card"

**Expected Result:** ✅ Order completed successfully with status "Processing"

---

### Test 2: Card Payment - Failed Payment

**Objective:** Verify card payment flow when payment fails

**Steps:**
1. Navigate to checkout page
2. Select "Debit/Credit Card" payment method
3. Fill in shipping information
4. Click "Proceed to Payment"
5. Verify order creation with status "Pending"
6. On Paymob page, simulate payment failure (cancel or use invalid card)
7. Verify webhook processing:
   - ✓ Order status changes to "PaymentFailed"
   - ✓ Payment status is "Failed"
8. Verify redirect to confirmation page
9. Verify confirmation page shows:
   - ✓ Payment failed message
   - ✓ Order status: "PaymentFailed"
   - ✓ Option to retry payment

**Expected Result:** ✅ Order status is "PaymentFailed"

---

### Test 3: Cash on Delivery - Complete Flow

**Objective:** Verify complete COD flow from order creation to delivery

**Steps:**
1. Navigate to checkout page
2. Select "Cash on Delivery" payment method
3. Verify UI changes:
   - ✓ COD option is highlighted
   - ✓ Button shows "Place Order"
   - ✓ Security badge shows "Secure checkout - Pay on delivery"
   - ✓ COD fee ($10) shown in order summary
4. Verify order summary calculation:
   - Subtotal: $100.00
   - Shipping: Free
   - COD Fee: $10.00
   - Total: $110.00
5. Fill in shipping information
6. Click "Place Order"
7. Verify order creation:
   - ✓ Order created successfully
   - ✓ Order status is "Pending"
   - ✓ Payment method is "CashOnDelivery"
   - ✓ Total includes $10 COD fee
8. Verify direct redirect to confirmation page (no Paymob)
9. Verify confirmation page displays:
   - ✓ Success message
   - ✓ Order details
   - ✓ Order status: "Pending"
   - ✓ Payment method: "Cash on Delivery"
   - ✓ Total includes COD fee
10. Admin dashboard: Change status to "Processing"
11. Verify order status updated to "Processing"
12. Admin dashboard: Change status to "Shipped"
13. Verify order status updated to "Shipped"
14. Admin dashboard: Change status to "Delivered"
15. Verify order status updated to "Delivered"
16. Verify payment status updated to "Paid"

**Expected Result:** ✅ Order progresses through all statuses correctly

---

### Test 4: Payment Method Switching

**Objective:** Verify UI updates when switching between payment methods

**Steps:**
1. Navigate to checkout page
2. Select "Debit/Credit Card"
3. Verify:
   - ✓ No COD fee shown
   - ✓ Button: "Proceed to Payment"
   - ✓ Total: $100.00
4. Switch to "Cash on Delivery"
5. Verify:
   - ✓ COD fee ($10) shown
   - ✓ Button: "Place Order"
   - ✓ Total: $110.00
6. Switch back to "Debit/Credit Card"
7. Verify:
   - ✓ COD fee removed
   - ✓ Button: "Proceed to Payment"
   - ✓ Total: $100.00

**Expected Result:** ✅ UI updates correctly when switching payment methods

---

### Test 5: Order Status Display

**Objective:** Verify all order statuses display correctly

**Steps:**
1. Create orders with different statuses:
   - Pending
   - Processing
   - Shipped
   - Delivered
   - Cancelled
   - PaymentFailed
2. Navigate to orders page
3. Verify each status displays with correct:
   - ✓ Badge color
   - ✓ Status text
   - ✓ Status message

**Expected Status Colors:**
- Pending: 🟡 Yellow
- Processing: 🔵 Blue
- Shipped: 🟣 Purple
- Delivered: 🟢 Green
- Cancelled: ⚫ Gray
- PaymentFailed: 🔴 Red

**Expected Result:** ✅ All statuses display correctly

---

### Test 6: COD Fee Calculation

**Objective:** Verify COD fee is calculated correctly for different cart totals

**Test Cases:**

| Cart Total | COD Fee | Final Total | Expected |
|-----------|---------|-------------|----------|
| $50.00 | $10.00 | $60.00 | ✅ |
| $100.00 | $10.00 | $110.00 | ✅ |
| $200.00 | $10.00 | $210.00 | ✅ |
| $0.00 | $10.00 | $10.00 | ✅ |

**Steps:**
1. Add items to cart with different totals
2. Select "Cash on Delivery"
3. Verify COD fee is always $10.00
4. Verify final total = cart total + $10.00

**Expected Result:** ✅ COD fee is always $10.00 regardless of cart total

---

### Test 7: Empty Cart Handling

**Objective:** Verify checkout is not accessible with empty cart

**Steps:**
1. Clear cart completely
2. Navigate to /checkout
3. Verify:
   - ✓ Checkout page shows "Cart is empty" message
   - ✓ Payment method selection not shown
   - ✓ "Return to Shop" button displayed

**Expected Result:** ✅ Checkout blocked with empty cart

---

### Test 8: Form Validation

**Objective:** Verify all form fields are validated correctly

**Steps:**
1. Navigate to checkout page
2. Select payment method
3. Click submit without filling form
4. Verify validation errors for:
   - ✓ First Name (min 2 characters)
   - ✓ Last Name (min 2 characters)
   - ✓ Email (valid email format)
   - ✓ Phone (min 10 characters)
   - ✓ Address (min 5 characters)
   - ✓ City (min 2 characters)
   - ✓ Zip Code (min 4 characters)
5. Fill form with invalid data
6. Verify specific error messages shown
7. Fill form with valid data
8. Verify form submits successfully

**Expected Result:** ✅ All fields validated correctly

---

### Test 9: API Request Format

**Objective:** Verify correct data is sent to backend

**Steps:**
1. Open browser DevTools (Network tab)
2. Navigate to checkout page
3. Select "Card" payment method
4. Fill form and submit
5. Inspect POST request to `/api/v1/orders/checkout`
6. Verify request body contains:
   ```json
   {
     "firstName": "Ibrahim",
     "lastName": "Mohamed",
     "email": "ibrahim@example.com",
     "phone": "01550162282",
     "address": "123 Test Street",
     "city": "Cairo",
     "zipCode": "12345",
     "paymentMethod": "Card"
   }
   ```
7. Repeat with "CashOnDelivery" selected
8. Verify `paymentMethod: "CashOnDelivery"`

**Expected Result:** ✅ Correct payment method value sent

---

### Test 10: Webhook Processing

**Objective:** Verify webhook correctly updates order status

**Steps:**
1. Create order with Card payment
2. Complete payment on Paymob
3. Monitor backend logs for webhook call
4. Verify webhook payload contains:
   - Order ID
   - Payment status
   - Transaction ID
5. Verify order status updated based on payment result:
   - Success → "Processing"
   - Failed → "PaymentFailed"
   - Cancelled → "Cancelled"
6. Verify COD orders are not affected by webhook

**Expected Result:** ✅ Webhook updates Card orders only

---

## 📊 Test Results Template

### Test Execution Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Card Payment - Success | ⏳ | |
| 2 | Card Payment - Failed | ⏳ | |
| 3 | COD - Complete Flow | ⏳ | |
| 4 | Payment Method Switching | ⏳ | |
| 5 | Order Status Display | ⏳ | |
| 6 | COD Fee Calculation | ⏳ | |
| 7 | Empty Cart Handling | ⏳ | |
| 8 | Form Validation | ⏳ | |
| 9 | API Request Format | ⏳ | |
| 10 | Webhook Processing | ⏳ | |

**Legend:**
- ⏳ Not Started
- 🔄 In Progress
- ✅ Passed
- ❌ Failed
- ⚠️ Blocked

---

## 🐛 Bug Report Template

If you find any issues during testing, use this template:

```markdown
### Bug Report

**Test:** [Test number and name]
**Severity:** [Critical / High / Medium / Low]
**Status:** [New / In Progress / Fixed]

**Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Environment:**
- Browser: [Chrome / Firefox / Safari / Edge]
- OS: [Windows / Mac / Linux]
- Frontend URL: https://ecommerce-nest-mart.vercel.app
- Backend URL: https://nestmart.runasp.net

**Additional Notes:**
[Any other relevant information]
```

---

## ✅ Testing Checklist

### Pre-Testing
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Paymob test mode enabled
- [ ] Test data prepared
- [ ] Browser DevTools ready

### During Testing
- [ ] Execute all test scenarios
- [ ] Document results
- [ ] Take screenshots of issues
- [ ] Log API requests/responses
- [ ] Note any unexpected behavior

### Post-Testing
- [ ] Review all test results
- [ ] Create bug reports for failures
- [ ] Verify critical paths work
- [ ] Document any workarounds
- [ ] Sign off on testing

---

## 🚀 Ready for Production Checklist

Before deploying to production, verify:

- [ ] All tests passed
- [ ] No critical bugs
- [ ] Payment flows work end-to-end
- [ ] Order statuses update correctly
- [ ] COD fee calculated correctly
- [ ] Webhook processing works
- [ ] Admin dashboard functional
- [ ] Error handling works
- [ ] UI/UX is polished
- [ ] Documentation complete

---

## 📞 Support

**Questions?** Refer to:
- `IMPLEMENTATION_STATUS.md` - Current status
- `QUICK_REFERENCE.md` - Quick reference guide
- `BACKEND_PAYMENT_METHOD_UPDATE.md` - Backend implementation
- `ORDER_STATUS_FLOWS_FINAL.md` - Status flows

**Ready to test! 🎉**

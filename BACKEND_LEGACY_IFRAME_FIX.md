# 🔧 Backend Fix Required: Switch to Paymob Legacy Iframe API

**Date:** February 26, 2026  
**Priority:** HIGH - Payment Integration Blocked  
**Status:** ⚠️ Action Required

---

## 🚨 Current Problem

The backend is using Paymob's **Unified Checkout API** (`/v1/intention/`) which requires a `client_secret`, but your Paymob account has a **Legacy Iframe integration** (iframe ID: 1009847).

**Current Error:**
```json
{
  "success": false,
  "message": "Payment provider error.",
  "detail": "Failed to create Paymob intention: no client_secret received"
}
```

**Root Cause:** Unified Checkout API is for newer Paymob integrations. Your account uses the legacy 3-step iframe method.

---

## ✅ Solution: Switch to Legacy Iframe API

The backend needs to switch from the Unified Checkout flow to the Legacy Iframe flow.

### Current Flow (Unified Checkout - NOT WORKING)
```
POST /v1/intention/ → Get client_secret → Build URL
```

### Required Flow (Legacy Iframe - WILL WORK)
```
1. POST /api/auth/tokens → Get auth token
2. POST /api/ecommerce/orders → Register order, get order ID
3. POST /api/acceptance/payment_keys → Get payment key
4. Build URL: https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token={payment_key}
```

---

## 📝 Implementation Guide

### Step 1: Update Configuration

**File:** `appsettings.Production.json` (or wherever Paymob config is stored)

**Add these fields:**
```json
{
  "Paymob": {
    "ApiKey": "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5...",
    "SecretKey": "egy_sk_test_...",
    "PublicKey": "egy_pk_test_...",
    "HmacSecret": "...",
    "BaseUrl": "https://accept.paymob.com",
    "Currency": "EGP",
    "IntegrationId": 158,
    "IframeId": 1009847,
    "WebhookUrl": "https://nestmart.runasp.net/api/payments/webhook/paymob",
    "RedirectBaseUrl": "https://ecommerce-nest-mart.vercel.app/"
  }
}
```

**New fields:**
- `IntegrationId`: 158 (your integration ID)
- `IframeId`: 1009847 (your iframe ID)

---

### Step 2: Update DTOs

**File:** `NestMart.Application/DTOs/Paymob/` (create new files or update existing)

#### 2.1 Auth Request/Response
```csharp
// PaymobAuthRequest.cs
public class PaymobAuthRequest
{
    [JsonPropertyName("api_key")]
    public string ApiKey { get; set; }
}

// PaymobAuthResponse.cs
public class PaymobAuthResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; }
}
```

#### 2.2 Order Registration Request/Response
```csharp
// PaymobOrderRequest.cs
public class PaymobOrderRequest
{
    [JsonPropertyName("auth_token")]
    public string AuthToken { get; set; }

    [JsonPropertyName("delivery_needed")]
    public bool DeliveryNeeded { get; set; } = false;

    [JsonPropertyName("amount_cents")]
    public int AmountCents { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "EGP";

    [JsonPropertyName("items")]
    public List<PaymobOrderItem> Items { get; set; }
}

public class PaymobOrderItem
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("amount_cents")]
    public int AmountCents { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }
}

// PaymobOrderResponse.cs
public class PaymobOrderResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("amount_cents")]
    public int AmountCents { get; set; }
}
```

#### 2.3 Payment Key Request/Response
```csharp
// PaymobPaymentKeyRequest.cs
public class PaymobPaymentKeyRequest
{
    [JsonPropertyName("auth_token")]
    public string AuthToken { get; set; }

    [JsonPropertyName("amount_cents")]
    public int AmountCents { get; set; }

    [JsonPropertyName("expiration")]
    public int Expiration { get; set; } = 3600; // 1 hour

    [JsonPropertyName("order_id")]
    public int OrderId { get; set; }

    [JsonPropertyName("billing_data")]
    public PaymobBillingData BillingData { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "EGP";

    [JsonPropertyName("integration_id")]
    public int IntegrationId { get; set; }
}

public class PaymobBillingData
{
    [JsonPropertyName("apartment")]
    public string Apartment { get; set; } = "NA";

    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("floor")]
    public string Floor { get; set; } = "NA";

    [JsonPropertyName("first_name")]
    public string FirstName { get; set; }

    [JsonPropertyName("street")]
    public string Street { get; set; }

    [JsonPropertyName("building")]
    public string Building { get; set; } = "NA";

    [JsonPropertyName("phone_number")]
    public string PhoneNumber { get; set; }

    [JsonPropertyName("shipping_method")]
    public string ShippingMethod { get; set; } = "NA";

    [JsonPropertyName("postal_code")]
    public string PostalCode { get; set; }

    [JsonPropertyName("city")]
    public string City { get; set; }

    [JsonPropertyName("country")]
    public string Country { get; set; } = "EG";

    [JsonPropertyName("last_name")]
    public string LastName { get; set; }

    [JsonPropertyName("state")]
    public string State { get; set; } = "NA";
}

// PaymobPaymentKeyResponse.cs
public class PaymobPaymentKeyResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; }
}
```

---

### Step 3: Update PaymobService

**File:** `NestMart.Infrastructure/Services/PaymobService.cs`

Replace the `CreatePaymentIntention` method with this new implementation:

```csharp
public async Task<string> CreatePaymentIntention(Order order)
{
    try
    {
        _logger.LogInformation("Starting Legacy Iframe payment creation for order {OrderId}", order.Id);

        // Step 1: Get authentication token
        var authToken = await GetAuthToken();
        _logger.LogInformation("Auth token obtained successfully");

        // Step 2: Register order with Paymob
        var paymobOrderId = await RegisterOrder(authToken, order);
        _logger.LogInformation("Order registered with Paymob. Paymob Order ID: {PaymobOrderId}", paymobOrderId);

        // Step 3: Get payment key
        var paymentKey = await GetPaymentKey(authToken, paymobOrderId, order);
        _logger.LogInformation("Payment key obtained successfully");

        // Step 4: Build iframe URL
        var iframeUrl = $"{_paymobConfig.BaseUrl}/api/acceptance/iframes/{_paymobConfig.IframeId}?payment_token={paymentKey}";
        _logger.LogInformation("Iframe URL generated: {IframeUrl}", iframeUrl);

        return iframeUrl;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to create payment intention for order {OrderId}", order.Id);
        throw new Exception($"Failed to create Paymob payment: {ex.Message}", ex);
    }
}

private async Task<string> GetAuthToken()
{
    var request = new PaymobAuthRequest
    {
        ApiKey = _paymobConfig.ApiKey
    };

    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/auth/tokens",
        request
    );

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        _logger.LogError("Paymob auth failed: {Error}", error);
        throw new Exception($"Paymob authentication failed: {error}");
    }

    var result = await response.Content.ReadFromJsonAsync<PaymobAuthResponse>();
    
    if (string.IsNullOrEmpty(result?.Token))
    {
        throw new Exception("No auth token received from Paymob");
    }

    return result.Token;
}

private async Task<int> RegisterOrder(string authToken, Order order)
{
    var amountCents = (int)(order.TotalAmount * 100);

    var request = new PaymobOrderRequest
    {
        AuthToken = authToken,
        DeliveryNeeded = false,
        AmountCents = amountCents,
        Currency = _paymobConfig.Currency,
        Items = order.OrderItems.Select(item => new PaymobOrderItem
        {
            Name = item.ProductVariant?.Product?.Name ?? "Product",
            AmountCents = (int)(item.UnitPrice * 100),
            Description = item.ProductVariant?.Product?.Description ?? "",
            Quantity = item.Quantity
        }).ToList()
    };

    _logger.LogInformation("Registering order with Paymob: {Request}", JsonSerializer.Serialize(request));

    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/ecommerce/orders",
        request
    );

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        _logger.LogError("Paymob order registration failed: {Error}", error);
        throw new Exception($"Failed to register order with Paymob: {error}");
    }

    var result = await response.Content.ReadFromJsonAsync<PaymobOrderResponse>();
    
    if (result?.Id == null || result.Id == 0)
    {
        throw new Exception("No order ID received from Paymob");
    }

    return result.Id;
}

private async Task<string> GetPaymentKey(string authToken, int paymobOrderId, Order order)
{
    var amountCents = (int)(order.TotalAmount * 100);

    var request = new PaymobPaymentKeyRequest
    {
        AuthToken = authToken,
        AmountCents = amountCents,
        Expiration = 3600, // 1 hour
        OrderId = paymobOrderId,
        Currency = _paymobConfig.Currency,
        IntegrationId = _paymobConfig.IntegrationId,
        BillingData = new PaymobBillingData
        {
            FirstName = order.FirstName ?? "Customer",
            LastName = order.LastName ?? "Customer",
            Email = order.Email ?? "customer@example.com",
            PhoneNumber = order.Phone ?? "+201000000000",
            Street = order.Address ?? "NA",
            City = order.City ?? "Cairo",
            PostalCode = order.ZipCode ?? "00000",
            Country = "EG",
            Apartment = "NA",
            Floor = "NA",
            Building = "NA",
            ShippingMethod = "NA",
            State = "NA"
        }
    };

    _logger.LogInformation("Requesting payment key from Paymob: {Request}", JsonSerializer.Serialize(request));

    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/acceptance/payment_keys",
        request
    );

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        _logger.LogError("Paymob payment key request failed: {Error}", error);
        throw new Exception($"Failed to get payment key from Paymob: {error}");
    }

    var result = await response.Content.ReadFromJsonAsync<PaymobPaymentKeyResponse>();
    
    if (string.IsNullOrEmpty(result?.Token))
    {
        throw new Exception("No payment key received from Paymob");
    }

    return result.Token;
}
```

---

### Step 4: Update Configuration Model

**File:** `NestMart.Infrastructure/Configuration/PaymobConfiguration.cs` (or similar)

```csharp
public class PaymobConfiguration
{
    public string ApiKey { get; set; }
    public string SecretKey { get; set; }
    public string PublicKey { get; set; }
    public string HmacSecret { get; set; }
    public string BaseUrl { get; set; }
    public string Currency { get; set; }
    public int IntegrationId { get; set; }  // NEW
    public int IframeId { get; set; }       // NEW
    public string WebhookUrl { get; set; }
    public string RedirectBaseUrl { get; set; }
}
```

---

## 🧪 Testing the Fix

### Test 1: Create Payment (cURL)

```bash
# Set variables
GUEST_ID="86a18ecb-b421-44bf-98a8-2e3fbb76036d"
API="https://nestmart.runasp.net"

# 1. Add items to cart
curl -X POST "$API/api/v1/cart" \
  -H "X-Guest-Id: $GUEST_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "variantId": 1,
    "quantity": 2
  }'

# 2. Create order
curl -X POST "$API/api/v1/orders/checkout" \
  -H "X-Guest-Id: $GUEST_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ibrahim",
    "lastName": "Mohamed",
    "email": "ibrahim.mohamed.ibrahim.t@gmail.com",
    "phone": "01550162282",
    "address": "Cairo",
    "city": "Cairo",
    "zipCode": "12345"
  }'

# 3. Create payment
curl -X POST "$API/api/v1/payments/create" \
  -H "X-Guest-Id: $GUEST_ID" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": true,
  "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5...",
  "orderId": 16
}
```

### Test 2: Verify URL Format

The `iframeUrl` should match this pattern:
```
https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token={long_token_string}
```

**NOT this (Unified Checkout):**
```
https://accept.paymob.com/unifiedcheckout/?publicKey=...&clientSecret=...
```

### Test 3: Complete Payment Flow

1. Open the `iframeUrl` in a browser
2. Should see Paymob payment form with "Installment_Discount" iframe
3. Use test card: `4987654321098769`
4. Complete payment
5. Should redirect to: `https://ecommerce-nest-mart.vercel.app/payment-callback`
6. Frontend will poll `/api/payments/status/{orderId}`
7. Status should change from `Pending` to `Paid`

---

## 📊 Verification Checklist

After implementing the fix, verify:

- [ ] Configuration includes `IntegrationId: 158`
- [ ] Configuration includes `IframeId: 1009847`
- [ ] DTOs have `[JsonPropertyName]` attributes for snake_case
- [ ] `CreatePaymentIntention` uses 3-step legacy flow
- [ ] Auth token request works (`POST /api/auth/tokens`)
- [ ] Order registration works (`POST /api/ecommerce/orders`)
- [ ] Payment key request works (`POST /api/acceptance/payment_keys`)
- [ ] Generated URL format is correct (iframe URL, not unified checkout)
- [ ] Billing data includes all required fields
- [ ] Amount is in cents (multiply by 100)
- [ ] Logging is comprehensive for debugging
- [ ] Error handling is robust

---

## 🔍 Debugging Tips

### Check Logs

Look for these log messages:
```
Starting Legacy Iframe payment creation for order {OrderId}
Auth token obtained successfully
Order registered with Paymob. Paymob Order ID: {PaymobOrderId}
Payment key obtained successfully
Iframe URL generated: {IframeUrl}
```

### Common Issues

**Issue 1: "Invalid API key"**
- Solution: Verify `ApiKey` in configuration is correct

**Issue 2: "Invalid integration ID"**
- Solution: Verify `IntegrationId: 158` is correct

**Issue 3: "Billing data validation failed"**
- Solution: Ensure all required billing fields are provided (use "NA" for optional fields)

**Issue 4: "Amount mismatch"**
- Solution: Ensure amount is in cents (multiply by 100)

---

## 📞 Support

### Paymob Documentation
- Legacy Iframe API: https://docs.paymob.com/docs/accept-standard-redirect
- Authentication: https://docs.paymob.com/docs/authentication
- Order Registration: https://docs.paymob.com/docs/order-registration-api
- Payment Keys: https://docs.paymob.com/docs/payment-key-request

### Your Paymob Account Details
- **Iframe ID:** 1009847
- **Iframe Name:** Installment_Discount
- **Integration ID:** 158
- **Mode:** TEST (use test cards)

### Test Cards
- **Success:** 4987654321098769
- **Declined:** 4000000000000002
- **Insufficient Funds:** 4000000000009995

---

## ✅ Summary

**What needs to change:**
1. Add `IntegrationId` and `IframeId` to configuration
2. Create DTOs for legacy 3-step flow
3. Replace `CreatePaymentIntention` method with 3-step implementation
4. Test with the provided cURL commands

**Expected result:**
- Payment creation returns iframe URL in format: `https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=...`
- Frontend can redirect users to this URL
- Users complete payment on Paymob
- Webhook updates order status
- Frontend polls status and shows success

**Frontend changes required:** NONE - Frontend already handles iframe URLs correctly!

---

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Testing Time:** 1 hour  

**Once this is fixed, the entire payment flow will work end-to-end! 🚀**

# ⚡ Backend Quick Fix Card

**Problem:** Payment creation returns 502 error  
**Cause:** Using wrong Paymob API  
**Solution:** Switch to Legacy Iframe API (3 steps)  
**Time:** 2-3 hours

---

## 🎯 What to Change

### 1. Configuration (appsettings.json)

```json
{
  "Paymob": {
    "IntegrationId": 158,
    "IframeId": 1009847
  }
}
```

### 2. Replace CreatePaymentIntention Method

```csharp
public async Task<string> CreatePaymentIntention(Order order)
{
    // Step 1: Get auth token
    var authToken = await GetAuthToken();
    
    // Step 2: Register order
    var paymobOrderId = await RegisterOrder(authToken, order);
    
    // Step 3: Get payment key
    var paymentKey = await GetPaymentKey(authToken, paymobOrderId, order);
    
    // Step 4: Build URL
    return $"{_paymobConfig.BaseUrl}/api/acceptance/iframes/{_paymobConfig.IframeId}?payment_token={paymentKey}";
}
```

### 3. Implement 3 Helper Methods

#### GetAuthToken()
```csharp
private async Task<string> GetAuthToken()
{
    var request = new { api_key = _paymobConfig.ApiKey };
    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/auth/tokens",
        request
    );
    var result = await response.Content.ReadFromJsonAsync<PaymobAuthResponse>();
    return result.Token;
}
```

#### RegisterOrder()
```csharp
private async Task<int> RegisterOrder(string authToken, Order order)
{
    var request = new
    {
        auth_token = authToken,
        delivery_needed = false,
        amount_cents = (int)(order.TotalAmount * 100),
        currency = "EGP",
        items = order.OrderItems.Select(item => new
        {
            name = item.ProductVariant?.Product?.Name ?? "Product",
            amount_cents = (int)(item.UnitPrice * 100),
            description = item.ProductVariant?.Product?.Description ?? "",
            quantity = item.Quantity
        }).ToList()
    };
    
    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/ecommerce/orders",
        request
    );
    var result = await response.Content.ReadFromJsonAsync<PaymobOrderResponse>();
    return result.Id;
}
```

#### GetPaymentKey()
```csharp
private async Task<string> GetPaymentKey(string authToken, int paymobOrderId, Order order)
{
    var request = new
    {
        auth_token = authToken,
        amount_cents = (int)(order.TotalAmount * 100),
        expiration = 3600,
        order_id = paymobOrderId,
        currency = "EGP",
        integration_id = _paymobConfig.IntegrationId,
        billing_data = new
        {
            first_name = order.FirstName ?? "Customer",
            last_name = order.LastName ?? "Customer",
            email = order.Email ?? "customer@example.com",
            phone_number = order.Phone ?? "+201000000000",
            street = order.Address ?? "NA",
            city = order.City ?? "Cairo",
            postal_code = order.ZipCode ?? "00000",
            country = "EG",
            apartment = "NA",
            floor = "NA",
            building = "NA",
            shipping_method = "NA",
            state = "NA"
        }
    };
    
    var response = await _httpClient.PostAsJsonAsync(
        $"{_paymobConfig.BaseUrl}/api/acceptance/payment_keys",
        request
    );
    var result = await response.Content.ReadFromJsonAsync<PaymobPaymentKeyResponse>();
    return result.Token;
}
```

---

## 🧪 Test After Implementation

```bash
curl -X POST "https://nestmart.runasp.net/api/v1/payments/create" \
  -H "X-Guest-Id: 86a18ecb-b421-44bf-98a8-2e3fbb76036d" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": true,
  "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/1009847?payment_token=...",
  "orderId": 16
}
```

**URL Must Contain:**
- ✅ `/iframes/1009847`
- ✅ `?payment_token=`

**URL Must NOT Contain:**
- ❌ `unifiedcheckout`
- ❌ `clientSecret`

---

## 📚 Full Documentation

See these files for complete details:
1. **BACKEND_LEGACY_IFRAME_FIX.md** - Complete implementation guide
2. **PAYMOB_API_COMPARISON.md** - API comparison and examples
3. **PAYMENT_STATUS_SUMMARY.md** - Overall status

---

## ✅ Checklist

- [ ] Add IntegrationId: 158 to config
- [ ] Add IframeId: 1009847 to config
- [ ] Create DTOs with [JsonPropertyName] attributes
- [ ] Implement GetAuthToken()
- [ ] Implement RegisterOrder()
- [ ] Implement GetPaymentKey()
- [ ] Update CreatePaymentIntention()
- [ ] Test with cURL
- [ ] Verify URL format
- [ ] Test complete payment flow

---

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Frontend Changes:** NONE (already complete)

**Once fixed, payment integration will work end-to-end! 🚀**

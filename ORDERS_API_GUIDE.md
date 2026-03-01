# NestMart Orders API Guide

**Base URL**: `https://nestmart.runasp.net/api/v1`

This guide explains how to use the Orders API endpoints for both authenticated users and anonymous guests.

---

## Table of Contents

1. [Authentication Methods](#authentication-methods)
2. [Endpoints Overview](#endpoints-overview)
3. [POST /orders/checkout - Place Order](#post-orderscheckout---place-order)
4. [GET /orders - Get User Orders](#get-orders---get-user-orders)
5. [GET /orders/{id} - Get Order Details](#get-ordersid---get-order-details)
6. [Error Handling](#error-handling)
7. [Guest Checkout Flow](#guest-checkout-flow)
8. [Authenticated Checkout Flow](#authenticated-checkout-flow)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## Authentication Methods

### Option 1: Authenticated User (JWT Bearer Token)

For registered users who have logged in:

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{...}'
```

**How to get a token:**
1. POST to `/auth/register` or `/auth/login` with email/password
2. Receive a JWT token in the response
3. Include it in the `Authorization: Bearer <token>` header on all requests

### Option 2: Anonymous Guest (X-Guest-Id Header)

For users without authentication who want to place orders:

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json' \
  -d '{...}'
```

**How to use it:**
1. Generate a unique ID on the client (UUID v4 recommended)
2. Store it in localStorage or a cookie
3. Include it in the `X-Guest-Id` header on every order request
4. The server automatically creates a guest user record if needed

**Guest ID Format:**
```javascript
// Example: Generate in JavaScript
const guestId = crypto.randomUUID(); // or use a library like uuid
localStorage.setItem('guestId', guestId);
```

---

## Endpoints Overview

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/orders/checkout` | Place a new order from cart | Token OR X-Guest-Id |
| GET | `/orders` | Get all orders for user | Token OR X-Guest-Id |
| GET | `/orders/{id}` | Get details of specific order | Token OR X-Guest-Id |

---

## POST /orders/checkout - Place Order

Places an order from the user's current cart. The cart is automatically cleared after successful checkout.

### Prerequisites

- Cart must have at least 1 item
- All items must have sufficient stock
- User must provide shipping/billing information

### Request

**URL**: `POST /api/v1/orders/checkout`

**Headers** (choose one):
```
Authorization: Bearer <token>
```
OR
```
X-Guest-Id: <guestId>
```

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234",
  "address": "123 Main Street",
  "city": "Springfield",
  "zipCode": "12345"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | Shipping first name |
| `lastName` | string | Yes | Shipping last name |
| `email` | string | Yes | Shipping email (must be valid) |
| `phone` | string | Yes | Shipping phone number |
| `address` | string | Yes | Shipping street address |
| `city` | string | Yes | Shipping city |
| `zipCode` | string | Yes | Shipping postal code |

**Example (Authenticated)**:
```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-555-9999",
  "address": "456 Oak Ave",
  "city": "Shelbyville",
  "zipCode": "54321"
}'
```

**Example (Guest)**:
```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-555-9999",
  "address": "456 Oak Ave",
  "city": "Shelbyville",
  "zipCode": "54321"
}'
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": 5,
  "errors": null
}
```

The `data` field contains the new order ID (use this to retrieve order details).

### Response (400 Bad Request)

**Condition**: Cart is empty, insufficient stock, or invalid data

```json
{
  "success": false,
  "message": "Cart is empty.",
  "data": null,
  "errors": null
}
```

OR

```json
{
  "success": false,
  "message": "Insufficient stock for 'Organic Honey'.",
  "data": null,
  "errors": null
}
```

### Notes

- Cart must have items before checkout
- Each product's stock is checked during checkout; order fails if insufficient
- Cart is automatically cleared after successful checkout
- Stock quantities are decremented from the database
- Order information is a snapshot (prices and item details are frozen at checkout time)

---

## GET /orders - Get User Orders

Retrieves all orders for the authenticated user or guest, sorted by most recent first.

### Request

**URL**: `GET /api/v1/orders`

**Headers** (choose one):
```
Authorization: Bearer <token>
```
OR
```
X-Guest-Id: <guestId>
```

**Example (Authenticated)**:
```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

**Example (Guest)**:
```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json'
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 5,
      "userId": "user-id-or-guest-id",
      "orderDate": "2026-02-25T14:30:00Z",
      "totalAmount": 76.20,
      "status": "Pending",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "Springfield",
      "zipCode": "12345",
      "items": [
        {
          "productId": 1,
          "productName": "Organic Honey",
          "quantity": 2,
          "unitPrice": 28.85,
          "totalPrice": 57.70
        },
        {
          "productId": 2,
          "productName": "Olive Oil",
          "quantity": 1,
          "unitPrice": 18.50,
          "totalPrice": 18.50
        }
      ]
    },
    {
      "id": 4,
      "userId": "user-id-or-guest-id",
      "orderDate": "2026-02-24T10:15:00Z",
      "totalAmount": 45.99,
      "status": "Completed",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "Springfield",
      "zipCode": "12345",
      "items": [
        {
          "productId": 3,
          "productName": "Balsamic Vinegar",
          "quantity": 1,
          "unitPrice": 45.99,
          "totalPrice": 45.99
        }
      ]
    }
  ],
  "errors": null
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Order ID |
| `userId` | string | User ID or guest ID |
| `orderDate` | datetime | When order was placed (ISO 8601 format) |
| `totalAmount` | decimal | Total order amount |
| `status` | string | Order status (Pending, Processing, Shipped, Delivered, Completed, Cancelled) |
| `firstName` | string | Shipping first name (snapshot) |
| `lastName` | string | Shipping last name (snapshot) |
| `email` | string | Shipping email (snapshot) |
| `phone` | string | Shipping phone (snapshot) |
| `address` | string | Shipping address (snapshot) |
| `city` | string | Shipping city (snapshot) |
| `zipCode` | string | Shipping postal code (snapshot) |
| `items` | array | Array of items in the order |
| `items[].productId` | int | Product ID |
| `items[].productName` | string | Product name (snapshot) |
| `items[].quantity` | int | Quantity ordered |
| `items[].unitPrice` | decimal | Price per unit (snapshot) |
| `items[].totalPrice` | decimal | unitPrice × quantity |

### Notes

- Orders are returned in descending order by date (newest first)
- If user has no orders, an empty array is returned (still success)
- Shipping information is a snapshot taken at checkout time and doesn't change

---

## GET /orders/{id} - Get Order Details

Retrieves detailed information about a specific order. You can only access your own orders.

### Request

**URL**: `GET /api/v1/orders/{id}`

**Path Parameter**:
```
id = 5  (order ID)
```

**Headers** (choose one):
```
Authorization: Bearer <token>
```
OR
```
X-Guest-Id: <guestId>
```

**Example (Authenticated)**:
```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders/5' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

**Example (Guest)**:
```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders/5' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json'
```

### Response (200 OK)

Same structure as GET /orders single order (see response above)

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 5,
    "userId": "user-id-or-guest-id",
    "orderDate": "2026-02-25T14:30:00Z",
    "totalAmount": 76.20,
    "status": "Pending",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "address": "123 Main Street",
    "city": "Springfield",
    "zipCode": "12345",
    "items": [
      {
        "productId": 1,
        "productName": "Organic Honey",
        "quantity": 2,
        "unitPrice": 28.85,
        "totalPrice": 57.70
      }
    ]
  },
  "errors": null
}
```

### Response (404 Not Found)

If order doesn't exist or belongs to a different user:

```json
{
  "success": false,
  "message": "Order not found.",
  "data": null,
  "errors": null
}
```

### Notes

- Users can only view their own orders
- Attempting to view another user's order returns 404
- Guest can only view orders placed with the same guest ID

---

## Error Handling

### 401 Unauthorized

**Condition**: Missing both `Authorization` header and `X-Guest-Id` header

**Response**:
```json
{
  "message": "Authentication token or X-Guest-Id header is required."
}
```

**Fix**: Include either:
- `Authorization: Bearer <token>` (for authenticated users)
- `X-Guest-Id: <guestId>` (for guests)

### 400 Bad Request

**Condition**: Cart is empty, insufficient stock, or invalid request data

**Response**:
```json
{
  "success": false,
  "message": "Cart is empty.",
  "data": null,
  "errors": null
}
```

**Fix**: 
- Ensure cart has items (add items via Cart API)
- Verify all products have sufficient stock
- Check that all required fields are provided

### 404 Not Found

**Condition**: Order doesn't exist or belongs to different user

**Response**:
```json
{
  "success": false,
  "message": "Order not found.",
  "data": null,
  "errors": null
}
```

**Fix**: 
- Verify order ID is correct
- Ensure you're accessing your own order
- Use GET /orders to list your orders

### 500 Internal Server Error

**Condition**: Unexpected server error (rare)

**Response**:
```json
{
  "success": false,
  "message": "An internal server error occurred.",
  "data": null,
  "errors": ["Details..."]
}
```

**Fix**: Check server logs or contact support

---

## Guest Checkout Flow

Complete flow for a guest user placing an order:

### 1. Generate or Retrieve Guest ID

```javascript
// Generate once and store in localStorage
let guestId = localStorage.getItem('guestId');
if (!guestId) {
  guestId = crypto.randomUUID();
  localStorage.setItem('guestId', guestId);
}
```

### 2. Add Items to Cart (via Cart API)

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/cart' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json' \
  -d '{
  "productId": 1,
  "variantId": 5,
  "quantity": 2
}'
```

### 3. Review Cart

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/cart' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json'
```

### 4. Place Order

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234",
  "address": "123 Main Street",
  "city": "Springfield",
  "zipCode": "12345"
}'
```

Response: `{"success": true, "data": 5}` (order ID = 5)

### 5. View Order

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders/5' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json'
```

### 6. View All Orders

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders' \
  -H 'X-Guest-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json'
```

---

## Authenticated Checkout Flow

Complete flow for a logged-in user placing an order:

### 1. Login to Get Token

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "Password123!"
}'
```

Response includes: `{"data": {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}}`

### 2. Add Items to Cart (via Cart API)

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/cart' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
  "productId": 1,
  "variantId": 5,
  "quantity": 2
}'
```

### 3. Review Cart

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/cart' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

### 4. Place Order

```bash
curl -X POST \
  'https://nestmart.runasp.net/api/v1/orders/checkout' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-555-9999",
  "address": "456 Oak Ave",
  "city": "Shelbyville",
  "zipCode": "54321"
}'
```

Response: `{"success": true, "data": 6}` (order ID = 6)

### 5. View Order

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders/6' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

### 6. View All Orders

```bash
curl -X GET \
  'https://nestmart.runasp.net/api/v1/orders' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

---

## Best Practices

1. **Persist guest ID**: Store guest ID in localStorage so the same guest ID is used across sessions. This keeps order history tied to the same guest.

2. **Handle 401 errors gracefully**: Always check that your auth header or X-Guest-Id is present on every request.

3. **Validate before checkout**: Call GET /cart before checkout to verify items and calculate expected total.

4. **Use HTTPS only**: Always communicate with the API over HTTPS (never HTTP). Guest IDs and tokens must be protected.

5. **Keep user updated**: Implement order status polling or webhooks to notify users of order status changes.

6. **Snapshot data**: Remember that order data is a snapshot. Products and prices may change, but the order captures the data at checkout time.

7. **Guest to registered conversion**: When a guest registers, optionally merge their guest orders into their account (roadmap feature).

8. **Error handling**: Always check the `success` field in responses. Display `message` to users.

9. **Validate shipping info**: Validate address, email, and phone on the client before sending to avoid wasted API calls.

10. **Retry failed requests**: Implement exponential backoff for failed requests due to network issues.

---

## FAQ

**Q: Can guests place orders without creating an account?**  
A: Yes. Guests can place orders using the X-Guest-Id header. A guest user account is automatically created on the server.

**Q: What happens to my guest orders if I create an account later?**  
A: Currently, guest orders remain under the guest ID. In the future, we'll provide a merge feature to move guest orders to your authenticated account.

**Q: Is my guest ID private?**  
A: Your guest ID should be treated like a password. Anyone with your guest ID can view your orders. Store it securely in localStorage/cookies.

**Q: Can I modify an order after checkout?**  
A: No, orders cannot be modified after placed. You would need to cancel and create a new order (cancel functionality coming soon).

**Q: How long does checkout take?**  
A: Checkout is typically instant (< 500ms). If it takes longer, the server may be processing stock updates.

**Q: What if checkout fails midway?**  
A: The entire transaction is atomic—either all steps succeed or all roll back. Your cart will be intact if anything fails.

**Q: Can I place multiple orders simultaneously?**  
A: Yes, each request is independent. However, if you have limited stock, concurrent checkouts may fail.

**Q: How is shipping cost calculated?**  
A: Currently, shipping is not calculated. The order total is the sum of item prices. Shipping will be added in a future release.

**Q: Do you support multiple addresses per order?**  
A: No, currently one shipping address per order. Multiple addresses per item is a future feature.

**Q: How often should I poll for order status updates?**  
A: Poll every 30-60 seconds for status changes. Polling more frequently wastes bandwidth. Webhooks are coming soon.

---

**Last Updated**: February 25, 2026  
**API Version**: v1  
**Last Build**: February 25, 2026

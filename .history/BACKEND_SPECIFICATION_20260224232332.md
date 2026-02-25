# E-Commerce Backend Specification

## 1. Architecture & Technology

### Recommended Architecture: Modular Monolith
For a production-ready e-commerce platform that requires scalability while maintaining developer velocity and operational simplicity, a **Modular Monolith** built on **Clean Architecture** principles is recommended.

**Justification**:
- **Why not Microservices immediately?** A full microservices architecture introduces significant infrastructure overhead, network latency, distributed transaction complexities (Sagas), and deployment challenges. 
- **The Modular Monolith approach** separates domains (Catalog, Cart, Ordering, Identity) into strictly isolated modules within the same deployment boundary. They communicate via in-memory events (Mediator pattern). When a specific module (e.g., Ordering) requires independent scaling, it can be easily extracted into a separate microservice.

### Technology Stack
- **Framework**: .NET 8 (ASP.NET Core Web API)
- **Language**: C# 12
- **Database**: PostgreSQL (Primary Relational DB)
- **Caching & Sessions**: Redis (Distributed caching, shopping cart storage, rate limiting)
- **Message Broker**: RabbitMQ or Azure Service Bus (for asynchronous background events like order processing and emails)
- **ORM**: Entity Framework Core 8
- **Object Mapping & Validation**: AutoMapper / Mapster, FluentValidation

### Folder Structure (Clean Architecture)
```text
src/
 ├─ ECommerce.Api/             # Presentation Layer: Controllers, Program.cs, Middlewares
 ├─ ECommerce.Application/     # Application Layer: Use Cases, CQRS (MediatR), Interfaces, DTOs
 ├─ ECommerce.Domain/          # Domain Layer: Entities, Value Objects, Domain Exceptions
 └─ ECommerce.Infrastructure/  # Infrastructure Layer: EF Core DbContext, Stripe API, SMTP config
```

### Environment Setup
- **Development**: Docker Compose (PostgreSQL, Redis, RabbitMQ) + Local .NET run.
- **Staging**: Cloud-hosted replica of production with anonymized data.
- **Production**: High-availability setup (e.g., Azure App Service or AWS ECS), Managed PostgreSQL, Managed Redis.

---

## 2. Database Design (Critical)

A relational database (PostgreSQL) is ideal for transactional integrity (ACID). 

### Core Schema

**Users & Security**
- `Users`: `Id` (UUID), `Email`, `PasswordHash`, `FirstName`, `LastName`, `Role` (Enum: Admin, Customer), `CreatedAt`, `IsActive`
- `Addresses`: `Id`, `UserId` (FK), `Title` (e.g., Home), `Street`, `City`, `State`, `PostalCode`, `Country`, `IsDefault`

**Catalog**
- `Categories`: `Id`, `Name`, `Slug` (Unique index), `ParentId` (Self-referencing FK), `IsActive`
- `Products`: `Id`, `Name`, `Slug` (Unique index), `Description`, `CategoryId` (FK), `BasePrice`, `CreatedAt`, `IsPublished`
- `ProductVariants`: `Id`, `ProductId` (FK), `SKU` (Unique index), `Size`, `Color`, `PriceAdjustment`, `StockQuantity`
- `ProductImages`: `Id`, `ProductId` (FK), `ImageUrl`, `IsPrimary`, `DisplayOrder`

**Shopping & Orders**
- `Carts`: Stored in **Redis** (Key: `cart:{userId|sessionId}`). Extremely fast read/write, expires after 7 days.
- `Wishlists`: `Id`, `UserId` (FK)
- `WishlistItems`: `WishlistId` (FK), `ProductId` (FK)
- `Coupons`: `Id`, `Code` (Unique), `DiscountType` (Percentage/Fixed), `DiscountValue`, `ExpiryDate`, `UsageLimit`
- `Orders`: `Id`, `UserId` (FK), `OrderNumber` (Unique str), `Status` (Enum: Pending, Paid, Shipped, Delivered, Cancelled), `TotalAmount`, `ShippingAddressId` (FK), `PaymentIntentId`, `CreatedAt`
- `OrderItems`: `Id`, `OrderId` (FK), `ProductVariantId` (FK), `ProductName` (Snapshot), `UnitPrice` (Snapshot), `Quantity`

**Social/Engagement**
- `Reviews`: `Id`, `ProductId` (FK), `UserId` (FK), `Rating` (1-5), `Comment`, `CreatedAt`, `IsApproved`

### Indexing Strategy
- **Unique B-Tree Indexes** on: `Users.Email`, `Products.Slug`, `Categories.Slug`, `ProductVariants.SKU`, `Coupons.Code`.
- **Foreign Key Indexes**: PostreSQL requires explicit indexing on FKs. Index `ProductId` on `ProductVariants`, `UserId` on `Orders`, etc.
- **Composite Indexes**: `(CategoryId, IsPublished)` on `Products` to speed up category listing queries.

---

## 3. API Design (RESTful)

APIs should be noun-based, versioned, and return standard JSON.

### Authentication Endpoints
- `POST /api/v1/auth/register` - Create a new user.
- `POST /api/v1/auth/login` - Authenticate & return JWT + Refresh Token.
- `POST /api/v1/auth/refresh` - Issue new JWT using valid Refresh Token.
- `POST /api/v1/auth/logout` - Revoke Refresh Token.

### Product & Catalog Endpoints
- `GET /api/v1/products` - List products (Query params: `?category=slug&sort=price_asc&page=1&limit=20`).
- `GET /api/v1/products/{slug}` - Details including variants, images, and average rating.
- `GET /api/v1/categories` - Nested list of active categories.
- `GET /api/v1/products/{productId}/reviews` - Paginated reviews.

### Cart Management (Powered by Redis)
- `GET /api/v1/cart` - Retrieve current user/session cart.
- `POST /api/v1/cart/items` - Add variant to cart (Body: `{ "productVariantId": 1, "quantity": 1 }`).
- `PUT /api/v1/cart/items/{variantId}` - Update quantity.
- `DELETE /api/v1/cart/items/{variantId}` - Remove from cart.
- `DELETE /api/v1/cart` - Clear entire cart.

### User & Wishlist
- `GET /api/v1/users/me` - Get profile.
- `PUT /api/v1/users/me` - Update profile details.
- `GET /api/v1/wishlists` - Get user wishlist items.
- `POST /api/v1/wishlists/{productId}` - Add to wishlist.

### Checkout & Orders
- `POST /api/v1/orders/checkout` - Validates cart, stock, applies coupon, and returns PaymentIntent secret.
- `GET /api/v1/orders` - Order history for user (paginated).
- `GET /api/v1/orders/{orderId}` - Specific order details.

---

## 4. Authentication & Security

- **JWT Authentication**: Access tokens (valid for 15 minutes). Refresh tokens stored as `HttpOnly, Secure, SameSite=Strict` cookies to prevent XSS.
- **Role-Based Access Control (RBAC)**: Use `[Authorize(Roles = "Admin")]` for admin endpoints.
- **Password Hashing**: `BCrypt` or ASP.NET Core Identity's default PBKDF2 with high iterations.
- **Rate Limiting**: Implementation of ASP.NET Core 8 Rate Limiter (e.g., `FixedWindow` of 100 req/minute per IP; 5 req/minute for `/login`).
- **Input Validation**: `FluentValidation` validates DTOs before reaching controllers. Prevents SQL Injection.
- **Anti-XSS**: Strip HTML tags from review comments. Ensure Content-Security-Policy (CSP) headers are configured via middleware.

---

## 5. Performance & Scalability

- **Caching Strategy**:
  - *Distributed Cache (Redis)*: Cart data, User Session state.
  - *Output Caching*: Cache `GET /api/v1/categories` and `GET /api/v1/products` (with short TTLs or cache invalidation upon admin update).
- **Database Optimization**: Prevent N+1 queries using EF Core `.Include()` appropriately or projection (`.Select()`). Use "No-Tracking" queries for read-only operations.
- **Pagination**: Seek-based (Cursor) pagination or standard Offset/Limit with hardware limits (maximum 100 items per page).
- **Background Jobs**: Use `Hangfire` or `MassTransit` for asynchronous tasks (e.g., sending order confirmation emails, generating invoice PDFs) to keep API responses under 200ms.
- **Media CDN**: Images stored in AWS S3 or Azure Blob Storage, served through a CDN (Cloudflare/Cloudfront) with auto-resizing.

---

## 6. Payment & Checkout Flow

**Architecture**: Stripe Payment Intents.
1. Frontend calls `POST /api/v1/orders/checkout`.
2. Backend validates stock, calculates total, reserves inventory (soft lock for 15 mins), creates a `Pending` Order, and calls Stripe API to create a `PaymentIntent`.
3. Backend returns `clientSecret` to Frontend.
4. Frontend handles card input via Stripe Elements and confirms payment directly with Stripe.
5. Stripe sends asynchronous Webhook to `POST /api/v1/webhooks/stripe`.
6. Backend verifies webhook signature, updates Order to `Paid`, clears the Redis Cart, and fires an `OrderPaidEvent`.
7. Background worker generates Invoice and emails the customer.

---

## 7. Admin Panel Support

Secure endpoints nested under `/api/v1/admin/` requiring `Admin` role.
- **Inventory Management**: `PUT /api/v1/admin/variants/{id}/stock` to update quantities.
- **Product Management**: Full CRUD on Products and Categories. Support for image uploads (returns CDN URL).
- **Order Processing**: Endpoints to transition status (`Paid` -> `Shipped` -> `Delivered`). Integration with shipping provider APIs to generate tracking numbers.
- **Dashboard Analytics**: `GET /api/v1/admin/analytics/sales?range=30d`. Optimized via indexed Views or Materialized Views in PostgreSQL for fast aggregations.

---

## 8. SEO & Professional Features

- **Slug-based Routing**: APIs accept slugs for products/categories (`/products/mens-leather-jacket`) so the frontend can generate beautiful `/shop/mens-leather-jacket` URLs.
- **Structured Data**: The backend provides clean metadata fields (SEO Title, Meta Description) on the Product entity. The Frontend Next.js/React app renders this into `<head>` and JSON-LD schema objects.

---

## 9. Error Handling & Logging

- **Standardized Responses**: Using RFC 7807 **Problem Details**. Any exception translates to a structured JSON object:
  ```json
  {
    "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
    "title": "Not Found",
    "status": 404,
    "detail": "Product with slug 'unknown' was not found."
  }
  ```
- **Global Exception Handler**: Use ASP.NET Core 8 `IExceptionHandler` to catch unhandled errors without leaking stack traces to the client.
- **Logging Strategy**: `Serilog` integrated into ASP.NET Core, logging to standard output in JSON format. Injected into `Seq`, `Datadog`, or `Azure Application Insights`.
- **Correlation IDs**: Pass a `X-Correlation-Id` header through all requests and logs to trace a user's journey across logs (crucial if moving to microservices).

---

## 10. Deployment & DevOps

- **Containerization**: Everything runs in Docker containers. Multistage `Dockerfile` for the .NET API.
- **CI/CD Pipeline** (e.g., GitHub Actions):
  - *Continuous Integration*: On Pull Request -> Restore, Build, Run Unit & Integration Tests (Testcontainers for PostgreSQL/Redis).
  - *Continuous Deployment*: On merge to `main` -> Build Docker image, push to ACR/ECR, deploy to cluster.
- **Hosting Recommendation**: Azure Container Apps (serverless containers, excellent .NET integration) or AWS ECS Fargate.
- **Infrastructure as Code (IaC)**: Terraform or Bicep scripts to manage the PostgreSQL DB, Redis Cache, and Container environments.

# E-Commerce Backend Architecture Specification

## 1. High-Level Architecture Explanation

### 1.1 Clean Architecture Approach
The solution follows the **Clean Architecture** pattern to ensure separation of concerns, testability, and independence from frameworks and UI.

#### Project Folder Structure
- **Ecommerce.Domain**: Contains enterprise logic, entities, value objects, domain exceptions, and domain interfaces (e.g., repository contracts). Has no external dependencies.
- **Ecommerce.Application**: Contains business rules, use cases (CQRS handlers or service classes), DTOs, AutoMapper profiles, FluentValidation validators, and application interfaces. Depends only on the Domain layer.
- **Ecommerce.Infrastructure**: Contains the DbContext, EF Core database migrations, Repository and Unit of Work implementations, Identity setup, caching implementations, email services, and payment gateway integration. Depends on Domain and Application layers.
- **Ecommerce.API**: The presentation layer (ASP.NET Core Web API). Configures DI, middleware, controllers, Swagger, and rate limiting.

#### Dependency Flow
`API Layer -> Infrastructure Layer -> Application Layer -> Domain Layer`
The Domain layer is at the core. Outer layers depend on inner layers, enforcing the Dependency Inversion Principle.

### 1.2 Core Patterns & Principles
- **SOLID Principles**: Adhered to throughout the architecture (e.g., Single Responsibility for controllers and handlers, Dependency Inversion using interfaces).
- **Repository + Unit of Work (UoW)**: 
  - *Why*: Abstracts EF Core, allowing for easier unit testing of the Application layer and providing a centralized way to commit transactions (`SaveChanges`) across multiple repository operations.
- **Standardized API Response**: All API responses are wrapped in a standard `ApiResponse<T>` object containing `Data`, `Success`, `Message`, and `Errors` (list of validation or operational errors).

---

## 2. Database Design (SQL Server)

All entities inherit from a `BaseEntity` with standard audit properties: `Id`, `CreatedAt`, `UpdatedAt`, `IsDeleted` (for Soft Delete). Concurrency is handled using a `[Timestamp] byte[] RowVersion`.

### Core Tables

#### 1. Users
- `Id` (Guid, PK)
- `FirstName`, `LastName` (NVARCHAR(100))
- `Email` (NVARCHAR(256), Indexed, Unique)
- `PasswordHash` (NVARCHAR(MAX))
- `PhoneNumber` (NVARCHAR(20))
- `IsActive` (BIT)
- `RefreshToken` (NVARCHAR(256))
- `RefreshTokenExpiryTime` (DATETIME2)

#### 2. Roles (AspNetRoles if using Identity)
- `Id` (Guid, PK)
- `Name` (NVARCHAR(256)) (e.g., Admin, Customer, Vendor)

#### 3. UserRoles (M-M)
- `UserId` (Guid, FK -> Users)
- `RoleId` (Guid, FK -> Roles)
- PK is composite (`UserId`, `RoleId`)

#### 4. Products
- `Id` (Guid, PK)
- `CategoryId` (Guid, FK -> Categories)
- `Name` (NVARCHAR(200))
- `Slug` (NVARCHAR(200), Indexed, Unique)
- `Description` (NVARCHAR(MAX))
- `BasePrice` (DECIMAL(18,2))
- `IsActive` (BIT)
- `AverageRating` (DECIMAL(3,2))

#### 5. Categories
- `Id` (Guid, PK)
- `ParentId` (Guid, Nullable, FK -> Categories)
- `Name` (NVARCHAR(100))
- `Slug` (NVARCHAR(100), Unique)

#### 6. ProductVariants
- `Id` (Guid, PK)
- `ProductId` (Guid, FK -> Products)
- `SKU` (NVARCHAR(100), Indexed, Unique)
- `Size`, `Color` (NVARCHAR(50))
- `PriceAdjustment` (DECIMAL(18,2))
- `StockQuantity` (INT) - *Stock management logic handled via optimistic concurrency*
- `RowVersion` (TIMESTAMP) - *Critical for concurrent checkout/stock updates*

#### 7. ProductImages
- `Id` (Guid, PK)
- `ProductId` (Guid, FK -> Products)
- `Url` (NVARCHAR(2048))
- `IsPrimary` (BIT)
- `DisplayOrder` (INT)

#### 8. Cart & CartItems
- **Cart**: 
  - `Id` (Guid, PK), `UserId` (Guid, Nullable, FK -> Users), `SessionId` (NVARCHAR(256), for guest carts), `UpdatedAt` (DATETIME2)
- **CartItem**: 
  - `Id` (Guid, PK), `CartId` (Guid, FK -> Cart), `ProductVariantId` (Guid, FK -> ProductVariants), `Quantity` (INT)

#### 9. Orders
- `Id` (Guid, PK)
- `UserId` (Guid, FK -> Users)
- `OrderNumber` (NVARCHAR(50), Indexed, Unique)
- `Status` (INT/Enum: Pending, Paid, Processing, Shipped, Delivered, Cancelled)
- `TotalAmount` (DECIMAL(18,2))
- `ShippingAddressId` (Guid, FK -> Addresses)
- `PaymentIntentId` (NVARCHAR(256)) - *Stripe integration tracking*

#### 10. OrderItems
- `Id` (Guid, PK)
- `OrderId` (Guid, FK -> Orders)
- `ProductVariantId` (Guid, Nullable, FK -> ProductVariants)
- `ProductName` (NVARCHAR(200)) - *Stored historically in case product name changes*
- `UnitPrice` (DECIMAL(18,2))
- `Quantity` (INT)

#### 11. Wishlist
- `Id` (Guid, PK)
- `UserId` (Guid, FK -> Users)
- `ProductId` (Guid, FK -> Products)

#### 12. Reviews
- `Id` (Guid, PK)
- `UserId` (Guid, FK -> Users)
- `ProductId` (Guid, FK -> Products)
- `Rating` (INT 1-5)
- `Comment` (NVARCHAR(MAX))
- `IsApproved` (BIT)

#### 13. Addresses
- `Id` (Guid, PK)
- `UserId` (Guid, FK -> Users)
- `Street`, `City`, `State`, `Country` (NVARCHAR(100))
- `ZipCode` (NVARCHAR(20))
- `IsDefault` (BIT)

#### 14. Coupons / Discounts
- `Id` (Guid, PK)
- `Code` (NVARCHAR(50), Unique)
- `DiscountType` (Enum: Percentage, FixedAmount)
- `DiscountValue` (DECIMAL(18,2))
- `StartDate`, `EndDate` (DATETIME2)
- `UsageLimit` (INT)
- `UsedCount` (INT)

#### 15. Payments
- `Id` (Guid, PK)
- `OrderId` (Guid, FK -> Orders, Unique for 1-1 mapped successful payment)
- `TransactionId` (NVARCHAR(256))
- `Amount` (DECIMAL(18,2))
- `Status` (Enum: Pending, Completed, Failed, Refunded)
- `Provider` (NVARCHAR(50) e.g., "Stripe")

### Indexing & Relationships
- **1-M**: Category->Products, Product->Variants, Product->Images, User->Orders, Order->OrderItems, User->Addresses, Product->Reviews.
- **M-M**: Users <-> Roles.
- **Indexing Strategy**: Non-clustered indexes on frequently searched/filtered columns: `Products.Slug`, `ProductVariants.SKU`, `Users.Email`, `Orders.OrderNumber`.
- **Soft Delete Strategy**: Global Query Filter applied in EF Core DbContext (`builder.Entity<T>().HasQueryFilter(e => !e.IsDeleted)`). Delete requests map to setting `IsDeleted = true`.

---

## 3. Authentication & Security

- **Mechanism**: JWT (JSON Web Tokens) with ASP.NET Core Identity.
- **Tokens**: Short-lived Access Tokens (e.g., 15 mins) and long-lived, rotating Refresh Tokens stored securely in the DB.
- **Role-Based Authorization**: Policies set up for `[Authorize(Roles = "Admin")]`, `[Authorize(Roles = "Customer")]`, etc.
- **Security Protections**:
  - **SQL Injection**: Prevented inherently via EF Core LINQ.
  - **XSS**: Input validation with FluentValidation; sanitization pipeline for rich text HTML.
  - **CSRF**: Unnecessary for pure REST API if using Bearer tokens without cookies, but implemented if utilizing HttpOnly cookies for refresh tokens.
  - **HTTPS & Secure Headers**: Enforced via app middleware (`app.UseHttpsRedirection()`, `app.UseHsts()`). Implement Helmet-like headers (CSP, X-Frame-Options) using custom middleware.
  - **Rate Limiting**: Used ASP.NET Core native `Microsoft.AspNetCore.RateLimiting` middleware. (e.g., standard endpoints: 100 req/min/IP, login: 5 req/min/IP).
  - **Password Hashing**: Identity`s built in PBKDF2 hashing (or optionally overridden to use Argon2).

---

## 4. API Design (RESTful)

*Note: All endpoints return a standard wrapper `ApiResponse<T>`.*

### Authentication
- `POST /api/auth/register` - *Req:* RegisterDto / *Res:* TokensDto
- `POST /api/auth/login` - *Req:* LoginDto / *Res:* TokensDto
- `POST /api/auth/refresh-token` - *Req:* RefreshTokenDto / *Res:* TokensDto
- `POST /api/auth/logout` - *(Auth Required)*

### Products (Public)
- `GET /api/products` - *Params:* page, size, search, category, sort / *Res:* PaginatedList<ProductSummaryDto>
- `GET /api/products/{slug}` - *Res:* ProductDetailDto (includes Variants & Images)

### Cart
- `GET /api/cart` - *(Optional session ID block/JWT validation)* / *Res:* CartDto
- `POST /api/cart/items` - *Req:* CartItemDto
- `PUT /api/cart/items/{itemId}` - *Req:* UpdateQuantityDto
- `DELETE /api/cart/items/{itemId}`

### Orders
- `POST /api/orders/checkout` - *(Auth Required)* / *Req:* CheckoutDto / *Res:* OrderCreatedDto (incl. `PaymentIntentUrl` or `ClientSecret`)
- `GET /api/orders` - *(Auth Required)* / *Res:* PaginatedList<OrderSummaryDto>
- `GET /api/orders/{id}` - *(Auth Required)* / *Res:* OrderDetailDto

### Wishlist
- `GET /api/wishlist` - *(Auth Required)* / *Res:* IEnumerable<ProductSummaryDto>
- `POST /api/wishlist/{productId}` - *(Auth Required)*
- `DELETE /api/wishlist/{productId}` - *(Auth Required)*

### Reviews
- `GET /api/products/{productId}/reviews` - *(Public)*
- `POST /api/products/{productId}/reviews` - *(Auth Required)* / *Req:* ReviewDto

### Admin (Auth Required: Admin Role)
- `POST /api/admin/products` - *Req:* CreateProductDto
- `PUT /api/admin/products/{id}` - *Req:* UpdateProductDto
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/categories` / `POST` / `PUT` / `DELETE`
- `GET /api/admin/users` - Manage Users
- `GET /api/admin/orders` - Filtered order lists
- `PUT /api/admin/orders/{id}/status` - *Req:* UpdateOrderStatusDto
- `GET /api/admin/dashboard` - Stats (Total Sales, New Users, Conversion Rates)

---

## 5. Performance & Scalability

- **Database Optimization**:
  - `AsNoTracking()` applied to read-only queries (e.g., `GetProductsListAsync`) to avoid EF tracking overhead.
  - Queries utilizing explicit/eager loading (`.Include()`) securely optimized to avoid Cartesian explosions (e.g., `.AsSplitQuery()` in EF Core).
- **Caching**: 
  - **IDistributedCache (Redis)**: Cache product catalogs, categories, active promotions.
  - **IMemoryCache**: For configuration parameters.
- **Pagination**: 
  - Standardized `.Skip((page-1)*size).Take(size)` mechanism bundled inside a `PaginatedList<T>` utility.
- **Background Services**:
  - Queue-based worker (using ASP.NET `BackgroundService` + RabbitMQ or Hangfire) for handling order confirmation emails and long-running invoice generations.
- **Logging**:
  - **Serilog** configured to sink to Elasticsearch/Kibana or Seq for querying high-volume structured logs.

---

## 6. Payment Architecture (Stripe Integration)

A robust 2-step payment architecture mapped perfectly for Stripe via webhooks:
1. **Checkout Phase**: The user requests a checkout. The backend calculates totals natively and creates a Stripe `PaymentIntent`. The `ClientSecret` is returned to the frontend.
2. **Order Creation**: An order is created simultaneously with `Status = Pending` and storing the `PaymentIntentId`.
3. **Webhook Processing**: Stripe fires event to `POST /api/webhooks/stripe`.
   - The handler verifies Stripe Signature using `StripeClientSecret`.
   - If `payment_intent.succeeded` -> Update corresponding Order status to `Paid`. Reduce respective `StockQuantity` inside a Database Transaction context (handling the `RowVersion` concurrency effectively).
   - If `payment_intent.payment_failed` -> Status moved to `Failed`.
4. **Idempotency**: Webhook events contain unique `EventId`. Tracked in DB to guarantee duplicate hooks don't credit users multiple times.

---

## 7. Professional Production Requirements

- **Global Exception Handling Middleware**: centralized `try/catch` catching domain exceptions (e.g. `NotFoundException`), returning consistent JSON structure `ApiResponse<T>` with accurate HTTP Status codes (`400`, `404`, `500`).
- **Structured Logging**: Applied natively throughout HTTP Pipeline; mapping UserId and endpoint properties automatically.
- **Docker Support**: Provided via a decoupled `Dockerfile` configured for multi-stage building. Alongside a `docker-compose.yml` to orchestrate SQL Server + Redis locally.
- **Environment Configuration**: Secure environment setups (e.g. `appsettings.Development.json` vs `appsettings.Production.json`). Environment variables / Azure KeyVault utilized to prevent storing secrets in codebase.
- **CI/CD Readiness**: 
  - Pipeline logic for GitHub Actions validates `dotnet build`, `dotnet test`, followed by Docker image publication to ACR (Azure Container Registry).
- **Deployment Recommendation (Azure Environment)**:
  - **API**: Azure App Service (Linux Container) or Azure Container Apps.
  - **Database**: Azure SQL Database.
  - **Cache**: Azure Cache for Redis. 
  - **Storage (Images)**: Azure Blob Storage natively accessed by API via SAS tokens.

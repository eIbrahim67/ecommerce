# E-Commerce Custom Backend Specification
*Target: ASP.NET Core 8 Web API, EF Core, SQL Server, ASPHostMonster (IIS Shared Hosting)*

---

## STEP 1 — WEBSITE ANALYSIS

### 1. Detected Features From UI
- **Product Catalog**: Products with Name, Image, Rating, Reviews Count, Price, Old Price, "Sale" badge, Short/Long Descriptions.
- **Product Attributes**: Weight/Size variants (e.g., 50g, 60g, 100g), Colors, SKU, MFG Date, Stock tracking, Tags (e.g., Snack, Organic).
- **Shop & Filtering**: 
  - Text search (by name or brand).
  - Category filtering with product counts per category.
  - Price range slider (min to max).
  - Color filtering checkboxes.
  - Sort by (Featured, Price: Low to High, Price: High to Low).
  - Pagination.
- **Cart System**: Product quantity adjustments, specific weight selection, subtotal calculation. (Currently local context, needs persistence).
- **Wishlist**: Add/remove products to wishlist.
- **Checkout**: Shipping details form (First/Last name, Email, Phone, Address, City, Zip), Cart Summary (Subtotal, Tax, Free Shipping), Order Placement.
- **User Authentication**: Login, Registration, JWT sessions.
- **Account Management**: Profile info, Order History, RBAC (Customer vs. Admin dashboard access).

### 2. User Flows
1. **Browsing**: User navigates the Home/Shop pages, searches, applies price/category filters, and paginates.
2. **Product Details**: Views image gallery, picks weight variant, adjusts quantity, drops item into Cart or Wishlist.
3. **Cart Management**: Checks Cart page, removes items, alters quantities; total is re-calculated.
4. **Checkout**: Submits shipping address. Order is processed, cart is cleared, and user returns to home with a success state.
5. **Post-Checkout**: User checks Account page to see the generated order.

### 3. Missing Backend Logic Behind UI Elements
- Cart and Wishlist are currently living in React State/Context. They must route to database tables to persist across devices.
- Price calculations on Checkout currently trust the client. The backend MUST recalculate totals, apply server-side taxes, and validate product prices during Checkout POST to prevent tampering.
- Inventory deduction upon successful checkout.
- Image storage logic (the UI uses static assets; backend needs a way to store uploaded product images on IIS).

### 4. Required Business Logic
- **Stock Management**: Ensure `Quantity` > 0 before allowing checkout. Deduct stock per variant weight.
- **Tax & Shipping**: If tax logic is added later, backend needs an engine for it (the UI assumes "calc at checkout", and "Free Shipping").
- **Admin Security**: The Admin UI snippet in `Account.tsx` requires strict Role-Based Authorization on API data mutation lines.

### 5. Implied Data Entities
`User`, `Role`, `Product`, `Category`, `ProductVariant` (Weight/Color), `ProductImage`, `Tag`, `Review`, `Order`, `OrderItem`, `CartItem`, `WishlistItem`.

---

## STEP 2 — CUSTOM BACKEND ARCHITECTURE (.NET)

To comply with the ASPHostMonster IIS shared hosting (No Docker) requirement while remaining scalable, we will use a **Lightweight Clean Architecture**.

### Folder & Project Structure
- `NestMart.Api` (Presentation)
  - Controllers, Program.cs, Middleware (Global Exception Handling), appsettings.json
- `NestMart.Application` (Business Logic)
  - Services, DTOs (Requests/Responses), Interfaces, FluentValidation Rules
- `NestMart.Domain` (Entities Core)
  - Models, Enums, Constants
- `NestMart.Infrastructure` (Data & External)
  - EF Core DbContext, Repositories (if needed, though direct DbContext is often preferred for simple layers), Migrations, Token Services.

### Key Considerations for Shared Hosting
- **In-Process Hosting**: Ensure `web.config` sets `<aspNetCore hostingModel="inprocess" />` for performance.
- **Memory Footprint**: Keep background services (IHostedService) to an absolute minimum since app pools recycle on shared hosting. 
- **Global Exception Middleware**: `API` layer will have a middleware to catch `Exception`, log it, and return a standard `{"success": false, "message": "...", "errors": [...] }`.

---

## STEP 3 — DATABASE DESIGN (SQL Server)

*Schema derived purely from the React UI features.*

### 1. Users & Roles (ASP.NET Identity)
- `AspNetUsers`: Id, UserName, Email, PhoneNumber, PasswordHash, FirstName, LastName
- `AspNetRoles`: Admin, Customer

### 2. Catalog
- **Categories**: `Id`, `Name`, `Icon` (string/SVG), `IsDeleted`
- **Products**: `Id`, `Name`, `Brand`, `CategoryId` (FK), `BasePrice`, `OldPrice`, `Description`, `AdditionalInfo`, `SKU`, `MfgDate`, `Rating` (computed), `ReviewsCount` (computed), `StockQuantity` (Global fallback), `RowVersion` (Timestamp for concurrency), `IsDeleted`.
- **ProductImages**: `Id`, `ProductId` (FK), `ImagePath`, `IsPrimary`.
- **ProductVariants**: `Id`, `ProductId` (FK), `Weight` (e.g., "50g"), `Color`, `PriceAdjustment`, `StockQuantity`.
- **ProductTags**: Many-to-Many junction between `Products` and `Tags` (snack, organic).

### 3. Shopping Context
- **CartItems**: `Id`, `UserId` (FK), `ProductId` (FK), `ProductVariantId` (FK, nullable), `Quantity`.
- **WishlistItems**: `UserId` (FK), `ProductId` (FK). (Composite PK)

### 4. Orders
- **Orders**: `Id`, `UserId` (FK), `OrderDate`, `Status` (Pending, Processing, Shipped, Delivered), `SubTotal`, `Tax`, `Total`, `ShippingAddress`, `City`, `ZipCode`, `PhoneNumber`.
- **OrderItems**: `Id`, `OrderId` (FK), `ProductId` (FK), `Weight` (snapshot), `UnitPrice` (snapshot), `Quantity`.
- **Reviews**: `Id`, `UserId` (FK), `ProductId` (FK), `Rating` (1-5), `Comment`, `CreatedAt`.

*Notes*: Soft delete (`IsDeleted` bool) will be applied to `Products` and `Categories` to prevent breaking existing Order history. Concurrency Token (`RowVersion` byte[]) will be on `Products` and `ProductVariants` for safe stock deductions.

---

## STEP 4 — FULL API SPECIFICATION

All endpoints prepend `/api/v1/`.

### Authentication
- `POST /auth/register`
  - **Req**: `RegisterDto` (Email, Password, FirstName, LastName)
  - **Res**: `AuthResponseDto` (Token, User details)
- `POST /auth/login`
  - **Req**: `LoginDto` (Email, Password)
  - **Res**: `AuthResponseDto` 
- `GET /account/profile` (Auth Required)
  - **Res**: `UserProfileDto` (Name, Email, Role)

### Products & Categories
- `GET /categories`
  - **Res**: `List<CategoryDto>` (Name, Icon, Count of active products)
- `GET /products`
  - **Req Query**: `search`, `categoryId`, `minPrice`, `maxPrice`, `colors`, `sortBy` (featured/price-low/price-high), `page`, `pageSize`
  - **Res**: `PaginatedResponse<ProductListItemDto>`
- `GET /products/{id}`
  - **Res**: `ProductDetailDto` (includes Variants, Images, Tags string[], Vendor details).

### Cart (Auth Required)
- `GET /cart`
  - **Res**: `CartSummaryDto` (Items array, Subtotal)
- `POST /cart`
  - **Req**: `AddToCartDto` (ProductId, VariantId/Weight, Quantity)
- `PUT /cart/{itemId}`
  - **Req**: `UpdateCartQtyDto` (Quantity)
- `DELETE /cart/{itemId}`
- `DELETE /cart` (Clear cart)

### Wishlist (Auth Required)
- `GET /wishlist`
  - **Res**: `List<ProductListItemDto>`
- `POST /wishlist/{productId}`
- `DELETE /wishlist/{productId}`

### Checkout & Orders (Auth Required)
- `POST /orders/checkout`
  - **Req**: `CheckoutDto` (FirstName, LastName, Address, City, ZipCode, Phone). *Backend pulls Cart items automatically, computes price, and deducts stock.*
  - **Res**: `200 OK`, `OrderId`
- `GET /orders`
  - **Res**: `List<OrderSummaryDto>`

---

## STEP 5 — PERFORMANCE & PROFESSIONAL REQUIREMENTS

### Shared Hosting Optimizations
1. **EF Core Queries**: Use `.AsNoTracking()` for all read-only `GET` endpoints (`/products`, `/categories`) to reduce memory overhead.
2. **Indexing**: 
   - Non-Clustered Indexes on `Products(CategoryId)` and `Products(Price)`.
   - Full-text or standard composite index on `Products(Name, Brand)` for the Search box.
3. **Paging**: Implemented using `Skip()` and `Take()` at the SQL level, avoiding memory buffering.
4. **Caching**: Utilize `IMemoryCache` for `/categories` and featured `/products` since they rarely change. Cache expiry duration of 10-15 minutes.
5. **Static Assets / Images**:
   - Store images in `wwwroot/images/products`.
   - Database only stores relative paths (`/images/products/apple.jpg`). 
   - Shared hosting handles static file serving extremely well via IIS. No blob storage needed.

---

## STEP 6 — SECURITY DESIGN

1. **Authentication**: JWT Bearer Tokens. Expiration set to 7 days for UX purposes.
2. **Authorization**: `[Authorize(Roles = "Admin")]` on any catalog-mutating endpoints (e.g., `POST /products`). Regular `[Authorize]` for Cart/Checkout APIs.
3. **Validation**: FluentValidation pipeline executed via Action Filter for DTOs.
   - Example: Checkout ZipCode minimum length, Address required.
4. **Resilience**: 
   - **SQL Injection**: Prevented intrinsically by EF Core LINQ parameterized queries.
   - **XSS**: APIs return JSON, React handles HTML escaping.
   - **Price Tampering Check**: Crucial logic during Checkout POST. Total must be recalculated on the server from the DB prices.

---

## STEP 7 — DEPLOYMENT (ASPHostMonster READY)

### 1. Database Setup
Shared hosting does not allow `dotnet ef database update` in production via CLI. 
- **Method**: Generate a SQL script locally: `dotnet ef migrations script -i -o migrate.sql`.
- Login to ASPHostMonster SQL Server Management Studio (SSMS) or Plesk/cPanel, execute `migrate.sql` on the provided empty database.

### 2. Configuration Settings (`appsettings.Production.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:YOUR_DB_SERVER;Initial Catalog=YOUR_DB_NAME;User Id=YOUR_DB_USER;Password=YOUR_DB_PASS;Encrypt=False;"
  },
  "Jwt": {
    "Key": "YOUR_SUPER_SECRET_COMPLEX_KEY_HERE_MIN_256_BITS",
    "Issuer": "NestMartAPI",
    "Audience": "NestMartUI"
  }
}
```

### 3. Publishing (.NET 8)
1. In Visual Studio or CLI, run:
   `dotnet publish -c Release -r win-x64 --self-contained false`
2. **Important**: Since ASPHostMonster provides the .NET runtime, `self-contained false` drastically reduces file size.
3. Ensure `web.config` is generated inside the `publish` folder. It should look like this:
```xml
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="dotnet" arguments=".\NestMart.Api.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
  </system.webServer>
</configuration>
```

### 4. FTP / Control Panel Upload
- Zip the contents of the `publish` folder (excluding the folder itself).
- Upload to the `wwwroot` or `httpdocs` folder of ASPHostMonster via FTP (FileZilla) or the web file manager.
- Verify permissions: The IIS AppPool user must have write access to `wwwroot/images/products` for admin image uploads to succeed.

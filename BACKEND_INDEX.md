# BACKEND Folder Index

Complete index of the UniDeals Backend API server.

---

## 📁 Directory Structure

```
BACKEND/
├── config/                    # Configuration modules
│   ├── database.js           # PostgreSQL connection pool
│   └── email.js              # Nodemailer email service
├── database/                 # Database schemas and migrations
│   ├── schema.sql           # Main database schema
│   ├── migration_add_location_fields.sql
│   ├── migration_add_supplier_to_orders.sql
│   └── fix_etage_size.sql
├── middleware/               # Express middleware
│   └── auth.js              # JWT authentication middleware
├── models/                   # Database models (data access layer)
│   ├── Client.js            # Client/user model
│   ├── Supplier.js          # Supplier model
│   ├── Product.js           # Product model
│   ├── Offer.js             # Offer model
│   ├── Panier.js            # Shopping cart model
│   └── Order.js             # Order model
├── routes/                   # API route handlers
│   ├── client.js            # Client API routes
│   └── supplier.js          # Supplier API routes
├── utils/                    # Utility functions
│   ├── jwt.js               # JWT token utilities
│   └── validation.js        # Input validation utilities
├── public/                   # Static frontend files
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── categories.html
│   ├── client-dashboard.html
│   ├── supplier-dashboard.html
│   ├── css/                 # Stylesheets
│   └── js/                  # Frontend JavaScript
├── server.js                 # Main Express server entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in repo)
├── env.example              # Environment variables template
└── [Documentation Files]     # Various .md files
```

---

## 🔧 Core Files

### `server.js`
**Purpose**: Main Express server application entry point

**Key Features**:
- Express app initialization
- Middleware setup (CORS, JSON parsing, static files)
- Route registration (`/api/client`, `/api/supplier`)
- Health check endpoint (`/health`)
- Error handling middleware
- Static file serving from `public/` directory

**Dependencies**:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `routes/client.js` - Client routes
- `routes/supplier.js` - Supplier routes

**Port**: Default 3000 (configurable via `PORT` env var)

---

## ⚙️ Configuration (`config/`)

### `config/database.js`
**Purpose**: PostgreSQL database connection pool

**Features**:
- Creates PostgreSQL connection pool
- Handles password authentication (supports trust auth)
- Connection error handling with helpful tips
- SSL configuration for production
- Environment variables:
  - `DB_HOST` (default: 127.0.0.1)
  - `DB_PORT` (default: 5432)
  - `DB_NAME` (default: unideals)
  - `DB_USER` (default: postgres)
  - `DB_PASS` (optional, empty string for trust auth)

**Exports**: `pool` - PostgreSQL connection pool instance

### `config/email.js`
**Purpose**: Email service configuration using Nodemailer

**Features**:
- Creates Nodemailer transporter (if configured)
- Fallback to console logging if email not configured
- Sends verification codes to users
- HTML email templates
- Environment variables:
  - `EMAIL_HOST` (default: smtp.gmail.com)
  - `EMAIL_PORT` (default: 587)
  - `EMAIL_USER` - Email username
  - `EMAIL_PASS` - Email password/app password

**Functions**:
- `sendVerificationCode(email, code)` - Sends 6-digit verification code

**Fallback Behavior**: If email not configured, logs verification code to console

---

## 🗄️ Database (`database/`)

### `database/schema.sql`
**Purpose**: Complete database schema definition

**Tables**:
1. **clients** - User accounts
   - Fields: id, email, password, verified, verification_code, verification_code_expires_at, panier_id, phone, location_type, etage, address
   - Indexes: email, verification_code

2. **suppliers** - Supplier accounts
   - Fields: id, name, email, password, phone, address

3. **products** - Products offered by suppliers
   - Fields: id, supplier_id, name, image, price, description, available
   - Foreign Key: supplier_id → suppliers(id)
   - Index: supplier_id

4. **offers** - Discount offers
   - Fields: id, supplier_id, name, description, discount_percentage, start_date, end_date, active
   - Foreign Key: supplier_id → suppliers(id)
   - Index: supplier_id

5. **offer_products** - Many-to-many (offers ↔ products)
   - Fields: id, offer_id, product_id
   - Unique constraint: (offer_id, product_id)
   - Indexes: offer_id, product_id

6. **paniers** - Shopping carts
   - Fields: id, client_id
   - Foreign Key: client_id → clients(id)
   - Index: client_id

7. **panier_items** - Items in shopping carts
   - Fields: id, panier_id, product_id, quantity, price_at_time
   - Foreign Keys: panier_id → paniers(id), product_id → products(id)
   - Index: panier_id

8. **orders** - Completed orders
   - Fields: id, client_id, panier_id, total_amount, delivery_fee, location_type, etage, address, phone, client_name, status
   - Foreign Keys: client_id → clients(id), panier_id → paniers(id)
   - Index: client_id

9. **order_items** - Items in orders
   - Fields: id, order_id, product_id, supplier_id, supplier_name, quantity, price_at_time
   - Foreign Keys: order_id → orders(id), product_id → products(id), supplier_id → suppliers(id)
   - Index: order_id

**Extensions**: `uuid-ossp` for UUID generation

### Migration Files
- `migration_add_location_fields.sql` - Adds location tracking to clients
- `migration_add_supplier_to_orders.sql` - Adds supplier tracking to order_items
- `fix_etage_size.sql` - Fixes etage field size

---

## 🔐 Middleware (`middleware/`)

### `middleware/auth.js`
**Purpose**: JWT authentication middleware

**Functions**:

1. **`authenticate(req, res, next)`**
   - Verifies JWT token from `Authorization: Bearer <token>` header
   - Adds decoded user to `req.user`
   - Used for client authentication
   - Returns 401 if token missing/invalid

2. **`authenticateSupplier(req, res, next)`**
   - Verifies JWT token
   - Checks if user role is 'supplier'
   - Returns 403 if not supplier
   - Used for supplier-only routes

**Dependencies**: `utils/jwt.js` - Token verification

---

## 📦 Models (`models/`)

### `models/Client.js`
**Purpose**: Client/user data access layer

**Static Methods**:
- `create(email, verificationCode, codeExpiresAt)` - Create new client
- `findByEmail(email)` - Find client by email
- `findById(id)` - Find client by ID
- `verifyEmail(email, verificationCode)` - Verify email with code
- `updateVerificationCode(email, code, expiresAt)` - Update verification code
- `setPassword(email, hashedPassword)` - Set password after verification
- `updateProfile(clientId, phone, locationType, etage, address)` - Update profile
- `getProfile(clientId)` - Get client profile
- `updatePanierId(clientId, panierId)` - Link panier to client
- `getOrders(clientId)` - Get client's order history

**Database Table**: `clients`

### `models/Supplier.js`
**Purpose**: Supplier data access layer

**Static Methods**:
- `create(name, email, hashedPassword, phone, address)` - Create supplier
- `findByEmail(email)` - Find supplier by email
- `findById(id)` - Find supplier by ID

**Database Table**: `suppliers`

### `models/Product.js`
**Purpose**: Product data access layer

**Static Methods**:
- `create(supplierId, name, image, price, description)` - Create product
- `findAll(supplierId)` - Get all products (optionally filtered by supplier)
- `findById(id)` - Get product by ID
- `update(id, supplierId, name, image, price, description, available)` - Update product
- `delete(id, supplierId)` - Delete product

**Database Table**: `products`
**Joins**: Includes supplier name and email in queries

### `models/Offer.js`
**Purpose**: Offer data access layer

**Static Methods**:
- `create(supplierId, name, description, discountPercentage, startDate, endDate)` - Create offer
- `findById(id)` - Get offer with products
- `findAllActive()` - Get all active offers (for clients)
- `findBySupplier(supplierId)` - Get supplier's offers
- `addProducts(offerId, productIds)` - Link products to offer
- `removeProducts(offerId, productIds)` - Unlink products from offer

**Database Tables**: `offers`, `offer_products`

### `models/Panier.js`
**Purpose**: Shopping cart data access layer

**Static Methods**:
- `create(clientId)` - Create new panier
- `findById(id)` - Get panier by ID
- `findByClientId(clientId)` - Get client's panier
- `getPanierWithItems(clientId)` - Get panier with all items
- `addItem(panierId, productId, quantity, price)` - Add item to panier
- `updateItemQuantity(panierId, itemId, quantity)` - Update item quantity
- `removeItem(panierId, itemId)` - Remove item from panier
- `clearPanier(panierId)` - Clear all items from panier

**Database Tables**: `paniers`, `panier_items`

### `models/Order.js`
**Purpose**: Order data access layer

**Static Methods**:
- `create(clientId, panierId, totalAmount, deliveryFee, locationType, etage, address, phone, clientName)` - Create order
- `findById(id)` - Get order by ID
- `findByClientId(clientId)` - Get client's orders
- `updateStatus(orderId, status)` - Update order status

**Database Tables**: `orders`, `order_items`
**Note**: Order creation includes supplier information in order_items

---

## 🛣️ Routes (`routes/`)

### `routes/client.js`
**Purpose**: Client API endpoints

**Endpoints**:

#### Authentication
- `POST /api/client/register`
  - Register with university email
  - Sends verification code
  - Body: `{ email }`
  - Returns: `{ success, message, data: { email } }`

- `POST /api/client/verify`
  - Verify email with code
  - Body: `{ email, verification_code }`
  - Returns: `{ success, message, data: { email, verified } }`

- `POST /api/client/set-password`
  - Set password after verification
  - Creates panier if doesn't exist
  - Returns JWT token
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { token, client } }`

- `POST /api/client/login`
  - Login with email and password
  - Returns JWT token
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { token, client } }`

#### Products & Offers
- `GET /api/client/products` (auth required)
  - Get all available products grouped by supplier
  - Returns: `{ success, data: [stores] }`

- `GET /api/client/offers` (auth required)
  - Get all active offers
  - Returns: `{ success, data: [offers] }`

#### Shopping Cart (Panier)
- `GET /api/client/panier` (auth required)
  - Get client's panier with items
  - Creates panier if doesn't exist
  - Returns: `{ success, data: { panier_id, items } }`

- `POST /api/client/panier/add` (auth required)
  - Add product to panier
  - Body: `{ product_id, quantity }`
  - Returns: `{ success, message, data: item }`

- `PUT /api/client/panier/update` (auth required)
  - Update item quantity
  - Body: `{ item_id, quantity }`
  - Returns: `{ success, message, data: item }`

- `DELETE /api/client/panier/remove/:item_id` (auth required)
  - Remove item from panier
  - Returns: `{ success, message, data: item }`

- `POST /api/client/panier/confirm` (auth required)
  - Confirm panier and create order
  - Calculates delivery fee (5 DH if outside EMSI, 0 if inside)
  - Creates new panier after order
  - Body: `{ phone, location_type, etage?, address?, client_name? }`
  - Returns: `{ success, message, data: order }`

#### Profile
- `GET /api/client/profile` (auth required)
  - Get client profile
  - Returns: `{ success, data: profile }`

- `PUT /api/client/profile` (auth required)
  - Update client profile
  - Body: `{ phone, location_type, etage?, address? }`
  - Returns: `{ success, message, data: profile }`

#### Orders
- `GET /api/client/orders` (auth required)
  - Get client's order history
  - Returns: `{ success, data: [orders] }`

**Dependencies**:
- `models/Client`, `models/Panier`, `models/Order`, `models/Product`, `models/Offer`
- `middleware/auth` - Authentication
- `config/email` - Email service
- `utils/jwt` - Token generation
- `utils/validation` - Input validation

### `routes/supplier.js`
**Purpose**: Supplier API endpoints

**Endpoints**:

#### Authentication
- `POST /api/supplier/register`
  - Register new supplier
  - Returns JWT token
  - Body: `{ name, email, password, phone?, address? }`
  - Returns: `{ success, message, data: { token, supplier } }`

- `POST /api/supplier/login`
  - Login supplier
  - Returns JWT token
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { token, supplier } }`

#### Products
- `POST /api/supplier/products` (supplier auth required)
  - Create product
  - Body: `{ name, image?, price, description? }`
  - Returns: `{ success, message, data: product }`

- `GET /api/supplier/products` (supplier auth required)
  - Get all supplier's products
  - Returns: `{ success, data: [products] }`

- `PUT /api/supplier/products/:id` (supplier auth required)
  - Update product
  - Body: `{ name, image?, price, description?, available? }`
  - Returns: `{ success, message, data: product }`

- `DELETE /api/supplier/products/:id` (supplier auth required)
  - Delete product
  - Returns: `{ success, message, data: product }`

#### Offers
- `POST /api/supplier/offers` (supplier auth required)
  - Create offer with products
  - Body: `{ name, description?, discount_percentage, start_date, end_date, product_ids[] }`
  - Returns: `{ success, message, data: offer }`

- `GET /api/supplier/offers` (supplier auth required)
  - Get all supplier's offers
  - Returns: `{ success, data: [offers] }`

#### Orders
- `GET /api/supplier/orders` (supplier auth required)
  - Get all orders containing supplier's products
  - Returns orders with items filtered by supplier
  - Returns: `{ success, data: [orders] }`

**Dependencies**:
- `models/Supplier`, `models/Product`, `models/Offer`
- `middleware/auth` - Supplier authentication
- `utils/jwt` - Token generation
- `config/database` - Direct database queries for orders

---

## 🛠️ Utilities (`utils/`)

### `utils/jwt.js`
**Purpose**: JWT token generation and verification

**Functions**:
- `generateToken(payload)` - Generate JWT token
  - Payload: `{ id, email, role }`
  - Expires: 7 days (configurable via `JWT_EXPIRES_IN`)
  - Secret: `JWT_SECRET` env var

- `verifyToken(token)` - Verify and decode JWT token
  - Returns decoded payload
  - Throws error if invalid/expired

**Environment Variables**:
- `JWT_SECRET` - Secret key for signing tokens
- `JWT_EXPIRES_IN` - Token expiration (default: '7d')

### `utils/validation.js`
**Purpose**: Input validation utilities

**Functions**:
- `isValidUniversityEmail(email)` - Validate university email format
  - Patterns: `.edu`, `.ac.*`, `university`, `uni`, `college`
  - Currently disabled in routes (accepts any email for testing)

- `generateVerificationCode()` - Generate 6-digit verification code
  - Returns: Random 6-digit string (100000-999999)

- `validatePassword(password)` - Validate password strength
  - Minimum 6 characters
  - Returns: `{ valid: boolean, message: string }`

---

## 🌐 Public Frontend (`public/`)

### HTML Pages
- `index.html` - Landing page
- `login.html` - Client login page
- `register.html` - Client registration page
- `categories.html` - Product categories/browsing page
- `client-dashboard.html` - Client dashboard (orders, profile)
- `supplier-dashboard.html` - Supplier dashboard (products, offers, orders)

### CSS (`public/css/`)
- `index.css` - Landing page styles
- `login.css` - Login page styles
- `register.css` - Registration page styles
- `categories.css` - Categories page styles
- `client-dashboard.css` - Client dashboard styles
- `supplier-dashboard.css` - Supplier dashboard styles
- `loading.css` - Loading spinner styles

### JavaScript (`public/js/`)
- `index.js` - Landing page logic
- `login.js` - Login functionality
- `register.js` - Registration flow (register → verify → set password)
- `categories.js` - Product browsing and cart management
- `client-dashboard.js` - Client dashboard (orders, profile management)
- `supplier-dashboard.js` - Supplier dashboard (product/offer CRUD, order viewing)

---

## 📚 Documentation Files

### `README.md`
Main backend documentation with:
- Setup instructions
- API endpoint overview
- Database schema overview
- Deployment guide

### `API_REFERENCE.md`
Complete API reference with:
- All endpoints with request/response examples
- Authentication flow
- Error responses
- Example usage flows

### `DATABASE_SETUP.md`
Database setup instructions

### `SETUP_GUIDE.md`
Detailed setup guide

### `SET_PASSWORD.md`
Password setting instructions

### `RESET_PASSWORD.md`
Password reset instructions

### `QUICK_FIX.md`
Quick fixes and troubleshooting

### `ORDER_UPDATE_INSTRUCTIONS.md`
Order system update instructions

---

## 🔄 Request Flow Examples

### Client Registration Flow
```
1. POST /api/client/register
   → Client.create() → sends email code
2. POST /api/client/verify
   → Client.verifyEmail() → marks verified
3. POST /api/client/set-password
   → Client.setPassword() → Panier.create() → generateToken()
   → Returns JWT token
```

### Order Creation Flow
```
1. GET /api/client/panier (auth)
   → Panier.getPanierWithItems()
2. POST /api/client/panier/confirm (auth)
   → Calculate totals → Client.updateProfile()
   → Order.create() → Create order_items with supplier info
   → Panier.create() (new empty panier)
```

### Supplier Product Management
```
1. POST /api/supplier/products (supplier auth)
   → Product.create()
2. GET /api/supplier/products (supplier auth)
   → Product.findAll(supplierId)
3. PUT /api/supplier/products/:id (supplier auth)
   → Product.update()
4. DELETE /api/supplier/products/:id (supplier auth)
   → Product.delete()
```

---

## 🔑 Authentication Flow

### Client Authentication
1. Register → Receive verification code
2. Verify code → Email verified
3. Set password → Receive JWT token
4. Use token in `Authorization: Bearer <token>` header

### Supplier Authentication
1. Register → Receive JWT token immediately
2. Or Login → Receive JWT token
3. Use token in `Authorization: Bearer <token>` header

### Token Structure
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "client" | "supplier"
}
```

---

## 📊 Database Relationships

```
clients (1) ──→ (1) paniers
clients (1) ──→ (*) orders
paniers (1) ──→ (*) panier_items
panier_items (*) ──→ (1) products
orders (1) ──→ (*) order_items
order_items (*) ──→ (1) products
order_items (*) ──→ (1) suppliers
suppliers (1) ──→ (*) products
suppliers (1) ──→ (*) offers
offers (*) ──→ (*) products (via offer_products)
```

---

## 🚀 Environment Variables

Required in `.env` file:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=unideals
DB_USER=postgres
DB_PASS=

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (optional - falls back to console logging)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=3000
NODE_ENV=development
```

---

## 📝 Key Features

### Client Features
- ✅ University email registration with verification
- ✅ Email verification code system (6-digit, 10-minute expiry)
- ✅ Password setting after verification
- ✅ JWT-based authentication
- ✅ Browse products grouped by supplier
- ✅ View active offers
- ✅ Shopping cart (Panier) management
- ✅ Order creation with location tracking
- ✅ Order history
- ✅ Profile management (phone, location)

### Supplier Features
- ✅ Supplier registration and authentication
- ✅ Product CRUD operations
- ✅ Offer creation with multiple products
- ✅ Discount percentage management
- ✅ View orders containing their products
- ✅ Order details with client information

### System Features
- ✅ Delivery fee calculation (5 DH outside EMSI, 0 inside)
- ✅ Location tracking (EMSI with floor, or outside with address)
- ✅ Multi-supplier order support
- ✅ Price snapshot at time of order
- ✅ Email verification with fallback to console logging

---

## 🔍 Quick Reference

### Start Server
```bash
npm start          # Production mode
npm run dev        # Development mode (same as start currently)
```

### Database Setup
```bash
psql -U postgres -d unideals -f database/schema.sql
```

### Health Check
```bash
GET http://localhost:3000/health
```

### Test Database Connection
```bash
node test-db-connection.js
```

---

*Last Updated: Based on current codebase structure*


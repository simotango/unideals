# UniDeals Backend

Backend API for UniDeals mobile application - a platform for university students to access deals, starting with the Fast Food category.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email verification
- **bcrypt** - Password hashing

## Features

### Client Features
- University email registration with verification
- Email verification code system
- Password setting after verification
- JWT-based authentication
- Browse products and offers
- Shopping cart (Panier) management
- Order creation and history

### Supplier Features
- Supplier registration and authentication
- Product management (CRUD)
- Offer creation with multiple products
- Discount management

## Database Schema

The database includes the following tables:
- **clients** - User accounts with email verification
- **suppliers** - Supplier accounts
- **products** - Products offered by suppliers
- **offers** - Discount offers combining multiple products
- **offer_products** - Many-to-many relationship between offers and products
- **paniers** - Shopping carts for clients
- **panier_items** - Items in shopping carts
- **orders** - Completed orders
- **order_items** - Items in orders

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Setup

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd BACKEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb unideals
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE unideals;
   \q
   ```

4. **Run database schema**
   ```bash
   psql -U postgres -d unideals -f database/schema.sql
   ```

5. **Configure environment variables**
   ```bash
   # On Windows PowerShell
   Copy-Item env.example .env
   
   # On Linux/Mac
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - Database credentials
   - JWT secret (use a strong random string)
   - Email configuration (for sending verification codes)

6. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000` (or the PORT specified in .env)

### Email Configuration

For Gmail:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password in `EMAIL_PASS` in your `.env` file

For other email providers, update `EMAIL_HOST` and `EMAIL_PORT` accordingly.

## API Endpoints

### Client Endpoints

#### Authentication
- `POST /api/client/register` - Register with university email
- `POST /api/client/verify` - Verify email with code
- `POST /api/client/set-password` - Set password after verification
- `POST /api/client/login` - Login with email and password

#### Products & Offers
- `GET /api/client/products` - Get all available products (requires auth)
- `GET /api/client/offers` - Get all active offers (requires auth)

#### Shopping Cart (Panier)
- `GET /api/client/panier` - Get client's panier (requires auth)
- `POST /api/client/panier/add` - Add product to panier (requires auth)
- `PUT /api/client/panier/update` - Update item quantity (requires auth)
- `DELETE /api/client/panier/remove/:item_id` - Remove item from panier (requires auth)
- `POST /api/client/panier/confirm` - Confirm panier and create order (requires auth)

#### Orders
- `GET /api/client/orders` - Get client's order history (requires auth)

### Supplier Endpoints

#### Authentication
- `POST /api/supplier/register` - Register new supplier
- `POST /api/supplier/login` - Login supplier

#### Products
- `POST /api/supplier/products` - Create product (requires supplier auth)
- `GET /api/supplier/products` - Get all supplier's products (requires supplier auth)
- `PUT /api/supplier/products/:id` - Update product (requires supplier auth)
- `DELETE /api/supplier/products/:id` - Delete product (requires supplier auth)

#### Offers
- `POST /api/supplier/offers` - Create offer (requires supplier auth)
- `GET /api/supplier/offers` - Get all supplier's offers (requires supplier auth)

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... }
}
```

## Deployment on Render

1. **Create a PostgreSQL database on Render**
   - Go to Render Dashboard
   - Create a new PostgreSQL database
   - Note the connection details

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add environment variables from your `.env` file

3. **Run database migration**
   - Use Render's PostgreSQL connection to run `database/schema.sql`
   - Or use a database migration tool

4. **Configure environment variables in Render**
   - Add all variables from `.env` to Render's environment variables
   - Update `DB_HOST`, `DB_NAME`, etc. with Render's PostgreSQL values
   - Set `NODE_ENV=production`

## Development

### Project Structure

```
BACKEND/
├── config/
│   ├── database.js      # PostgreSQL connection
│   └── email.js         # Email service configuration
├── database/
│   └── schema.sql       # Database schema
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── Client.js        # Client model
│   ├── Supplier.js      # Supplier model
│   ├── Product.js       # Product model
│   ├── Offer.js         # Offer model
│   ├── Panier.js        # Panier model
│   └── Order.js         # Order model
├── routes/
│   ├── client.js        # Client API routes
│   └── supplier.js      # Supplier API routes
├── utils/
│   ├── jwt.js           # JWT utilities
│   └── validation.js    # Validation utilities
├── .env.example         # Environment variables example
├── .gitignore
├── package.json
├── README.md
└── server.js            # Main server file
```

## Testing

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example registration flow:
1. `POST /api/client/register` with `{ "email": "student@university.edu" }`
2. Check email for verification code
3. `POST /api/client/verify` with `{ "email": "student@university.edu", "verification_code": "123456" }`
4. `POST /api/client/set-password` with `{ "email": "student@university.edu", "password": "password123" }`
5. Use the returned token for authenticated requests

## License

ISC


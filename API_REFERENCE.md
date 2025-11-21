# UniDeals Backend API Reference

## Base URL
- Local: `http://localhost:3000`
- Production: Your Render URL

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Client APIs

### 1. Register Client
**POST** `/api/client/register`

Request body:
```json
{
  "email": "student@university.edu"
}
```

Response:
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "data": {
    "email": "student@university.edu"
  }
}
```

### 2. Verify Email
**POST** `/api/client/verify`

Request body:
```json
{
  "email": "student@university.edu",
  "verification_code": "123456"
}
```

### 3. Set Password
**POST** `/api/client/set-password`

Request body:
```json
{
  "email": "student@university.edu",
  "password": "password123"
}
```

Response includes JWT token:
```json
{
  "success": true,
  "message": "Password set successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "client": {
      "id": "uuid",
      "email": "student@university.edu",
      "panier_id": "uuid"
    }
  }
}
```

### 4. Login
**POST** `/api/client/login`

Request body:
```json
{
  "email": "student@university.edu",
  "password": "password123"
}
```

### 5. Get Products
**GET** `/api/client/products` (requires auth)

### 6. Get Active Offers
**GET** `/api/client/offers` (requires auth)

### 7. Get Panier
**GET** `/api/client/panier` (requires auth)

### 8. Add to Panier
**POST** `/api/client/panier/add` (requires auth)

Request body:
```json
{
  "product_id": "uuid",
  "quantity": 2
}
```

### 9. Update Panier Item
**PUT** `/api/client/panier/update` (requires auth)

Request body:
```json
{
  "item_id": "uuid",
  "quantity": 3
}
```

### 10. Remove from Panier
**DELETE** `/api/client/panier/remove/:item_id` (requires auth)

### 11. Confirm Panier (Create Order)
**POST** `/api/client/panier/confirm` (requires auth)

### 12. Get Order History
**GET** `/api/client/orders` (requires auth)

---

## Supplier APIs

### 1. Register Supplier
**POST** `/api/supplier/register`

Request body:
```json
{
  "name": "Fast Food Restaurant",
  "email": "supplier@restaurant.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### 2. Login Supplier
**POST** `/api/supplier/login`

Request body:
```json
{
  "email": "supplier@restaurant.com",
  "password": "password123"
}
```

### 3. Create Product
**POST** `/api/supplier/products` (requires supplier auth)

Request body:
```json
{
  "name": "Burger",
  "image": "https://example.com/burger.jpg",
  "price": 9.99,
  "description": "Delicious burger"
}
```

### 4. Get Supplier Products
**GET** `/api/supplier/products` (requires supplier auth)

### 5. Update Product
**PUT** `/api/supplier/products/:id` (requires supplier auth)

Request body:
```json
{
  "name": "Updated Burger",
  "image": "https://example.com/burger2.jpg",
  "price": 10.99,
  "description": "Updated description",
  "available": true
}
```

### 6. Delete Product
**DELETE** `/api/supplier/products/:id` (requires supplier auth)

### 7. Create Offer
**POST** `/api/supplier/offers` (requires supplier auth)

Request body:
```json
{
  "name": "Combo Deal",
  "description": "Get burger and fries together",
  "discount_percentage": 15.0,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "product_ids": ["product-uuid-1", "product-uuid-2"]
}
```

### 8. Get Supplier Offers
**GET** `/api/supplier/offers` (requires supplier auth)

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Flow: Client Registration to Order

1. **Register**: `POST /api/client/register`
   ```json
   { "email": "student@university.edu" }
   ```

2. **Check email** for verification code

3. **Verify**: `POST /api/client/verify`
   ```json
   { "email": "student@university.edu", "verification_code": "123456" }
   ```

4. **Set Password**: `POST /api/client/set-password`
   ```json
   { "email": "student@university.edu", "password": "password123" }
   ```
   → Save the returned `token`

5. **Browse Products**: `GET /api/client/products`
   - Header: `Authorization: Bearer <token>`

6. **Add to Panier**: `POST /api/client/panier/add`
   - Header: `Authorization: Bearer <token>`
   ```json
   { "product_id": "uuid", "quantity": 2 }
   ```

7. **Confirm Order**: `POST /api/client/panier/confirm`
   - Header: `Authorization: Bearer <token>`

8. **View Orders**: `GET /api/client/orders`
   - Header: `Authorization: Bearer <token>`







# Order Update Instructions

## Changes Made

Orders now include **supplier/store information** (supplier_id and supplier_name) in each order item.

## Database Migration

If you already have existing tables, you need to run the migration:

```sql
-- Run this in PostgreSQL (pgAdmin Query Tool or psql)
-- File: database/migration_add_supplier_to_orders.sql
```

Or manually:

```sql
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id),
ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);

-- Update existing records
UPDATE order_items oi
SET 
  supplier_id = p.supplier_id,
  supplier_name = s.name
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
WHERE oi.product_id = p.id 
  AND (oi.supplier_id IS NULL OR oi.supplier_name IS NULL);
```

## New Features

### For Clients:
- Orders now show items grouped by **store/supplier name**
- Each order displays which store each item came from
- Example: "🏪 Burger King" with items below

### For Suppliers:
- New endpoint: `GET /api/supplier/orders`
- Suppliers can now see all orders containing their products
- Shows client email, order details, and items from their store

## Testing

1. **Create a new order** - The supplier information will be automatically included
2. **View client orders** - Items are grouped by supplier/store
3. **View supplier orders** - Suppliers see orders with their products

## API Changes

### Client Orders Response:
```json
{
  "items": [
    {
      "product_name": "Burger",
      "supplier_id": "uuid",
      "supplier_name": "Burger King",
      "quantity": 2,
      "price_at_time": 9.99
    }
  ]
}
```

### Supplier Orders Endpoint:
```
GET /api/supplier/orders
Authorization: Bearer <supplier_token>
```

Response includes:
- Order ID, total, status, date
- Client email
- Items from the supplier's store




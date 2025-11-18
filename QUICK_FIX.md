# Quick Fix for Order Confirmation Error

## If you're getting "server error confirming panier"

The error is likely because the database tables don't have the new columns yet. 

## Solution: Run the migrations

Run these SQL commands in your PostgreSQL database (pgAdmin or psql):

### 1. Add columns to orders table:
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_type VARCHAR(20) DEFAULT 'emsi',
ADD COLUMN IF NOT EXISTS etage VARCHAR(10),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
```

### 2. Add columns to order_items table:
```sql
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id),
ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);
```

### 3. Add columns to clients table:
```sql
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS location_type VARCHAR(20) DEFAULT 'emsi',
ADD COLUMN IF NOT EXISTS etage VARCHAR(10),
ADD COLUMN IF NOT EXISTS address TEXT;
```

### Or run the migration files:
```bash
# In pgAdmin or psql, run:
psql -U postgres -d unideals -f database/migration_add_location_fields.sql
psql -U postgres -d unideals -f database/migration_add_supplier_to_orders.sql
```

## After running migrations

Restart your server and try again. The code now has fallbacks, but it's better to have the columns for full functionality.




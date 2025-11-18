-- Migration: Add supplier information to order_items table
-- Run this if you already have existing tables

-- Add supplier_id and supplier_name columns to order_items
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id),
ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);

-- Update existing order_items with supplier information
UPDATE order_items oi
SET 
  supplier_id = p.supplier_id,
  supplier_name = s.name
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
WHERE oi.product_id = p.id 
  AND (oi.supplier_id IS NULL OR oi.supplier_name IS NULL);

-- Make supplier_id and supplier_name NOT NULL for new records
-- (We keep them nullable for existing records that might not have been updated)
ALTER TABLE order_items 
ALTER COLUMN supplier_id SET NOT NULL,
ALTER COLUMN supplier_name SET NOT NULL;




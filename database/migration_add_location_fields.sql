-- Migration: Add location and delivery fields to clients and orders
-- Run this if you already have existing tables

-- Add location fields to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS location_type VARCHAR(20) DEFAULT 'emsi',
ADD COLUMN IF NOT EXISTS etage VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add delivery fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_type VARCHAR(20) DEFAULT 'emsi',
ADD COLUMN IF NOT EXISTS etage VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);

-- If columns already exist with wrong size, alter them
ALTER TABLE clients ALTER COLUMN etage TYPE VARCHAR(50);
ALTER TABLE orders ALTER COLUMN etage TYPE VARCHAR(50);


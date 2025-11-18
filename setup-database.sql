-- Setup script for UniDeals database
-- Run this in PostgreSQL (pgAdmin Query Tool or psql)

-- 1. Set password for postgres user (if needed)
ALTER USER postgres WITH PASSWORD 'postgres';

-- 2. Create the database
CREATE DATABASE unideals;

-- 3. Connect to unideals database and run schema
-- (You'll need to run the schema.sql file separately after connecting to unideals)




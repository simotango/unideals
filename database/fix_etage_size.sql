-- Fix etage column size (if you already have the columns with VARCHAR(10))
-- Run this to increase the size to VARCHAR(50)

ALTER TABLE clients ALTER COLUMN etage TYPE VARCHAR(50);
ALTER TABLE orders ALTER COLUMN etage TYPE VARCHAR(50);




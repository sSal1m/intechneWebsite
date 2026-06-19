-- Drop name_surname column
ALTER TABLE volunteers DROP COLUMN IF EXISTS name_surname;

-- Add first_name and last_name columns
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS first_name VARCHAR(150) NOT NULL DEFAULT '';
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS last_name VARCHAR(150) NOT NULL DEFAULT '';

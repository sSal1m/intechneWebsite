-- 1. Split name in messages into first_name and last_name
ALTER TABLE messages ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Migrate existing data by splitting the original name field on the last space character
UPDATE messages 
SET 
  first_name = COALESCE(
    SUBSTRING(name FROM 1 FOR LENGTH(name) - POSITION(' ' IN REVERSE(name))),
    name
  ),
  last_name = CASE 
    WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM LENGTH(name) - POSITION(' ' IN REVERSE(name)) + 2)
    ELSE ''
  END
WHERE first_name IS NULL;

-- Apply constraints and defaults
ALTER TABLE messages ALTER COLUMN first_name SET DEFAULT '';
ALTER TABLE messages ALTER COLUMN last_name SET DEFAULT '';
ALTER TABLE messages ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE messages ALTER COLUMN last_name SET NOT NULL;

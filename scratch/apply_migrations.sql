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

  -- 2. Create site_settings table to store global configurations (like news sorting)
  CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value VARCHAR(255) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Seed default sorting configuration (by manual index)
  INSERT INTO site_settings (key, value) VALUES ('news_sort_order', 'index') ON CONFLICT (key) DO NOTHING;

  -- Enable Row Level Security (RLS) on site_settings
  ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

  -- Allow public read access to settings (needed for public site routing/rendering)
  DROP POLICY IF EXISTS "Ziyaretciler ayarlari okuyabilir" ON site_settings;
  CREATE POLICY "Ziyaretciler ayarlari okuyabilir" ON site_settings FOR SELECT USING (true);

  -- Restrict full management of settings to authenticated admin users only
  DROP POLICY IF EXISTS "Admin ayarlari yonetebilir" ON site_settings;
  CREATE POLICY "Admin ayarlari yonetebilir" ON site_settings 
      FOR ALL TO authenticated 
      USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr') 
      WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

-- job_applications tablosunda ad ve soyad alanlarını ayırma
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS first_name VARCHAR(150);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS last_name VARCHAR(150);

-- Mevcut veriyi güncelle (ad ve soyadı boşluktan ayır)
UPDATE job_applications 
SET 
  first_name = COALESCE(split_part(name, ' ', 1), 'Bilinmeyen'),
  last_name = COALESCE(
    CASE 
      WHEN position(' ' in name) > 0 THEN substring(name from position(' ' in name) + 1)
      ELSE 'Soyadı Yok'
    END, 
    'Bilinmeyen'
  )
WHERE name IS NOT NULL;

-- Yeni kolonları NOT NULL yap
ALTER TABLE job_applications ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE job_applications ALTER COLUMN last_name SET NOT NULL;

-- Eski name kolonunu kaldır
ALTER TABLE job_applications DROP COLUMN IF EXISTS name;

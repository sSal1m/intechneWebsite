-- 1. Açık Pozisyonlar Tablosu (job_positions)
CREATE TABLE IF NOT EXISTS job_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    department_tr VARCHAR(255) NOT NULL,
    department_en VARCHAR(255) NOT NULL,
    location_tr VARCHAR(255) NOT NULL,
    location_en VARCHAR(255) NOT NULL,
    type_tr VARCHAR(100) NOT NULL, -- e.g., Tam Zamanlı, Yarı Zamanlı
    type_en VARCHAR(100) NOT NULL,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    requirements_tr TEXT NOT NULL,
    requirements_en TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. İş Başvuruları Tablosu (job_applications)
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position_id UUID REFERENCES job_positions(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    cv_path TEXT NOT NULL, -- Storage bucket path
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Politikaları Etkinleştirme
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 4. job_positions RLS Kuralları
-- Ziyaretçiler okuyabilir
DROP POLICY IF EXISTS "Ziyaretciler pozisyonlari okuyabilir" ON job_positions;
CREATE POLICY "Ziyaretciler pozisyonlari okuyabilir" ON job_positions 
    FOR SELECT USING (true);

-- Admin yönetebilir
DROP POLICY IF EXISTS "Admin pozisyonlari yonetebilir" ON job_positions;
CREATE POLICY "Admin pozisyonlari yonetebilir" ON job_positions
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

-- 5. job_applications RLS Kuralları
-- Ziyaretçiler sadece ekleyebilir
DROP POLICY IF EXISTS "Ziyaretciler basvuru ekleyebilir" ON job_applications;
CREATE POLICY "Ziyaretciler basvuru ekleyebilir" ON job_applications
    FOR INSERT TO public WITH CHECK (true);

-- Admin okuyabilir ve yönetebilir
DROP POLICY IF EXISTS "Admin basvurulari okuyabilir ve yonetebilir" ON job_applications;
CREATE POLICY "Admin basvurulari okuyabilir ve yonetebilir" ON job_applications
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

-- 6. Supabase Storage 'cv_uploads' Private Bucket ve Politikaları
-- Bucket oluşturma
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv_uploads', 'cv_uploads', false, 614400, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Politikaları
DROP POLICY IF EXISTS "Ziyaretciler CV yukleyebilir" ON storage.objects;
CREATE POLICY "Ziyaretciler CV yukleyebilir" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id = 'cv_uploads');

DROP POLICY IF EXISTS "Admin CV okuyabilir" ON storage.objects;
CREATE POLICY "Admin CV okuyabilir" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'cv_uploads' AND (auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

DROP POLICY IF EXISTS "Admin CV silebilir veya guncelleyebilir" ON storage.objects;
CREATE POLICY "Admin CV silebilir veya guncelleyebilir" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'cv_uploads' AND (auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

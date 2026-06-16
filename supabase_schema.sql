-- Intechne Supabase Veritabanı Şeması
-- Bu betik, tabloları oluşturur, Satır Düzeyinde Güvenliği (RLS) aktif eder
-- ve admin@intechne.com.tr e-postasına özel politikaları yazar.

-- UUID fonksiyonları için uzantıyı etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabloları bağımlılık sırasına göre sil (Sıfırdan temiz kurulum yapabilmek için)
DROP TABLE IF EXISTS trash_bin;
DROP TABLE IF EXISTS news; -- Önce bağımlı tablo silinmeli (foreign key hatası almamak için)
DROP TABLE IF EXISTS news_categories;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS sliders;
DROP TABLE IF EXISTS interactive;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS corporate_identity;

-- 1. BAĞIMSIZ TABLOLAR

-- Haber Kategorileri Tablosu
CREATE TABLE news_categories (
    slug VARCHAR(50) PRIMARY KEY,
    name_tr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sayılarla Biz İstatistikleri Tablosu
CREATE TABLE stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_tr VARCHAR(100) NOT NULL,
    value_en VARCHAR(100) NOT NULL,
    label_tr VARCHAR(255) NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ekip Üyeleri Tablosu
CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role_tr VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    image_url TEXT,
    email VARCHAR(255),
    linkedin_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slaytlar (Hero Slider) Tablosu
CREATE TABLE sliders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    button_label_tr VARCHAR(100),
    button_label_en VARCHAR(100),
    href VARCHAR(255),
    image_url TEXT,
    stats JSONB NOT NULL DEFAULT '[]',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İnteraktif Yayınlar Tablosu
CREATE TABLE interactive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_url TEXT,
    video_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gelen İletişim Mesajları Tablosu
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    kvkk_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kurumsal Kimlik Tablosu
CREATE TABLE corporate_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'logo' veya 'guide'
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. BAĞIMLI TABLOLAR

-- Haberler Tablosu
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    excerpt_tr TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    content_tr TEXT NOT NULL,
    content_en TEXT NOT NULL,
    tag VARCHAR(50),
    category_slug VARCHAR(50) REFERENCES news_categories(slug) ON DELETE SET NULL,
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. SATIR DÜZEYİNDE GÜVENLİK (RLS) VE POLİTİKALAR

-- RLS'i tüm tablolarda etkinleştir
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_identity ENABLE ROW LEVEL SECURITY;

-- Politikalar: Ziyaretçi Okuma Yetkileri (Kamuya Açık Tablolar)
CREATE POLICY "Ziyaretciler kategorileri okuyabilir" ON news_categories FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler istatistikleri okuyabilir" ON stats FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler ekibi okuyabilir" ON team FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler slaytlari okuyabilir" ON sliders FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler yayinlari okuyabilir" ON interactive FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler haberleri okuyabilir" ON news FOR SELECT USING (true);
CREATE POLICY "Ziyaretciler kurumsal kimligi okuyabilir" ON corporate_identity FOR SELECT USING (true);

-- Politikalar: İletişim Formu Mesaj Ekleme Yetkisi (Kamuya Açık - Anonim dahil)
CREATE POLICY "Ziyaretciler mesaj iletebilir" ON messages FOR INSERT TO public WITH CHECK (true);

-- Politikalar: Sıkı Admin Yetkileri (Tüm Tablolar)
-- auth.jwt() ->> 'email' alanının kesinlikle 'admin@intechne.com.tr' olması gerekir.
CREATE POLICY "Admin kategorileri yonetebilir" ON news_categories
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin istatistikleri yonetebilir" ON stats
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin ekibi yonetebilir" ON team
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin slaytlari yonetebilir" ON sliders
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin yayinlari yonetebilir" ON interactive
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin haberleri yonetebilir" ON news
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin mesajlari okuyabilir" ON messages
    FOR SELECT TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin mesajlari guncelleyebilir" ON messages
    FOR UPDATE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin mesajlari silebilir" ON messages
    FOR DELETE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin kurumsal kimligi yonetebilir" ON corporate_identity
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');



-- H. MİGRASYON SORGUSU (MEVCUT VERİTABANINA UYGULAMAK İÇİN)
-- Mevcut veritabanında bu kolonu eklemek için Supabase SQL Editor'de aşağıdaki satırı çalıştırın:
-- ALTER TABLE corporate_identity ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- I. Çöp Kutusu Tablosu ve Politikaları
CREATE TABLE IF NOT EXISTS trash_bin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL, -- 'sliders', 'news', 'team', 'corporate_identity', 'interactive'
    entity_id UUID NOT NULL,
    original_data JSONB NOT NULL,
    file_paths TEXT[] DEFAULT '{}',
    deleted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trash_bin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin cop kutusunu yonetebilir" ON trash_bin
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'email'::text) = 'admin@intechne.com.tr'::text)
    WITH CHECK ((auth.jwt() ->> 'email'::text) = 'admin@intechne.com.tr'::text);



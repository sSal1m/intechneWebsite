-- Intechne Supabase Veritabanı Şeması ve Başlangıç Verileri (Seed Data)
-- Bu betik, tabloları oluşturur, Satır Düzeyinde Güvenliği (RLS) aktif eder,
-- admin@intechne.com.tr e-postasına özel politikaları yazar ve hiyerarşik sıralamada seed verilerini ekler.

-- UUID fonksiyonları için uzantıyı etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabloları bağımlılık sırasına göre sil (temiz kurulum için)
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS news_categories;
DROP TABLE IF EXISTS sliders;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS team;
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

-- Politikalar: İletişim Formu Mesaj Ekleme Yetkisi (Kamuya Açık)
CREATE POLICY "Ziyaretciler mesaj iletebilir" ON messages FOR INSERT WITH CHECK (true);

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

CREATE POLICY "Admin mesajlari yonetebilir" ON messages
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');

CREATE POLICY "Admin kurumsal kimligi yonetebilir" ON corporate_identity
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');


-- 4. HİYERARŞİK SIRALAMADA BAŞLANGIÇ VERİLERİ (SEED DATA)

-- A. Haber Kategorileri Seed Verisi
INSERT INTO news_categories (slug, name_tr, name_en) VALUES
('kategori-1', 'Girişimcilik ve İnovasyon', 'Entrepreneurship and Innovation'),
('kategori-2', 'Havacılık ve Uzay', 'Aerospace and Aviation'),
('kategori-3', 'Robotik ve Donanım', 'Robotics and Hardware'),
('kategori-4', 'Yazılım ve Yapay Zeka', 'Software and AI'),
('kategori-5', 'Eğitim ve Atölyeler', 'Education and Workshops'),
('kategori-6', 'Etkinlik ve Festivaller', 'Events and Festivals');

-- B. İstatistikler Seed Verisi
INSERT INTO stats (value_tr, value_en, label_tr, label_en, order_index) VALUES
('30', '30', 'Eğitim Sayısı', 'Number of Trainings', 1),
('5000', '5000', 'Intechne Akademi Öğrencisi', 'Intechne Academy Students', 2),
('10.000', '10.000', 'Cezeri Robot Ligi Yarışmacı', 'Cezeri Robot League Competitors', 3),
('35', '35', 'Toplam Etkinlik Sayısı', 'Total Number of Events', 4),
('30', '30', 'Paydaş Kurum', 'Partner Institutions', 5);

-- C. Haberler Seed Verisi
INSERT INTO news (title_tr, title_en, excerpt_tr, excerpt_en, content_tr, content_en, tag, category_slug, image_url, published_at) VALUES
(
  'Yıldız Robot Yarışları Tasarım Hackathon’u Başlıyor!',
  'Yildiz Robot Races Design Hackathon is Starting!',
  'Genç tasarımcıların ve yazılımcıların sınırlarını zorlayacağı Yıldız Robot Yarışları Tasarım Hackathon’u heyecanı başlıyor.',
  'The excitement of the Yildiz Robot Races Design Hackathon, where young designers and developers will push their limits, is starting.',
  'Genç tasarımcıların ve yazılımcıların sınırlarını zorlayacağı Yıldız Robot Yarışları Tasarım Hackathon’u heyecanı başlıyor.\n\nTeknoloji ve mühendislik alanındaki son gelişmeleri takip etmeye devam edin. Intechne olarak genç yeteneklerin gelişimini ve sektörel dönüşümü destekleyen projeler üretmeye devam ediyoruz. Detaylı bilgi ve güncel duyurular için sosyal medya kanallarımızı takip edebilirsiniz.',
  'The excitement of the Yildiz Robot Races Design Hackathon, where young designers and developers will push their limits, is starting.\n\nKeep following the latest developments in technology and engineering. As Intechne, we continue to produce projects that support the development of young talents and sectoral transformation. You can follow our social media channels for detailed information and updates.',
  'Öne Çıkan',
  'kategori-3',
  'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  NOW() - INTERVAL '1 day'
),
(
  'Gaziantep Drone Fest 26-27 Haziran’da Festival Park’ta!',
  'Gaziantep Drone Fest is on June 26-27 at Festival Park!',
  'Hız, teknoloji ve heyecan dolu Gaziantep Drone Fest, bu yıl 26-27 Haziran tarihlerinde Festival Park’ta kapılarını açıyor.',
  'Gaziantep Drone Fest, full of speed, technology, and excitement, opens its doors this year on June 26-27 at Festival Park.',
  'Hız, teknoloji ve heyecan dolu Gaziantep Drone Fest, bu yıl 26-27 Haziran tarihlerinde Festival Park’ta kapılarını açıyor.\n\nTeknoloji ve mühendislik alanındaki son gelişmeleri takip etmeye devam edin. Intechne olarak genç yeteneklerin gelişimini ve sektörel dönüşümü destekleyen projeler üretmeye devam ediyoruz. Detaylı bilgi ve güncel duyurular için sosyal medya kanallarımızı takip edebilirsiniz.',
  'Gaziantep Drone Fest, full of speed, technology, and excitement, opens its doors this year on June 26-27 at Festival Park.\n\nKeep following the latest developments in technology and engineering. As Intechne, we continue to produce projects that support the development of young talents and sectoral transformation. You can follow our social media channels for detailed information and updates.',
  'Duyuru',
  'kategori-2',
  'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  NOW()
),
(
  'Intechne Akademi Yeni Dönem Başvuruları Kabul Edilmeye Başlandı',
  'Applications for the New Semester of Intechne Academy Have Started',
  'Uygulamalı eğitimlerle donanımlı teknoloji uzmanları yetiştiren Intechne Akademi yeni dönem kayıt detayları duyuruldu.',
  'The registration details for the new semester of Intechne Academy, which trains technology experts equipped with hands-on training, have been announced.',
  'Uygulamalı eğitimlerle donanımlı teknoloji uzmanları yetiştiren Intechne Akademi yeni dönem kayıt detayları duyuruldu.\n\nTeknoloji ve mühendislik alanındaki son gelişmeleri takip etmeye devam edin. Intechne olarak genç yeteneklerin gelişimini ve sektörel dönüşümü destekleyen projeler üretmeye devam ediyoruz. Detaylı bilgi ve güncel duyurular için sosyal medya kanallarımızı takip edebilirsiniz.',
  'The registration details for the new semester of Intechne Academy, which trains technology experts equipped with hands-on training, have been announced.\n\nKeep following the latest developments in technology and engineering. As Intechne, we continue to produce projects that support the development of young talents and sectoral transformation. You can follow our social media channels for detailed information and updates.',
  'Akademi',
  'kategori-5',
  'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  NOW() - INTERVAL '4 days'
),
(
  'Robonex Robot Ligi Bölgesel Eleme Sonuçları Açıklandı',
  'Robonex Robot League Regional Qualifiers Results Announced',
  'Türkiye genelinde düzenlenen bölgesel elemelerin ardından büyük finale katılmaya hak kazanan robot takımları belli oldu.',
  'Following the regional qualifiers held across Turkey, the robot teams qualified for the grand final have been determined.',
  'Türkiye genelinde düzenlenen bölgesel elemelerin ardından büyük finale katılmaya hak kazanan robot takımları belli oldu.\n\nTeknoloji ve mühendislik alanındaki son gelişmeleri takip etmeye devam edin. Intechne olarak genç yeteneklerin gelişimini ve sektörel dönüşümü destekleyen projeler üretmeye devam ediyoruz. Detaylı bilgi ve güncel duyurular için sosyal medya kanallarımızı takip edebilirsiniz.',
  'Following the regional qualifiers held across Turkey, the robot teams qualified for the grand final have been determined.\n\nKeep following the latest developments in technology and engineering. As Intechne, we continue to produce projects that support the development of young talents and sectoral transformation. You can follow our social media channels for detailed information and updates.',
  'Robotik',
  'kategori-3',
  'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  NOW() - INTERVAL '7 days'
),
(
  'Tech & Chill Fest 2026 Biletleri Biletix Üzerinden Satışa Sunuldu',
  'Tech & Chill Fest 2026 Tickets Go on Sale via Biletix',
  'Sosyal yaşam ile teknolojinin harmanlandığı, e-spor ve konserlerle dolu festivalde yerinizi şimdiden alın.',
  'Take your place now in the festival filled with e-sports and concerts, where social life blends with technology.',
  'Sosyal yaşam ile teknolojinin harmanlandığı, e-spor ve konserlerle dolu festivalde yerinizi şimdiden alın.\n\nTeknoloji ve mühendislik alanındaki son gelişmeleri takip etmeye devam edin. Intechne olarak genç yeteneklerin gelişimini ve sektörel dönüşümü destekleyen projeler üretmeye devam ediyoruz. Detaylı bilgi ve güncel duyurular için sosyal medya kanallarımızı takip edebilirsiniz.',
  'Take your place now in the festival filled with e-sports and concerts, where social life blends with technology.\n\nKeep following the latest developments in technology and engineering. As Intechne, we continue to produce projects that support the development of young talents and sectoral transformation. You can follow our social media channels for detailed information and updates.',
  'Festival',
  'kategori-6',
  'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  NOW() - INTERVAL '11 days'
);

-- D. Ekip Üyeleri Seed Verisi
INSERT INTO team (name, role_tr, role_en, email, linkedin_url, order_index) VALUES
('Ömer Akbulut', 'Genel Koordinatör', 'General Coordinator', 'omer.akbulut@intechne.com.tr', 'https://linkedin.com/', 1),
('Seha Salim', 'Teknik Koordinatör', 'Technical Coordinator', 'seha.salim@intechne.com.tr', 'https://linkedin.com/', 2);

-- E. Slaytlar Seed Verisi
INSERT INTO sliders (title_tr, title_en, description_tr, description_en, button_label_tr, button_label_en, href, stats, order_index) VALUES
(
  'Cezeri Robot Ligi',
  'Cezeri Robot League',
  'Mühendisliği kıyasıya bir spora dönüştürmek ve Türkiye''deki genç yetenekleri küresel rekabete hazırlamak hedefiyle düzenlenen devasa bir robotik ligidir.',
  'A massive robotics league organized with the goal of turning engineering into a competitive sport and preparing young talents in Turkey for global competition.',
  'Daha Fazla Bilgi',
  'More Info',
  '/projelerimiz/cezeri-robot-ligi',
  '[{"value": "3. Yıl", "label": ""}, {"value": "6", "label": "Yarışma"}, {"value": "10.000", "label": "Yarışmacı"}]'::jsonb,
  1
),
(
  'Intechne Akademi',
  'Intechne Academy',
  'Genç yetenekleri teorik eğitimin sınırlarından çıkarıp gerçek dünya projeleriyle buluşturmak ve sektöre donanımlı mühendisler kazandırmak hedefiyle kurulan uygulamalı teknoloji akademisidir.',
  'An applied technology academy founded with the goal of taking young talents out of the limits of theoretical education and bringing them together with real-world projects.',
  'Daha Fazla Bilgi',
  'More Info',
  '/projelerimiz/intechne-akademi',
  '[{"value": "5", "label": "İl"}, {"value": "30+", "label": "Atölye"}, {"value": "5.000+", "label": "Öğrenci"}]'::jsonb,
  2
),
(
  '2026 Vex Robotics Türkiye Şampiyonası',
  '2026 Vex Robotics Turkey Championship',
  'Dünyanın en prestijli STEM programlarından birini Türkiye arenasına taşıyarak, genç yeteneklerin mekanik tasarım ve takım çalışması becerilerini küresel standartlarda test ettiği ulusal robotik şampiyonasıdır.',
  'A national robotics championship that tests the mechanical design and teamwork skills of young talents at global standards by carrying one of the world''s most prestigious STEM programs into the Turkey arena.',
  'Daha Fazla Bilgi',
  'More Info',
  '/projelerimiz/cezeri-robot-ligi',
  '[{"value": "18", "label": "şehir"}, {"value": "3500", "label": "Yarışmacı"}]'::jsonb,
  3
),
(
  'Robonex Robot Ligi',
  'Robonex Robot League',
  'Yeni nesil otonom sistemler ve robotik teknolojilerin kıyasıya yarıştığı, genç mühendisleri geleceğin teknolojilerine hazırlamak hedefiyle düzenlenen dinamik bir rekabet arenasıdır.',
  'A dynamic competition arena organized with the goal of preparing young engineers for the technologies of the future, where new generation autonomous systems and robotics technologies compete fiercely.',
  'Daha Fazla Bilgi',
  'More Info',
  '/projelerimiz/robonex-robot-ligi',
  '[{"value": "1. Yıl", "label": ""}, {"value": "3", "label": "Yarışma"}, {"value": "6000", "label": "Yarışmacı"}]'::jsonb,
  4
);

-- F. İnteraktif Yayınlar Seed Verisi
INSERT INTO interactive (title_tr, title_en, description_tr, description_en, category, type, video_url) VALUES
('Intechne Robotik Eko-Sistemi Tanıtım Videosu', 'Intechne Robotics Eco-System Introduction Video', 'Intechne bünyesinde kurulan ve yürütülen robotik ligleri, festivaller ve akademi programlarının genel ekosistem tanıtım belgeseli.', 'A general ecosystem documentary of robotics leagues, festivals, and academy programs established and managed under Intechne.', 'projeler', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

-- G. Kurumsal Kimlik Seed Verisi
INSERT INTO corporate_identity (title_tr, title_en, type, file_url) VALUES
('Intechne Logo', 'Intechne Logo', 'logo', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg'),
('Intechne Kurumsal Kimlik Kılavuzu', 'Intechne Corporate Identity Guide', 'guide', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg'),
('Cezeri Robot Ligi Logo', 'Cezeri Robot League Logo', 'logo', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg'),
('Robonex Robot Ligi Logo', 'Robonex Robot League Logo', 'logo', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg'),
('Tech & Chill Fest Logo', 'Tech & Chill Fest Logo', 'logo', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg'),
('Intechne Akademi Logo', 'Intechne Academy Logo', 'logo', 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg');

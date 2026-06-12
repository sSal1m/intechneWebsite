# Intechne Web Sitesi Admin Paneli Gereksinimleri Raporu

Bu rapor, Intechne web sitesinin dinamik bir yapıya dönüştürülmesi ve içeriklerin bir Yönetim Paneli (CMS) üzerinden güncellenebilmesi durumunda ihtiyaç duyulacak modülleri, yönetilebilir alanları ve teknik gereksinimleri detaylandırmaktadır.

---

## 1. Yönetilebilir Modüller ve Alanlar

Mevcut sayfa yapıları ve bileşenler incelendiğinde, admin panelinde yer alması gereken temel yönetim modülleri şunlardır:

### 1.1. Slayt ve İstatistik Yönetimi (Ana Sayfa)
Ana sayfada kullanıcıyı karşılayan görsel ve sayısal verilerin güncellenmesini kapsar.
* **Slider Yönetimi:** [HeroSlider.tsx](file:///c:/Users/seha/Desktop/t3c2/components/home/HeroSlider.tsx) bileşenindeki dönen slaytların görsel, başlık, açıklama metni, buton yazısı ve buton yönlendirme linklerinin eklenmesi, silinmesi ve sıralanması.
* **İstatistikler (Sayılarla Biz):** [StatsSection.tsx](file:///c:/Users/seha/Desktop/t3c2/components/home/StatsSection.tsx) bileşeninde yer alan sayısal verilerin ve açıklamaların güncellenmesi.

### 1.2. Haber ve Duyuru Yönetimi
Kurumsal haber ve duyuruların dinamik olarak yayınlanmasını kapsar.
* **Haber Yönetimi:** [NewsSection.tsx](file:///c:/Users/seha/Desktop/t3c2/components/home/NewsSection.tsx) ve haber detay sayfalarındaki içeriklerin yönetimi.
* **İçerik Alanları:** Haber başlığı, özet bilgi, zengin metin (HTML/WYSIWYG) haber içeriği, kapak görseli, yayınlanma tarihi ve yayın durumu (taslak/yayında).

### 1.3. Ekip Yönetimi
Kuruluş bünyesindeki yönetim ve çalışma ekibinin listelenmesini kapsar.
* **Ekip Üyeleri:** [TeamGrid.tsx](file:///c:/Users/seha/Desktop/t3c2/components/about/TeamGrid.tsx) bileşeninde listelenen kişilerin yönetimi.
* **İçerik Alanları:** İsim, unvan, profil fotoğrafı, e-posta adresi ve LinkedIn bağlantılarının eklenmesi, güncellenmesi veya silinmesi.

### 1.4. Kurumsal Kimlik Dosyaları
Basın ve iş ortakları için indirilebilir materyallerin güncellenmesini kapsar.
* **Kurumsal Dosyalar:** [CorporateIdentityGrid.tsx](file:///c:/Users/seha/Desktop/t3c2/components/about/CorporateIdentityGrid.tsx) bileşenindeki indirilebilir kurumsal kimlik ögelerinin (kılavuzlar, logolar vb.) yönetimi.
* **İçerik Alanları:** Dosya başlığı, açıklaması, görseli ve dosya indirme bağlantısı (PDF, ZIP vb. dosya yükleme desteğiyle).

### 1.5. İnteraktif İçerik ve Yayınlar
Dönemsel faaliyet raporları, bültenler ve belgelerin listelenmesini kapsar.
* **Yayın Yönetimi:** [InteractiveGrid.tsx](file:///c:/Users/seha/Desktop/t3c2/components/interactive/InteractiveGrid.tsx) bileşenindeki kategorilerin ve bu kategorilere ait yayınların yönetimi.
* **İçerik Alanları:** Kategori adı, yayın başlığı, kapak görseli ve indirilebilir PDF/dosya linki.

### 1.6. Marka ve Partner Yönetimi
İş ortakları ve markaların logolarının güncellenmesini kapsar.
* **Markalar:** [BrandsTabSection.tsx](file:///c:/Users/seha/Desktop/t3c2/components/home/BrandsTabSection.tsx) ve [BrandsLogoRow.tsx](file:///c:/Users/seha/Desktop/t3c2/components/home/BrandsLogoRow.tsx) bileşenlerindeki marka kategorilerinin, logolarının ve yönlendirme adreslerinin yönetimi.

### 1.7. İletişim Bilgileri ve Form Mesajları
Kullanıcı etkileşiminin ve kurumsal iletişim bilgilerinin takibini kapsar.
* **İletişim ve Harita:** [ContactCards.tsx](file:///c:/Users/seha/Desktop/t3c2/components/contact/ContactCards.tsx), [ContactMap.tsx](file:///c:/Users/seha/Desktop/t3c2/components/contact/ContactMap.tsx) ve [Footer.tsx](file:///c:/Users/seha/Desktop/t3c2/components/layout/Footer.tsx) içerisindeki adres, telefon, e-posta bilgileri ve harita konum kodunun güncellenmesi.
* **Gelen Mesajlar:** [ContactForm.tsx](file:///c:/Users/seha/Desktop/t3c2/components/contact/ContactForm.tsx) üzerinden gönderilen form verilerinin (ad, soyad, e-posta, konu, mesaj, KVKK onay durumu) admin panelinde listelenmesi, okunma durumunun takibi ve arşivlenmesi.

### 1.8. Dil ve Genel SEO Yönetimi
Çoklu dil desteğinin sürdürülebilirliğini ve arama motoru optimizasyonunu kapsar.
* **Çoklu Dil Çevirileri:** Türkçe ve İngilizce dillerindeki tüm dinamik alanların ve çevirilerin admin panelinden yönetilebilmesi.
* **SEO Ayarları:** Her sayfa için meta başlığı (meta title), meta açıklaması (meta description) ve anahtar kelimelerin yönetilmesi.

---

## 2. Teknik Altyapı ve Veri Yapısı Gereksinimleri

Bu alanların yönetilebilmesi için arka planda aşağıdaki teknik bileşenlerin kurulması gerekir:

1. **Veritabanı (Database):** Slaytlar, haberler, ekip üyeleri, dosyalar ve gelen mesajlar için tablolar oluşturulmalıdır (örn. PostgreSQL, MySQL).
2. **API Katmanı (Backend API):** Next.js API Routes kullanılarak veya harici bir backend (Node.js, Go vb.) üzerinden verilerin güvenli bir şekilde çekilmesini ve güncellenmesini sağlayan RESTful / GraphQL servisleri yazılmalıdır.
3. **Kimlik Doğrulama (Authentication & Authorization):** Sadece yetkili yöneticilerin panele erişebilmesi için JWT, NextAuth.js veya benzeri bir kütüphane ile oturum yönetimi kurulmalıdır.
4. **Medya Sunucusu (Media Storage):** Yüklenen görsellerin, PDF'lerin ve kılavuzların barındırılması için bir nesne depolama servisi (AWS S3, Supabase Storage, Cloudinary vb.) entegre edilmelidir.

# Intechne CMS İçerik Yönetim Alanları Raporu

Bu rapor, Intechne web sitesinin yönetim paneli (CMS) üzerinden güncellenebilen, silinebilen veya yeni içerik eklenebilen tüm dinamik alanları listeler. Yöneticinizin içerik stratejisini belirlemesine yardımcı olmak amacıyla alanların kabul ettiği veri türleri (Metin, Görsel, Video, Döküman) detaylıca açıklanmıştır.

---

## 💻 1. Ana Sayfa Slayt Yönetimi (Hero Sliders)
Ziyaretçilerin web sitesine girdiğinde karşılaştığı ilk büyük görsel ve metin alanıdır. Türkçe ve İngilizce dil desteği mevcuttur.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **Slayt Görseli** | Görsel (`.jpg`, `.png`, `.webp`, `.avif`) | Arka planda tam ekran görüntülenecek yüksek çözünürlüklü görsel. |
| **Slayt Başlığı (TR/EN)** | Metin | Slaytın ortasında kalın yazı tipiyle gösterilecek ana başlık. |
| **Slayt Açıklaması (TR/EN)** | Metin | Başlığın altında yer alan kısa tanıtım/bilgi metni. |
| **Buton Metni (TR/EN)** | Metin | Slayt üzerindeki eylem butonunun yazısı (Örn: "Keşfet", "İletişime Geç"). |
| **Buton Bağlantısı (URL)** | Metin (Bağlantı) | Butona tıklandığında yönlendirilecek iç sayfa yolu (örn: `/iletisim`) veya dış bağlantı. |
| **Sıra Numarası** | Sayı | Slaytların soldan sağa hangi sırayla kayacağını belirler. |

---

## 📊 2. İstatistik Yönetimi (Sayılarla Biz)
Ana sayfada, projenin büyüklüğünü ve başarılarını gösteren dinamik sayısal kartlardır.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **İstatistik Değeri** | Metin / Sayı | Kartta büyük puntolarla gösterilecek değer (Örn: "5.000+", "18", "1. Yıl"). |
| **İstatistik Etiketi (TR/EN)** | Metin | Değerin altında yer alan açıklama metni (Örn: "Öğrenci", "Şehir", "Yarışma"). |
| **Sıra Numarası** | Sayı | İstatistik kartlarının soldan sağa sıralanma sırasını belirler. |

---

## 📰 3. Haber Yönetimi (News)
Tüm kurumsal haberlerin, duyuruların ve etkinliklerin yönetildiği bölümdür. Zengin medya desteği sayesinde haber detaylarına video veya ek resimler eklenebilir.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **Haber Kapak Görseli** | Görsel (`.jpg`, `.png`, `.webp`, `.avif`) | Haber kartlarında ve detay sayfasının başında gösterilecek ana görsel. |
| **Haber Başlığı (TR/EN)** | Metin | Haberin başlığı. |
| **Haber İçeriği (TR/EN)** | Metin (Zengin Metin) | Haberin detay metni. **Zengin Medya Desteği:** İçerik içerisine ayrı satırlarda resim linkleri, video linkleri veya YouTube video URL'leri eklendiğinde sistem bunları otomatik olarak görsel/video oynatıcıya dönüştürür. |
| **Kategori Seçimi** | Seçim Listesi | Haberin ait olduğu kategori (Örn: "Duyuru", "Akademi", "Robotik", "Festival"). |
| **Haber Etiketleri** | Çoklu Seçim | Habere eklenecek filtreleme etiketleri (Örn: "Öne Çıkan", "Duyuru"). |
| **Yayınlanma Tarihi** | Tarih Seçici | Haberin yayınlandığı veya yayınlanacağı tarih. |

---

## 👥 4. Ekip Yönetimi (Team)
Kurumsal sayfadaki "Ekibimiz" alanında listelenecek personellerin ve yöneticilerin yönetildiği alandır.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **Profil Resmi** | Görsel (`.jpg`, `.png`, `.webp`) | Ekip üyesinin dairesel profil kartında gösterilecek fotoğrafı. |
| **İsim / Soyisim** | Metin | Ekip üyesinin adı ve soyadı. |
| **Unvan (TR/EN)** | Metin | Üyenin şirketteki pozisyonu / rolü (Örn: "Kurucu Ortak & CEO", "Yazılım Mühendisi"). |
| **E-posta Adresi** | Metin (E-posta) | İletişim amaçlı e-posta adresi. |
| **LinkedIn Profil Linki** | Metin (Bağlantı) | Ekip üyesinin profesyonel LinkedIn profili yönlendirme bağlantısı. |
| **Sıra Numarası** | Sayı | Ekip üyelerinin sayfada hangi öncelikle listeleneceğini belirler. |

---

## 📚 5. İnteraktif Yayınlar (Interactive Publications)
Projeler, raporlar, sunumlar ve tanıtım videoları gibi etkileşimli içeriklerin yayınlandığı alandır.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **Yayın Kapak Görseli** | Görsel (`.jpg`, `.png`, `.webp`) | İnteraktif yayının kart görseli (Örn: Rapor kapağı veya video önizleme resmi). |
| **Yayın Başlığı (TR/EN)** | Metin | Yayının ana başlığı. |
| **Yayın Açıklaması (TR/EN)** | Metin | Yayına dair kısa özet açıklama. |
| **Kategori** | Seçim Listesi | Yayının ait olduğu alan (Örn: "projeler", "raporlar", "yayinlar"). |
| **Yayın Türü** | Seçim Listesi | İçeriğin türü: **Video** (YouTube veya MP4), **Döküman** (PDF veya dosya bağlantısı) veya **Etkileşimli** (Web bağlantısı). |
| **Yönlendirme URL'si** | Metin (Bağlantı) | Tür 'video' ise YouTube video linki; 'döküman' ise PDF/dosya yolu; 'etkileşimli' ise harici web sitesi bağlantısı. |
| **Sıra Numarası** | Sayı | Yayınların sayfadaki sıralama düzeni. |

---

## 📂 6. Kurumsal Kimlik (Corporate Identity)
Şirketin resmi logoları, kullanım kılavuzları, PDF dökümanları ve marka varlıklarının paylaşıldığı dinamik alandır.

| Alan Adı | Veri Türü | Açıklama |
| :--- | :---: | :--- |
| **Kimlik Öğesi / Dosya** | Dosya / Görsel (`.pdf`, `.png`, `.jpg`, `.svg`) | İndirilebilir döküman veya görsel (logolar için SVG/PNG tercih edilir). |
| **Öge Başlığı (TR/EN)** | Metin | Dosyanın adı veya kurumsal kimlik ögesinin başlığı (Örn: "Yatay Logo - Renkli"). |
| **Öge Açıklaması (TR/EN)** | Metin | Dosyanın kullanım amacını açıklayan kısa açıklama (Örn: "Koyu arka planlar için tercih edilen SVG logo formatı."). |
| **Öge Türü** | Seçim Listesi | İçeriğin türü: **Logo** (görsel olarak listelenir) veya **Döküman** (indirilebilir döküman ikonuyla listelenir). |
| **Sıra Numarası** | Sayı | Ögelerin sayfadaki listelenme önceliğini belirler. |

---

## ⚙️ 7. Diğer Destekleyici Sistemler
* **Gelen Mesajlar (Messages):** İletişim formundan gelen mesajlar (Ad, E-posta, Telefon, Konu, Mesaj İçeriği ve Gönderim Saati) panelde anlık olarak listelenir ve yöneticiniz tarafından okunup temizlenebilir.
* **Çöp Kutusu (Trash Bin):** Yanlışlıkla silinen slayt, haber, ekip üyesi, döküman veya mesajların 24 saat boyunca saklandığı alandır. Yöneticiniz bu süre zarfında silinen verileri tek tıkla geri yükleyebilir veya kalıcı olarak sistemden silebilir.

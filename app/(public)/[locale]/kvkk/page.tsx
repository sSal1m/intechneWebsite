import { Link } from '@/src/i18n/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'KVKK Clarification Text' : 'KVKK Aydınlatma Metni',
    description: isEn 
      ? 'INTECHNE TECHNOLOGY INC. Personal Data Protection Law Clarification Text' 
      : 'INTECHNE TEKNOLOJİ A.Ş. Kişisel Verilerin Korunması Kanunu Aydınlatma Metni',
  };
}

export default async function KvkkPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const t = {
    title: isEn ? 'KVKK Clarification Text' : 'KVKK Aydınlatma Metni',
    home: isEn ? 'Home' : 'Anasayfa',
    introText: 'İşbu KVKK Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. Maddesi kapsamında veri sorumlusu sıfatıyla INTECHNE TEKNOLOJİ ANONİM ŞİRKETİ tarafından hazırlanmıştır.',
    dataControllerTitle: 'Veri Sorumlusu',
    processedDataTitle: 'İşlenen Kişisel Veriler',
    purposesTitle: 'Kişisel Verilerin İşlenme Amaçları',
    legalReasonsTitle: 'Hukuki Sebepler',
    transferTitle: 'Aktarım',
    methodTitle: 'Toplama Yöntemi',
    rightsTitle: 'İlgili Kişi Hakları',
    methodologyTitle: 'Başvuru Usulü',
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 text-slate-800 font-sans">
      {/* Header Banner Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-12 md:mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {t.home}
            </Link>
            <span>/</span>
            <span>{t.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black">
            {t.title}
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-sm flex flex-col gap-10">
          
          {/* Intro statement */}
          <div className="p-5 bg-[#01c1d3]/5 border-l-4 border-[#01c1d3] rounded-r-2xl">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
              {t.introText}
            </p>
          </div>

          {/* 1. Veri Sorumlusu */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.dataControllerTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Unvanı</span>
                <span className="font-bold text-slate-800">INTECHNE TEKNOLOJİ ANONİM ŞİRKETİ</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Vergi Dairesi ve No</span>
                <span className="font-bold text-slate-800">Ümraniye Vergi Dairesi / 4651617884</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mersis No</span>
                <span className="font-bold text-slate-800">0465161788400001</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Elektronik Tebligat Adresi</span>
                <span className="font-bold text-slate-800">25838 - 43551 - 12850</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100 md:col-span-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Adresi</span>
                <span className="font-bold text-slate-800">
                  Ünalan Mah. Ünalan Cad. No: 1 D: 1 Üsküdar / İSTANBUL
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Telefon</span>
                <span className="font-bold text-slate-800">
                  Belirtilmemiş
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Elektronik Posta Adresi</span>
                <span className="font-bold text-[#01c1d3] hover:underline">
                  <a href="mailto:off-season@intechne.com.tr">off-season@intechne.com.tr</a>
                </span>
              </div>
            </div>
          </section>

          {/* 2. İşlenen Kişisel Veriler */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.processedDataTitle}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 mt-2 font-medium">
              {[
                'Katılımcı kimlik ve iletişim bilgileri',
                'Veli kimlik ve iletişim bilgileri',
                'Okul, takım, sınıf ve danışman bilgileri',
                'Başvuru ve kayıt bilgileri',
                'Yarışma kategorisi, takım eşleştirme ve teknik başvuru bilgileri',
                'Etkinliğe giriş-çıkış, yoklama ve organizasyon kayıtları (varsa)',
                'Fotoğraf, video ve ses kayıtları (tanıtım amaçlı kullanım bakımından ayrıca açık rıza alınması gereken haller saklıdır.)',
                'Finans / fatura / ödeme bilgileri (varsa)',
                'Talep, şikâyet ve başvuru kayıtları'
              ].map((item, idx) => (
                <li key={idx} className="bg-slate-50/55 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#01c1d3] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Kişisel Verilerin İşlenme Amaçları */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.purposesTitle}
            </h2>
            <div className="grid grid-cols-1 gap-2.5 text-sm text-slate-700 mt-2 font-medium">
              {[
                'Başvuru ve kayıt işlemlerinin alınması ve değerlendirilmesi',
                'Katılım uygunluğunun belirlenmesi',
                'Takım, kategori, saha ve organizasyon operasyonunun yürütülmesi',
                'Katılımcı ve veli ile iletişim kurulması',
                'Etkinlik kurallarının uygulanması ile güvenliğin ve düzenin sağlanması',
                'Ödül, sertifika, katılım belgesi ve raporlama süreçlerinin yürütülmesi',
                'Faturalama, muhasebe ve finans süreçlerinin yürütülmesi',
                'Hukuki yükümlülüklerin yerine getirilmesi',
                'Yetkili kurum ve kuruluşlardan gelen taleplerin karşılanması',
                'Talep, şikâyet ve başvuruların yönetimi',
                'Açık rıza verilmişse tanıtım ve kurumsal iletişim faaliyetlerinin yürütülmesi'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-[#01c1d3]/10 text-[#01c1d3] font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Hukuki Sebepler */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.legalReasonsTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium mt-2">
              Kişisel verileriniz; bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla gerekli olması, veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması, bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması, ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için veri işlemenin zorunlu olması ve yalnızca açık rıza gerektiren işlemler bakımından açık rıza hukuki sebeplerine dayanılarak işlenebilecektir.
            </p>
          </section>

          {/* 5. Aktarım */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.transferTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium mt-2">
              Kişisel verileriniz; işleme amaçlarıyla sınırlı olmak üzere etkinliğin birlikte düzenlendiği kurum ve kuruluşlara, teknik altyapı, yazılım, depolama, iletişim, baskı, lojistik ve destek hizmeti alınan tedarikçilere, muhasebe, hukuk ve denetim danışmanlarına, yetkili kamu kurum ve kuruluşlarına ve kanunen yetkili özel hukuk kişilerine aktarılabilecektir.
            </p>
          </section>

          {/* 6. Toplama Yöntemi */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.methodTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium mt-2">
              Kişisel veriler; fiziki başvuru formları, online kayıt formları, e-posta, telefon, internet sitesi, mobil uygulama, etkinlik alanı kayıtları, kamera sistemleri, sözlü başvurular ve benzeri kanallar aracılığıyla otomatik veya kısmen otomatik yollarla toplanabilmektedir.
            </p>
          </section>

          {/* 7. İlgili Kişi Hakları */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.rightsTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium mt-2">
              Bu kapsamda dilediğiniz zaman Kanunun 11. maddesi kapsamında Veri Sorumlusu olan Şirketimize başvurarak aşağıda belirtilen hakları kullanabilirsiniz. Buna göre kişisel verisi işlenen tüm şahıslar;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 mt-2 font-medium">
              {[
                'Kendisine ait kişisel verilerin işlenip işlenmediğini öğrenme',
                'İşlenen kişisel verileri varsa bunlara ilişkin bilgi talep etme',
                'Kişisel verilerin işlenme amacını ve bu verilerin amaca uygun kullanıp kullanılmadığını öğrenme',
                'Kişisel verilerin aktarıldığı üçüncü kişileri bilme',
                'Kişisel verilerindeki hataların düzeltilmesini ve eğer aktarım yapılmışsa ilgili üçüncü kişiden bu düzeltmenin istenmesini talep etme',
                'Kişisel verilerin işlenmesini gerektiren sebeplerin ortadan kalkması halinde bu verilerin silinmesini, yok edilmesini ya da anonim hale getirilmesini ve eğer aktarım yapılmışsa bu talebin aktarılan üçüncü kişiye iletilmesini isteme',
                'İşlenen verilerin neticesinde kişi ile ilintili olumsuz bir sonuç çıkmasına itiraz etme',
                'Kanun’a aykırı veri işleme nedeniyle zararının ortaya çıkması halinde zararlarını yasalar çerçevesinde talep etme'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#01c1d3] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Başvuru Usulü */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">
              {t.methodologyTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium mt-2">
              KVKK kapsamındaki başvurularınızı, INTECHNE’ye yazılı olarak,{' '}
              <a href="mailto:off-season@intechne.com.tr" className="text-[#01c1d3] font-bold hover:underline">
                off-season@intechne.com.tr
              </a>{' '}
              adresinden veya şirketin ileride duyuracağı başvuru kanalları aracılığıyla iletebilirsiniz.
            </p>
          </section>

          {/* Signature info / dates */}
          <div className="border-t border-slate-100 pt-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aydınlatma Metni Tarihi</span>
              <span className="font-bold text-slate-800">...</span>
            </div>
            <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Veli Ad Soyad / İmza</span>
                <span className="font-bold text-slate-800">...</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Katılımcı Öğrenci Ad Soyad / İmza</span>
                <span className="font-bold text-slate-800">...</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

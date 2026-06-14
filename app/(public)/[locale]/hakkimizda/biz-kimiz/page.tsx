import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Who We Are' : 'Biz Kimiz?',
  };
}

export default async function BizKimizPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header inside Content */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-brand-navy">
          {isEn ? 'Who We Are' : 'Biz Kimiz?'}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      {/* Hero Intro Paragraph */}
      <div className="bg-primary-light/40 border-l-4 border-primary p-6 md:p-8 rounded-r-3xl">
        <p className="text-brand-navy font-semibold text-lg md:text-xl leading-relaxed">
          {isEn
            ? 'Intechne set out at a time when technology education remained largely theoretical, by building physical arenas where young people can showcase their skills in real-world environments.'
            : 'Intechne, teknoloji eğitiminin teoride kaldığı bir dönemde, gençlerin becerilerini gerçek ortamlarda sergileyebileceği fiziksel arenalar kurarak yola çıktı.'}
        </p>
      </div>

      {/* Main Text Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Story Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-brand-navy uppercase tracking-wider">
            {isEn ? 'Our Story' : 'Hikayemiz'}
          </h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            {isEn
              ? 'Our starting point was an observation: there were talented young people, but no system to recognize them. Robotics competitions offered an ideal ground to fill this gap—bridging the distance between learning and making, and transforming technical skills into tangible competition. We began building this foundation in Türkiye by establishing leagues for international robotics competitions.'
              : 'Başlangıç noktamız bir gözlemdi: Yetenekli gençler vardı, onları tanıyan bir sistem yoktu. Robotik yarışmaları bu boşluğu doldurmak için ideal bir zemin sunuyordu — öğrenmek ile üretmek arasındaki mesafeyi kapatıyor, teknik beceriyi somut bir rekabete dönüştürüyordu. Türkiye\'de uluslararası robot yarışmaları için ligler hayata geçirerek bu zemini inşa etmeye başladık.'}
          </p>
        </div>

        {/* Present Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-brand-navy uppercase tracking-wider">
            {isEn ? 'Who We Are Today' : 'Bugün Biz'}
          </h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            {isEn
              ? 'Over the years, our organizational experience created the need to develop our own technology. To solve inefficiencies in the field, we developed **ARENO**, an AI-powered autonomous refereeing system. To translate standout talent in competitions into digital data, we built the **TechApp** platform. Today, Intechne is an integrated ecosystem that adapts and organizes international robotics leagues in Türkiye, develops technology products emerging from these processes, and connects talent discovered in the field with industry. We create experience for the competing student, AI-powered insight for the system observer, and actionable data for companies seeking talent.'
              : 'Yıllar içinde organizasyon deneyimimiz, kendi teknolojimizi geliştirme ihtiyacını doğurdu. Sahalardaki verimsizlikleri çözmek için yapay zeka destekli otonom hakemlik sistemi ARENO\'yu geliştirdik. Yarışmalarda öne çıkan yetenekleri dijital veriye taşımak için TechApp platformunu kurduk.Bugün Intechne; uluslararası robotik liglerini Türkiye’de uyarlayarak organize eden, bu süreçten doğan teknoloji ürünleri geliştiren ve sahadan çıkan yetenekleri endüstriyle buluşturan bütünleşik bir yapıdır. Sahada yarışan gence deneyim, sistemi izleyene yapay zeka, yeteneği arayan şirkete ise veri üretiyoruz.'}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-brand-dark p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl mt-6">
        <p className="text-white text-base md:text-lg font-bold leading-relaxed">
          {isEn
            ? 'In short, we produce hardware for the youth competing on the field, AI for the system watching them, and data for the companies seeking them.'
            : 'Kısacası biz; sahada yarışan gence donanım, onu izleyen sisteme yapay zeka, onu arayan şirkete ise veri üretiyoruz.'}
        </p>
      </div>
    </div>
  );
}

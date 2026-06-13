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
            ? 'Intechne is the unification of an R&D company developing deep tech solutions and a massive robotics ecosystem bringing tens of thousands of young people together.'
            : 'Intechne, derin teknoloji çözümleri geliştiren bir Ar-Ge şirketi ile on binlerce genci buluşturan devasa bir robotik ekosisteminin tek vücut olmuş halidir.'}
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
              ? 'Our story began with a simple but unsettling observation: Young people consume technology very well, but when it comes to producing work and showcasing their physical abilities, the system only offered them boring classrooms and theoretical exams. We wanted to change this. We set out to build physical arenas where code doesn\'t stay on paper but turns into autonomous vehicles and strategic competition.'
              : 'Hikayemiz, basit ama rahatsız edici bir tespitle başladı: Gençler teknolojiyi çok iyi tüketiyor ama iş üretmeye ve fiziksel yeteneklerini sergilemeye geldiğinde sistem onlara sadece sıkıcı sınıflar ve teorik sınavlar sunuyordu. Biz bunu değiştirmek istedik. Kodların kağıt üzerinde kalmadığı, otonom araçlara ve stratejik rekabete dönüştüğü fiziksel arenalar kurarak yola çıktık.'}
          </p>
        </div>

        {/* Present Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-brand-navy uppercase tracking-wider">
            {isEn ? 'Who We Are Today' : 'Bugün Biz'}
          </h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            {isEn
              ? 'Over time, these arenas turned from mere event venues into a laboratory where we develop our own technology. Today, Intechne is an ecosystem builder organizing international robotics leagues in Turkey, a technology producer developing AI-assisted autonomous refereeing systems that eliminate human error on these fields, and a bridge to the future that transforms on-field talent into digital data to connect them with companies.'
              : 'Zamanla bu arenalar, sadece birer etkinlik alanı olmaktan çıkıp kendi teknolojimizi geliştirdiğimiz bir laboratuvara dönüştü. Bugün Intechne; uluslararası robotik liglerini Türkiye\'de organize eden bir ekosistem kurucusu, bu sahalardaki insan hatasını sıfırlayan yapay zeka destekli otonom hakemlik sistemi geliştiren bir teknoloji üreticisi ve sahadaki yetenekleri dijital veriye dönüştürüp şirketlerle buluşturan bir gelecek köprüsüdür.'}
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

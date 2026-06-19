import { Link } from '@/src/i18n/navigation';
import { VolunteerForm } from '@/components/volunteer/VolunteerForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Become a Volunteer' : 'Gönüllü Ol',
    description: isEn 
      ? 'Join our volunteer network at Intechne Technology and contribute to shaping the future of technology.' 
      : 'Intechne Teknoloji gönüllü ağına katılın ve teknoloji geleceğini şekillendirmeye katkıda bulunun.',
  };
}

export default async function VolunteerPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const t = {
    title: isEn ? 'Become a Volunteer' : 'Gönüllü Ol',
    home: isEn ? 'Home' : 'Anasayfa',
    introTitle: isEn ? 'Shape the Future with Us' : 'Geleceği Bizimle Şekillendirin',
    introDesc: isEn
      ? 'Join Intechne Technology\'s volunteer program to support robotics leagues, academy mentorship programs, hackathons, and youth technology hubs. Fill out the application form below to start your journey.'
      : 'Robonex ve Cezeri robot liglerimiz, Intechne Akademi mentorluk programlarımız, hackathonlar ve teknoloji festivallerimizde aktif roller üstlenmek için gönüllü ağımıza katılın. Aşağıdaki formu eksiksiz doldurarak ilk adımı atabilirsiniz.',
  };

  return (
    <div className="min-h-screen bg-white pb-20 text-[#111111]">
      {/* Header Banner Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {t.home}
            </Link>
            <span>/</span>
            <span>{t.title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {t.title}
          </h1>
        </div>
      </div>

      {/* Main Content Form Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-black text-[#111111]">{t.introTitle}</h2>
          <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">{t.introDesc}</p>
        </div>

        <VolunteerForm isEn={isEn} />
      </div>
    </div>
  );
}

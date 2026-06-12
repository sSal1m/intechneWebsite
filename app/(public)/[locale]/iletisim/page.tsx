import { Link } from '@/src/i18n/navigation';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactCards } from '@/components/contact/ContactCards';
import { ContactMap } from '@/components/contact/ContactMap';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-8 md:mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <span>{isEn ? 'Contact' : 'İletişim'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {isEn ? 'Contact' : 'İletişim'}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm />
        <ContactCards />
        <ContactMap />
      </div>
    </div>
  );
}

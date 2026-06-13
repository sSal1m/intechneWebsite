import type { Metadata } from 'next';
import { FaqAccordion } from './FaqAccordion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'FAQ' : 'Sıkça Sorulan Sorular',
  };
}

export default async function SssPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header inside Content */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-brand-navy">
          {isEn ? 'Frequently Asked Questions' : 'Sıkça Sorulan Sorular'}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <FaqAccordion isEn={isEn} />
    </div>
  );
}

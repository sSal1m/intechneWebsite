import { notFound } from 'next/navigation';
import { getBrandPage } from '@/src/actions/brands';
import { BrandPageContent } from '@/components/brands/BrandPageContent';

export async function generateStaticParams() {
  const locales = ['tr', 'en'];
  const slugs = [
    'cezeri-robot-ligi',
    'robonex-robot-ligi',
    'intechne-akademi',
    'drone-cup',
    'hack-the-future-marathons',
    'intechne-girisim-kulubu',
    'tech-chill-fest',
    'intechne-gaming-hub'
  ];

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  const brandPage = await getBrandPage(slug);

  if (!brandPage) {
    notFound();
  }

  return <BrandPageContent slug={slug} locale={locale} data={brandPage} />;
}

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Hakkımızda sub-pages
export async function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}

// Biz Kimiz
export async function generateMetadata() {
  return { title: 'Biz Kimiz?' };
}

export default async function BizKimizPage({ params }: PageProps) {
  const { locale } = await params;
  return <PlaceholderPage title="Biz Kimiz?" locale={locale} />;
}

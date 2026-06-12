import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const locales = ['tr', 'en'];
  const ids = ['1', '2', '3', '4', '5', '6'];
  const params: { locale: string; id: string }[] = [];
  locales.forEach((locale) => {
    ids.forEach((id) => {
      params.push({ locale, id });
    });
  });
  return params;
}

export default async function Page({ params }: PageProps) {
  const { locale, id } = await params;
  const title = locale === 'en' ? `NEWS DETAIL #${id}` : `HABER DETAY #${id}`;
  return <PlaceholderPage title={title} locale={locale} />;
}

import { ITalksGrid } from '@/components/i-talks/ITalksGrid';
import { getITalksItems } from '@/src/actions/i-talks';
import { Link } from '@/src/i18n/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string; search?: string; startDate?: string; endDate?: string }>;
}

export async function generateMetadata() {
  return { title: 'I-Talks' };
}

export default async function ITalksPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { category, page: pageParam, search, startDate, endDate } = await searchParams;
  const isEn = locale === 'en';
  const items = await getITalksItems(category || undefined);

  return (
    <ITalksGrid
      isEn={isEn}
      initialItems={items}
      filterCategory={category}
      filterSearch={search}
      filterStartDate={startDate}
      filterEndDate={endDate}
      filterPage={pageParam}
    />
  );
}

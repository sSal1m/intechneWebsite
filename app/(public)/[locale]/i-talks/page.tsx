import { InteractiveGrid } from '@/components/interactive/InteractiveGrid';
import { InteractiveSidebar } from '@/components/interactive/InteractiveSidebar';
import { getInteractiveItems } from '@/src/actions/interactive';
import { Link } from '@/src/i18n/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string; search?: string; startDate?: string; endDate?: string }>;
}

export async function generateMetadata() {
  return { title: 'İnteraktif' };
}

export default async function InteraktifPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { category, page: pageParam, search, startDate, endDate } = await searchParams;
  const isEn = locale === 'en';
  const items = await getInteractiveItems(category || undefined);

  return (
    <InteractiveGrid
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

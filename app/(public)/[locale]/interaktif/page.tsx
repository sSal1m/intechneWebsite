import { InteractiveGrid } from '@/components/interactive/InteractiveGrid';
import { getInteractiveItems } from '@/src/actions/interactive';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}

export async function generateMetadata() {
  return { title: 'İnteraktif' };
}

export default async function InteraktifPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const items = await getInteractiveItems();
  
  return <InteractiveGrid isEn={isEn} initialItems={items} />;
}

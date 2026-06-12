import { InteractiveGrid } from '@/components/interactive/InteractiveGrid';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return { title: 'İnteraktif' };
}

export default async function InteraktifPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return <InteractiveGrid isEn={isEn} />;
}

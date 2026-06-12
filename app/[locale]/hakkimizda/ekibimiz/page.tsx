import { TeamGrid } from '@/components/about/TeamGrid';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return { title: 'Ekibimiz' };
}

export default async function EkibimizPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return <TeamGrid isEn={isEn} />;
}

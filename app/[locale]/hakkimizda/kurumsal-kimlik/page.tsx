import { CorporateIdentityGrid } from '@/components/about/CorporateIdentityGrid';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return { title: 'Kurumsal Kimlik' };
}

export default async function KurumsalKimlikPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return <CorporateIdentityGrid isEn={isEn} />;
}

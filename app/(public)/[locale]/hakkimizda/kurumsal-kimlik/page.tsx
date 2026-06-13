import { CorporateIdentityGrid } from '@/components/about/CorporateIdentityGrid';
import { getCorporateIdentityItems } from '@/src/actions/corporate-identity';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Kurumsal Kimlik' };
}

export default async function KurumsalKimlikPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  const items = await getCorporateIdentityItems();
  
  return <CorporateIdentityGrid isEn={isEn} initialAssets={items} />;
}

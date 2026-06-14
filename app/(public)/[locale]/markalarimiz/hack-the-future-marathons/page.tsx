'use client';

import { BrandPageContent } from '@/components/brands/BrandPageContent';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const locale = (params?.locale as string) || 'tr';
  return <BrandPageContent slug="hack-the-future-marathons" locale={locale} />;
}

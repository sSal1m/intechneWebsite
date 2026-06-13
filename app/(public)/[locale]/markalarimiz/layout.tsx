import { BrandsSidebar } from '@/components/brands/BrandsSidebar';
import { DynamicHeader } from '@/components/ui/DynamicHeader';

export default async function BrandsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Area */}
      <DynamicHeader locale={locale} defaultTitle="Markalarımız" defaultTitleEn="Our Brands" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <BrandsSidebar />
          <main className="flex-1 w-full min-h-[400px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

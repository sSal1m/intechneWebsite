import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import '../globals.css';

const locales = ['tr', 'en'];

export const metadata: Metadata = {
  title: {
    template: '%s | Intechne Teknoloji',
    default: 'Intechne Teknoloji',
  },
  description: 'Intechne Teknoloji; Cezeri Robot Ligi, Robonex Robot Ligi, Intechne Akademi ve daha pek çok proje ile teknoloji geleceğini inşa ediyor.',
  keywords: ['teknoloji', 'robotik', 'Cezeri', 'Robonex', 'Intechne', 'Akademi'],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

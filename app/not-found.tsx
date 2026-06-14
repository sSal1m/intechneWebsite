'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Large 404 & Image Container */}
        <div className="relative flex flex-col items-center">
          <span className="text-9xl font-black text-slate-200 select-none leading-none">
            404
          </span>
          <div className="w-40 h-40 flex items-center justify-center -mt-10 relative z-10">
            <img
              src="/cute-axolotl-axolotl-illustration-sea-salamander-sea-life-marine-life-png.webp"
              alt="404 Axolotl"
              className="w-full h-full object-contain animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isEn ? 'Page Not Found' : 'Sayfa Bulunamadı'}
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            {isEn
              ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
              : 'Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#15a3b0] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#0d8e9a] transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            {isEn ? 'Go to Homepage' : 'Ana Sayfaya Dön'}
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-full font-bold text-sm shadow-sm hover:bg-slate-50 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <HelpCircle className="w-4 h-4" />
            {isEn ? 'Contact Us' : 'Bize Ulaşın'}
          </Link>
        </div>
      </div>
    </div>
  );
}

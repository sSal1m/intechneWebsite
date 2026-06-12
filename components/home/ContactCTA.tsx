'use client';

import { Mail, Phone } from 'lucide-react';
import { useLocale } from 'next-intl';

export function ContactCTA() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <section className="bg-primary py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inner card with overlay */}
        <div className="relative rounded-3xl overflow-hidden mb-10 max-w-4xl mx-auto">
          {/* BG gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/80 via-brand-red/60 to-primary/50 z-10" />
          {/* Placeholder background */}
          <div className="h-[200px] bg-gradient-to-br from-slate-400 to-slate-600" />
          {/* Text overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 py-6">
            <h3 className="text-white font-black text-2xl md:text-3xl mb-2">
              {isEn ? 'Contact Us' : 'Bizimle İletişime Geçin'}
            </h3>
            <p className="text-white/80 text-sm max-w-md">
              {isEn
                ? 'You can contact us for any questions, suggestions, and cooperation requests.'
                : 'Her türlü soru, öneri ve iş birliği talepleriniz için bizimle iletişime geçebilirsiniz.'}
            </p>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:kurumsal@intechne.com.tr"
            className="inline-flex items-center gap-3 bg-brand-yellow text-brand-dark font-bold px-6 py-3.5 rounded-full hover:brightness-95 transition-all duration-200 text-sm"
          >
            <Mail className="w-5 h-5" />
            kurumsal@intechne.com.tr
          </a>
          <a
            href="tel:05346349058"
            className="inline-flex items-center gap-3 bg-brand-teal text-white font-bold px-6 py-3.5 rounded-full hover:bg-brand-teal-dark transition-all duration-200 text-sm"
          >
            <Phone className="w-5 h-5" />
            0534 634 9058
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Fullscreen Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/404hp3.png"
          alt="404 Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay to ensure contrast and modern look */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
      </div>

      {/* Glassmorphic Card Container */}
      <div className="relative z-10 max-w-lg w-full text-center p-8 md:p-12 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl space-y-8 text-white">
        {/* Giant 404 Header */}
        <div className="relative flex flex-col items-center">
          <span className="text-8xl md:text-9xl font-black text-white/20 select-none tracking-widest leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            404
          </span>
          <span className="absolute bottom-2 text-lg md:text-xl font-bold tracking-widest text-[#15a3b0] uppercase">
            {isEn ? "This Page Doesn't Appear on the Marauder's Map" : "Bu Sayfa Marauder Haritası'nda Görünmüyor"}
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {isEn ? "This Page Doesn't Appear on the Marauder's Map" : "Bu Sayfa Marauder Haritası'nda Görünmüyor"}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-md mx-auto whitespace-pre-line">
            {isEn
              ? "The page you are looking for could not be found in the corridors of Hogwarts or on the Marauder's Map.\n\nPerhaps it was hit by a Vanishing Spell, or an incorrect Portkey brought you here."
              : "Aradığınız sayfa ne Hogwarts koridorlarında ne de Marauder Haritası'nda bulunabildi.\n\nBelki bir Kaybolma Büyüsü'ne maruz kaldı ya da yanlış bir Portkey sizi buraya getirdi."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#15a3b0] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-[#0d8e9a] transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            {isEn ? 'Return to Hogwarts' : "Hogwarts'a Dön"}
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <HelpCircle className="w-4 h-4" />
            {isEn ? 'Ask a Wizard' : 'Bir Büyücüye Sor'}
          </Link>
        </div>
      </div>
    </div>
  );
}

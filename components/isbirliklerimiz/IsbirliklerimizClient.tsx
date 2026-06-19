'use client';

import { useState } from 'react';
import { Link } from '@/src/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface Partner {
  name: string;
  initials: string;
  logoUrl?: string;
}

const partners: Partner[] = [
  { name: 'Acun Medya', initials: 'AM', logoUrl: '/isbirliklerimiz/Acun-Medya-Logo.png' },
  { name: 'ADENTE Advanced Engineering Technologies', initials: 'AD', logoUrl: '/isbirliklerimiz/ADENTE-Advanced-Engineering-Technologies-logo.png' },
  { name: 'Armelsan', initials: 'AR', logoUrl: '/isbirliklerimiz/Armelsan-logo.png' },
  { name: 'Bağcılar Belediyesi', initials: 'BB', logoUrl: '/isbirliklerimiz/bagcilar-belediyesi-logo.png' },
  { name: 'Bottobo Robotics', initials: 'BO', logoUrl: '/isbirliklerimiz/Bottobo-Robotics-logo.png' },
  { name: 'Co Print 3D Printing Technologies', initials: 'CP', logoUrl: '/isbirliklerimiz/Co-Print-logo.png' },
  { name: 'Esenler Belediyesi', initials: 'EB', logoUrl: '/isbirliklerimiz/esenler-belediyesi-logo.png' },
  { name: 'Etiya', initials: 'ET', logoUrl: '/isbirliklerimiz/Etiya-Logo.png' },
  { name: 'İstanbul Gedik Üniversitesi', initials: 'GÜ', logoUrl: '/isbirliklerimiz/istanbul-gedik-üniversitesi-logo.png' },
  { name: 'Kadıköy Belediyesi', initials: 'KB', logoUrl: '/isbirliklerimiz/Kadıköy-Belediyesi-Logo.png' },
  { name: 'Papara', initials: 'PP', logoUrl: '/isbirliklerimiz/papara-logo.png' },
  { name: 'Pendik Belediyesi', initials: 'PB', logoUrl: '/isbirliklerimiz/pendik-belediyesi-logo.png' },
  { name: 'RISE-X Technology', initials: 'RX', logoUrl: '/isbirliklerimiz/RISE-X-Technology-logo.png' },
  { name: 'Tatlıköy', initials: 'TK', logoUrl: '/isbirliklerimiz/tatlikoy-logo.png' },
  { name: 'Teknopark İstanbul', initials: 'TI', logoUrl: '/isbirliklerimiz/teknopark-istanbul-logo.png' },
  { name: 'Turkcell', initials: 'TC', logoUrl: '/isbirliklerimiz/turkcell-logo.png' },
  { name: 'Ümraniye Belediyesi', initials: 'ÜB', logoUrl: '/isbirliklerimiz/Umraniye-Belediyesi-Logo.png' },
  { name: 'Yalova Organize Sanayi Bölgesi', initials: 'YO', logoUrl: '/isbirliklerimiz/Yalova-Organize-Sanayi-Bolgesi-logo.png' },
  { name: 'Yalova Teknopark', initials: 'YT', logoUrl: '/isbirliklerimiz/yalova-teknopark-logo.png' },
  { name: 'Ziraat Bankası', initials: 'ZB', logoUrl: '/isbirliklerimiz/Ziraat-Bankası-Logo.png' },
];

export function IsbirliklerimizClient({ locale }: { locale: string }) {
  const isEn = locale === 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <span>{isEn ? 'Collaborations' : 'İş Birliklerimiz'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {isEn ? 'Our Collaborations' : 'İş Birliklerimiz'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls: Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-white/80 font-semibold text-xs md:text-sm uppercase tracking-wider">
            {isEn
              ? 'Our ecosystem partners and strategic collaborations'
              : 'Ekosistem paydaşlarımız ve stratejik iş birliklerimiz'}
          </p>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder={isEn ? 'Search partners...' : 'İş birliklerinde ara'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-transparent text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15a3b0] transition-all duration-200 text-sm font-semibold shadow-sm"
            />
          </div>
        </div>

        {/* Partners Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          <AnimatePresence mode="popLayout">
            {filteredPartners.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="col-span-full py-16 text-center bg-white/5 border border-white/10 rounded-3xl"
              >
                <p className="text-white/60 font-bold text-base">
                  {isEn
                    ? 'No collaborations found matching your criteria.'
                    : 'Arama kriterlerinize uygun iş birliği bulunamadı.'}
                </p>
              </motion.div>
            ) : (
              filteredPartners.map((partner) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={partner.name}
                  className="flex flex-col items-center justify-center text-center cursor-default group"
                >
                  {/* Logo Container */}
                  <div className="w-full max-w-[384px] h-48 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 mb-4 rounded-2xl p-6">
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <span className="text-[#15a3b0] font-black text-5xl">{partner.initials}</span>
                    )}
                  </div>

                  {/* Partner Details */}
                  <div className="w-full">
                    <h3 className="font-bold text-white/95 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-white transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brands } from '@/src/data/brands';
import { Link } from '@/src/i18n/navigation';

interface BrandsTabSectionProps {
  locale: string;
}

const statLabelTranslations: Record<string, string> = {
  'Paydaş Kurum': 'Partner Institution',
  'Yarışma': 'Competition',
  'Parametre': 'Parameter',
  'Kuruluş': 'Foundation',
  'Yerli': 'Local',
  'Atölye': 'Workshop',
  'İl': 'Province',
  'Öğrenci': 'Student',
  'Merkez': 'Center',
  'Ziyaretçi': 'Visitor',
  'Girişim': 'Startup',
  'Mentor': 'Mentor',
  'Yıl': 'Year',
  'Makale': 'Article',
  'Editör': 'Editor',
  'Başlangıç': 'Start',
  'Dağıtılan Kart': 'Distributed Cards',
  'Piyasaya Çıkış': 'Release Year',
  'Yerli Üretim': 'Local Production',
  'Okuyucu': 'Reader',
  'Kuruluş Yılı': 'Foundation Year',
  'Burslu Öğrenci': 'Scholarship Student',
  'Üniversite': 'University',
  'Desteklenen Takım': 'Supported Team',
  'Destek Miktarı': 'Support Amount',
  'şehir': 'Cities',
  'Yarışmacı': 'Competitors',
  'Etkinlik': 'Events',
  'Katılımcı': 'Participants',
  'Pilot': 'Pilots',
  'Turnuva': 'Tournaments',
  'Geliştirici': 'Developers',
  'Game Jam': 'Game Jams',
  'Kodlama': 'Coding',
};

const statValueTranslations: Record<string, string> = {
  '9. Yıl': '9th Year',
  '3. Yıl': '3rd Year',
  '1. Yıl': '1st Year',
  '4. Yıl': '4th Year',
  '5. Yıl': '5th Year',
  '5+ Yıl': '5+ Years',
  '24 Saat': '24 Hours',
};

const brandTranslationsEn: Record<string, { name: string; shortDescription: string }> = {
  'cezeri-robot-ligi': {
    name: 'Cezeri Robot League',
    shortDescription: 'As a strong part of the Intechne ecosystem, Cezeri Robot League hosts international robotics competitions, fierce autonomous hardware battles, technology workshops, and innovation-focused events, converting young people\'s interest in engineering into an exciting sports passion and creating a strong awareness for Turkey to become a high-technology producer.',
  },
  'robonex-robot-ligi': {
    name: 'Robonex Robot League',
    shortDescription: 'Reflecting Intechne\'s new generation technology vision onto the field, Robonex Robot League hosts futuristic autonomous system battles, artificial intelligence-supported robotics competitions, and advanced technology events, preparing young engineers for the global innovation race in the best way.',
  },
  'tech-chill-fest': {
    name: 'Tech & Chill Fest',
    shortDescription: 'The flagship event of the Intechne ecosystem, Tech & Chill Fest, hosts technology hackathons, robotics finals, and innovation workshops during the day, and live music performances and e-sports tournaments in the evening, creating a dynamic meeting point where technology integrates seamlessly with social life.',
  },
  'intechne-akademi': {
    name: 'Intechne Academy',
    shortDescription: 'The applied education base of the Intechne ecosystem, Intechne Academy, hosts innovation workshops, hardware and software trainings, maker camps, and project-oriented mentorship programs, providing a novel learning environment that blends youth\'s theoretical knowledge with the reality of the field.',
  },
  'drone-cup': {
    name: 'Drone Cup',
    shortDescription: 'The futuristic competitive arena of the Intechne ecosystem in the sky, Drone Cup, hosts high-speed professional drone races, breathtaking drone soccer matches played entirely in the air, aerodynamic design workshops, and advanced engineering events, bringing a unique experience that connects aviation passion with technology.',
  },
  'intechne-girisim-kulubu': {
    name: 'Intechne Venture Club',
    shortDescription: 'The visionary kitchen of the Intechne ecosystem that transforms innovative ideas into global projects, Intechne Venture Club hosts ideathons, investor meetings, startup summits, and strategic mentorship programs, aiming to bring technology production passion together with sustainable business models.',
  },
  'intechne-gaming-hub': {
    name: 'Intechne Gaming Hub',
    shortDescription: 'The interactive competition and production center of the Intechne ecosystem in the digital world, Intechne Gaming Hub hosts strategy-focused e-sports tournaments, game jams, virtual reality (VR) workshops, and digital innovation events, aiming to turn gaming passion into technology design power.',
  },
  'hack-the-future-marathons': {
    name: 'Hack the Future Marathons',
    shortDescription: 'The visionary software and production arena of the Intechne ecosystem that pushes the limits, Hack the Future Marathons hosts continuous coding hackathons, deep-tech rapid prototyping competitions, AI development camps, and advanced problem-solving events, aiming to transform analytical intelligence into innovative projects.',
  },
};

export function BrandsTabSection({ locale }: BrandsTabSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const isEn = locale === 'en';

  function handleTabClick(idx: number) {
    setActiveIdx(idx);
  }

  const active = brands[activeIdx];
  const activeTranslation = brandTranslationsEn[active.slug];
  const activeName = isEn ? (activeTranslation?.name || active.name) : active.name;
  const activeDesc = isEn ? (activeTranslation?.shortDescription || active.shortDescription) : active.shortDescription;

  return (
    <section className="bg-[#15a3b0] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-white font-black text-3xl md:text-4xl mb-3">
            {isEn ? 'Our Brands' : 'Markalarımız'}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {isEn 
              ? 'As Intechne Technology, we work to instill technology passion and innovation spirit across the whole society.'
              : 'Intechne Teknoloji olarak teknoloji tutkusunu ve inovasyon ruhunu tüm topluma aşılamak için çalışıyoruz.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Tab List */}
          <div className="lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {brands.map((brand, idx) => {
              const brandName = isEn ? (brandTranslationsEn[brand.slug]?.name || brand.name) : brand.name;
              return (
                <button
                  key={brand.id}
                  onClick={() => handleTabClick(idx)}
                  style={{
                    backgroundColor: idx === activeIdx ? '#DDF8FB' : 'rgba(10, 200, 218, 0.15)',
                    borderLeft: `4px solid #0AC8DA`,
                  }}
                  className={`text-left px-4 py-3 rounded-lg font-bold text-xs whitespace-nowrap lg:whitespace-normal transition-all duration-200 flex-shrink-0 ${
                    idx === activeIdx
                      ? 'text-[#089EAD] shadow-lg font-black scale-[1.02]'
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {brandName}
                </button>
              );
            })}
          </div>

          {/* Right: Active Brand Content */}
          <div className="lg:flex-1 relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                {/* Text */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-white font-black text-3xl md:text-4xl leading-tight">
                    {activeName}
                  </h3>
                  <p className="text-white/85 text-sm md:text-base leading-relaxed">
                    {activeDesc}
                  </p>
                  <Link
                    href={`/markalarimiz/${active.slug}` as any}
                    className="inline-flex items-center gap-2 border-2 border-white text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-white hover:text-primary transition-all duration-200 w-fit"
                  >
                    {isEn ? 'Learn More' : 'Daha Fazla Bilgi'}
                  </Link>
                </div>

                {/* Image + Stats */}
                <div className="relative flex justify-center items-center">
                  <div className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] bg-white/20 rounded-[40%_60%_60%_40%/60%_40%_60%_40%] flex items-center justify-center">
                    <div className="w-[90%] h-[90%] bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                      {active.logoUrl ? (
                        <img
                          src={active.logoUrl}
                          alt={activeName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-black text-2xl">{activeName.slice(0, 2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Stat badges */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    {active.stats.map((stat: { value: string; label: string }, sIdx: number) => {
                      const displayLabel = isEn ? (statLabelTranslations[stat.label] || stat.label) : stat.label;
                      return (
                        <div key={sIdx} className="bg-white rounded-xl shadow-md px-4 py-2 text-right min-w-[100px]">
                          <p className="text-brand-dark font-black text-base leading-none">
                            {isEn ? (statValueTranslations[stat.value] || stat.value) : stat.value}
                          </p>
                          {stat.label && <p className="text-slate-500 text-xs mt-0.5">{displayLabel}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

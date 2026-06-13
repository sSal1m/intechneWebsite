'use client';

import { motion } from 'framer-motion';

interface TimelineEvent {
  year: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2021',
    titleTr: 'Kuruluş ve İlk Kıvılcım',
    titleEn: 'Foundation and the First Spark',
    descTr: 'Intechne, teknoloji üreten bir toplum vizyonuyla, genç yeteneklerin mühendislik ve robotik alanlarındaki potansiyelini açığa çıkarmak için 2021 yılında kuruldu. İlk eğitim modülleri ve atölye planlamaları bu dönemde hayata geçirildi.',
    descEn: 'Intechne was founded in 2021 with the vision of a technology-producing society, aiming to unlock the potential of young talents in engineering and robotics. The first training modules and workshop planning were launched in this period.'
  },
  {
    year: '2022',
    titleTr: 'Cezeri Robot Ligi\'nin Doğuşu',
    titleEn: 'Birth of the Cezeri Robot League',
    descTr: 'Türkiye\'nin en kapsamlı ve prestijli robotik yarışmalarından biri olan Cezeri Robot Ligi\'nin temelleri atıldı. İlk bölgesel turnuvalar düzenlendi ve yüzlerce genç mühendis adayı takım ruhuyla yarıştı.',
    descEn: 'The foundations of the Cezeri Robot League, one of Turkey\'s most comprehensive and prestigious robotics competitions, were laid. The first regional tournaments were held, and hundreds of young engineer candidates competed with team spirit.'
  },
  {
    year: '2023',
    titleTr: 'Intechne Akademi ve Yaygınlaşma',
    titleEn: 'Intechne Academy and Expansion',
    descTr: 'Genç yetenekleri gerçek dünya projeleriyle buluşturan Intechne Akademi kuruldu. Farklı şehirlerde açılan yeni atölyeler ve uygulamalı teknoloji eğitimleriyle ulaşılan öğrenci sayısı 5.000\'i aştı.',
    descEn: 'Intechne Academy was established, bringing young talents together with real-world projects. The number of students reached exceeded 5,000 with new workshops opened in different cities and practical technology trainings.'
  },
  {
    year: '2024',
    titleTr: 'Ulusal Başarılar ve Robonex Ligi',
    titleEn: 'National Achievements and Robonex League',
    descTr: 'Otonom sistemler ve ileri teknoloji yarışmalarını içeren Robonex Robot Ligi başlatıldı. Vex Robotics Türkiye Şampiyonası ulusal arenada büyük ses getirerek binlerce gence ilham kaynağı oldu.',
    descEn: 'The Robonex Robot League, featuring autonomous systems and advanced technology competitions, was launched. The Vex Robotics Turkey Championship made a huge impact in the national arena, inspiring thousands of young people.'
  },
  {
    year: '2025',
    titleTr: 'Dijital Ekosistem ve Küresel Vizyon',
    titleEn: 'Digital Ecosystem and Global Vision',
    descTr: 'Intechne İnteraktif ve bulut tabanlı yayıncılık altyapısı hayata geçirildi. Robotikten yapay zekaya uzanan geniş bir yelpazede hazırlanan teknik raporlar ve eğitim simülasyonları dijital ekosisteme kazandırıldı.',
    descEn: 'Intechne Interactive and cloud-based publishing infrastructure were implemented. Technical reports and educational simulations prepared in a wide range from robotics to artificial intelligence were brought to the digital ecosystem.'
  },
  {
    year: '2026',
    titleTr: 'Geleceği Hep Birlikte İnşa Ediyoruz',
    titleEn: 'Building the Future Together',
    descTr: 'Bugün Intechne, 30\'dan fazla eğitim programı, binlerce aktif mezunu ve genişleyen paydaş ağıyla Türkiye\'nin teknoloji odaklı gelişimine liderlik etmeye ve yarının mühendislerini yetiştirmeye devam ediyor.',
    descEn: 'Today, with more than 30 educational programs, thousands of active alumni, and an expanding network of stakeholders, Intechne continues to lead Turkey\'s technology-oriented development and train the engineers of tomorrow.'
  }
];

export function HikayemizClient({ locale }: { locale: string }) {
  const isEn = locale === 'en';

  return (
    <div className="flex flex-col gap-10">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-black text-brand-navy">
          {isEn ? 'Our Story' : 'Hikayemiz'}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      {/* Intro */}
      <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium max-w-3xl">
        {isEn
          ? 'Discover the milestones and achievements of Intechne since our inception in 2021 as we build the future of technology and robotics.'
          : '2021 yılındaki kuruluşumuzdan bu yana Intechne\'nin teknoloji ve robotik geleceğini inşa ederken kaydettiği önemli kilometre taşlarını ve başarıları keşfedin.'}
      </p>

      {/* Vertical Timeline */}
      <div className="relative mt-8 py-4 px-2 md:px-0">
        {/* Central Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-100 md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-12 relative">
          {timelineEvents.map((event, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.05 }}
                className={`relative flex flex-col md:flex-row items-start justify-between w-full last:mb-0`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 -translate-x-1/2 md:left-1/2 md:top-8 md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-white bg-primary shadow-sm z-10" />

                {/* Left/Right Card spacing on Desktop */}
                <div
                  className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${
                    isEven ? 'md:text-right md:order-1' : 'md:text-left md:order-3 md:ml-auto'
                  }`}
                >
                  <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <span className="text-3xl font-black text-red-600 block mb-2">{event.year}</span>
                    <h4 className="text-lg font-bold text-neutral-800 mb-2">
                      {isEn ? event.titleEn : event.titleTr}
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                      {isEn ? event.descEn : event.descTr}
                    </p>
                  </div>
                </div>

                {/* Empty spacer card for alignment on desktop */}
                <div className="hidden md:block md:w-[calc(50%-2rem)] md:order-2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

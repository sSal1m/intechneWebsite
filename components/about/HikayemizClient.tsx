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
    titleTr: 'Kuruluş ve İlk Adım',
    titleEn: 'Foundation and First Step',
    descTr: 'Intechne, gençlerin teknik becerilerini teorinin ötesinde, gerçek rekabet ortamlarında geliştirebileceği bir ekosistem kurma vizyonuyla İstanbul\'da hayata geçti. Robotik yarışma organizasyonuna yönelik ilk altyapı çalışmaları ve ortaklık görüşmeleri bu dönemde başladı.',
    descEn: 'Intechne was launched in Istanbul with the vision of establishing an ecosystem where young people can develop their technical skills beyond theory in real competitive environments. First infrastructure works and partnership discussions for robotics competition organization began in this period.'
  },
  {
    year: '2022',
    titleTr: 'Saha Tecrübesi ve İlk Turnuvalar',
    titleEn: 'Field Experience and the First Tournaments',
    descTr: 'FRC off-season turnuvaları düzenlenerek saha organizasyon tecrübesi kazanıldı. Bu turnuvalarla yüzlerce öğrenci, robotik yarışma ortamıyla ilk kez buluştu.',
    descEn: 'FRC Off-season tournaments were organized to gain field management and event operations experience. Through these tournaments, hundreds of students were introduced to the robotics competition environment for the first time.'
  },
  {
    year: '2023',
    titleTr: 'Ekosistem Büyüyor: Robocube ve Yeni Ortaklıklar',
    titleEn: 'Growing the Ecosystem: RoboCube and New Partnerships',
    descTr: 'Türkiye\'ye özgü robotik lig formatı Robocube hayata geçirildi. Teknopark İstanbul bünyesinde Ar-Ge faaliyetleri başlatıldı. İstanbul Gedik Üniversitesi ile stratejik iş birliği kurularak akademi-saha bağlantısı güçlendirildi.',
    descEn: 'RoboCube, a robotics league format tailored to Türkiye, was launched. R&D activities were initiated within Teknopark Istanbul, and a strategic partnership with Istanbul Gedik University was established to strengthen the connection between academia and hands-on robotics practice.'
  },
  {
    year: '2024',
    titleTr: 'ARENO: Yapay Zekayı Sahaya Taşımak',
    titleEn: 'ARENO: Bringing AI to the Field',
    descTr: 'Yarışma alanlarındaki hakemlik süreçlerini otomatikleştirmek amacıyla geliştirilen ARENO projesi Ar-Ge aşamasına girdi. Vex Robotics Türkiye Şampiyonası düzenlendi.',
    descEn: 'The ARENO project, developed to automate refereeing processes in robotics competitions, entered the R&D phase. The VEX Robotics Türkiye Championship was successfully organized, further expanding the national robotics ecosystem.'
  },
  {
    year: '2025',
    titleTr: 'TechApp ve Teknofest',
    titleEn: 'TechApp and Teknofest',
    descTr: 'Sahadaki yetenekleri dijital veriye taşıyan TechApp platformunun geliştirme süreci hız kazandı. Teknofest İzmir Girişim Yarışması finaline ulaşıldı. Yıldız Teknopark ile robot ligi ve atölye iş birliği hayata geçirildi.',
    descEn: 'The development process of the TechApp platform, which translates on-field talent into digital data, gained momentum. Reached the finals of the Teknofest Izmir Startup Competition. Robot league and workshop cooperation with Yildiz Technopark was implemented.'
  },
  {
    year: '2026',
    titleTr: 'Ürün, Ekosistem, Büyüme',
    titleEn: 'Product, Ecosystem, Growth',
    descTr: 'The ARENO project, developed to automate refereeing processes in robotics competitions, entered the R&D phase. The VEX Robotics Türkiye Championship was successfully organized, further expanding the national robotics ecosystem.',
    descEn: 'The ARENO project, developed to automate refereeing processes in robotics competitions, entered the R&D phase. The VEX Robotics Türkiye Championship was organized, marking another significant milestone in the growth of the national robotics ecosystem.'
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
          ? 'Discover the important steps we have taken in technology and robotics since our foundation in 2021 as Intechne.'
          : '2021 yılındaki kuruluşumuzdan bu yana Intechne olarak teknoloji ve robotik alanında kaydettiğimiz önemli adımları keşfedin.'}
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
                  className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isEven ? 'md:text-right md:order-1' : 'md:text-left md:order-3 md:ml-auto'
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

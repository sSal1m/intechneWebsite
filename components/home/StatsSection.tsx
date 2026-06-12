'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats as staticStats } from '@/src/data/stats';
import { useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';

interface StatsSectionProps {
  initialStats?: any[];
}

export function StatsSection({ initialStats = [] }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const locale = useLocale();
  const isEn = locale === 'en';

  const statsTranslationsEn: Record<string, { title: string; description: string; value?: string }> = {
    '1': {
      title: 'Number of Trainings',
      description: 'Connecting young talents with technology and fostering development through our workshops across different provinces.',
      value: '30'
    },
    '2': {
      title: 'Intechne Academy Students',
      description: 'Talented young engineering candidates receiving hands-on education and developing real-world projects.',
    },
    '3': {
      title: 'Cezeri Robot League Competitors',
      description: 'Participants of the national robotics league, experiencing engineering excitement and fierce competition.',
    },
    '4': {
      title: 'Total Number of Events',
      description: 'Major organizations focused on technology, science, e-sports, and innovation held throughout our ecosystem.',
    },
    '5': {
      title: 'Partner Institutions',
      description: 'Our collaboration partners supporting the Intechne vision and contributing to technological transformation.',
    },
  };

  const statsList = initialStats && initialStats.length > 0
    ? initialStats.map((s: any, idx: number) => {
        const staticItem = staticStats[idx] || staticStats[0];
        const trans = statsTranslationsEn[String(idx + 1)];
        return {
          id: s.id,
          value: isEn && trans && trans.value ? trans.value : (isEn ? s.value_en : s.value_tr),
          title: isEn ? s.label_en : s.label_tr,
          description: isEn && trans ? trans.description : staticItem.description,
        };
      })
    : staticStats.map((stat, idx) => {
        const trans = statsTranslationsEn[stat.id];
        return {
          id: stat.id,
          value: isEn && trans && trans.value ? trans.value : stat.value,
          title: isEn && trans ? trans.title : stat.title,
          description: isEn && trans ? trans.description : stat.description,
        };
      });

  return (
    <section className="bg-[#F7FAFB] py-16">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Title + description + image */}
          <div className="flex flex-col gap-5">
            <h2 className="text-brand-dark font-black text-3xl md:text-4xl leading-tight">
              {isEn ? 'Intechne in Numbers' : 'Sayılarla Biz'}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {isEn
                ? 'Intechne prepares young talents for the future through its many innovative projects, robotics leagues, and hands-on technology trainings.'
                : 'Intechne; pek çok yenilikçi projesi, robotik ligleri ve teknoloji eğitimleriyle genç yetenekleri geleceğe hazırlamaktadır.'}
            </p>
            {/* Placeholder image */}
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center max-w-sm">
              <span className="text-white/60 font-medium text-sm">
                {isEn ? 'Event Image' : 'Etkinlik Görseli'}
              </span>
            </div>
          </div>

          {/* Right: grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {statsList.map((stat, idx) => {
              const colors = [
                { bg: '#0AC8DA', circleBg: '#089EAD', isLight: false },
                { bg: '#DDF8FB', circleBg: '#0AC8DA', isLight: true },
                { bg: '#F7FAFB', circleBg: '#E5E7EB', isLight: true },
                { bg: '#111111', circleBg: '#333333', isLight: false },
                { bg: '#089EAD', circleBg: '#111111', isLight: false },
              ];
              const color = colors[idx] || colors[0];

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className={cn(
                    "rounded-2xl p-6 flex flex-col gap-4",
                    idx === 4 && "sm:col-span-2"
                  )}
                  style={{ backgroundColor: color.bg }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: color.circleBg }}
                    >
                      <span
                        className="font-bold text-[10px] sm:text-xs text-center leading-tight px-1 text-white"
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div>
                      <h4
                        className="font-bold text-base leading-snug"
                        style={{ color: color.isLight ? '#0F172A' : 'white' }}
                      >
                        {stat.title}
                      </h4>
                    </div>
                  </div>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: color.isLight ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.8)' }}
                  >
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Link } from '@/src/i18n/navigation';
import {
  Cpu,
  TrendingUp,
  Award,
  MapPin,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface JobPosition {
  id: string;
  title_tr: string;
  title_en: string;
  department_tr: string;
  department_en: string;
  location_tr: string;
  location_en: string;
  type_tr: string;
  type_en: string;
  description_tr: string;
  description_en: string;
  requirements_tr: string;
  requirements_en: string;
}

interface CareerClientProps {
  isEn: boolean;
  positions: JobPosition[];
}

export function CareerClient({ isEn, positions }: CareerClientProps) {
  const [expandedPositionId, setExpandedPositionId] = useState<string | null>(null);

  // Localized texts
  const t = {
    whyTitle: isEn ? 'Why Intechne?' : 'Neden Intechne?',
    whySubtitle: isEn
      ? 'Step into a workspace where future technology meets dynamic learning and innovation.'
      : 'Geleceğin teknolojilerinin dinamik bir öğrenim ve inovasyon kültürüyle buluştuğu yere adım atın.',
    processTitle: isEn ? 'Application Process' : 'Başvuru Süreci',
    processSubtitle: isEn
      ? 'How we find and welcome new team members.'
      : 'Ekibimizin yeni üyelerini nasıl keşfediyor ve aramıza katıyoruz.',
    positionsTitle: isEn ? 'Open Positions' : 'Açık Pozisyonlar',
    positionsSubtitle: isEn
      ? 'Explore career paths and find your fit.'
      : 'Kariyer yollarını keşfedin ve size en uygun rolü bulun.',
    noPositions: isEn
      ? 'There are no open positions at the moment.'
      : 'Şu an aktif bir açık pozisyonumuz bulunmamaktadır.',
    applyNow: isEn ? 'Apply Now' : 'Başvuru Yap',
    generalApply: isEn ? 'General Application' : 'Genel Başvuru',

    // Form Labels
    nameLabel: isEn ? 'Full Name' : 'Ad Soyad',
    emailLabel: isEn ? 'Email Address' : 'E-posta Adresi',
    phoneLabel: isEn ? 'Phone Number' : 'Telefon Numarası',
    coverLabel: isEn ? 'Cover Letter (Optional, Max 2000 Chars)' : 'Niyet Mektubu (Opsiyonel, Maks 2000 Karakter)',
    cvLabel: isEn ? 'Upload CV (PDF, Max 600KB)' : 'CV Yükle (PDF, Maks 600KB)',
    kvkkLabel: isEn
      ? 'I read and accept the KVKK Clarification Text.'
      : 'KVKK Aydınlatma Metnini okudum, kabul ediyorum.',
    submitBtn: isEn ? 'Submit Application' : 'Başvuruyu Gönder',
    submittingBtn: isEn ? 'Submitting...' : 'Gönderiliyor...',

    // Why Intechne Cards
    cards: [
      {
        title: isEn ? 'Innovative Culture' : 'Yenilikçi Kültür',
        desc: isEn
          ? 'Work in a dynamic environment where continuous learning is embraced and ideas are valued.'
          : 'Sürekli öğrenen, en yeni teknolojileri sahaya uygulayan ve fikirlerin değer gördüğü dinamik bir ortamda çalışın.',
        icon: Cpu
      },
      {
        title: isEn ? 'Impact and Vision' : 'Etki ve Vizyon',
        desc: isEn
          ? 'Design the technology future of Turkey with projects like Cezeri and Robonex leagues.'
          : 'Yalnızca bugünü değil, Cezeri ve Robonex ligleri ile Türkiye\'nin teknoloji geleceğini tasarlayın.',
        icon: TrendingUp
      },
      {
        title: isEn ? 'Growth Opportunities' : 'Gelişim Fırsatları',
        desc: isEn
          ? 'Unleash your full potential under the mentorship of Intechne Academy and Venture Club.'
          : 'Intechne Akademi ve Girişim Kulübü mentorluğunda kariyerinizde sınırları aşan fırsatları yakalayın.',
        icon: Award
      }
    ],

    // Process Steps
    steps: [
      {
        num: '01',
        title: isEn ? 'Application' : 'Başvuru',
        desc: isEn ? 'Send your CV and a brief cover letter for the position.' : 'İlgilendiğiniz pozisyona CV\'nizi ve niyet mektubunuzu iletin.'
      },
      {
        num: '02',
        title: isEn ? 'Screening' : 'Ön Değerlendirme',
        desc: isEn ? 'Our teams review your background, skills, and projects.' : 'İlgili ekiplerimiz yetkinliklerinizi ve projelerinizi inceler.'
      },
      {
        num: '03',
        title: isEn ? 'Interview' : 'Mülakat',
        desc: isEn ? 'Let\'s connect and align on technical aspects and values.' : 'Teknik ve vizyon odaklı görüşmeler ile enerjimizi birleştirelim.'
      },
      {
        num: '04',
        title: isEn ? 'Offer' : 'Teklif',
        desc: isEn ? 'Join our family and start bringing Intechne vision to life.' : 'Ailemize katılarak Intechne vizyonunu gerçeğe dönüştürmeye başlayın.'
      }
    ]
  };

  return (
    <div className="w-full flex flex-col gap-20">

      {/* 1. Why Intechne Section */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-black text-[#111111]">{t.whyTitle}</h2>
          <p className="text-slate-600 font-medium">{t.whySubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#01c1d3]/10 text-[#01c1d3] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#111111]">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Open Positions Section */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-black text-[#111111]">{t.positionsTitle}</h2>
          <p className="text-slate-600 font-medium">{t.positionsSubtitle}</p>
        </div>

        {positions.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto flex flex-col gap-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">{t.noPositions}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            {positions.map((pos) => {
              const isExpanded = expandedPositionId === pos.id;
              const title = isEn ? pos.title_en : pos.title_tr;
              const department = isEn ? pos.department_en : pos.department_tr;
              const location = isEn ? pos.location_en : pos.location_tr;
              const type = isEn ? pos.type_en : pos.type_tr;
              const description = isEn ? pos.description_en : pos.description_tr;
              const requirements = isEn ? pos.requirements_en : pos.requirements_tr;

              return (
                <div
                  key={pos.id}
                  className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Position Header (Accordion trigger) */}
                  <button
                    onClick={() => {
                      setExpandedPositionId(isExpanded ? null : pos.id);
                    }}
                    className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <h3 className="text-lg font-bold text-[#111111]">{title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          <Building2 className="w-3 h-3 text-[#01c1d3]" />
                          {department}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          <MapPin className="w-3 h-3 text-[#01c1d3]" />
                          {location}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-[#01c1d3]/10 text-[#01c1d3] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          <Briefcase className="w-3 h-3" />
                          {type}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Position Details & Form */}
                  {isExpanded && (
                    <div className="px-6 pb-8 md:px-8 border-t border-slate-100 bg-slate-50/20 flex flex-col gap-8 animate-fadeIn">

                      {/* Description */}
                      <div className="flex flex-col gap-3 mt-6">
                        <h4 className="font-bold text-[#111111] text-sm uppercase tracking-wider border-l-4 border-[#01c1d3] pl-3">
                          {isEn ? 'Job Description' : 'İş Tanımı'}
                        </h4>
                        <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed font-medium">
                          {description}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[#111111] text-sm uppercase tracking-wider border-l-4 border-[#01c1d3] pl-3">
                          {isEn ? 'Requirements' : 'Genel Nitelikler ve Gereksinimler'}
                        </h4>
                        <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed font-medium">
                          {requirements}
                        </div>
                      </div>

                      {/* Apply Redirect Button */}
                      <div className="border-t border-slate-100 pt-6 flex justify-end">
                        <Link
                          href={`/kariyer/${pos.id}` as any}
                          className="bg-[#01c1d3] hover:bg-[#009cb0] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors duration-200 shadow-md shadow-[#01c1d3]/10 hover:shadow-lg hover:shadow-[#01c1d3]/20"
                        >
                          {isEn ? 'Apply Now' : 'Başvuru Yap'}
                        </Link>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Application Process Section */}
      <section className="bg-slate-50/50 rounded-[40px] border border-slate-100 p-8 md:p-16 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-black text-[#111111]">{t.processTitle}</h2>
          <p className="text-slate-600 font-medium">{t.processSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {t.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-4 relative">
              <span className="text-5xl font-black text-[#01c1d3]/20 font-mono tracking-tighter">{step.num}</span>
              <h3 className="text-lg font-bold text-[#111111]">{step.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

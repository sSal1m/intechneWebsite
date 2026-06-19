'use client';

import { useState, useTransition } from 'react';
import { submitJobApplication } from '@/src/actions/careers';
import {
  Cpu,
  TrendingUp,
  Award,
  MapPin,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Upload,
  CheckCircle2,
  AlertCircle
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
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fileValidationErr, setFileValidationErr] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

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
    coverLabel: isEn ? 'Cover Letter (Optional)' : 'Niyet Mektubu (Opsiyonel)',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileValidationErr(null);
    setSelectedFileName('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setFileValidationErr(isEn ? 'Only PDF files are allowed.' : 'Sadece PDF formatında CV yükleyebilirsiniz.');
      e.target.value = ''; // Reset input
      return;
    }

    if (file.size > 600 * 1024) {
      setFileValidationErr(isEn ? 'File size must be 600KB or less.' : 'Dosya boyutu en fazla 600KB olmalıdır.');
      e.target.value = ''; // Reset input
      return;
    }

    setSelectedFileName(file.name);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, positionId: string) => {
    e.preventDefault();
    setFormErrors(null);
    setFormSuccess(null);

    const formData = new FormData(e.currentTarget);
    formData.append('position_id', positionId);

    // Resolve checkbox value
    const kvkkCheckbox = formData.get('kvkk_approved');
    formData.set('kvkk_approved', kvkkCheckbox === 'on' ? 'true' : 'false');

    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setFormErrors(isEn ? 'CV file is required.' : 'CV dosyası yüklemeniz zorunludur.');
      return;
    }

    // Client-side double check
    if (file.type !== 'application/pdf' || file.size > 600 * 1024) {
      setFormErrors(isEn ? 'Invalid CV file format or size.' : 'Geçersiz CV formatı veya dosya boyutu.');
      return;
    }

    startTransition(async () => {
      const result = await submitJobApplication(formData);
      if (result.success) {
        setFormSuccess(isEn ? 'Your application has been submitted successfully.' : 'Başvurunuz başarıyla alınmıştır.');
        setSelectedFileName('');
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        setFormErrors(result.error || (isEn ? 'An error occurred. Please try again.' : 'Bir hata oluştu. Lütfen tekrar deneyin.'));
      }
    });
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
                      setFormErrors(null);
                      setFormSuccess(null);
                      setSelectedFileName('');
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

                      {/* Application Form */}
                      <div className="border-t border-slate-100 pt-8 flex flex-col gap-6">
                        <h4 className="font-bold text-[#111111] text-base">
                          {isEn ? `Apply for ${title}` : `${title} Pozisyonuna Başvur`}
                        </h4>

                        <form onSubmit={(e) => handleFormSubmit(e, pos.id)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Honeypot field (hidden from screen readers & users) */}
                          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                            <input
                              type="text"
                              name="hp_field"
                              tabIndex={-1}
                              autoComplete="off"
                              placeholder="Do not fill this field"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                              {t.nameLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder={isEn ? 'John Doe' : 'Ahmet Yılmaz'}
                              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none w-full transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                              {t.emailLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="example@intechne.com.tr"
                              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none w-full transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                              {t.phoneLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              placeholder="0555 555 5555"
                              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none w-full transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                              {t.coverLabel}
                            </label>
                            <textarea
                              name="cover_letter"
                              rows={4}
                              placeholder={isEn ? 'Tell us why you want to join Intechne...' : 'Intechne ekibine neden katılmak istediğinizi kısaca açıklayın...'}
                              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none w-full transition-colors resize-none"
                            />
                          </div>

                          {/* CV File Upload */}
                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                              {t.cvLabel} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2">
                                <Upload className="w-4 h-4 text-[#01c1d3]" />
                                {isEn ? 'Choose File' : 'Dosya Seç'}
                                <input
                                  type="file"
                                  name="cv"
                                  accept=".pdf,application/pdf"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  required
                                />
                              </label>
                              {selectedFileName ? (
                                <span className="text-xs text-emerald-600 font-semibold truncate max-w-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {selectedFileName}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  {isEn ? 'No file chosen' : 'Dosya seçilmedi'}
                                </span>
                              )}
                            </div>
                            {fileValidationErr && (
                              <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {fileValidationErr}
                              </span>
                            )}
                          </div>

                          {/* KVKK Consent Checkbox */}
                          <div className="flex items-start gap-2.5 md:col-span-2 mt-2">
                            <input
                              type="checkbox"
                              name="kvkk_approved"
                              id={`kvkk-${pos.id}`}
                              required
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#01c1d3] focus:ring-[#01c1d3]"
                            />
                            <label htmlFor={`kvkk-${pos.id}`} className="text-slate-600 text-xs font-medium leading-relaxed">
                              {isEn ? (
                                <>
                                  I read and accept the{' '}
                                  <a href="/en/privacy-policy" target="_blank" className="text-[#01c1d3] hover:underline font-bold">
                                    KVKK Clarification Text
                                  </a>
                                  .
                                </>
                              ) : (
                                <>
                                  <a href="/tr/kvkk" target="_blank" className="text-[#01c1d3] hover:underline font-bold">
                                    KVKK Aydınlatma Metnini
                                  </a>{' '}
                                  okudum ve kabul ediyorum. <span className="text-red-500">*</span>
                                </>
                              )}
                            </label>
                          </div>

                          {/* Status Alerts */}
                          {formErrors && (
                            <div className="md:col-span-2 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2.5 text-red-600 text-xs font-bold">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{formErrors}</span>
                            </div>
                          )}

                          {formSuccess && (
                            <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-2.5 text-emerald-700 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>{formSuccess}</span>
                            </div>
                          )}

                          {/* Submit Button */}
                          <div className="md:col-span-2 flex justify-end mt-4">
                            <button
                              type="submit"
                              disabled={isPending || !!fileValidationErr}
                              className="bg-[#01c1d3] hover:bg-[#009cb0] disabled:bg-slate-200 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors duration-200 shadow-md shadow-[#01c1d3]/10"
                            >
                              {isPending ? t.submittingBtn : t.submitBtn}
                            </button>
                          </div>

                        </form>
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

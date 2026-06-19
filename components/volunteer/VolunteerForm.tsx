'use client';

import { useState, useTransition } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { submitVolunteerForm } from '@/src/actions/volunteers';
import { User, Calendar, Users, Phone, MapPin, Briefcase, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

interface VolunteerFormProps {
  isEn: boolean;
}

export function VolunteerForm({ isEn }: VolunteerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [kvkkChecked, setKvkkChecked] = useState(false);

  // Localization resources
  const t = {
    nameLabel: isEn ? 'Full Name' : 'Ad Soyad',
    birthLabel: isEn ? 'Birth Date' : 'Doğum Tarihi',
    genderLabel: isEn ? 'Gender' : 'Cinsiyet',
    genderSelect: isEn ? 'Select Gender' : 'Cinsiyet Seçiniz',
    female: isEn ? 'Female' : 'Kadın',
    male: isEn ? 'Male' : 'Erkek',
    phoneLabel: isEn ? 'Phone Number' : 'Telefon Numarası',
    cityLabel: isEn ? 'City you live in' : 'Yaşadığınız Şehir',
    jobLabel: isEn ? 'Employment / Education Status' : 'İş/Eğitim Durumu',
    schoolLabel: isEn ? 'School / Department' : 'Okul / Bölüm',
    allergyLabel: isEn ? 'Food Allergies (Optional)' : 'Gıda Alerjisi (Opsiyonel)',
    medicalLabel: isEn ? 'Medical Conditions / Illnesses (Optional)' : 'Rahatsızlık Durumu (Opsiyonel)',
    kvkkText: isEn ? (
      <>
        I read and approve the processing of my personal health data for volunteering registration under the{' '}
        <a href="/en/privacy-policy" target="_blank" className="text-[#01c1d3] font-bold hover:underline">
          KVKK Clarification Text
        </a>
        .
      </>
    ) : (
      <>
        Gönüllü kaydı kapsamında özel nitelikli kişisel sağlık verilerimin işlenmesini{' '}
        <a href="/tr/kvkk" target="_blank" className="text-[#01c1d3] font-bold hover:underline">
          KVKK Aydınlatma Metni
        </a>{' '}
        çerçevesinde okudum ve onaylıyorum.
      </>
    ),

    submitBtn: isEn ? 'Become a Volunteer' : 'Gönüllü Ol',
    submittingBtn: isEn ? 'Submitting...' : 'Başvuru İletiliyor...',
    successMsg: isEn ? 'Your application has been received successfully!' : 'Gönüllü başvurunuz başarıyla alınmıştır!',
    placeholderName: isEn ? 'John Doe' : 'Ahmet Yılmaz',
    placeholderPhone: '0555 555 5555',
    placeholderCity: isEn ? 'Istanbul' : 'İstanbul',
    placeholderJob: isEn ? 'Student / Software Engineer' : 'Öğrenci / Yazılım Mühendisi',
    placeholderSchool: isEn ? 'ITU - Computer Engineering' : 'İTÜ - Bilgisayar Mühendisliği',
    placeholderAllergies: isEn ? 'Gluten, nuts etc.' : 'Gluten, kuruyemiş vb.',
    placeholderMedical: isEn ? 'Diabetes, asthma etc.' : 'Diyabet, astım vb.',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!kvkkChecked) {
      toast.error(isEn ? 'Please approve the KVKK consent.' : 'Lütfen KVKK onay kutusunu işaretleyiniz.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitVolunteerForm(formData);
      if (result.success) {
        toast.success(t.successMsg, { duration: 5000 });
        form.reset();
        setKvkkChecked(false);
      } else {
        toast.error(result.error || (isEn ? 'Submission failed.' : 'Başvuru iletilemedi.'));
      }
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-100 rounded-[32px] p-6 md:p-12 shadow-sm relative overflow-hidden">
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
        {/* Honeypot Spam Bot Protection (Invisible to users & screenreaders) */}
        <div className="opacity-0 absolute pointer-events-none" aria-hidden="true" style={{ display: 'none' }}>
          <input
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            placeholder="Do not fill this field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Soyad */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#01c1d3]" />
              {t.nameLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="name_surname"
              required
              placeholder={t.placeholderName}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* Doğum Tarihi */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#01c1d3]" />
              {t.birthLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="date"
              name="birth_date"
              required
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* Cinsiyet */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#01c1d3]" />
              {t.genderLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              name="gender"
              required
              defaultValue=""
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-400">{t.genderSelect}</option>
              <option value="Kadin">{t.female}</option>
              <option value="Erkek">{t.male}</option>
            </select>
          </div>

          {/* Telefon */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#01c1d3]" />
              {t.phoneLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder={t.placeholderPhone}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* Yaşadığınız Şehir */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#01c1d3]" />
              {t.cityLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="city"
              required
              placeholder={t.placeholderCity}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* İş/Eğitim Durumu */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#01c1d3]" />
              {t.jobLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="employment_status"
              required
              placeholder={t.placeholderJob}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* Okul/Bölüm */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#01c1d3]" />
              {t.schoolLabel} <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="school_department"
              required
              placeholder={t.placeholderSchool}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors"
            />
          </div>

          {/* Gıda Alerjisi */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#01c1d3]" />
              {t.allergyLabel}
            </label>
            <textarea
              name="food_allergies"
              rows={3}
              placeholder={t.placeholderAllergies}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors resize-none font-sans"
            />
          </div>

          {/* Rahatsızlık Durumu */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#01c1d3]" />
              {t.medicalLabel}
            </label>
            <textarea
              name="medical_conditions"
              rows={3}
              placeholder={t.placeholderMedical}
              className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3.5 text-sm focus:outline-none w-full transition-colors resize-none font-sans"
            />
          </div>
        </div>

        {/* KVKK Consent Checkbox */}
        <div className="flex items-start gap-3 mt-2 border-t border-slate-100 pt-6">
          <input
            type="checkbox"
            name="kvkk_consent"
            id="kvkk_consent"
            checked={kvkkChecked}
            onChange={(e) => setKvkkChecked(e.target.checked)}
            required
            className="mt-1 h-5 w-5 rounded border-slate-350 bg-white text-[#01c1d3] focus:ring-[#01c1d3] transition-all cursor-pointer"
          />
          <label htmlFor="kvkk_consent" className="text-slate-600 text-xs font-medium leading-relaxed cursor-pointer select-none">
            {t.kvkkText} <span className="text-red-500 font-bold">*</span>
          </label>
        </div>

        {/* Submit button wrapper */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#01c1d3] hover:bg-[#009cb0] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 shadow-md shadow-[#01c1d3]/10 hover:shadow-[#01c1d3]/20 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.submittingBtn}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t.submitBtn}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

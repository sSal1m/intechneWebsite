'use client';

import { useState, useTransition } from 'react';
import { submitJobApplication } from '@/src/actions/careers';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface JobApplyFormProps {
  isEn: boolean;
  positionId: string;
  positionTitle: string;
}

export function JobApplyForm({ isEn, positionId, positionTitle }: JobApplyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fileValidationErr, setFileValidationErr] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const t = {
    emailLabel: isEn ? 'Email Address' : 'E-posta Adresi',
    phoneLabel: isEn ? 'Phone Number' : 'Telefon Numarası',
    coverLabel: isEn ? 'Cover Letter (Optional, Max 2000 Chars)' : 'Niyet Mektubu (Opsiyonel, Maks 2000 Karakter)',
    cvLabel: isEn ? 'Upload CV (PDF, Max 600KB)' : 'CV Yükle (PDF, Maks 600KB)',
    submitBtn: isEn ? 'Submit Application' : 'Başvuruyu Gönder',
    submittingBtn: isEn ? 'Submitting...' : 'Gönderiliyor...',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileValidationErr(null);
    setSelectedFileName('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setFileValidationErr(isEn ? 'Only PDF files are allowed.' : 'Sadece PDF formatında CV yükleyebilirsiniz.');
      e.target.value = '';
      return;
    }

    if (file.size > 600 * 1024) {
      setFileValidationErr(isEn ? 'File size must be 600KB or less.' : 'Dosya boyutu en fazla 600KB olmalıdır.');
      e.target.value = '';
      return;
    }

    setSelectedFileName(file.name);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors(null);
    setFormSuccess(null);

    const formData = new FormData(e.currentTarget);
    formData.append('position_id', positionId);

    const kvkkCheckbox = formData.get('kvkk_approved');
    formData.set('kvkk_approved', kvkkCheckbox === 'on' ? 'true' : 'false');

    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setFormErrors(isEn ? 'CV file is required.' : 'CV dosyası yüklemeniz zorunludur.');
      return;
    }

    if (file.type !== 'application/pdf' || file.size > 600 * 1024) {
      setFormErrors(isEn ? 'Invalid CV file format or size.' : 'Geçersiz CV formatı veya dosya boyutu.');
      return;
    }

    startTransition(async () => {
      const result = await submitJobApplication(formData);
      if (result.success) {
        setFormSuccess(isEn ? 'Your application has been submitted successfully.' : 'Başvurunuz başarıyla alınmıştır.');
        setSelectedFileName('');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormErrors(result.error || (isEn ? 'An error occurred. Please try again.' : 'Bir hata oluştu. Lütfen tekrar deneyin.'));
      }
    });
  };

  return (
    <div className="border-t border-slate-100 pt-8 flex flex-col gap-6 w-full">
      <h4 className="font-bold text-[#111111] text-lg">
        {isEn ? `Apply for ${positionTitle}` : `${positionTitle} Pozisyonuna Başvur`}
      </h4>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Honeypot field */}
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
            {isEn ? 'First Name' : 'Ad'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            required
            placeholder={isEn ? 'John' : 'Ahmet'}
            className="bg-white border border-slate-200 focus:border-[#01c1d3] text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none w-full transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
            {isEn ? 'Last Name' : 'Soyad'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            required
            placeholder={isEn ? 'Doe' : 'Yılmaz'}
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

        <div className="flex flex-col gap-1.5">
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
            maxLength={2000}
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

        {/* KVKK Consent */}
        <div className="flex items-start gap-2.5 md:col-span-2 mt-2">
          <input
            type="checkbox"
            name="kvkk_approved"
            id={`kvkk-${positionId}`}
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#01c1d3] focus:ring-[#01c1d3]"
          />
          <label htmlFor={`kvkk-${positionId}`} className="text-slate-600 text-xs font-medium leading-relaxed">
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
            className="bg-[#01c1d3] hover:bg-[#009cb0] disabled:bg-slate-200 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors duration-200 shadow-md shadow-[#01c1d3]/10 cursor-pointer"
          >
            {isPending ? t.submittingBtn : t.submitBtn}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-white rounded-[2rem] p-6 lg:p-10 shadow-xl border border-slate-100 mb-12">
      {/* Left side Image */}
      <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
        <img 
          src="https://cdnv2.t3vakfi.org/media/uploaded/V2CUKth9TDqEoX7OpbBdkRJHyKaCRBtV.png" 
          alt="Contact Illustration" 
          className="w-full max-w-md object-contain"
        />
      </div>

      {/* Right side Form */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Bize Ulaşın</h2>
        <p className="text-slate-500 font-medium mb-8">
          Soru ve talepleriniz için aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.
        </p>

        {isSubmitted ? (
          <div className="bg-[#15a3b0]/10 border border-[#15a3b0]/20 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-[#15a3b0] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-[#15a3b0] mb-2">Mesajınız Gönderildi!</h3>
            <p className="text-slate-600 font-medium">
              En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="İsim Soyisim"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15a3b0]/20 focus:border-[#15a3b0] transition-all"
            />
            
            <input
              type="email"
              placeholder="E-Posta Adresi"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15a3b0]/20 focus:border-[#15a3b0] transition-all"
            />

            <input
              type="text"
              placeholder="Konu"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15a3b0]/20 focus:border-[#15a3b0] transition-all"
            />

            <textarea
              placeholder="Mesajınız"
              required
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15a3b0]/20 focus:border-[#15a3b0] transition-all resize-none"
            ></textarea>

            <div className="flex items-start gap-3 mt-2">
              <input 
                type="checkbox" 
                id="kvkk" 
                required 
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#15a3b0] focus:ring-[#15a3b0]"
              />
              <label htmlFor="kvkk" className="text-sm text-slate-600 font-medium leading-tight">
                <a 
                  href="https://drive.google.com/file/d/1l9YG0k9t0mWb1G2AzjiO16oY3K6ZdpGe/view?usp=drive_link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#15a3b0] hover:underline font-bold"
                >
                  KVKK Aydınlatma Metnini
                </a> okudum ve onaylıyorum.
              </label>
            </div>

            <button 
              type="submit"
              className="mt-4 w-full bg-[#15a3b0] hover:bg-[#128a95] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Mesajı Gönder
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

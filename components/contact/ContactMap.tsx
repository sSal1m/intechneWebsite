'use client';

import { MapPin, Mail } from 'lucide-react';

export function ContactMap() {
  return (
    <div className="bg-[#f8f9fa] rounded-3xl p-6 lg:p-10 mb-16 border border-slate-100">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Text Block */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center">
          <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#15a3b0]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#15a3b0]" />
            </span>
            Merkezimiz
          </h3>
          <p className="text-slate-600 font-medium text-lg leading-relaxed mb-6">
            İstanbul / Türkiye
          </p>
          <a 
            href="mailto:kurumsal@intechne.com.tr" 
            className="flex items-center gap-3 text-[#15a3b0] font-bold hover:text-[#128a95] transition-colors w-max group"
          >
            <div className="w-10 h-10 rounded-full bg-[#15a3b0]/10 flex items-center justify-center group-hover:bg-[#15a3b0]/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            kurumsal@intechne.com.tr
          </a>
        </div>

        {/* Map Iframe */}
        <div className="w-full lg:w-[60%] h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-inner bg-slate-200">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.79327429152!2d28.87175402096894!3d41.00549580879659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

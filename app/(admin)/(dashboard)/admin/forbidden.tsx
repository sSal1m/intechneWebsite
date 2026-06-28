'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h2 className="text-2xl font-black text-white">403 - Yetkisiz Erişim</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Bu sayfayı görüntülemek veya bu işlemi gerçekleştirmek için gerekli yetkilere sahip değilsiniz. Lütfen yöneticinizle iletişime geçin.
        </p>
      </div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 bg-[#01c1d3]/10 hover:bg-[#01c1d3] text-primary hover:text-slate-950 border border-[#01c1d3]/20 hover:border-primary font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Panel Ana Sayfasına Dön
      </Link>
    </div>
  );
}

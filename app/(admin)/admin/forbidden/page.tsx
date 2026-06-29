'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-black text-neutral-100 gap-6">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-2xl shadow-red-950/20 mb-2">
        <ShieldAlert className="w-10 h-10 animate-pulse" />
      </div>
      <div className="flex flex-col gap-3 max-w-md">
        <h2 className="text-3xl font-black text-white">403 - Yetkisiz Erişim</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Hesabınız başarıyla doğrulandı ancak bu paneli görüntülemek veya bu sayfaya erişmek için gerekli yetkilere (role) sahip değilsiniz. Lütfen yöneticinizle iletişime geçin.
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-950/20"
      >
        <LogOut className="w-4 h-4" />
        Çıkış Yap ve Tekrar Giriş Dene
      </button>
    </div>
  );
}

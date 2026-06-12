'use client';

import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isDummyMode = !url || !key || !url.startsWith('http') || key.includes('your-supabase');

    if (isDummyMode) {
      if (email === 'admin@intechne.com.tr' && password === 'admin123') {
        document.cookie = "sb-dummy-session=true; path=/; max-age=86400";
        router.push('/admin');
        router.refresh();
        setLoading(false);
        return;
      } else {
        setError('Demo modundasınız. Giriş yapmak için admin@intechne.com.tr ve admin123 şifresini kullanın.');
        setLoading(false);
        return;
      }
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10 backdrop-blur-md bg-opacity-70">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl text-primary tracking-wider">INTECHNE</span>
            <span className="bg-slate-800 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded">CMS</span>
          </div>
          <p className="text-slate-400 text-xs">Yönetici Girişi</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@intechne.com.tr"
              className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors w-full font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors w-full font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-slate-950 font-bold py-3 px-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

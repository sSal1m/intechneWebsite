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
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.avif"
              alt="Intechne Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="bg-neutral-800 text-[10px] text-neutral-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              CMS
            </span>
          </div>
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Yönetici Girişi</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              className="bg-black border border-[#1f1f1f] text-white placeholder-neutral-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors w-full font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-300 text-xs font-semibold uppercase tracking-wider">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black border border-[#1f1f1f] text-white placeholder-neutral-700 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors w-full font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-black font-bold py-3 px-4 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

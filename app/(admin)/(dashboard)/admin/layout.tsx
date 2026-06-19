'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { 
  LayoutDashboard, 
  Sliders, 
  FileText, 
  Users, 
  BookOpen, 
  Mail, 
  LogOut,
  FolderArchive,
  TrendingUp,
  Trash2,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  async function handleSignOut() {
    document.cookie = "sb-dummy-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    router.push('/admin/login');
    router.refresh();
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Slayt', href: '/admin/sliders', icon: Sliders },
    { label: 'Marka Sayfaları', href: '/admin/brands', icon: Cpu },
    { label: 'İstatistik', href: '/admin/stats', icon: TrendingUp },
    { label: 'Haber', href: '/admin/news', icon: FileText },
    { label: 'Ekip', href: '/admin/team', icon: Users },
    { label: 'İnteraktif Yayınlar', href: '/admin/interactive', icon: BookOpen },
    { label: 'Kurumsal Kimlik', href: '/admin/identity', icon: FolderArchive },
    { label: 'Gelen Mesajlar', href: '/admin/messages', icon: Mail },
    { label: 'Çöp Kutusu', href: '/admin/trash', icon: Trash2 },
  ];

  return (
    <div className="flex min-h-screen bg-black text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col justify-between p-6 flex-shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.avif"
              alt="Intechne Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="bg-neutral-800 text-[10px] text-neutral-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              CMS
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-2 px-3">
              YÖNETİM BÖLÜMLERİ
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-neutral-400 hover:bg-[#161616] hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-neutral-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1f1f1f] bg-[#0a0a0a] flex items-center justify-between px-8">
          <h1 className="font-bold text-base text-neutral-300">
            {menuItems.find((item) => item.href === pathname)?.label || 'Yönetim Paneli'}
          </h1>
          <div className="flex items-center gap-4">
            {isOnline ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-400">Aktif</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-red-400 font-bold">Bağlantı Yok (Çevrimdışı)</span>
              </>
            )}
          </div>
        </header>

        {/* Content Box */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

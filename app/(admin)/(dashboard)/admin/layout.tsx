'use client';

import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { 
  LayoutDashboard, 
  Sliders, 
  FileText, 
  Users, 
  BookOpen, 
  Mail, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

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
    { label: 'Slayt & İstatistik', href: '/admin/sliders', icon: Sliders },
    { label: 'Haber Yönetimi', href: '/admin/news', icon: FileText },
    { label: 'Ekip Yönetimi', href: '/admin/team', icon: Users },
    { label: 'İnteraktif Yayınlar', href: '/admin/interactive', icon: BookOpen },
    { label: 'Gelen Mesajlar', href: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-6 flex-shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl text-primary tracking-wider">INTECHNE</span>
            <span className="bg-slate-800 text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded">CMS</span>
          </div>

          <nav className="flex flex-col gap-1.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 px-3">
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
                      ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-lg shadow-primary/5'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
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
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">
          <h1 className="font-bold text-base text-slate-300">
            {menuItems.find((item) => item.href === pathname)?.label || 'Yönetim Paneli'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Canlı Sistem</span>
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

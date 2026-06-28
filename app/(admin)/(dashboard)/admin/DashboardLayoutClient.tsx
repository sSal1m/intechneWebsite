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
  Trash2,
  Cpu,
  Briefcase,
  Heart,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { AdminRole } from '@/src/utils/supabase/role-server';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  role: AdminRole;
}

function formatTime(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${d}.${m}.${y} ${h}:${min}:${s}`;
}

export default function DashboardLayoutClient({ children, role }: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Set initial timestamp on mount
    setLastUpdated(formatTime(new Date()));

    // Subscribe to all changes in the public schema
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload: Record<string, unknown>) => {
          console.log('Realtime database change detected:', payload);
          // Silently refresh the page data
          router.refresh();
          // Update timestamp to the current time
          setLastUpdated(formatTime(new Date()));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

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
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    router.push('/admin/login');
    router.refresh();
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Slayt', href: '/admin/sliders', icon: Sliders },
    { label: 'Markalarımız', href: '/admin/brands', icon: Cpu },
    { label: 'Haber', href: '/admin/news', icon: FileText },
    { label: 'Ekip', href: '/admin/team', icon: Users },
    { label: 'I-Talks', href: '/admin/i-talks', icon: BookOpen },
    { label: 'Kurumsal Kimlik', href: '/admin/identity', icon: FolderArchive },
    { label: 'Gelen Mesajlar', href: '/admin/messages', icon: Mail },
    { label: 'Kariyer', href: '/admin/careers', icon: Briefcase },
    { label: 'Gönüllüler', href: '/admin/volunteers', icon: Heart },
    { label: 'Çöp Kutusu', href: '/admin/trash', icon: Trash2 },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (role === 'operations_manager') {
      return (
        item.href === '/admin' ||
        item.href === '/admin/messages' ||
        item.href === '/admin/careers' ||
        item.href === '/admin/volunteers'
      );
    }
    if (role === 'admin') {
      return (
        item.href === '/admin' ||
        item.href === '/admin/sliders' ||
        item.href === '/admin/brands' ||
        item.href === '/admin/news' ||
        item.href === '/admin/team' ||
        item.href === '/admin/i-talks' ||
        item.href === '/admin/careers' ||
        item.href === '/admin/trash'
      );
    }
    // super_admin gets all items
    return true;
  });

  return (
    <div className="flex min-h-screen bg-black text-neutral-100">
      {/* Sidebar */}
      <aside className={`bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col justify-between flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen 
          ? 'w-64 p-6 opacity-100' 
          : 'w-0 p-0 opacity-0 border-r-0 overflow-hidden pointer-events-none'
      }`}>
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
            
            {filteredMenuItems.map((item) => {
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#161616] rounded-xl text-neutral-400 hover:text-white transition-colors"
              title={isSidebarOpen ? "Menüyü Gizle" : "Menüyü Göster"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-base text-neutral-300">
              {menuItems.find((item) => item.href === pathname)?.label || 'Yönetim Paneli'}
            </h1>
          </div>
          <div className="flex items-center gap-4 font-sans">
            {/* Show authenticated role badge */}
            <span className="text-[10px] font-black uppercase bg-neutral-800 text-neutral-400 px-2 py-1 rounded border border-neutral-700">
              {role.replace('_', ' ')}
            </span>
            {isOnline ? (
              <>
                {lastUpdated && (
                  <span className="text-xs text-neutral-400 hidden sm:inline">
                    Son Güncelleme: <span className="font-mono">{lastUpdated}</span>
                  </span>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-400">Aktif</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-red-400 font-bold">Bağlantı Yok</span>
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

import { createClient } from '@/src/utils/supabase/server';
import { Mail, FileText, Users, Sliders, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for the admin dashboard home

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts from Supabase
  const { count: newsCount } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true });

  const { count: messagesCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  const { count: teamCount } = await supabase
    .from('team')
    .select('*', { count: 'exact', head: true });

  const { count: slidersCount } = await supabase
    .from('sliders')
    .select('*', { count: 'exact', head: true });

  // Fetch 5 recent messages
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Gelen Mesajlar', value: messagesCount || 0, href: '/admin/messages', icon: Mail, color: 'text-primary bg-primary/10' },
    { label: 'Haber Sayısı', value: newsCount || 0, href: '/admin/news', icon: FileText, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Ekip Üyeleri', value: teamCount || 0, href: '/admin/team', icon: Users, color: 'text-amber-400 bg-amber-400/10' },
    { label: 'Aktif Slaytlar', value: slidersCount || 0, href: '/admin/sliders', icon: Sliders, color: 'text-indigo-400 bg-indigo-400/10' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Card */}
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-4xl">
        <h2 className="text-xl font-black text-white mb-2">Yönetim Paneline Hoş Geldiniz</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          CMS üzerinden ana sayfa slaytlarını, haberleri, ekip listesini ve interaktif yayınları yönetebilir, Bize Ulaşın formu üzerinden gelen mesajları görüntüleyebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                <span className="text-3xl font-black text-white group-hover:text-primary transition-colors">
                  {stat.value}
                </span>
              </div>
              <div className={`p-4 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages Area */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 max-w-4xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Son Gelen Mesajlar
          </h3>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages && recentMessages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {recentMessages.map((msg: any) => (
              <div
                key={msg.id}
                className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 rounded-xl p-4 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{msg.name}</span>
                    <span className="text-slate-500 text-xs">{msg.email}</span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-slate-500 text-[10px] font-bold uppercase self-start sm:self-center">
                  {new Date(msg.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Henüz gelen bir mesaj bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}

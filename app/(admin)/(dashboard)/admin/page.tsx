import { createClient } from '@/src/utils/supabase/server';
import { Mail, FileText, Users, Sliders, ArrowRight, FolderArchive, BookOpen, Briefcase, Heart } from 'lucide-react';
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

  const { count: identityCount } = await supabase
    .from('corporate_identity')
    .select('*', { count: 'exact', head: true });

  const { count: interactiveCount } = await supabase
    .from('interactive')
    .select('*', { count: 'exact', head: true });

  const { count: applicationsCount } = await supabase
    .from('job_applications')
    .select('*', { count: 'exact', head: true });

  const { count: volunteersCount } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact', head: true });

  // Fetch 3 recent messages
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch 3 recent job applications
  const { data: recentApplications } = await supabase
    .from('job_applications')
    .select('*, job_positions(title_tr)')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch 3 recent volunteers
  const { data: recentVolunteers } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const stats = [
    { label: 'Gelen Mesajlar', value: messagesCount || 0, href: '/admin/messages', icon: Mail, color: 'text-primary bg-primary/10' },
    { label: 'Gelen Başvurular', value: applicationsCount || 0, href: '/admin/careers', icon: Briefcase, color: 'text-violet-400 bg-violet-400/10' },
    { label: 'Gönüllüler', value: volunteersCount || 0, href: '/admin/volunteers', icon: Heart, color: 'text-rose-400 bg-rose-400/10' },
    { label: 'Haber Sayısı', value: newsCount || 0, href: '/admin/news', icon: FileText, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Ekip Üyeleri', value: teamCount || 0, href: '/admin/team', icon: Users, color: 'text-amber-400 bg-amber-400/10' },
    { label: 'Aktif Slaytlar', value: slidersCount || 0, href: '/admin/sliders', icon: Sliders, color: 'text-indigo-400 bg-indigo-400/10' },
    { label: 'Kurumsal Kimlik', value: identityCount || 0, href: '/admin/identity', icon: FolderArchive, color: 'text-pink-400 bg-pink-400/10' },
    { label: 'I-Talks', value: interactiveCount || 0, href: '/admin/i-talks', icon: BookOpen, color: 'text-cyan-400 bg-cyan-400/10' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Card */}
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-4xl">
        <h2 className="text-xl font-black text-white mb-2">Yönetim Paneline Hoş Geldiniz</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Destek için: better call seha.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* Three Columns for Messages, Applications and Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Recent Messages Area */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
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
                  className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 rounded-xl p-4 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-3">
                      <span className="font-bold text-sm text-white truncate max-w-[120px]">
                        {msg.first_name ? `${msg.first_name} ${msg.last_name || ''}`.trim() : msg.name}
                      </span>
                      <span className="text-slate-500 text-xs truncate">{msg.email}</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2">{msg.message}</p>
                  </div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase self-end">
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

        {/* Recent Applications Area */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-400" />
              Son Gelen Başvurular
            </h3>
            <Link
              href="/admin/careers"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Tümünü Gör
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications && recentApplications.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentApplications.map((app: any) => {
                const positionTitle = app.position_title_tr || app.job_positions?.title_tr || 'Kapatılmış / Silinmiş Pozisyon';
                return (
                  <div
                    key={app.id}
                    className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 rounded-xl p-4 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-3">
                        <span className="font-bold text-sm text-white truncate max-w-[120px]">{app.name}</span>
                        <span className="text-slate-500 text-xs truncate">{app.email}</span>
                      </div>
                      <p className="text-slate-400 text-xs font-medium mt-1">
                        Pozisyon: <span className="text-violet-400 font-bold">{positionTitle}</span>
                      </p>
                    </div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase self-end">
                      {new Date(app.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Henüz gelen bir başvuru bulunmuyor.
            </div>
          )}
        </div>

        {/* Recent Volunteers Area */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Son Gönüllü Başvuruları
            </h3>
            <Link
              href="/admin/volunteers"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Tümünü Gör
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentVolunteers && recentVolunteers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentVolunteers.map((vol: any) => (
                <div
                  key={vol.id}
                  className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 rounded-xl p-4 transition-colors flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-3">
                      <span className="font-bold text-sm text-white truncate max-w-[120px]">{vol.first_name} {vol.last_name}</span>
                      <span className="text-slate-500 text-xs truncate">{vol.phone}</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      Şehir: <span className="text-slate-300 font-medium">{vol.city}</span> | 
                      Durum: <span className="text-slate-300 font-medium">{vol.employment_status}</span>
                    </p>
                  </div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase self-end">
                    {new Date(vol.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              Henüz gelen bir gönüllü başvurusu bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

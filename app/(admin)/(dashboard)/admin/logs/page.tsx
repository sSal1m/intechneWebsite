import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getAdminLogs } from '@/src/actions/admin-logs';
import { LogsManager } from './LogsManager';

export const revalidate = 0;

export default async function AdminLogsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== 'super_admin') {
    redirect('/admin');
  }

  // Fetch initial page of logs
  const initialData = await getAdminLogs({
    page: 1,
    limit: 25,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Sistem İşlem Günlükleri</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Yetkili super_admin İşlem Logları ve Güvenlik Denetimleri
        </p>
      </div>

      <LogsManager 
        initialLogs={initialData.logs} 
        initialTotalCount={initialData.totalCount} 
      />
    </div>
  );
}

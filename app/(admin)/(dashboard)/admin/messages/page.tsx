import { getMessages } from '@/src/actions/messages';
import { MessagesList } from './MessagesList';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { forbidden } from 'next/navigation';

export const revalidate = 0; // Disable cache for message inbox

export default async function AdminMessagesPage() {
  const { role } = await getServerUserAndRole();
  if (role !== 'super_admin' && role !== 'operations_manager') {
    forbidden();
  }

  const messages = await getMessages();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Gelen Mesaj Kutusu</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kamu Bize Ulaşın Formu Üzerinden Gönderilen Bildirimler
        </p>
      </div>

      <MessagesList initialMessages={messages} />
    </div>
  );
}

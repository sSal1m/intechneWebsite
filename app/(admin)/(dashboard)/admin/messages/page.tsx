import { getMessages } from '@/src/actions/messages';
import { MessagesList } from './MessagesList';

export const revalidate = 0; // Disable cache for message inbox

export default async function AdminMessagesPage() {
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

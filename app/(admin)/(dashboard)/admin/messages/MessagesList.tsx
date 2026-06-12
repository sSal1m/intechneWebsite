'use client';

import { useState, useTransition } from 'react';
import { deleteMessage } from '@/src/actions/messages';
import { Trash2, Calendar, User, Phone, Mail, FileText } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at: string;
}

interface MessagesListProps {
  initialMessages: Message[];
}

export function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;

    startTransition(async () => {
      const result = await deleteMessage(id);
      if (result.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Silme işlemi başarısız: ' + result.error);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left List */}
      <div className="lg:col-span-5 flex flex-col gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
            Gelen kutusu boş.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`bg-slate-950 border rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col gap-3 group relative ${
                selectedMessage?.id === msg.id
                  ? 'border-primary shadow-lg shadow-primary/5'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-bold text-sm text-white line-clamp-1">{msg.name}</span>
                  <span className="text-slate-400 text-xs line-clamp-1">{msg.subject || 'Konu Yok'}</span>
                </div>
                
                <button
                  onClick={(e) => handleDelete(msg.id, e)}
                  disabled={isPending}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                  aria-label="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1">
                <span>{msg.email}</span>
                <span>{new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Detail Card */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[400px] shadow-xl flex flex-col justify-between">
        {selectedMessage ? (
          <div className="flex flex-col gap-6 h-full justify-between">
            <div className="flex flex-col gap-5">
              {/* Header Info */}
              <div className="border-b border-slate-800 pb-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gönderen</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {selectedMessage.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary transition-colors">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject & Message body */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  {selectedMessage.subject || 'Konu Yok'}
                </div>
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
              </div>
              
              <button
                onClick={(e) => handleDelete(selectedMessage.id, e)}
                disabled={isPending}
                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Bu Mesajı Sil
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Mail className="w-12 h-12 text-slate-800 animate-bounce" />
            <p className="text-sm">Detayları görüntülemek için sol taraftan bir mesaj seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

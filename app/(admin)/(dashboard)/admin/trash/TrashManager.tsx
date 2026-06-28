'use client';

import { useState, useEffect, useTransition } from 'react';
import { restoreFromTrash, deletePermanently } from '@/src/actions/trash-bin';
import { RotateCcw, Trash2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useAdminRole } from '@/src/utils/supabase/role-client';

interface TrashItem {
  id: string;
  entity_type: string;
  entity_id: string;
  original_data: any;
  file_paths: string[];
  deleted_at: string;
}

interface TrashManagerProps {
  initialItems: TrashItem[];
}

export function TrashManager({ initialItems }: TrashManagerProps) {
  const { role } = useAdminRole();
  const [items, setItems] = useState<TrashItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Sync props to state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems);
  }, [initialItems]);

  // Confirm delete modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Update timers every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  function getEntityTypeName(type: string) {
    switch (type) {
      case 'sliders':
        return 'Slayt';
      case 'news':
        return 'Haber';
      case 'team':
        return 'Ekip Üyesi';
      case 'corporate_identity':
        return 'Kurumsal Kimlik';
      case 'interactive':
        return 'I-Talks';
      case 'messages':
        return 'Mesaj';
      case 'job_positions':
        return 'Açık Pozisyon';
      case 'job_applications':
        return 'İş Başvurusu';
      case 'volunteers':
        return 'Gönüllü';
      default:
        return type;
    }
  }

  function getEntityTypeBadgeColor(type: string) {
    switch (type) {
      case 'sliders':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'news':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'team':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'corporate_identity':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'interactive':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'messages':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'job_positions':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'job_applications':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'volunteers':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  }

  function getItemName(item: TrashItem) {
    const data = item.original_data;
    if (!data) return 'Bilinmeyen Öge';
    
    if (item.entity_type === 'team') {
      return data.name || 'İsimsiz Üye';
    }
    if (item.entity_type === 'messages') {
      return `${data.name} - ${data.subject || 'Konusuz Mesaj'}`;
    }
    if (item.entity_type === 'job_applications') {
      const fullName = `${data.first_name || ''} ${data.last_name || data.name || ''}`.trim();
      return `${fullName || 'İsimsiz Aday'} - ${data.position_title_tr || 'Pozisyon Bilgisi Yok'}`;
    }
    if (item.entity_type === 'volunteers') {
      const fullName = `${data.first_name || ''} ${data.last_name || data.name_surname || ''}`.trim();
      return `${fullName || 'İsimsiz Gönüllü'} (${data.phone || ''})`;
    }
    if (item.entity_type === 'job_positions') {
      return data.title_tr || 'Başlıksız Pozisyon';
    }
    return data.title_tr || data.title || 'Başlıksız Öge';
  }

  function getRemainingMetrics(deletedAt: string) {
    const deletionTime = new Date(deletedAt).getTime();
    const expireTime = deletionTime + 24 * 60 * 60 * 1000;
    const diff = expireTime - currentTime;

    if (diff <= 0) return { label: 'Süre Doldu', percent: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const percent = Math.max(0, Math.min(100, (diff / (24 * 60 * 60 * 1000)) * 100));

    let label = '';
    if (hours > 0) {
      label = `${hours} sa ${minutes} dk kaldı`;
    } else {
      label = `${minutes} dk kaldı`;
    }

    return { label, percent };
  }

  function handleRestore(trashId: string) {
    startTransition(async () => {
      const res = await restoreFromTrash(trashId);
      if (res.success) {
        setItems(items.filter(item => item.id !== trashId));
      } else {
        alert('Kurtarma hatası: ' + res.error);
      }
    });
  }

  function executePermanentDelete() {
    if (!itemToDelete) return;
    
    startTransition(async () => {
      const res = await deletePermanently(itemToDelete);
      if (res.success) {
        setItems(items.filter(item => item.id !== itemToDelete));
        setItemToDelete(null);
      } else {
        alert('Silme hatası: ' + res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executePermanentDelete}
        title="Ögeyi Kalıcı Olarak Sil"
        message="Bu ögeyi çöp kutusundan kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve ilişkili tüm görsel ile dökümanlar bulut depolama alanından tamamen temizlenir."
      />

      {/* Info Callout Box (Intechne style) */}
      {items.length > 0 && (
        <div className="bg-[#01c1d3]/5 border border-[#01c1d3]/20 rounded-2xl p-5 flex items-start gap-4 shadow-lg shadow-[#01c1d3]/2">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Otomatik Temizlik Uyarısı</h5>
            <p className="text-slate-400 text-xs leading-relaxed max-w-4xl">
              Çöpe taşınan tüm içerik ve medya dosyaları Next.js veritabanında geçici olarak saklanır. Silinme zamanından itibaren 24 saat boyunca kurtarılmayan kayıtlar, her çöp kutusu ekranı açıldığında sistem tarafından otomatik olarak kalıcı şekilde temizlenmektedir.
            </p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-center shadow-inner">
            <Trash2 className="w-8 h-8 text-neutral-600" />
          </div>
          <h4 className="text-white font-bold text-base mt-2">Çöp Kutunuz Temiz</h4>
          <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
            Son 24 saat içerisinde silinen herhangi bir slayt, haber, ekip üyesi, mesaj veya dosya bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2">
            <span>Mevcut Ögeler ({items.length})</span>
            <span>Kalan Süre (24 Saat Limit)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => {
              const metrics = getRemainingMetrics(item.deleted_at);
              return (
                <div
                  key={item.id}
                  className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#01c1d3]/30 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(1,193,211,0.03)] group"
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider shrink-0 mt-0.5 ${getEntityTypeBadgeColor(item.entity_type)}`}>
                      {getEntityTypeName(item.entity_type)}
                    </span>
                    
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-primary transition-colors duration-200">{getItemName(item)}</h4>
                      <span className="text-slate-500 text-xs mt-1 font-medium">
                        Silinme: {new Date(item.deleted_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  {/* Right: Timer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-5 w-full lg:w-auto border-t lg:border-t-0 border-[#1f1f1f] pt-4 lg:pt-0">
                    
                    {/* Visual Progress Countdown */}
                    <div className="flex flex-col items-end gap-1 font-sans shrink-0">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kalan Zaman</span>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{metrics.label}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:ml-2">
                      <button
                        onClick={() => handleRestore(item.id)}
                        disabled={isPending}
                        className="bg-[#01c1d3]/10 hover:bg-[#01c1d3] text-primary hover:text-slate-950 border border-[#01c1d3]/20 hover:border-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50"
                        title="Geri Yükle / Kurtar"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        Kurtar
                      </button>
                      {role === 'super_admin' && (
                        <button
                          onClick={() => {
                            setItemToDelete(item.id);
                            setDeleteConfirmOpen(true);
                          }}
                          disabled={isPending}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-slate-950 border border-red-500/20 hover:border-red-500 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50"
                          title="Kalıcı Olarak Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          Kalıcı Sil
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

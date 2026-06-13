'use client';

import { useState, useTransition } from 'react';
import { updateStat } from '@/src/actions/sliders';
import { Edit, TrendingUp, X } from 'lucide-react';

interface StatItem {
  id: string;
  value_tr: string;
  value_en: string;
  label_tr: string;
  label_en: string;
  order_index: number;
}

interface StatManagerProps {
  initialStats: StatItem[];
}

export function StatManager({ initialStats }: StatManagerProps) {
  const [globalStats, setGlobalStats] = useState<StatItem[]>(initialStats);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);

  // Form State
  const [statValueTr, setStatValueTr] = useState('');
  const [statValueEn, setStatValueEn] = useState('');
  const [statLabelTr, setStatLabelTr] = useState('');
  const [statLabelEn, setStatLabelEn] = useState('');

  function openEditStatModal(stat: StatItem) {
    setEditingStat(stat);
    setStatValueTr(stat.value_tr);
    setStatValueEn(stat.value_en);
    setStatLabelTr(stat.label_tr);
    setStatLabelEn(stat.label_en);
    setIsStatModalOpen(true);
  }

  function handleStatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStat) return;

    startTransition(async () => {
      const result = await updateStat(editingStat.id, {
        value_tr: statValueTr,
        value_en: statValueEn,
        label_tr: statLabelTr,
        label_en: statLabelEn,
      });

      if (result.success && result.data) {
        const updated = result.data[0];
        setGlobalStats(
          globalStats
            .map((s) => (s.id === editingStat.id ? updated : s))
            .sort((a, b) => a.order_index - b.order_index)
        );
        setIsStatModalOpen(false);
      } else {
        alert('İstatistik güncelleme hatası: ' + result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Sayılarla Biz İstatistikleri ({globalStats.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
        {globalStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative group flex flex-col gap-2"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-2xl font-black text-white">{stat.value_tr}</span>
              <span className="text-slate-400 text-xs font-bold">{stat.label_tr}</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold">{stat.label_en}</span>
            </div>

            <button
              onClick={() => openEditStatModal(stat)}
              className="absolute right-4 top-4 text-slate-500 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Düzenle"
              title="Düzenle"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* STAT MODAL */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsStatModalOpen(false)}
          />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">İstatistiği Düzenle</h3>
              <button
                onClick={() => setIsStatModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleStatSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Değer (TR)
                </label>
                <input
                  type="text"
                  required
                  value={statValueTr}
                  onChange={(e) => setStatValueTr(e.target.value)}
                  placeholder="9. Yıl"
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Değer (EN)
                </label>
                <input
                  type="text"
                  required
                  value={statValueEn}
                  onChange={(e) => setStatValueEn(e.target.value)}
                  placeholder="9th Year"
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Etiket (TR)
                </label>
                <input
                  type="text"
                  required
                  value={statLabelTr}
                  onChange={(e) => setStatLabelTr(e.target.value)}
                  placeholder="Kuruluş Yılı"
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Etiket (EN)
                </label>
                <input
                  type="text"
                  required
                  value={statLabelEn}
                  onChange={(e) => setStatLabelEn(e.target.value)}
                  placeholder="Foundation Year"
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                />
              </div>

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {isPending ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

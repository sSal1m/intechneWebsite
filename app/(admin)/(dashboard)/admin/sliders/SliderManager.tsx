'use client';

import { useState, useTransition, useEffect } from 'react';
import { createSlider, updateSlider, deleteSlider } from '@/src/actions/sliders';
import { Trash2, Edit, Plus, X, Upload, Layers, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Slider {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  button_label_tr?: string;
  button_label_en?: string;
  href?: string;
  image_url?: string;
  stats: any[];
  order_index: number;
}

interface SliderManagerProps {
  initialSliders: Slider[];
}

export function SliderManager({ initialSliders }: SliderManagerProps) {
  const [sliders, setSliders] = useState<Slider[]>(initialSliders);
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    setSliders(initialSliders);
  }, [initialSliders]);

  // Modals state
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<{ id: string; img?: string } | null>(null);

  // Slider Form state
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [btnLabelTr, setBtnLabelTr] = useState('');
  const [btnLabelEn, setBtnLabelEn] = useState('');
  const [href, setHref] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  // 3 Stats subform state for Slider
  const [sliderStats, setSliderStats] = useState<any[]>([
    { value: '', label: '', valueEn: '', labelEn: '' },
    { value: '', label: '', valueEn: '', labelEn: '' },
    { value: '', label: '', valueEn: '', labelEn: '' }
  ]);



  // Open modals
  function openAddSliderModal() {
    setEditingSlider(null);
    setTitleTr('');
    setTitleEn('');
    setDescriptionTr('');
    setDescriptionEn('');
    setBtnLabelTr('');
    setBtnLabelEn('');
    setHref('');
    setImageUrl('');
    setOrderIndex(sliders.length + 1);
    setSliderStats([
      { value: '', label: '', valueEn: '', labelEn: '' },
      { value: '', label: '', valueEn: '', labelEn: '' },
      { value: '', label: '', valueEn: '', labelEn: '' }
    ]);
    setIsSliderModalOpen(true);
  }

  function openEditSliderModal(slider: Slider) {
    setEditingSlider(slider);
    setTitleTr(slider.title_tr);
    setTitleEn(slider.title_en);
    setDescriptionTr(slider.description_tr);
    setDescriptionEn(slider.description_en);
    setBtnLabelTr(slider.button_label_tr || '');
    setBtnLabelEn(slider.button_label_en || '');
    setHref(slider.href || '');
    setImageUrl(slider.image_url || '');
    setOrderIndex(sliders.findIndex(s => s.id === slider.id) + 1);
    
    // Fill stats (pad to 3 items if shorter)
    const filledStats = [...(slider.stats || [])];
    while (filledStats.length < 3) {
      filledStats.push({ value: '', label: '', valueEn: '', labelEn: '' });
    }
    setSliderStats(filledStats.slice(0, 3));
    setIsSliderModalOpen(true);
  }



  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'sliders');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Yükleme başarısız');
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: any) {
      alert('Resim yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleSliderSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      // Filter out empty stats
      const cleanStats = sliderStats.filter(s => s.value || s.label);

      const payload = {
        title_tr: titleTr,
        title_en: titleEn,
        description_tr: descriptionTr,
        description_en: descriptionEn,
        button_label_tr: btnLabelTr,
        button_label_en: btnLabelEn,
        href,
        image_url: imageUrl,
        stats: cleanStats,
        order_index: Math.max(0, orderIndex - 1),
      };

      if (editingSlider) {
        const result = await updateSlider(editingSlider.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0];
          setSliders(sliders.map(s => s.id === editingSlider.id ? updated : s).sort((a,b) => a.order_index - b.order_index));
          setIsSliderModalOpen(false);
        } else {
          alert('Güncelleme hatası: ' + result.error);
        }
      } else {
        const result = await createSlider(payload);
        if (result.success && result.data) {
          const created = result.data[0];
          setSliders([...sliders, created].sort((a,b) => a.order_index - b.order_index));
          setIsSliderModalOpen(false);
        } else {
          alert('Ekleme hatası: ' + result.error);
        }
      }
    });
  }

  function executeSliderDelete() {
    if (!sliderToDelete) return;
    const { id, img } = sliderToDelete;
    startTransition(async () => {
      const result = await deleteSlider(id, img);
      if (result.success) {
        setSliders(sliders.filter(s => s.id !== id));
      } else {
        alert('Silme hatası: ' + result.error);
      }
    });
  }



  return (
    <div className="flex flex-col gap-10">
      {/* SECTION 1: SLIDERS */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Ana Sayfa Slaytları ({sliders.length})
          </h3>
          <button
            onClick={openAddSliderModal}
            className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
            title="Yeni Slayt Ekle"
          >
            <Plus className="w-4 h-4" />
            Yeni Slayt Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-5xl">
          {sliders.map((slider, idx) => (
            <div
              key={slider.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative group"
            >
              {/* Image Column */}
              <div className="w-full md:w-48 h-32 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {slider.image_url ? (
                  <img src={slider.image_url} alt="Slider Visual" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-600 text-xs">Görsel Yok</span>
                )}
              </div>

              {/* Detail Column */}
              <div className="flex-1 flex flex-col gap-3 min-w-0 pr-12">
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-white text-base line-clamp-1">{slider.title_tr}</h4>
                  <span className="text-slate-500 text-xs font-semibold uppercase">{slider.title_en}</span>
                </div>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{slider.description_tr}</p>

                {/* mini stats tags */}
                {slider.stats && slider.stats.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {slider.stats.map((s, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold px-2.5 py-1 rounded-lg">
                        {s.value}: {s.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions panel */}
              <div className="absolute right-6 top-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 pl-2">
                <a
                  href={slider.href ? `/tr${slider.href}` : '/tr'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  aria-label="Sitede Gör"
                  title="Sitede Gör"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openEditSliderModal(slider)}
                  className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  aria-label="Düzenle"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSliderToDelete({ id: slider.id, img: slider.image_url });
                    setDeleteConfirmOpen(true);
                  }}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  aria-label="Sil"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className="absolute bottom-6 right-6 text-[9px] font-bold text-slate-600 uppercase">
                Sıra: {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>



      {/* SLIDER MODAL */}
      {isSliderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSliderModalOpen(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-white text-base">
                {editingSlider ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}
              </h3>
              <button onClick={() => setIsSliderModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSliderSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
              {/* TR / EN Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Başlık (TR)</label>
                  <input
                    type="text"
                    required
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    placeholder="Cezeri Robot Ligi"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Başlık (EN)</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Cezeri Robot League"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* TR / EN Descriptions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Açıklama (TR)</label>
                <textarea
                  required
                  rows={2}
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Açıklama (EN)</label>
                <textarea
                  required
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none"
                />
              </div>

              {/* Button Action configs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Buton Metni (TR)</label>
                  <input
                    type="text"
                    value={btnLabelTr}
                    onChange={(e) => setBtnLabelTr(e.target.value)}
                    placeholder="Detaylı Bilgi"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Buton Metni (EN)</label>
                  <input
                    type="text"
                    value={btnLabelEn}
                    onChange={(e) => setBtnLabelEn(e.target.value)}
                    placeholder="Learn More"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Buton Linki</label>
                  <input
                    type="text"
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    placeholder="/markalarimiz/cezeri-robot-ligi"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Slayt Görseli</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-700">YOK</span>
                    )}
                  </div>
                  <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Slider mini-stats subform (3 items) */}
              <div className="border-t border-slate-850 pt-4 mt-2">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-3">
                  Slayt İstatistik Kartları (En Fazla 3 Adet)
                </label>
                
                <div className="flex flex-col gap-4">
                  {sliderStats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl grid grid-cols-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Kart {idx+1} Değer</span>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...sliderStats];
                            newStats[idx].value = e.target.value;
                            setSliderStats(newStats);
                          }}
                          placeholder="9. Yıl"
                          className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Etiket (TR / EN)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...sliderStats];
                              newStats[idx].label = e.target.value;
                              setSliderStats(newStats);
                            }}
                            placeholder="Kuruluş"
                            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:border-primary"
                          />
                          <input
                            type="text"
                            value={stat.labelEn || ''}
                            onChange={(e) => {
                              const newStats = [...sliderStats];
                              newStats[idx].labelEn = e.target.value;
                              setSliderStats(newStats);
                            }}
                            placeholder="Foundation"
                            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1.5 text-xs focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Sıra Numarası</label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {editingSlider 
                        ? `Toplam ${sliders.length} slayt var` 
                        : `Yeni eklenecek: ${sliders.length + 1}. slayt`
                      }
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1}
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary w-1/4 min-w-[80px]"
                  />
                </div>
              </div>

              <footer className="border-t border-slate-800 pt-5 mt-2 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSliderModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}


      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeSliderDelete}
        title="Slaytı Sil"
        message="Bu slaytı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}

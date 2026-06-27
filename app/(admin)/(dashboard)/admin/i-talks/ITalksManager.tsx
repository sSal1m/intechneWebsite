'use client';

import { useState, useTransition, useEffect } from 'react';
import { createITalksItem, updateITalksItem, deleteITalksItem } from '@/src/actions/i-talks';
import { Trash2, Edit, Plus, X, Upload, BookOpen, ExternalLink, Play } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ITalksItem {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category: string;
  type: 'report' | 'video' | 'interactive';
  file_url?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
}

interface ITalksManagerProps {
  initialItems: ITalksItem[];
}

export function ITalksManager({ initialItems }: ITalksManagerProps) {
  const [items, setItems] = useState<ITalksItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ITalksItem | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; img?: string; file?: string } | null>(null);

  // Form states
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [category, setCategory] = useState('projeler');
  const [type, setType] = useState<'report' | 'video' | 'interactive'>('report');
  const [fileUrl, setFileUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  function openAddModal() {
    setEditingItem(null);
    setTitleTr('');
    setTitleEn('');
    setDescriptionTr('');
    setDescriptionEn('');
    setCategory('projeler');
    setType('report');
    setFileUrl('');
    setVideoUrl('');
    setImageUrl('');
    setIsModalOpen(true);
  }

  function openEditModal(item: ITalksItem) {
    setEditingItem(item);
    setTitleTr(item.title_tr);
    setTitleEn(item.title_en);
    setDescriptionTr(item.description_tr);
    setDescriptionEn(item.description_en);
    setCategory(item.category);
    setType(item.type);
    setFileUrl(item.file_url || '');
    setVideoUrl(item.video_url || '');
    setImageUrl(item.image_url || '');
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'file') {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'image') setUploadingImage(true);
    else setUploadingFile(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'identity');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Yükleme başarısız');

      const data = await res.json();
      if (field === 'image') setImageUrl(data.url);
      else setFileUrl(data.url);
    } catch (err: any) {
      alert('Dosya yüklenirken hata oluştu: ' + err.message);
    } finally {
      if (field === 'image') setUploadingImage(false);
      else setUploadingFile(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        title_tr: titleTr,
        title_en: titleEn,
        description_tr: descriptionTr,
        description_en: descriptionEn,
        category,
        type,
        file_url: type === 'report' || type === 'interactive' ? fileUrl : undefined,
        video_url: type === 'video' ? videoUrl : undefined,
        image_url: imageUrl,
      };

      const sortItems = (a: ITalksItem, b: ITalksItem) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      };

      if (editingItem) {
        const result = await updateITalksItem(editingItem.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0];
          setItems(items.map((i) => (i.id === editingItem.id ? updated : i)).sort(sortItems));
          setIsModalOpen(false);
        } else {
          alert('Güncelleme hatası: ' + result.error);
        }
      } else {
        const result = await createITalksItem(payload);
        if (result.success && result.data) {
          const created = result.data[0];
          setItems([created, ...items].sort(sortItems));
          setIsModalOpen(false);
        } else {
          alert('Ekleme hatası: ' + result.error);
        }
      }
    });
  }

  function executeDelete() {
    if (!itemToDelete) return;
    const { id, img, file } = itemToDelete;
    startTransition(async () => {
      const result = await deleteITalksItem(id, img, file);
      if (result.success) {
        setItems(items.filter((i) => i.id !== id));
      } else {
        alert('Silme hatası: ' + result.error);
      }
    });
  }

  const typeLabels = {
    report: { label: 'Rapor (PDF)', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-500/20', icon: BookOpen },
    video: { label: 'Video (Youtube)', color: 'bg-red-400/10 text-red-400 border-red-500/20', icon: Play },
    interactive: { label: 'Etkileşimli', color: 'bg-primary/10 text-primary border-primary/20', icon: ExternalLink },
  };

  const categoryLabels: Record<string, string> = {
    projeler: 'Projeler',
    raporlar: 'Raporlar',
    egitimler: 'Eğitimler',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Mevcut Yayın ve Raporlar ({items.length})
        </span>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg"
          title="Yeni Yayın Ekle"
        >
          <Plus className="w-4 h-4" />
          Yeni Yayın Ekle
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const typeInfo = typeLabels[item.type];
          const TypeIcon = typeInfo.icon;
          return (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 relative group"
            >
              {/* Cover Image Header */}
              <div className="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title_tr} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 text-slate-800" />
                )}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-2 min-h-[90px]">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Kategori: {categoryLabels[item.category] || item.category}</span>
                </div>
                <div className="flex">
                  <span className={`border text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${typeInfo.color}`}>
                    <TypeIcon className="w-2.5 h-2.5" />
                    {typeInfo.label}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1 leading-snug">{item.title_tr}</h4>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mt-0.5">{item.description_tr}</p>
              </div>

              {/* Actions panel */}
              <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 p-1.5 rounded-lg border border-slate-850 shadow-md">
                <a
                  href={`/tr/i-talks/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  aria-label="Sitede Gör"
                  title="Sitede Gör"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openEditModal(item)}
                  className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  aria-label="Düzenle"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete({ id: item.id, img: item.image_url, file: item.file_url });
                    setDeleteConfirmOpen(true);
                  }}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  aria-label="Sil"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-white text-base">
                {editingItem ? 'Yayın Bilgilerini Düzenle' : 'Yeni Yayın Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* TR / EN Titles */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Yayın Adı (TR)</label>
                  <input
                    type="text"
                    required
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    placeholder="Geleceğin Teknolojileri Raporu"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Yayın Adı (EN)</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Future Technologies Report"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                {/* Description TR / EN */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Açıklama (TR)</label>
                  <textarea
                    required
                    rows={2}
                    value={descriptionTr}
                    onChange={(e) => setDescriptionTr(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Açıklama (EN)</label>
                  <textarea
                    required
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none"
                  />
                </div>

                {/* Category & Type selectors */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  >
                    <option value="projeler">Projeler</option>
                    <option value="raporlar">Raporlar</option>
                    <option value="egitimler">Eğitimler</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Yayın Tipi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  >
                    <option value="report">Rapor (PDF Belgesi)</option>
                    <option value="video">Video (Link)</option>
                    <option value="interactive">Etkileşimli (Dış Bağlantı)</option>
                  </select>
                </div>

                {/* Conditional fields based on type selection */}
                {type === 'report' && (
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">PDF Rapor Dosyası</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        readOnly
                        value={fileUrl}
                        placeholder="Yüklenen dosya yolu..."
                        className="bg-slate-950 border border-slate-800 text-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none flex-1 truncate"
                      />
                      <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingFile ? 'Yükleniyor...' : 'Dosya Seç'}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e, 'file')}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {type === 'video' && (
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Video Bağlantısı (Youtube vb.)</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>
                )}

                {type === 'interactive' && (
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Etkileşimli İçerik Bağlantısı (URL)</label>
                    <input
                      type="url"
                      required
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>
                )}

                {/* Cover image upload / Thumbnail */}
                <div className="flex flex-col gap-1.5 col-span-2 border-t border-slate-800 pt-3 mt-1">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kapak Görseli (Thumbnail - Opsiyonel)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-slate-700" />
                      )}
                    </div>
                    
                    <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Yükleniyor...' : 'Görsel Seç'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Görseli Kaldır
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kapak Görseli URL (Opsiyonel)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>
              </div>

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploadingImage || uploadingFile}
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
        onConfirm={executeDelete}
        title="Yayını Sil"
        message="Bu I-Talks yayınını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}

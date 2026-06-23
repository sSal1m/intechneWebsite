'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
  createCorporateIdentityItem, 
  updateCorporateIdentityItem, 
  deleteCorporateIdentityItem 
} from '@/src/actions/corporate-identity';
import { Trash2, Edit, Plus, X, Upload, FileText, Image, Download, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface CorporateIdentityItem {
  id: string;
  title_tr: string;
  title_en: string;
  type: string; // 'logo' | 'guide'
  file_url: string;
  thumbnail_url?: string;
  order_index?: number;
  created_at?: string;
}

interface IdentityManagerProps {
  initialItems: CorporateIdentityItem[];
}

export function IdentityManager({ initialItems }: IdentityManagerProps) {
  const [items, setItems] = useState<CorporateIdentityItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CorporateIdentityItem | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; url?: string; thumbUrl?: string } | null>(null);

  // Form states
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [type, setType] = useState('logo'); // 'logo' or 'guide'
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  function openAddModal() {
    setEditingItem(null);
    setTitleTr('');
    setTitleEn('');
    setType('logo');
    setFileUrl('');
    setThumbnailUrl('');
    setOrderIndex(items.length + 1);
    setIsModalOpen(true);
  }

  function openEditModal(item: CorporateIdentityItem) {
    setEditingItem(item);
    setTitleTr(item.title_tr);
    setTitleEn(item.title_en);
    setType(item.type);
    setFileUrl(item.file_url);
    setThumbnailUrl(item.thumbnail_url || '');
    setOrderIndex(item.order_index !== undefined ? item.order_index + 1 : items.findIndex(i => i.id === item.id) + 1);
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
      setFileUrl(data.url);
    } catch (err: any) {
      alert('Dosya yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailUploading(true);
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
      setThumbnailUrl(data.url);
    } catch (err: any) {
      alert('Kapak görseli yüklenirken hata oluştu: ' + err.message);
    } finally {
      setThumbnailUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fileUrl) {
      alert('Lütfen bir dosya yükleyin veya dosya URL\'si belirtin.');
      return;
    }

    startTransition(async () => {
      const payload = {
        title_tr: titleTr,
        title_en: titleEn,
        type,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl || undefined,
        order_index: Math.max(0, orderIndex - 1),
      };

      if (editingItem) {
        // Update
        const result = await updateCorporateIdentityItem(editingItem.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0];
          setItems(
            items
              .map((item) => (item.id === editingItem.id ? updated : item))
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
          );
          setIsModalOpen(false);
        } else {
          alert('Güncelleme hatası: ' + result.error);
        }
      } else {
        // Create
        const result = await createCorporateIdentityItem(payload);
        if (result.success && result.data) {
          const created = result.data[0];
          setItems(
            [...items, created]
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
          );
          setIsModalOpen(false);
        } else {
          alert('Ekleme hatası: ' + result.error);
        }
      }
    });
  }

  function executeDelete() {
    if (!itemToDelete) return;
    const { id, url, thumbUrl } = itemToDelete;
    startTransition(async () => {
      const result = await deleteCorporateIdentityItem(id, url, thumbUrl);
      if (result.success) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert('Silme hatası: ' + result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Mevcut Ögeler ({items.length})
        </span>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 shadow-lg shadow-primary/10"
          title="Yeni Öge Ekle"
        >
          <Plus className="w-4 h-4" />
          Yeni Öge Ekle
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 relative group"
          >
            <div>
              {/* Type icon header */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.type === 'logo' 
                    ? 'bg-amber-500/10 text-amber-500' 
                    : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {item.type === 'logo' ? 'Logo' : 'Kılavuz'}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Sıra: {item.order_index !== undefined ? item.order_index + 1 : idx + 1}
                </span>
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-white text-sm line-clamp-1">{item.title_tr}</h4>
                <span className="text-slate-400 text-xs line-clamp-1">{item.title_en}</span>
              </div>

              {/* Preview Box */}
              <div className="mt-4 aspect-video w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative group-hover:border-slate-700 transition-colors">
                {item.thumbnail_url ? (
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title_tr} 
                    className="w-full h-full object-contain p-2" 
                  />
                ) : item.type === 'logo' && item.file_url ? (
                  <img 
                    src={item.file_url} 
                    alt={item.title_tr} 
                    className="w-full h-full object-contain p-2" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <FileText className="w-8 h-8 text-blue-500/80" />
                    <span className="text-[10px] font-semibold">PDF Doküman</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-2">
              <a 
                href={item.file_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Dosyayı Aç
              </a>

              <div className="flex items-center gap-1">
                <a
                  href="/tr/hakkimizda/kurumsal-kimlik"
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
                    setItemToDelete({ id: item.id, url: item.file_url, thumbUrl: item.thumbnail_url });
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
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-white text-base">
                {editingItem ? 'Kurumsal Kimlik Ögesini Düzenle' : 'Yeni Öge Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Başlık (TR)</label>
                  <input
                    type="text"
                    required
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    placeholder="Örn: Intechne Dikey Logo"
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
                    placeholder="Örn: Intechne Vertical Logo"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Tür</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  >
                    <option value="logo">Logo (Görsel)</option>
                    <option value="guide">Kurumsal Kılavuz / Doküman (PDF vb.)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Dosya Yükleme</label>
                  <div className="flex items-center gap-3">
                    <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline hover:text-primary/80 truncate max-w-[250px] font-semibold"
                      >
                        Yüklenen Dosyayı Gör
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 truncate max-w-[250px]">
                        Dosya seçilmedi
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Dosya Bağlantısı (URL)</label>
                  <input
                    type="url"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                {/* Thumbnail upload field */}
                <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-3 mt-1">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kapak Görseli (Thumbnail - Opsiyonel)</label>
                  <div className="flex items-center gap-3">
                    <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      {thumbnailUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={thumbnailUploading}
                        className="hidden"
                      />
                    </label>
                    {thumbnailUrl ? (
                      <a
                        href={thumbnailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline hover:text-primary/80 truncate max-w-[250px] font-semibold"
                      >
                        Kapak Görselini Gör
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 truncate max-w-[250px]">
                        Görsel seçilmedi
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kapak Görseli URL (Opsiyonel)</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Sıra Numarası</label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {editingItem 
                        ? `Toplam ${items.length} dosya var` 
                        : `Yeni eklenecek: ${items.length + 1}. dosya`
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

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading || thumbnailUploading}
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
        title="Ögeyi Sil"
        message="Bu kurumsal kimlik ögesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}

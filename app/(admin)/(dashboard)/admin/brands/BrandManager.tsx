'use client';

import { useState, useTransition } from 'react';
import { updateBrandPage } from '@/src/actions/brands';
import { Edit, X, Upload, Plus, Trash2, Video, Images, Globe, Info, BarChart2 } from 'lucide-react';

interface BrandPage {
  slug: string;
  nedir_tr: string;
  nedir_en: string;
  vizyon_tr: string;
  vizyon_en: string;
  kapsam_tr: string;
  kapsam_en: string;
  video_url?: string | null;
  gallery?: string[] | null;
  sections_tr: any;
  sections_en: any;
  stats?: any;
  status_message_tr?: string | null;
  status_message_en?: string | null;
}

interface BrandManagerProps {
  initialBrands: BrandPage[];
}

const brandNames: Record<string, string> = {
  'cezeri-robot-ligi': 'Cezeri Robot Ligi',
  'robonex-robot-ligi': 'Robonex Robot Ligi',
  'intechne-akademi': 'Intechne Akademi',
  'drone-cup': 'Drone Cup',
  'hack-the-future-marathons': 'Hack the Future Marathons',
  'intechne-girisim-kulubu': 'Intechne Girişim Kulübü',
  'tech-chill-fest': 'Tech & Chill Fest',
  'intechne-gaming-hub': 'Intechne Gaming Hub',
};

export function BrandManager({ initialBrands }: BrandManagerProps) {
  const [brands, setBrands] = useState<BrandPage[]>(initialBrands);
  const [editingBrand, setEditingBrand] = useState<BrandPage | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [nedirTr, setNedirTr] = useState('');
  const [nedirEn, setNedirEn] = useState('');
  const [vizyonTr, setVizyonTr] = useState('');
  const [vizyonEn, setVizyonEn] = useState('');
  const [kapsamTr, setKapsamTr] = useState('');
  const [kapsamEn, setKapsamEn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [statusMessageTr, setStatusMessageTr] = useState('');
  const [statusMessageEn, setStatusMessageEn] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [sectionsTr, setSectionsTr] = useState<{ title: string; content: string }[]>([]);
  const [sectionsEn, setSectionsEn] = useState<{ title: string; content: string }[]>([]);
  
  // 3 Stats subform state for Brand (matching slider/stat style)
  const [brandStats, setBrandStats] = useState<any[]>([
    { value: '', label: '', valueEn: '', labelEn: '' },
    { value: '', label: '', valueEn: '', labelEn: '' },
    { value: '', label: '', valueEn: '', labelEn: '' }
  ]);

  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'media' | 'stats'>('tr');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  function openEditModal(brand: BrandPage) {
    setEditingBrand(brand);
    setNedirTr(brand.nedir_tr || '');
    setNedirEn(brand.nedir_en || '');
    setVizyonTr(brand.vizyon_tr || '');
    setVizyonEn(brand.vizyon_en || '');
    setKapsamTr(brand.kapsam_tr || '');
    setKapsamEn(brand.kapsam_en || '');
    setVideoUrl(brand.video_url || '');
    setStatusMessageTr(brand.status_message_tr || '');
    setStatusMessageEn(brand.status_message_en || '');
    
    // Ensure gallery has 3 positions (empty/null slots can be empty strings)
    const currentGallery = brand.gallery || [];
    const paddedGallery = [...currentGallery];
    while (paddedGallery.length < 3) {
      paddedGallery.push('');
    }
    setGallery(paddedGallery.slice(0, 3));

    setSectionsTr(brand.sections_tr ? JSON.parse(JSON.stringify(brand.sections_tr)) : []);
    setSectionsEn(brand.sections_en ? JSON.parse(JSON.stringify(brand.sections_en)) : []);

    // Ensure stats has 3 positions
    const currentStats = brand.stats ? JSON.parse(JSON.stringify(brand.stats)) : [];
    const paddedStats = [...currentStats];
    while (paddedStats.length < 3) {
      paddedStats.push({ value: '', label: '', valueEn: '', labelEn: '' });
    }
    setBrandStats(paddedStats.slice(0, 3));

    setActiveTab('tr');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'brands'); // CRITICAL: explicit 'brands' folder

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Yükleme başarısız');
      const data = await res.json();
      
      const newGallery = [...gallery];
      newGallery[index] = data.url;
      setGallery(newGallery);
    } catch (err: any) {
      alert('Resim yüklenirken hata oluştu: ' + err.message);
    } finally {
      setUploadingIndex(null);
    }
  }

  function clearGalleryImage(index: number) {
    const newGallery = [...gallery];
    newGallery[index] = '';
    setGallery(newGallery);
  }

  function addSection() {
    setSectionsTr([...sectionsTr, { title: '', content: '' }]);
    setSectionsEn([...sectionsEn, { title: '', content: '' }]);
  }

  function removeSection(index: number) {
    setSectionsTr(sectionsTr.filter((_, i) => i !== index));
    setSectionsEn(sectionsEn.filter((_, i) => i !== index));
  }

  function updateSectionTr(index: number, field: 'title' | 'content', value: string) {
    const updated = [...sectionsTr];
    updated[index][field] = value;
    setSectionsTr(updated);
  }

  function updateSectionEn(index: number, field: 'title' | 'content', value: string) {
    const updated = [...sectionsEn];
    updated[index][field] = value;
    setSectionsEn(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBrand) return;

    startTransition(async () => {
      // Filter out empty gallery slots
      const cleanGallery = gallery.filter((img) => img !== '');

      // Filter out empty stats
      const cleanStats = brandStats.filter((s) => s.value || s.label || s.valueEn || s.labelEn);

      const payload = {
        nedir_tr: nedirTr,
        nedir_en: nedirEn,
        vizyon_tr: vizyonTr,
        vizyon_en: vizyonEn,
        kapsam_tr: kapsamTr,
        kapsam_en: kapsamEn,
        video_url: videoUrl || null,
        gallery: cleanGallery,
        sections_tr: sectionsTr,
        sections_en: sectionsEn,
        stats: cleanStats,
        status_message_tr: statusMessageTr || null,
        status_message_en: statusMessageEn || null,
      };

      const result = await updateBrandPage(editingBrand.slug, payload);

      if (result.success && result.data) {
        const updated = result.data[0];
        setBrands(brands.map((b) => (b.slug === editingBrand.slug ? updated : b)));
        setEditingBrand(null);
      } else {
        alert('Güncelleme hatası: ' + result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Brands List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {Object.keys(brandNames).map((slug) => {
          const name = brandNames[slug];
          const brandData = brands.find((b) => b.slug === slug);
          const hasData = !!brandData;

          return (
            <div
              key={slug}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-base leading-snug">{name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    hasData ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {hasData ? 'Aktif (DB)' : 'Veri Yok'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-mono mb-4">{slug}</p>
                <div className="space-y-1 text-xs text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>TR & EN Açıklamalar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-500" />
                    <span>Video: {brandData?.video_url ? 'Mevcut' : 'Yok'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-slate-500" />
                    <span>Galeri: {brandData?.gallery?.length || 0} / 3 Fotoğraf</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>İstatistikler: {brandData?.stats?.length || 0} / 3 Kart</span>
                  </div>
                </div>
              </div>

              {hasData && brandData && (
                <button
                  onClick={() => openEditModal(brandData)}
                  className="w-full bg-[#161616] hover:bg-[#222] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-primary" />
                  Sayfayı Düzenle
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingBrand(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="font-bold text-white text-base">
                  Sayfa Düzenleme: {brandNames[editingBrand.slug]}
                </h3>
                <p className="text-slate-500 text-xs font-mono">{editingBrand.slug}</p>
              </div>
              <button onClick={() => setEditingBrand(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('tr')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'tr' ? 'border-primary text-primary bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Türkçe İçerik
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'en' ? 'border-primary text-primary bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                İngilizce İçerik
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'media' ? 'border-primary text-primary bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Medya & Galeri
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'stats' ? 'border-primary text-primary bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                İstatistikler
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              {/* TAB 1: Türkçe İçerik */}
              {activeTab === 'tr' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Nedir?</label>
                    <textarea
                      required
                      rows={3}
                      value={nedirTr}
                      onChange={(e) => setNedirTr(e.target.value)}
                      placeholder="Bu markanın amacı, rolü ve konumu..."
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Vizyon</label>
                      <textarea
                        required
                        rows={3}
                        value={vizyonTr}
                        onChange={(e) => setVizyonTr(e.target.value)}
                        placeholder="Vizyonu..."
                        className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Kapsam</label>
                      <textarea
                        required
                        rows={3}
                        value={kapsamTr}
                        onChange={(e) => setKapsamTr(e.target.value)}
                        placeholder="Kapsadığı alanlar..."
                        className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-slate-800/60 pt-4">
                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Durum Mesajı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={statusMessageTr}
                      onChange={(e) => setStatusMessageTr(e.target.value)}
                      placeholder="örn: Festival Çok Yakında!"
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>

                  {/* Sections Dynamic Fields */}
                  <div className="border-t border-slate-800/60 pt-5 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Dinamik Alt Başlıklar / İçerikler (TR)</label>
                      <button
                        type="button"
                        onClick={addSection}
                        className="bg-primary hover:bg-primary-dark text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Alt Başlık Ekle
                      </button>
                    </div>

                    <div className="space-y-4">
                      {sectionsTr.map((sec, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeSection(idx)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1"
                            title="Alt başlığı sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="w-5/6 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Başlık {idx + 1} (TR)</span>
                            <input
                              type="text"
                              required
                              value={sec.title}
                              onChange={(e) => updateSectionTr(idx, 'title', e.target.value)}
                              placeholder="örn: Cezeri Robot Ligi Nedir?"
                              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:border-primary"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">İçerik {idx + 1} (TR)</span>
                            <textarea
                              required
                              rows={4}
                              value={sec.content}
                              onChange={(e) => updateSectionTr(idx, 'content', e.target.value)}
                              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: İngilizce İçerik */}
              {activeTab === 'en' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Nedir? (EN)</label>
                    <textarea
                      required
                      rows={3}
                      value={nedirEn}
                      onChange={(e) => setNedirEn(e.target.value)}
                      placeholder="What is it..."
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Vizyon (EN)</label>
                      <textarea
                        required
                        rows={3}
                        value={vizyonEn}
                        onChange={(e) => setVizyonEn(e.target.value)}
                        placeholder="Vision..."
                        className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Kapsam (EN)</label>
                      <textarea
                        required
                        rows={3}
                        value={kapsamEn}
                        onChange={(e) => setKapsamEn(e.target.value)}
                        placeholder="Scope..."
                        className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-slate-800/60 pt-4">
                    <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Durum Mesajı (EN - Opsiyonel)</label>
                    <input
                      type="text"
                      value={statusMessageEn}
                      onChange={(e) => setStatusMessageEn(e.target.value)}
                      placeholder="örn: Festival Coming Very Soon!"
                      className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                    />
                  </div>

                  {/* Sections Dynamic Fields (EN) */}
                  <div className="border-t border-slate-800/60 pt-5 mt-4">
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-4">Dinamik Alt Başlıklar / İçerikler (EN)</label>

                    <div className="space-y-4">
                      {sectionsEn.map((sec, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 relative">
                          <div className="w-5/6 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Başlık {idx + 1} (EN)</span>
                            <input
                              type="text"
                              required
                              value={sec.title}
                              onChange={(e) => updateSectionEn(idx, 'title', e.target.value)}
                              placeholder="örn: What is Cezeri Robot League?"
                              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:border-primary"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">İçerik {idx + 1} (EN)</span>
                            <textarea
                              required
                              rows={4}
                              value={sec.content}
                              onChange={(e) => updateSectionEn(idx, 'content', e.target.value)}
                              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Medya & Galeri */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* YouTube Video Link */}
                  <div className="bg-slate-950 p-6 border border-slate-850 rounded-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary" /> Tanıtım Videosu
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">YouTube Embed Linki</label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                      />
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Videoların iframe içinde doğru oynatılması için embed url formatında giriniz. (örn: https://www.youtube.com/embed/...)
                      </span>
                    </div>
                  </div>

                  {/* Photo Gallery (3 Photos) */}
                  <div className="bg-slate-950 p-6 border border-slate-850 rounded-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Images className="w-4 h-4 text-primary" /> Fotoğraf Galerisi (En Fazla 3 Adet)
                    </h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      Yüklenen fotoğraflar sırasıyla 3 kartlık galeri alanında görüntülenecektir. Boş bıraktığınız alanlar galeriden çıkarılır.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                      {gallery.map((imgUrl, idx) => (
                        <div key={idx} className="border border-slate-850 rounded-xl p-4 bg-slate-900 flex flex-col gap-3">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Fotoğraf {idx + 1}</span>
                          
                          <div className="h-32 bg-slate-950 rounded-lg border border-slate-850 overflow-hidden flex items-center justify-center relative group">
                            {imgUrl ? (
                              <>
                                <img src={imgUrl} alt={`Gallery Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => clearGalleryImage(idx)}
                                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Görseli Kaldır"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-700 text-xs font-semibold">Boş</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2">
                              <Upload className="w-3.5 h-3.5" />
                              {uploadingIndex === idx ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingIndex !== null}
                                onChange={(e) => handleImageUpload(e, idx)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: İstatistikler */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 p-6 border border-slate-850 rounded-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary" /> Sayfa İstatistik Kartları (En Fazla 3 Adet)
                    </h4>
                    <p className="text-slate-400 text-xs leading-normal">
                      Marka sayfasının üst bandında yer alan istatistik değerlerini düzenleyebilirsiniz. Değer veya etiket boş bırakılan kartlar render edilmez.
                    </p>

                    <div className="flex flex-col gap-4 mt-2">
                      {brandStats.map((stat, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-850 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-slate-500 uppercase">KART {idx + 1} DEĞERLERİ</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400">Değer (TR)</span>
                                <input
                                  type="text"
                                  value={stat.value || ''}
                                  onChange={(e) => {
                                    const updated = [...brandStats];
                                    updated[idx].value = e.target.value;
                                    setBrandStats(updated);
                                  }}
                                  placeholder="örn: 3. Yıl"
                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400">Değer (EN)</span>
                                <input
                                  type="text"
                                  value={stat.valueEn || ''}
                                  onChange={(e) => {
                                    const updated = [...brandStats];
                                    updated[idx].valueEn = e.target.value;
                                    setBrandStats(updated);
                                  }}
                                  placeholder="örn: 3rd Year"
                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-slate-500 uppercase">KART {idx + 1} ETİKETLERİ</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400">Etiket (TR)</span>
                                <input
                                  type="text"
                                  value={stat.label || ''}
                                  onChange={(e) => {
                                    const updated = [...brandStats];
                                    updated[idx].label = e.target.value;
                                    setBrandStats(updated);
                                  }}
                                  placeholder="örn: Yarışma"
                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400">Etiket (EN)</span>
                                <input
                                  type="text"
                                  value={stat.labelEn || ''}
                                  onChange={(e) => {
                                    const updated = [...brandStats];
                                    updated[idx].labelEn = e.target.value;
                                    setBrandStats(updated);
                                  }}
                                  placeholder="örn: Competitions"
                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploadingIndex !== null}
                  className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

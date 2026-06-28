'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { createNews, updateNews, deleteNews } from '@/src/actions/news';
import { Trash2, Edit, Plus, X, Upload, FileText, Search, ExternalLink, Bold, Italic, List } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface NewsItem {
  id: string;
  title_tr: string;
  title_en: string;
  excerpt_tr: string;
  excerpt_en: string;
  content_tr: string;
  content_en: string;
  tag?: string;
  category_slug?: string;
  image_url?: string;
  published_at: string;
  order_index?: number;
}

interface Category {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
}

interface NewsManagerProps {
  initialNews: NewsItem[];
  categories: Category[];
}

export function NewsManager({ initialNews, categories }: NewsManagerProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    setNewsList(initialNews);
  }, [initialNews]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<{ id: string; img?: string } | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');

  // Form states
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptTr, setExcerptTr] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentTr, setContentTr] = useState('');
  const [contentEn, setContentEn] = useState('');

  const contentTrRef = useRef<HTMLTextAreaElement>(null);
  const contentEnRef = useRef<HTMLTextAreaElement>(null);

  function insertFormatting(
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    type: 'bold' | 'italic' | 'bullet',
    value: string,
    setValue: (val: string) => void
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (type === 'bold') {
      replacement = `*${selectedText || 'kalın yazılı metin'}*`;
    } else if (type === 'italic') {
      replacement = `_${selectedText || 'italik yazılı metin'}_`;
    } else if (type === 'bullet') {
      if (selectedText.includes('\n')) {
        replacement = selectedText
          .split('\n')
          .map((line) => (line.trim().startsWith('- ') || line.trim().startsWith('* ') ? line : `- ${line}`))
          .join('\n');
      } else {
        replacement = `\n- ${selectedText || 'madde işareti'}`;
      }
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  }

  const [categorySlug, setCategorySlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [inContentMediaUrl, setInContentMediaUrl] = useState('');
  const [inContentUploading, setInContentUploading] = useState(false);
  const [inContentMediaType, setInContentMediaType] = useState<'image' | 'video'>('image');

  function openAddModal() {
    setEditingNews(null);
    setTitleTr('');
    setTitleEn('');
    setExcerptTr('');
    setExcerptEn('');
    setContentTr('');
    setContentEn('');

    setCategorySlug(categories[0]?.slug || '');
    setImageUrl('');
    setInContentMediaUrl('');
    // Default to current local time in datetime-local format (YYYY-MM-DDTHH:MM)
    const localNow = new Date();
    localNow.setMinutes(localNow.getMinutes() - localNow.getTimezoneOffset());
    setPublishedAt(localNow.toISOString().slice(0, 16));
    setIsModalOpen(true);
  }

  function openEditModal(news: NewsItem) {
    setEditingNews(news);
    setTitleTr(news.title_tr);
    setTitleEn(news.title_en);
    setExcerptTr(news.excerpt_tr);
    setExcerptEn(news.excerpt_en);
    setContentTr(news.content_tr);
    setContentEn(news.content_en);

    setCategorySlug(news.category_slug || '');
    setImageUrl(news.image_url || '');
    setInContentMediaUrl('');
    
    // Format published_at to local datetime-local format
    const dateObj = new Date(news.published_at);
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    setPublishedAt(dateObj.toISOString().slice(0, 16));
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'news');

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

  async function handleInContentMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setInContentUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'news');

    // Automatically detect type from file mime
    const isVideo = file.type.startsWith('video/');
    setInContentMediaType(isVideo ? 'video' : 'image');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Yükleme başarısız');

      const data = await res.json();
      setInContentMediaUrl(data.url);
    } catch (err: any) {
      alert('Medya yüklenirken hata oluştu: ' + err.message);
    } finally {
      setInContentUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      // Derive tag from selected category name
      const selectedCategory = categories.find(c => c.slug === categorySlug);
      const derivedTag = selectedCategory ? selectedCategory.name_tr : '';

      const payload = {
        title_tr: titleTr,
        title_en: titleEn,
        excerpt_tr: excerptTr,
        excerpt_en: excerptEn,
        content_tr: contentTr,
        content_en: contentEn,
        tag: derivedTag,
        category_slug: categorySlug || undefined,
        image_url: imageUrl,
        published_at: new Date(publishedAt).toISOString(),
        order_index: 0,
      };

      const sortNews = (a: NewsItem, b: NewsItem) => {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      };

      if (editingNews) {
        // Update
        const result = await updateNews(editingNews.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0];
          setNewsList(newsList.map((n) => (n.id === editingNews.id ? updated : n)).sort(sortNews));
          setIsModalOpen(false);
        } else {
          alert('Güncelleme hatası: ' + result.error);
        }
      } else {
        // Create
        const result = await createNews(payload);
        if (result.success && result.data) {
          const created = result.data[0];
          setNewsList([created, ...newsList].sort(sortNews));
          setIsModalOpen(false);
        } else {
          alert('Ekleme hatası: ' + result.error);
        }
      }
    });
  }

  function executeDelete() {
    if (!newsToDelete) return;
    const { id, img } = newsToDelete;
    startTransition(async () => {
      const result = await deleteNews(id, img);
      if (result.success) {
        setNewsList(newsList.filter((n) => n.id !== id));
      } else {
        alert('Silme hatası: ' + result.error);
      }
    });
  }

  // Filter & Sort logic (automatically sorted by publish date descending)
  const filteredNews = newsList
    .filter((news) => {
      const matchesSearch = 
        news.title_tr.toLowerCase().includes(searchTerm.toLowerCase()) || 
        news.title_en.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedFilterCategory === 'all' || 
        news.category_slug === selectedFilterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2 w-full sm:w-64 focus-within:border-primary transition-colors">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Haberlerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm border-none outline-none text-white placeholder-slate-500 w-full focus:ring-0 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full sm:w-48 font-semibold cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name_tr}
              </option>
            ))}
          </select>

        </div>

        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
          title="Yeni Haber Ekle"
        >
          <Plus className="w-4 h-4" />
          Yeni Haber Ekle
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 relative group"
          >
            {/* News Image Header */}
            <div className="w-full h-40 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
              {news.image_url ? (
                <img src={news.image_url} alt={news.title_tr} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-10 h-10 text-slate-800" />
              )}

              {/* Category badge overlay */}
              {news.category_slug && (
                <span className="absolute top-3 left-3 bg-primary text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {categories.find((c) => c.slug === news.category_slug)?.name_tr || news.tag}
                </span>
              )}

            </div>

            {/* Title & info */}
            <div className="flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span>
                  {categories.find((c) => c.slug === news.category_slug)?.name_tr || 'Kategorisiz'}
                </span>
                <span>{new Date(news.published_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">{news.title_tr}</h4>
              <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mt-1">{news.excerpt_tr}</p>
            </div>

            {/* Actions panel overlay */}
            <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 p-1.5 rounded-lg border border-slate-850 shadow-md">
              <a
                href={`/tr/haberler/${news.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                aria-label="Sitede Gör"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => openEditModal(news)}
                className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                aria-label="Düzenle"
                title="Düzenle"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setNewsToDelete({ id: news.id, img: news.image_url });
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
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-white text-base">
                {editingNews ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TR / EN Titles */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Başlığı (TR)</label>
                  <textarea
                    required
                    rows={1}
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    placeholder="Başlığı yazın..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-y"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Başlığı (EN)</label>
                  <textarea
                    required
                    rows={1}
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Enter title..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-y"
                  />
                </div>

                {/* TR / EN Excerpts */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Özeti / Kısa Açıklama (TR)</label>
                  <textarea
                    required
                    rows={2}
                    value={excerptTr}
                    onChange={(e) => setExcerptTr(e.target.value)}
                    placeholder="Ana sayfada ve listelemede görünecek kısa özet..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-y"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Özeti / Kısa Açıklama (EN)</label>
                  <textarea
                    required
                    rows={2}
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Brief summary for listings..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-y"
                  />
                </div>

                {/* TR / EN Main Rich Content */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Detay İçeriği (TR)</label>
                  <div className="flex gap-1 bg-slate-950 border border-slate-800 border-b-0 rounded-t-xl px-3 py-1.5 items-center">
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentTrRef, 'bold', contentTr, setContentTr)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="Kalın (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentTrRef, 'italic', contentTr, setContentTr)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="İtalik (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentTrRef, 'bullet', contentTr, setContentTr)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="Madde İşareti (Bullet List)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    ref={contentTrRef}
                    required
                    rows={6}
                    value={contentTr}
                    onChange={(e) => setContentTr(e.target.value)}
                    placeholder="Haberin ana detay içeriği..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-b-xl rounded-t-none border-t-0 px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full font-sans text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Haber Detay İçeriği (EN)</label>
                  <div className="flex gap-1 bg-slate-950 border border-slate-800 border-b-0 rounded-t-xl px-3 py-1.5 items-center">
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentEnRef, 'bold', contentEn, setContentEn)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="Bold (Kalın)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentEnRef, 'italic', contentEn, setContentEn)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="Italic (İtalik)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting(contentEnRef, 'bullet', contentEn, setContentEn)}
                      className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition-colors"
                      title="Bullet List (Madde İşareti)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    ref={contentEnRef}
                    required
                    rows={6}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Main content details in English..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-b-xl rounded-t-none border-t-0 px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full font-sans text-sm"
                  />
                </div>

                {/* Haber İçi Medya Yükleme Paneli */}
                <div className="flex flex-col gap-3 col-span-2 bg-slate-950 p-4 border border-slate-800 rounded-xl mt-2">
                  <div className="flex flex-col gap-1">
                    <h5 className="text-white text-xs font-bold uppercase tracking-wider">Haber İçi Medya Yükleme Yardımcısı</h5>
                    <p className="text-slate-500 text-[10px] font-semibold leading-relaxed">
                      Haber metninizin içerisine görsel, video veya YouTube videosu yerleştirmek için bu aracı kullanabilirsiniz. Yüklediğiniz dosyanın kodunu kopyalayıp haber metninde boş satır olarak yapıştırın (Satırlar arası boşluk bırakarak yerleştirin).
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-slate-900 pt-3">
                    <label className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      {inContentUploading ? 'Yükleniyor...' : 'Görsel / Video Yükle'}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleInContentMediaUpload}
                        disabled={inContentUploading}
                        className="hidden"
                      />
                    </label>

                    {inContentMediaUrl && (
                      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                        <input
                          type="text"
                          readOnly
                          value={
                            inContentMediaType === 'image'
                              ? `![Görsel Açıklaması](${inContentMediaUrl})`
                              : `[video](${inContentMediaUrl})`
                          }
                          className="bg-slate-900 border border-slate-800 text-slate-400 rounded-xl px-3 py-1.5 text-xs focus:outline-none w-full font-mono select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const code = inContentMediaType === 'image'
                              ? `![Görsel Açıklaması](${inContentMediaUrl})`
                              : `[video](${inContentMediaUrl})`;
                            navigator.clipboard.writeText(code);
                            alert('Haber içi medya kodu panoya kopyalandı! Haber detay metnine boş satır olarak yapıştırabilirsiniz.');
                          }}
                          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-colors"
                        >
                          Kodu Kopyala
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 border-t border-slate-900 pt-3">
                    <span className="text-slate-400 text-[10px] font-bold">YouTube Video Ekleme:</span>
                    <p className="text-slate-500 text-[10px] font-semibold leading-relaxed">
                      Herhangi bir YouTube videosunu yerleştirmek için video linkini (Örn: <code className="text-slate-400 font-mono">https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>) kopyalayıp haber metninde tek başına bir satıra yapıştırmanız yeterlidir.
                    </p>
                  </div>
                </div>

                {/* Category & Tag & DateTime */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kategori</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  >
                    <option value="">Seçiniz</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name_tr}
                      </option>
                    ))}
                  </select>
                </div>



                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Yayın Tarihi</label>
                  <input
                    type="datetime-local"
                    required
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full cursor-pointer"
                  />
                </div>

                {/* Cover image upload */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Kapak Görseli</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-700" />
                      )}
                    </div>
                    
                    <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
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
        onConfirm={executeDelete}
        title="Haberi Sil"
        message="Bu haberi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}

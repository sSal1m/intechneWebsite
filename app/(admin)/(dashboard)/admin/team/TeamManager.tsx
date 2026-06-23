'use client';

import { useState, useTransition, useEffect } from 'react';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/src/actions/team';
import { Trash2, Edit, Plus, Mail, Users, X, Upload, ExternalLink } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  id: string;
  name: string;
  role_tr: string;
  role_en: string;
  image_url?: string;
  email?: string;
  linkedin_url?: string;
  order_index: number;
}

interface TeamManagerProps {
  initialMembers: TeamMember[];
}

export function TeamManager({ initialMembers }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; img?: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [roleTr, setRoleTr] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  function openAddModal() {
    setEditingMember(null);
    setName('');
    setRoleTr('');
    setRoleEn('');
    setImageUrl('');
    setEmail('');
    setLinkedinUrl('');
    setOrderIndex(members.length);
    setIsModalOpen(true);
  }

  function openEditModal(member: TeamMember) {
    setEditingMember(member);
    setName(member.name);
    setRoleTr(member.role_tr);
    setRoleEn(member.role_en);
    setImageUrl(member.image_url || '');
    setEmail(member.email || '');
    setLinkedinUrl(member.linkedin_url || '');
    setOrderIndex(member.order_index);
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'team');

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        name,
        role_tr: roleTr,
        role_en: roleEn,
        image_url: imageUrl,
        email,
        linkedin_url: linkedinUrl,
        order_index: orderIndex,
      };

      if (editingMember) {
        // Update
        const result = await updateTeamMember(editingMember.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0];
          setMembers(members.map((m) => (m.id === editingMember.id ? updated : m)).sort((a,b) => a.order_index - b.order_index));
          setIsModalOpen(false);
        } else {
          alert('Güncelleme hatası: ' + result.error);
        }
      } else {
        // Create
        const result = await createTeamMember(payload);
        if (result.success && result.data) {
          const created = result.data[0];
          setMembers([...members, created].sort((a,b) => a.order_index - b.order_index));
          setIsModalOpen(false);
        } else {
          alert('Ekleme hatası: ' + result.error);
        }
      }
    });
  }

  function executeDelete() {
    if (!memberToDelete) return;
    const { id, img } = memberToDelete;
    startTransition(async () => {
      const result = await deleteTeamMember(id, img);
      if (result.success) {
        setMembers(members.filter((m) => m.id !== id));
      } else {
        alert('Silme hatası: ' + result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Mevcut Ekip Üyeleri ({members.length})
        </span>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 shadow-lg shadow-primary/10"
          title="Yeni Üye Ekle"
        >
          <Plus className="w-4 h-4" />
          Yeni Üye Ekle
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 relative group"
          >
            {/* Header info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-bold text-white text-sm line-clamp-1">{member.name}</h4>
                <span className="text-primary text-xs font-semibold line-clamp-1">{member.role_tr}</span>
                <span className="text-slate-500 text-[10px] line-clamp-1">{member.role_en}</span>
              </div>
            </div>

            {/* Social details */}
            <div className="flex gap-4 text-xs text-slate-400 border-t border-slate-900 pt-3">
              {member.email && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
              {member.linkedin_url && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <LinkedinIcon className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  <span className="truncate">Profil Linki</span>
                </div>
              )}
            </div>

            {/* Actions panel overlay */}
            <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 pl-2">
              <a
                href="/tr/hakkimizda/ekibimiz"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                aria-label="Sitede Gör"
                title="Sitede Gör"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => openEditModal(member)}
                className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                aria-label="Düzenle"
                title="Düzenle"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMemberToDelete({ id: member.id, img: member.image_url });
                  setDeleteConfirmOpen(true);
                }}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                aria-label="Sil"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Sorting Badge */}
            <span className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-600 uppercase">
              Sıra: {member.order_index}
            </span>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">
                {editingMember ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ömer Akbulut"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Unvan (TR)</label>
                  <input
                    type="text"
                    required
                    value={roleTr}
                    onChange={(e) => setRoleTr(e.target.value)}
                    placeholder="Genel Koordinatör"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Unvan (EN)</label>
                  <input
                    type="text"
                    required
                    value={roleEn}
                    onChange={(e) => setRoleEn(e.target.value)}
                    placeholder="General Coordinator"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">E-posta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="isim@intechne.com.tr"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">LinkedIn Bağlantısı</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                {/* Profile image upload */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Profil Görseli</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-slate-700" />
                      )}
                    </div>
                    
                    <label className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Listeleme Sırası</label>
                  <input
                    type="number"
                    required
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>
              </div>

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
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
        title="Ekip Üyesini Sil"
        message="Bu ekip üyesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
}

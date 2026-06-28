'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
  createJobPosition, 
  updateJobPosition, 
  deleteJobPosition,
  deleteJobApplication,
  toggleJobPositionStatus,
  generateCVDownloadUrl 
} from '@/src/actions/careers';
import { createClient } from '@/src/utils/supabase/client';
import { useAdminRole } from '@/src/utils/supabase/role-client';
import { 
  Briefcase, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  MapPin, 
  Building2, 
  Download, 
  Eye,
  FileText,
  Calendar,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface JobPosition {
  id: string;
  title_tr: string;
  title_en: string;
  department_tr: string;
  department_en: string;
  location_tr: string;
  location_en: string;
  type_tr: string;
  type_en: string;
  description_tr: string;
  description_en: string;
  requirements_tr: string;
  requirements_en: string;
  order_index: number;
  is_active?: boolean;
}

interface JobApplication {
  id: string;
  position_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  cv_path: string;
  created_at: string;
  position_title_tr?: string | null;
  position_title_en?: string | null;
  job_positions: {
    title_tr: string;
    title_en: string;
    is_active?: boolean;
  } | null;
}

interface CareersManagerProps {
  initialPositions: JobPosition[];
  initialApplications: JobApplication[];
}

export function CareersManager({ initialPositions, initialApplications }: CareersManagerProps) {
  const { role } = useAdminRole();
  const [activeTab, setActiveTab] = useState<'positions' | 'applications'>('positions');
  const [positions, setPositions] = useState<JobPosition[]>(initialPositions);
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  useEffect(() => {
    if (role === 'admin' && activeTab === 'applications') {
      setActiveTab('positions');
    }
  }, [role, activeTab]);
  
  const [isPending, startTransition] = useTransition();

  // Sync props to state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(initialPositions);
  }, [initialPositions]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplications(initialApplications);
  }, [initialApplications]);

  // Real-time job position listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('job-positions-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_positions',
        },
        (payload: { new: JobPosition }) => {
          const updatedPos = payload.new;

          // 1. Update positions list
          setPositions((prev) =>
            prev
              .map((p) => (p.id === updatedPos.id ? updatedPos : p))
              .sort((a, b) => a.order_index - b.order_index)
          );

          // 2. Update job_positions in applications list
          setApplications((prev) =>
            prev.map((app) => {
              if (app.position_id === updatedPos.id) {
                return {
                  ...app,
                  job_positions: {
                    title_tr: updatedPos.title_tr,
                    title_en: updatedPos.title_en,
                    is_active: updatedPos.is_active,
                  },
                };
              }
              return app;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Real-time job applications listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('job-applications-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
        },
        (payload: { eventType: string; new: JobApplication; old: { id: string } }) => {
          if (payload.eventType === 'INSERT') {
            const newApp = payload.new;
            const pos = positions.find((p) => p.id === newApp.position_id);
            const appWithPosition: JobApplication = {
              ...newApp,
              job_positions: pos ? {
                title_tr: pos.title_tr,
                title_en: pos.title_en,
                is_active: pos.is_active,
              } : null
            };
            setApplications((prev) => {
              if (prev.some((a) => a.id === appWithPosition.id)) return prev;
              return [appWithPosition, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            const oldApp = payload.old;
            setApplications((prev) => prev.filter((a) => a.id !== oldApp.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [positions]);
  
  // Modals state
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null);
  // Confirm delete modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [posToDelete, setPosToDelete] = useState<string | null>(null);
  const [deleteAppConfirmOpen, setDeleteAppConfirmOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);

  // Application details modal
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(null);

  // Loading state for signed URL generation
  const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);

  // Position Form State
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [deptTr, setDeptTr] = useState('');
  const [deptEn, setDeptEn] = useState('');
  const [locTr, setLocTr] = useState('');
  const [locEn, setLocEn] = useState('');
  const [typeTr, setTypeTr] = useState('');
  const [typeEn, setTypeEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [reqTr, setReqTr] = useState('');
  const [reqEn, setReqEn] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  function openAddPosModal() {
    setEditingPosition(null);
    setTitleTr('');
    setTitleEn('');
    setDeptTr('');
    setDeptEn('');
    setLocTr('');
    setLocEn('');
    setTypeTr('');
    setTypeEn('');
    setDescTr('');
    setDescEn('');
    setReqTr('');
    setReqEn('');
    setOrderIndex(positions.length);
    setIsPosModalOpen(true);
  }

  function openEditPosModal(pos: JobPosition) {
    setEditingPosition(pos);
    setTitleTr(pos.title_tr);
    setTitleEn(pos.title_en);
    setDeptTr(pos.department_tr);
    setDeptEn(pos.department_en);
    setLocTr(pos.location_tr);
    setLocEn(pos.location_en);
    setTypeTr(pos.type_tr);
    setTypeEn(pos.type_en);
    setDescTr(pos.description_tr);
    setDescEn(pos.description_en);
    setReqTr(pos.requirements_tr);
    setReqEn(pos.requirements_en);
    setOrderIndex(pos.order_index);
    setIsPosModalOpen(true);
  }

  function handlePosSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title_tr: titleTr,
      title_en: titleEn,
      department_tr: deptTr,
      department_en: deptEn,
      location_tr: locTr,
      location_en: locEn,
      type_tr: typeTr,
      type_en: typeEn,
      description_tr: descTr,
      description_en: descEn,
      requirements_tr: reqTr,
      requirements_en: reqEn,
      order_index: orderIndex,
      is_active: editingPosition ? editingPosition.is_active : true,
    };

    startTransition(async () => {
      if (editingPosition) {
        // Update
        const result = await updateJobPosition(editingPosition.id, payload);
        if (result.success && result.data) {
          const updated = result.data[0] as JobPosition;
          setPositions(
            positions
              .map((p) => (p.id === editingPosition.id ? updated : p))
              .sort((a, b) => a.order_index - b.order_index)
          );
          setIsPosModalOpen(false);
        } else {
          alert('Hata: ' + result.error);
        }
      } else {
        // Create
        const result = await createJobPosition(payload);
        if (result.success && result.data) {
          const created = result.data[0] as JobPosition;
          setPositions(
            [...positions, created].sort((a, b) => a.order_index - b.order_index)
          );
          setIsPosModalOpen(false);
        } else {
          alert('Hata: ' + result.error);
        }
      }
    });
  }

  function executePosDelete() {
    if (!posToDelete) return;
    startTransition(async () => {
      const result = await deleteJobPosition(posToDelete);
      if (result.success) {
        setPositions(positions.filter((p) => p.id !== posToDelete));
        setDeleteConfirmOpen(false);
      } else {
        alert('Hata: ' + result.error);
      }
    });
  }

  function handleToggleActive(id: string, newStatus: boolean) {
    startTransition(async () => {
      const result = await toggleJobPositionStatus(id, newStatus);
      if (result.success) {
        setPositions(
          positions.map((p) => (p.id === id ? { ...p, is_active: newStatus } : p))
        );
      } else {
        alert('Hata: ' + result.error);
      }
    });
  }

  function executeAppDelete() {
    if (!appToDelete) return;
    startTransition(async () => {
      const result = await deleteJobApplication(appToDelete);
      if (result.success) {
        setApplications(applications.filter((a) => a.id !== appToDelete));
        setDeleteAppConfirmOpen(false);
      } else {
        alert('Hata: ' + result.error);
      }
    });
  }

  async function handleExportToExcel() {
    try {
      const XLSX = await import('xlsx');
      
      const exportData = applications.map((app) => {
        const date = new Date(app.created_at);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(
          date.getMonth() + 1
        ).padStart(2, '0')}.${date.getFullYear()}`;
        
        return {
          'Aday Adı': app.first_name,
          'Aday Soyadı': app.last_name,
          'E-posta': app.email,
          'Telefon': app.phone,
          'Başvurulan Pozisyon (TR)': app.position_title_tr || app.job_positions?.title_tr || 'Kapatılmış / Silinmiş Pozisyon',
          'Başvurulan Pozisyon (EN)': app.position_title_en || app.job_positions?.title_en || 'Closed / Deleted Position',
          'Pozisyon Durumu': app.job_positions ? 'Açık' : 'Kapalı',
          'Başvuru Tarihi': formattedDate,
          'Niyet Mektubu': app.cover_letter || 'Eklenmemiş'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Başvurular');
      XLSX.writeFile(workbook, 'gelen_basvurular.xlsx');
    } catch (error: any) {
      alert('Excel export hatası: ' + error.message);
    }
  }

  async function handleDownloadCv(cvPath: string, appId: string) {
    if (downloadingCvId) return;
    setDownloadingCvId(appId);

    try {
      const result = await generateCVDownloadUrl(cvPath);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      } else {
        alert('CV İndirme Linki Üretilemedi: ' + result.error);
      }
    } catch (err: any) {
      alert('Bir hata oluştu: ' + err.message);
    } finally {
      setDownloadingCvId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'positions'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Pozisyonlar ({positions.length})
        </button>
        {role !== 'admin' && (
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Gelen Başvurular ({applications.length})
          </button>
        )}
      </div>

      {/* POSITIONS TAB */}
      {activeTab === 'positions' && (() => {
        const activePositions = positions.filter((p) => p.is_active !== false);
        const inactivePositions = positions.filter((p) => p.is_active === false);

        const renderPositionCard = (pos: JobPosition) => (
          <div
            key={pos.id}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-6 flex flex-col gap-4 relative group"
          >
            <div className="flex flex-col gap-1 pr-24">
              <h4 className="font-bold text-white text-base">{pos.title_tr}</h4>
              <span className="text-slate-400 text-xs">{pos.title_en}</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs border-t border-slate-900 pt-3">
              <span className="inline-flex items-center gap-1 bg-slate-900 text-slate-300 px-2 py-1 rounded">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                {pos.department_tr}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-900 text-slate-300 px-2 py-1 rounded">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {pos.location_tr}
              </span>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                {pos.type_tr}
              </span>
            </div>

            {/* Toggle switch and actions overlay */}
            <div className="absolute right-4 top-4 flex items-center gap-3 bg-slate-950 pl-2">
              <button
                type="button"
                onClick={() => handleToggleActive(pos.id, !pos.is_active)}
                disabled={isPending}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  pos.is_active !== false ? 'bg-primary' : 'bg-slate-800'
                }`}
                title={pos.is_active !== false ? 'Pasifleştir / Kapat' : 'Aktifleştir / Aç'}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    pos.is_active !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditPosModal(pos)}
                  className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setPosToDelete(pos.id);
                    setDeleteConfirmOpen(true);
                  }}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <span className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-600 uppercase">
              Sıra: {pos.order_index}
            </span>
          </div>
        );

        return (
          <div className="flex flex-col gap-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Tüm Pozisyonlar
              </span>
              <button
                onClick={openAddPosModal}
                className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 shadow-lg shadow-primary/10"
              >
                <Plus className="w-4 h-4" />
                Pozisyon Ekle
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {/* 1. Açık (Aktif) Pozisyonlar */}
              <div className="flex flex-col gap-4">
                <h5 className="font-bold text-[#01c1d3] text-sm uppercase tracking-wider border-l-4 border-[#01c1d3] pl-3">
                  Açık Pozisyonlar ({activePositions.length})
                </h5>
                {activePositions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                    Açık pozisyon bulunmamaktadır.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activePositions.map((pos) => renderPositionCard(pos))}
                  </div>
                )}
              </div>

              {/* 2. Kapalı (Pasif) Pozisyonlar */}
              <div className="flex flex-col gap-4">
                <h5 className="font-bold text-red-400 text-sm uppercase tracking-wider border-l-4 border-red-500/40 pl-3">
                  Kapalı Pozisyonlar ({inactivePositions.length})
                </h5>
                {inactivePositions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                    Kapalı pozisyon bulunmamaktadır.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inactivePositions.map((pos) => renderPositionCard(pos))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && role !== 'admin' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Gönderilen CV ve Başvurular
            </span>
            {applications.length > 0 && (
              <button
                onClick={handleExportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/10"
              >
                <Download className="w-4 h-4" />
                Excel'e Aktar
              </button>
            )}
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-sm">
              Henüz bir başvuru bulunmamaktadır.
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0c0c0c] text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Aday Bilgisi</th>
                      <th className="px-6 py-4">Başvurulan Pozisyon</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {applications.map((app) => {
                      // Optional chaining & fallback for deleted positions as requested
                      const positionTitle = app.position_title_tr || app.job_positions?.title_tr || 'Kapatılmış / Silinmiş Pozisyon';
                      const isDeletedPos = !app.job_positions;

                      return (
                        <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4 flex flex-col gap-1">
                            <span className="font-bold text-white">{app.first_name} {app.last_name}</span>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {app.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {app.phone}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`font-semibold ${isDeletedPos || app.job_positions?.is_active === false ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                {positionTitle}
                              </span>
                              <div>
                                {isDeletedPos || app.job_positions?.is_active === false ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                    Kapalı
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Açık
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-bold">
                            {new Date(app.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingApp(app)}
                                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-1"
                                title="Detayları Gör"
                              >
                                <Eye className="w-4 h-4" />
                                Detay
                              </button>
                              <button
                                onClick={() => handleDownloadCv(app.cv_path, app.id)}
                                disabled={downloadingCvId !== null}
                                className="text-primary hover:text-white p-1.5 rounded-lg hover:bg-primary/10 disabled:bg-transparent disabled:text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
                                title="CV Dosyasını İndir/Görüntüle (1 dk geçerli imzalı url)"
                              >
                                {downloadingCvId === app.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                CV
                              </button>
                              <button
                                onClick={() => {
                                  setAppToDelete(app.id);
                                  setDeleteAppConfirmOpen(true);
                                }}
                                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* POSITIONS ADD/EDIT MODAL */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPosModalOpen(false)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-white text-base">
                {editingPosition ? 'Pozisyonu Düzenle' : 'Yeni Pozisyon Ekle'}
              </h3>
              <button onClick={() => setIsPosModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handlePosSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Pozisyon Başlığı (TR)</label>
                  <input
                    type="text"
                    required
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    placeholder="Yazılım Geliştirici"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Pozisyon Başlığı (EN)</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Software Developer"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Departman (TR)</label>
                  <input
                    type="text"
                    required
                    value={deptTr}
                    onChange={(e) => setDeptTr(e.target.value)}
                    placeholder="Teknoloji & Ar-Ge"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Departman (EN)</label>
                  <input
                    type="text"
                    required
                    value={deptEn}
                    onChange={(e) => setDeptEn(e.target.value)}
                    placeholder="Technology & R&D"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Lokasyon (TR)</label>
                  <input
                    type="text"
                    required
                    value={locTr}
                    onChange={(e) => setLocTr(e.target.value)}
                    placeholder="İstanbul (Hibrit)"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Lokasyon (EN)</label>
                  <input
                    type="text"
                    required
                    value={locEn}
                    onChange={(e) => setLocEn(e.target.value)}
                    placeholder="Istanbul (Hybrid)"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Çalışma Türü (TR)</label>
                  <input
                    type="text"
                    required
                    value={typeTr}
                    onChange={(e) => setTypeTr(e.target.value)}
                    placeholder="Tam Zamanlı"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Çalışma Türü (EN)</label>
                  <input
                    type="text"
                    required
                    value={typeEn}
                    onChange={(e) => setTypeEn(e.target.value)}
                    placeholder="Full-time"
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">İş Tanımı (TR)</label>
                  <textarea
                    required
                    rows={4}
                    value={descTr}
                    onChange={(e) => setDescTr(e.target.value)}
                    placeholder="Pozisyonun genel sorumluluklarını yazın..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">İş Tanımı (EN)</label>
                  <textarea
                    required
                    rows={4}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Write the responsibilities in English..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Gereksinimler (TR)</label>
                  <textarea
                    required
                    rows={4}
                    value={reqTr}
                    onChange={(e) => setReqTr(e.target.value)}
                    placeholder="Adaylarda aranan nitelikleri listeleyin..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Gereksinimler (EN)</label>
                  <textarea
                    required
                    rows={4}
                    value={reqEn}
                    onChange={(e) => setReqEn(e.target.value)}
                    placeholder="List the requirements in English..."
                    className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none w-full resize-none font-sans"
                  />
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

              <footer className="border-t border-slate-800 pt-5 mt-4 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICATION DETAILS MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingApp(null)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Başvuru Detayı</h3>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* Candidate Info */}
              <div className="flex flex-col gap-3">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Aday Bilgileri</span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-white font-bold text-base">{viewingApp.first_name} {viewingApp.last_name}</span>
                  <span className="text-slate-300 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> {viewingApp.email}
                  </span>
                  <span className="text-slate-300 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> {viewingApp.phone}
                  </span>
                </div>
              </div>

              {/* Position */}
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Başvurulan Pozisyon</span>
                <span className={`font-semibold ${!viewingApp.job_positions ? 'text-red-400 italic' : 'text-white'}`}>
                  {viewingApp.job_positions?.title_tr || 'Kapatılmış / Silinmiş Pozisyon'}
                </span>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Başvuru Tarihi</span>
                <span className="text-slate-300 text-sm font-semibold">
                  {new Date(viewingApp.created_at).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
                </span>
              </div>

              {/* Cover Letter */}
              <div className="flex flex-col gap-2">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Niyet Mektubu</span>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto">
                  {viewingApp.cover_letter || 'Niyet mektubu eklenmemiş.'}
                </p>
              </div>

              {/* CV Action */}
              <div className="border-t border-slate-800 pt-4 flex justify-end">
                <button
                  onClick={() => handleDownloadCv(viewingApp.cv_path, viewingApp.id)}
                  disabled={downloadingCvId !== null}
                  className="bg-primary hover:bg-primary-dark text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  {downloadingCvId === viewingApp.id ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <Download className="w-4.5 h-4.5" />
                  )}
                  CV Dosyasını Aç / İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POSITION DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executePosDelete}
        title="Pozisyonu Sil"
        message="Bu iş pozisyonunu silmek istediğinize emin misiniz? Pozisyon silindiğinde, bu pozisyona ait başvuruların listelenmesindeki pozisyon bilgisi 'Kapatılmış / Silinmiş Pozisyon' olarak görünecektir."
      />

      {/* APPLICATION DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={deleteAppConfirmOpen}
        onClose={() => setDeleteAppConfirmOpen(false)}
        onConfirm={executeAppDelete}
        title="Başvuruyu Sil"
        message="Bu iş başvurusunu silmek istediğinize emin misiniz? Başvuru silindiğinde çöp kutusuna taşınacaktır."
      />

    </div>
  );
}

'use client';

import { useState, useTransition, useEffect } from 'react';
import { deleteVolunteer } from '@/src/actions/volunteers';
import { 
  Trash2, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  AlertCircle, 
  Heart, 
  Download, 
  Users
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { createClient } from '@/src/utils/supabase/client';

interface Volunteer {
  id: string;
  name_surname: string;
  birth_date: string;
  gender: string;
  phone: string;
  city: string;
  employment_status: string;
  school_department: string;
  food_allergies?: string | null;
  medical_conditions?: string | null;
  created_at: string;
}

interface VolunteersManagerProps {
  initialVolunteers: Volunteer[];
}

export function VolunteersManager({ initialVolunteers }: VolunteersManagerProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isPending, startTransition] = useTransition();

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState<string | null>(null);

  // Real-time volunteer listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('volunteers-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'volunteers',
        },
        (payload: any) => {
          const newVol = payload.new as Volunteer;
          setVolunteers((prev) => {
            if (prev.some((v) => v.id === newVol.id)) return prev;
            return [newVol, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'volunteers',
        },
        (payload: any) => {
          const deletedId = payload.old.id;
          setVolunteers((prev) => prev.filter((v) => v.id !== deletedId));
          setSelectedVolunteer((prev) => (prev?.id === deletedId ? null : prev));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function triggerDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setVolunteerToDelete(id);
    setDeleteConfirmOpen(true);
  }

  function executeDelete() {
    if (!volunteerToDelete) return;
    const id = volunteerToDelete;
    startTransition(async () => {
      const result = await deleteVolunteer(id);
      if (result.success) {
        setVolunteers(volunteers.filter((v) => v.id !== id));
        if (selectedVolunteer?.id === id) {
          setSelectedVolunteer(null);
        }
        setDeleteConfirmOpen(false);
      } else {
        alert('Silme işlemi başarısız: ' + result.error);
      }
    });
  }

  async function handleExportToExcel() {
    try {
      const XLSX = await import('xlsx');
      
      const exportData = volunteers.map((v) => {
        const date = new Date(v.created_at);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(
          date.getMonth() + 1
        ).padStart(2, '0')}.${date.getFullYear()}`;
        
        return {
          'Adı Soyadı': v.name_surname,
          'Doğum Tarihi': v.birth_date,
          'Cinsiyet': v.gender === 'Kadin' ? 'Kadın' : 'Erkek',
          'Telefon': v.phone,
          'Şehir': v.city,
          'İş/Eğitim Durumu': v.employment_status,
          'Okul/Bölüm': v.school_department,
          'Gıda Alerjileri': v.food_allergies || 'Yok',
          'Rahatsızlık Durumu': v.medical_conditions || 'Yok',
          'Başvuru Tarihi': formattedDate
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gönüllüler');
      XLSX.writeFile(workbook, 'gonullu_basvurulari.xlsx');
    } catch (error: any) {
      alert('Excel export hatası: ' + error.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-2xl">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Başvurular ({volunteers.length})
        </span>
        {volunteers.length > 0 && (
          <button
            onClick={handleExportToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/10"
          >
            <Download className="w-4 h-4" />
            Excel'e Aktar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 flex flex-col gap-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          {volunteers.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
              Henüz gönüllü başvurusu bulunmuyor.
            </div>
          ) : (
            volunteers.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVolunteer(v)}
                className={`bg-slate-950 border rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col gap-3 group relative ${
                  selectedVolunteer?.id === v.id
                    ? 'border-primary shadow-lg shadow-primary/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-bold text-sm text-white line-clamp-1">{v.name_surname}</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {v.city}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => triggerDelete(v.id, e)}
                    disabled={isPending}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                    aria-label="Sil"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1">
                  <span>{v.phone}</span>
                  <span>{new Date(v.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[450px] shadow-xl flex flex-col justify-between">
          {selectedVolunteer ? (
            <div className="flex flex-col gap-6 h-full justify-between">
              <div className="flex flex-col gap-5">
                {/* Header Info */}
                <div className="border-b border-slate-800 pb-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aday Bilgisi</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {selectedVolunteer.name_surname}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>D. Tarihi: {selectedVolunteer.birth_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>Cinsiyet: {selectedVolunteer.gender === 'Kadin' ? 'Kadın' : 'Erkek'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${selectedVolunteer.phone}`} className="hover:text-primary transition-colors">
                        {selectedVolunteer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>Şehir: {selectedVolunteer.city}</span>
                    </div>
                  </div>
                </div>

                {/* Job & School details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">İş/Eğitim Durumu</span>
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary shrink-0" />
                      {selectedVolunteer.employment_status}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Okul / Bölüm</span>
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                      {selectedVolunteer.school_department}
                    </div>
                  </div>
                </div>

                {/* Health details */}
                <div className="flex flex-col gap-4 border-t border-slate-800/50 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gıda Alerjileri</span>
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400">
                      {selectedVolunteer.food_allergies || 'Gıda alerjisi bulunmuyor.'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rahatsızlık Durumu</span>
                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400">
                      {selectedVolunteer.medical_conditions || 'Bildirilen kronik rahatsızlık bulunmuyor.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold mt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Başvuru: {new Date(selectedVolunteer.created_at).toLocaleString('tr-TR')}</span>
                </div>
                
                <button
                  onClick={(e) => triggerDelete(selectedVolunteer.id, e)}
                  disabled={isPending}
                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                  title="Bu Başvuruyu Sil"
                >
                  <Trash2 className="w-4 h-4" />
                  Başvuruyu Sil
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Heart className="w-12 h-12 text-slate-800 animate-pulse" />
              <p className="text-sm">Detayları görüntülemek için sol taraftan bir gönüllü seçin.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Başvuruyu Sil"
        message="Bu gönüllü başvurusunu silmek istediğinize emin misiniz? Başvuru çöp kutusuna taşınacaktır."
      />
    </div>
  );
}

import { getJobPositions, getJobApplications } from '@/src/actions/careers';
import { CareersManager } from './CareersManager';

export const revalidate = 0; // Disable caching for the admin dashboard list page

export default async function AdminCareersPage() {
  const positions = await getJobPositions();
  const applications = await getJobApplications();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Kariyer Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Açık Pozisyonlar ve Gönderilen CV'lerin Yönetimi
        </p>
      </div>

      <CareersManager 
        initialPositions={positions} 
        initialApplications={applications} 
      />
    </div>
  );
}

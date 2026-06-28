import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import DashboardLayoutClient from './DashboardLayoutClient';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, role } = await getServerUserAndRole();

  if (!user || !role) {
    redirect('/admin/login');
  }

  return (
    <DashboardLayoutClient role={role}>
      {children}
    </DashboardLayoutClient>
  );
}

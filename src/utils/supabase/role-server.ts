import { createClient } from './server';
import { User } from '@supabase/supabase-js';

export type AdminRole = 'super_admin' | 'admin' | 'operations_manager';

export async function getServerUserAndRole(): Promise<{ user: User | null; role: AdminRole | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { user: null, role: null };
    }

    const uRole = user.app_metadata?.role;
    if (uRole === 'admin' || uRole === 'operations_manager' || uRole === 'super_admin') {
      return { user, role: uRole as AdminRole };
    }

    return { user, role: null };
  } catch (e) {
    console.error('Error fetching server user/role:', e);
    return { user: null, role: null };
  }
}

'use server';

import { createClient } from '@/src/utils/supabase/server';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';

export interface AdminLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  role: string | null;
  action: string;
  status: 'SUCCESS' | 'FAILED';
  error_name: string | null;
  error_code: string | null;
  error_message: string | null;
  details: Record<string, unknown> | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  location: string | null;
  user_agent: string | null;
  execution_time_ms: number;
  created_at: string;
}

export async function getAdminLogs(params: {
  page: number;
  limit: number;
  actionFilter?: string;
  emailFilter?: string;
  statusFilter?: string;
}) {
  try {
    // Strict server-side RBAC enforcement
    const { user, role } = await getServerUserAndRole();
    if (!user || role !== 'super_admin') {
      throw new Error('Unauthorized');
    }

    const supabase = await createClient();

    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    let query = supabase
      .from('admin_logs')
      .select('*', { count: 'exact' });

    if (params.actionFilter && params.actionFilter !== 'ALL') {
      query = query.eq('action', params.actionFilter);
    }
    if (params.emailFilter) {
      query = query.ilike('user_email', `%${params.emailFilter.trim()}%`);
    }
    if (params.statusFilter && params.statusFilter !== 'ALL') {
      query = query.eq('status', params.statusFilter);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return {
      logs: (data || []) as AdminLog[],
      totalCount: count || 0,
    };
  } catch (error: unknown) {
    console.error('getAdminLogs error:', error);
    return {
      logs: [],
      totalCount: 0,
    };
  }
}

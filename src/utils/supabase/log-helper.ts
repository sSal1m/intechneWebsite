import { headers } from 'next/headers';
import { createClient, createServiceClient } from './server';

import { AuditAction, LogDetails } from './log-types';
export { AuditAction };
export type { LogDetails };

export async function writeAuditLog({
  action,
  status,
  startTime,
  details,
  oldValues = null,
  newValues = null,
  error
}: {
  action: AuditAction;
  status: 'SUCCESS' | 'FAILED';
  startTime: number;
  details?: LogDetails;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  error?: unknown;
}): Promise<void> {
  const executionTimeMs = performance.now() - startTime;

  try {
    // 1. Resolve User Identity safely, defaulting to 'anonymous' if null
    let userId: string | null = null;
    let userEmail: string | null = 'anonymous';
    let role: string | null = null;

    try {
      const supabaseUserClient = await createClient();
      const { data: { user } } = await supabaseUserClient.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email || 'anonymous';
        role = (user.app_metadata?.role as string) || null;
      }
    } catch (identityError) {
      console.error('[Audit Log] Failed to resolve caller identity:', identityError);
    }

    // 2. Safely parse headers for Client Metrics
    let ipAddress = 'Unknown';
    let location = 'Unknown';
    let userAgent = 'Unknown';

    try {
      const headersList = await headers();
      const rawIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip');
      if (rawIp) {
        ipAddress = rawIp.split(',')[0].trim();
      }
      const country = headersList.get('x-vercel-ip-country') || '';
      const region = headersList.get('x-vercel-ip-country-region') || '';
      const city = headersList.get('x-vercel-ip-city') || '';
      const locationParts = [city, region, country].filter(Boolean);
      if (locationParts.length > 0) {
        location = locationParts.join(', ');
      }
      userAgent = headersList.get('user-agent') || 'Unknown';
    } catch (headerError) {
      console.error('[Audit Log] Failed to parse headers:', headerError);
    }

    // 3. Cleanly parse errors without persisting stack traces
    let errorName: string | null = null;
    let errorCode: string | null = null;
    let errorMessage: string | null = null;

    if (error !== undefined && error !== null) {
      if (error instanceof Error) {
        errorName = error.name;
        errorMessage = error.message;
        const errObj = (error as unknown) as Record<string, unknown>;
        if (typeof errObj.code === 'string') {
          errorCode = errObj.code;
        } else if (typeof errObj.code === 'number') {
          errorCode = String(errObj.code);
        }
      } else if (typeof error === 'object') {
        const errObj = error as Record<string, unknown>;
        errorName = typeof errObj.name === 'string' ? errObj.name : 'UnknownError';
        errorMessage = typeof errObj.message === 'string' ? errObj.message : JSON.stringify(error);
        if (typeof errObj.code === 'string') {
          errorCode = errObj.code;
        } else if (typeof errObj.code === 'number') {
          errorCode = String(errObj.code);
        }
      } else {
        errorName = 'Error';
        errorMessage = String(error);
      }
    }

    // 4. Insert log via service role client (fail-safe and bypasses RLS on server)
    const supabaseService = createServiceClient();
    const { error: dbError } = await supabaseService
      .from('admin_logs')
      .insert({
        user_id: userId,
        user_email: userEmail,
        role: role,
        action: action,
        status: status,
        error_name: errorName,
        error_code: errorCode,
        error_message: errorMessage,
        details: details || null,
        old_values: oldValues,
        new_values: newValues,
        ip_address: ipAddress,
        location: location,
        user_agent: userAgent,
        execution_time_ms: executionTimeMs
      });

    if (dbError) {
      console.error('[Audit Log Database Insertion Error]:', dbError);
    }
  } catch (logError) {
    // Fail-safe strategy guarantees this block does not block or break the parent execution
    console.error('[Audit Log Failure]: Internal error in writeAuditLog:', logError);
  }
}

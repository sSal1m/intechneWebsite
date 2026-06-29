import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const mockQuery: unknown = new Proxy({}, {
  get(target, prop): unknown {
    if (prop === 'then') {
      return (resolve: (val: unknown) => void) => resolve({ data: [], error: null, count: 0 });
    }
    return () => mockQuery;
  }
});

const mockAuthQuery: unknown = new Proxy({}, {
  get(target, prop): unknown {
    if (prop === 'then') {
      return (resolve: (val: unknown) => void) => resolve({ data: { user: null, session: null }, error: null });
    }
    return () => mockAuthQuery;
  }
});

const mockSupabase = new Proxy({}, {
  get(target, prop): unknown {
    if (prop === 'then') {
      return undefined;
    }
    if (prop === 'auth') {
      return new Proxy({}, {
        get(t, p): unknown {
          if (p === 'then') return undefined;
          return () => mockAuthQuery;
        }
      });
    }
    if (prop === 'storage') {
      return new Proxy({}, {
        get(t, p): unknown {
          if (p === 'then') return undefined;
          return () => new Proxy({}, {
            get(t2, p2): unknown {
              if (p2 === 'then') return undefined;
              if (p2 === 'getPublicUrl') {
                return () => ({ data: { publicUrl: '' } });
              }
              return () => mockQuery;
            }
          });
        }
      });
    }
    return () => mockQuery;
  }
});

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("--- Supabase Server client requested ---");
  console.log("URL on server:", url);
  console.log("KEY on server:", key);

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  console.log("isValidUrl:", isValidUrl, "isPlaceholder:", isPlaceholder);

  if (!isValidUrl || isPlaceholder) {
    console.log("Returning mockSupabase client");
    return mockSupabase as unknown as ReturnType<typeof createServerClient>;
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    return mockSupabase as unknown as SupabaseClient;
  }

  return createSupabaseClient(url, key);
}


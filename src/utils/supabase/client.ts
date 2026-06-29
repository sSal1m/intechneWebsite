import { createBrowserClient } from '@supabase/ssr';

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

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    return mockSupabase as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}

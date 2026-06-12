import { createBrowserClient } from '@supabase/ssr';

const mockSupabase = new Proxy({}, {
  get(target, prop): any {
    if (prop === 'then') {
      return (resolve: any) => resolve({ data: [], error: null, count: 0 });
    }
    return () => mockSupabase;
  }
});

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    return mockSupabase as any;
  }

  return createBrowserClient(url, key);
}

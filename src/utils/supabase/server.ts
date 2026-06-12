import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const mockSupabase = new Proxy({}, {
  get(target, prop): any {
    if (prop === 'then') {
      return (resolve: any) => resolve({ data: [], error: null, count: 0 });
    }
    return () => mockSupabase;
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
    return mockSupabase as any;
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

'use client';

import { useState, useEffect } from 'react';
import { createClient } from './client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export type AdminRole = 'super_admin' | 'admin' | 'operations_manager';

export function useAdminRole() {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getInitialRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const uRole = user.app_metadata?.role;
          if (uRole === 'admin' || uRole === 'operations_manager' || uRole === 'super_admin') {
            setRole(uRole as AdminRole);
          } else {
            setRole(null);
          }
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error('Error fetching initial role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialRole();

    // Set up auth state change listener to dynamically update role state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      // Prevent unused variable warning on event if any
      (void event);
      const user = session?.user;
      if (user) {
        const uRole = user.app_metadata?.role;
        if (uRole === 'admin' || uRole === 'operations_manager' || uRole === 'super_admin') {
          setRole(uRole as AdminRole);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { role, loading };
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useHabitStore } from '@/store/useHabitStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { initStore } = useHabitStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/login') {
        router.replace('/login');
      } else if (session && pathname === '/login') {
        router.replace('/');
      } else if (session) {
        // Initialize store with user data
        initStore(session.user.id);
      }
      
      if (mounted) setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        initStore(session.user.id);
        if (pathname === '/login') router.replace('/');
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router, initStore]);

  // Optionally show a loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }

  // Si no está logueado y no está en login, no renderizamos los hijos para evitar parpadeos
  if (pathname !== '/login' && !loading) {
     // we could check if session is actually null, but the redirect handles it.
  }

  return <>{children}</>;
}

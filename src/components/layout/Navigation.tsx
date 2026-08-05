'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, BarChart2, Trash2, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useHabitStore } from '@/store/useHabitStore';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const resetStore = useHabitStore(state => state.resetStore);
  const userEmail = useHabitStore(state => state.userEmail);
  const userAvatar = useHabitStore(state => state.userAvatar);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // No renderizar navegación en la página de login
  if (pathname === '/login') return null;

  const navItems = [
    { name: 'Hoy', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Gestionar', href: '/manage', icon: Settings },
    { name: 'Papelera', href: '/trash', icon: Trash2 },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetStore();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-zinc-800 bg-zinc-950/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-medium transition-colors uppercase tracking-wider',
                isActive ? 'text-zinc-100' : 'text-zinc-500 active:text-zinc-300'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-medium transition-colors uppercase tracking-wider text-zinc-500 active:text-rose-400"
        >
          <LogOut className="h-5 w-5 mb-1" strokeWidth={1.5} />
          <span>Salir</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950/50 p-6 md:flex">
        <div className="mb-12 mt-4 px-2">
          <h1 className="text-xl font-semibold tracking-tighter text-zinc-100 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-6 w-6 drop-shadow-md" />
            Habit Tracker
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'text-zinc-100 bg-zinc-800/50 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                )}
              >
                <item.icon 
                  className={cn("h-4 w-4 transition-colors", isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-400")} 
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 transition-colors text-zinc-500 group-hover:text-rose-400" strokeWidth={1.5} />
              Cerrar Sesión
            </div>
            {userEmail && (
              userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 opacity-80 group-hover:opacity-40 transition-opacity" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px] border border-emerald-500/20 opacity-80 group-hover:opacity-40 transition-opacity">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
              )
            )}
          </button>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-lg font-bold text-zinc-100">Cerrar Sesión</h3>
            <p className="mb-6 text-sm text-zinc-400">¿Estás seguro de que quieres salir de tu cuenta?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

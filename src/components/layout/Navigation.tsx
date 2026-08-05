'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Hoy', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Gestionar', href: '/manage', icon: Settings },
    { name: 'Papelera', href: '/trash', icon: Trash2 },
  ];

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
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950/50 p-6 md:flex">
        <div className="mb-12 mt-4 px-2">
          <h1 className="text-xl font-semibold tracking-tighter text-zinc-100 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-zinc-100 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            Tracker
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
      </div>
    </>
  );
}

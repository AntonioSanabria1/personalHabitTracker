'use client';

import { useEffect } from 'react';
import { useHabitStore } from '@/store/useHabitStore';

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const clearOldTrash = useHabitStore((state) => state.clearOldTrash);

  useEffect(() => {
    // Run trash cleanup on app load
    clearOldTrash();
  }, [clearOldTrash]);

  return <>{children}</>;
}

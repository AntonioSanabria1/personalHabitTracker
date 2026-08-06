'use client';

import { Dashboard } from '@/components/habits/Dashboard';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-full flex items-center justify-center p-10">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full animate-in fade-in duration-500">
      <Dashboard />
    </div>
  );
}

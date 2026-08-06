'use client';

import { WeeklyHabitGrid } from '@/components/habits/WeeklyHabitGrid';
import { TodayProgress } from '@/components/habits/TodayProgress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const todayDateString = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 capitalize">
          {todayDateString}
        </h2>
        <p className="text-zinc-400 mt-1">
          Tu resumen de la semana. Haz clic en las celdas para registrar tus hábitos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyHabitGrid />
        </div>
        <div className="lg:col-span-1">
          <TodayProgress />
        </div>
      </div>
    </div>
  );
}

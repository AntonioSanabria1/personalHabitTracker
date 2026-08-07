'use client';

import { useHabitStore } from '@/store/useHabitStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function TodayProgress({ serverDate }: { serverDate?: string }) {
  const { habits, logs } = useHabitStore();
  
  const activeHabits = habits.filter(h => !h.is_deleted);
  
  const baseDate = serverDate ? new Date(serverDate) : new Date();
  const today = format(baseDate, 'yyyy-MM-dd');
  const activeHabitIds = new Set(activeHabits.map(h => h.id));
  const todayLogs = logs.filter(l => l.date === today && l.completed && activeHabitIds.has(l.habit_id));
  
  const total = activeHabits.length;
  const completed = todayLogs.length;
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  
  // SVG properties for the radial progress
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="elevated-card p-6 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-zinc-300 w-full text-left mb-6 uppercase tracking-wider">
        Progreso de Hoy
      </h3>
      
      <div className="relative flex items-center justify-center mb-8">
        <svg className={cn(
          "w-36 h-36 transform -rotate-90 transition-all duration-700 ease-out",
          percentage === 100 ? "scale-110 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" : ""
        )}>
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-zinc-800"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
          percentage === 100 ? "scale-110" : ""
        )}>
          <span className="text-4xl font-bold text-zinc-100">{percentage}%</span>
        </div>
      </div>
      
      <div className="w-full bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
        <p className="text-center text-zinc-400 text-sm">
          Has completado <span className="text-emerald-400 font-bold">{completed}</span> de <span className="text-zinc-200 font-bold">{total}</span> hábitos hoy.
        </p>
        
        {percentage === 100 && total > 0 && (
          <p className="text-center text-emerald-400 text-[13px] font-medium mt-2">
            ¡Día perfecto!
          </p>
        )}
      </div>
    </div>
  );
}

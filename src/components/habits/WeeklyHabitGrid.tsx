'use client';

import { useHabitStore } from '@/store/useHabitStore';
import { cn, getHabitColorClasses, getHabitTextColorClasses } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export function WeeklyHabitGrid({ serverDate }: { serverDate?: string }) {
  const { habits, logs, toggleHabitLog } = useHabitStore();
  
  const activeHabits = habits.filter(h => !h.is_deleted);
  
  const baseDate = serverDate ? new Date(serverDate) : new Date();

  // Generate the last 7 days (oldest to newest)
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(baseDate, 6 - i);
    return {
      dateObj: date,
      dateStr: date.toISOString().split('T')[0],
      dayName: format(date, 'E', { locale: es }).substring(0, 1).toUpperCase(),
      dayNumber: format(date, 'd'),
      isToday: i === 6
    };
  });

  if (activeHabits.length === 0) {
    return (
      <div className="elevated-card p-8 flex flex-col items-center justify-center text-center h-64">
        <p className="text-zinc-400 font-medium mb-2">No tienes hábitos activos</p>
        <p className="text-zinc-500 text-sm">Ve a Gestionar para crear tu primer hábito.</p>
      </div>
    );
  }

  return (
    <div className="elevated-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-zinc-800/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-[40%] sm:w-1/3 min-w-[120px] sm:min-w-[150px]">
                Hábitos
              </th>
              {days.map((day, i) => (
                <th key={day.dateStr} className={cn(
                  "p-1 sm:p-2 border-b border-zinc-800/50 text-center min-w-[40px] sm:min-w-[48px]",
                  day.isToday ? "bg-zinc-800/20" : "",
                  i < 4 ? "hidden sm:table-cell" : "table-cell"
                )}>
                  <div className={cn(
                    "flex flex-col items-center justify-center space-y-1",
                    day.isToday ? "text-zinc-100" : "text-zinc-500"
                  )}>
                    <span className="text-[10px] font-bold">{day.dayName}</span>
                    <span className="text-xs">{day.dayNumber}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {activeHabits.map(habit => (
              <tr key={habit.id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="p-3 sm:p-4 max-w-[120px] sm:max-w-none">
                  <Link 
                    href={`/dashboard?habit=${habit.id}`}
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer md:group-hover:opacity-80 active:opacity-80 transition-opacity"
                    title="Ver analíticas de este hábito"
                  >
                    <div className={cn("w-2 h-2 rounded-full shrink-0", getHabitTextColorClasses(habit.color).replace('text-', 'bg-'))} />
                    <div className="min-w-0">
                      <p className="text-[13px] sm:text-sm font-medium text-zinc-200 hover:text-zinc-100 truncate">{habit.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">{habit.category}</p>
                    </div>
                  </Link>
                </td>
                
                {days.map((day, i) => {
                  const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === day.dateStr && l.completed);
                  
                  return (
                    <td key={day.dateStr} className={cn(
                      "p-1 sm:p-2 text-center",
                      day.isToday ? "bg-zinc-800/10" : "",
                      i < 4 ? "hidden sm:table-cell" : "table-cell"
                    )}>
                      <button
                        onClick={() => toggleHabitLog(habit.id, day.dateStr)}
                        className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8 rounded-lg mx-auto flex items-center justify-center border cursor-pointer touch-manipulation",
                          getHabitColorClasses(habit.color, isCompleted)
                        )}
                        title={`${isCompleted ? 'Completado' : 'No completado'} el ${day.dateStr}`}
                      >
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

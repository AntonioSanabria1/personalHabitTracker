'use client';

import { useState } from 'react';
import { useHabitStore } from '@/store/useHabitStore';
import { cn, getHabitColorClasses } from '@/lib/utils';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';

interface HabitMonthGridProps {
  habitId: string;
}

export function HabitMonthGrid({ habitId }: HabitMonthGridProps) {
  const { habits, logs, toggleHabitLog } = useHabitStore();
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  const habit = habits.find(h => h.id === habitId);

  if (!habit) return null;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days to display in the calendar grid (including padding days from prev/next months)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="elevated-card p-6 mt-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">Registro Mensual</h3>
          <p className="text-sm text-zinc-400">Historial detallado para <span className="font-semibold text-zinc-300">{habit.name}</span></p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/50">
          <button 
            onClick={prevMonth}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="min-w-[120px] text-center font-medium text-sm text-zinc-200 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </span>
          
          <button 
            onClick={nextMonth}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === dateStr && l.completed);
            const today = isToday(day);
            
            return (
              <div 
                key={dateStr}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center p-1 rounded-xl sm:rounded-2xl border transition-all",
                  isCurrentMonth ? "bg-zinc-900/30 border-zinc-800/30" : "opacity-30 bg-transparent border-transparent",
                  today && isCurrentMonth ? "ring-1 ring-zinc-500/50 bg-zinc-800/40" : ""
                )}
              >
                <span className={cn(
                  "text-[10px] sm:text-xs mb-1 sm:mb-2 font-medium",
                  today ? "text-zinc-200" : "text-zinc-500"
                )}>
                  {format(day, 'd')}
                </span>
                
                <button
                  onClick={() => toggleHabitLog(habit.id, dateStr)}
                  disabled={!isCurrentMonth && day > new Date()} // Prevent checking future days in next month (optional)
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border cursor-pointer transition-transform hover:scale-105 touch-manipulation",
                    getHabitColorClasses(habit.color, isCompleted),
                    !isCurrentMonth ? "opacity-50" : ""
                  )}
                  title={`${isCompleted ? 'Completado' : 'No completado'} el ${dateStr}`}
                >
                  {isCompleted && (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

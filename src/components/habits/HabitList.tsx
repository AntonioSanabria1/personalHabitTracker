'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useHabitStore } from '@/store/useHabitStore';
import { cn, getHabitColorClasses } from '@/lib/utils';
import { Check } from 'lucide-react';

export function HabitList() {
  const { habits, logs, toggleHabitLog } = useHabitStore();

  const today = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter(h => !h.is_deleted);
  const todayDateString = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-12">
      <div className="mb-12">
        <p className="text-secondary text-xs uppercase mb-2 font-semibold">Tus Hábitos</p>
        <h2 className="text-4xl font-semibold tracking-tighter text-white capitalize">
          {todayDateString}
        </h2>
      </div>

      <div className="space-y-3">
        {activeHabits.length === 0 ? (
          <div className="p-8 text-center text-secondary border border-dashed border-white/[0.08] rounded-2xl">
            No tienes hábitos activos.
          </div>
        ) : (
          activeHabits.map(habit => {
            const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === today && l.completed);
            
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabitLog(habit.id, today)}
                className={cn(
                  'group w-full flex items-center gap-5 p-4 text-left transition-all duration-300',
                  'border border-transparent md:hover:border-white/[0.06] rounded-xl md:hover:bg-white/[0.02]',
                  isCompleted ? 'opacity-50 grayscale' : 'opacity-100'
                )}
              >
                <div className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                  getHabitColorClasses(habit.color, isCompleted),
                  isCompleted ? 'bg-white border-white text-black' : 'bg-transparent'
                )}>
                  {isCompleted && <Check className="h-3 w-3" strokeWidth={3} />}
                </div>

                <div className="flex-1">
                  <h3 className={cn(
                    "text-[15px] font-medium transition-all duration-300",
                    isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-200'
                  )}>
                    {habit.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {habit.category}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

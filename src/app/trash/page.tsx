'use client';

import { useHabitStore } from '@/store/useHabitStore';
import { cn, getHabitTextColorClasses } from '@/lib/utils';
import { RotateCcw, X } from 'lucide-react';

export default function TrashPage() {
  const { habits, restoreHabit, permanentlyDeleteHabit } = useHabitStore();
  
  const deletedHabits = habits.filter(h => h.is_deleted);

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10 min-h-full">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Papelera</h2>
        <p className="text-zinc-400 mt-1">
          Restaurar hábitos eliminados o borrarlos definitivamente. Se eliminan automáticamente tras 30 días.
        </p>
      </div>

      <div className="space-y-3">
        {deletedHabits.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            La papelera está vacía.
          </div>
        ) : (
          deletedHabits.map(habit => (
            <div
              key={habit.id}
              className="group elevated-card flex items-center justify-between p-4 text-left transition-all"
            >
              <div className="flex items-center gap-5 opacity-60 grayscale">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  getHabitTextColorClasses(habit.color).replace('text-', 'bg-')
                )} />
                <div>
                  <h3 className="text-[15px] font-medium text-zinc-400 line-through">
                    {habit.name}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {habit.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => permanentlyDeleteHabit(habit.id)}
                  className="p-2 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="Eliminar definitivamente"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => restoreHabit(habit.id)}
                  className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="Recuperar Hábito"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

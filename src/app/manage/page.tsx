'use client';

import { useState, useEffect, useCallback } from 'react';
import { useHabitStore } from '@/store/useHabitStore';
import { cn, getHabitTextColorClasses, getHabitColorClasses } from '@/lib/utils';
import { Trash2, Plus, X, Pencil, GripVertical } from 'lucide-react';
import { HabitCategory, HabitColor, Habit } from '@/types/database';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CATEGORIES: HabitCategory[] = [
  'Académico', 'Salud', 'Responsabilidades', 'Planificación', 
  'Finanzas', 'Deporte', 'Social', 'Desarrollo Personal', 
  'Hobbies', 'Hogar', 'Otros'
];
const COLORS: HabitColor[] = [
  'Red', 'Orange', 'Amber', 'Lime', 'Green', 'Emerald', 
  'Teal', 'Cyan', 'Sky', 'Blue', 'Indigo', 'Purple', 'Pink', 'Rose'
];

function SortableHabitItem({ 
  habit, 
  openEditForm, 
  deleteHabit 
}: { 
  habit: Habit, 
  openEditForm: (h: Habit) => void, 
  deleteHabit: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between p-4 mb-3 relative bg-zinc-900 border rounded-2xl transition-shadow",
        isDragging ? "shadow-2xl border-zinc-600 scale-[1.02]" : "border-zinc-800/80 shadow-sm"
      )}
    >
      <div className="flex items-center gap-4">
        <div 
          {...attributes} 
          {...listeners} 
          className="text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing p-1.5 -ml-1.5 transition-colors touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className={cn(
          'w-3 h-3 rounded-full',
          getHabitTextColorClasses(habit.color).replace('text-', 'bg-')
        )} />
        <div>
          <h3 className="text-[15px] font-medium text-zinc-200">{habit.name}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{habit.category}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => openEditForm(habit)}
          className="p-2 text-zinc-500 md:hover:text-zinc-200 md:hover:bg-zinc-800/80 active:bg-zinc-800/80 rounded-lg transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => deleteHabit(habit.id)}
          className="p-2 text-zinc-600 md:hover:text-rose-500 md:hover:bg-rose-500/10 active:bg-rose-500/10 rounded-lg transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          title="Eliminar (enviar a papelera)"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const { habits, addHabit, editHabit, deleteHabit, reorderHabits } = useHabitStore();
  const activeHabits = habits.filter(h => !h.is_deleted);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Salud');
  const [color, setColor] = useState<HabitColor>('Blue');

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderHabits(active.id as string, over.id as string);
    }
  };

  const openNewForm = () => {
    const usedColors = new Set(activeHabits.map(h => h.color));
    const availableColors = COLORS.filter(c => !usedColors.has(c));
    const randomColor = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : COLORS[Math.floor(Math.random() * COLORS.length)];

    setName('');
    setCategory('Salud');
    setColor(randomColor);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (habit: Habit) => {
    setName(habit.name);
    setCategory(habit.category);
    setColor(habit.color);
    setEditingId(habit.id);
    setIsFormOpen(true);
  };

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingId(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) {
        closeForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, closeForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (editingId) {
      editHabit(editingId, name.trim(), category, color);
    } else {
      addHabit(name.trim(), category, color);
    }
    
    closeForm();
  };

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10 min-h-full pb-32">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Gestionar Hábitos</h2>
          <p className="text-zinc-400 mt-1">Configura y ordena tus hábitos (arrastra para reordenar).</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Hábito</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="elevated-card p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-zinc-100">
              {editingId ? 'Editar Hábito' : 'Crear nuevo hábito'}
            </h3>
            <button type="button" onClick={closeForm} className="text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 p-2 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Leer 15 páginas"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all text-sm appearance-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                        getHabitColorClasses(c, true),
                        c === color ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110" : "opacity-70 hover:opacity-100 hover:scale-105"
                      )}
                      title={c}
                    >
                      {c === color && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="w-1/3 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-2/3 bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-50 disabled:hover:bg-zinc-100 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar Hábito'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div>
        {activeHabits.length === 0 ? (
          <div className="text-center p-12 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            No tienes hábitos activos.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activeHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {activeHabits.map(habit => (
                <SortableHabitItem 
                  key={habit.id} 
                  habit={habit} 
                  openEditForm={openEditForm}
                  deleteHabit={deleteHabit}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

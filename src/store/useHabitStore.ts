import { create } from 'zustand';
import { Habit, HabitLog } from '@/types/database';

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (name: string, category: Habit['category'], color: Habit['color']) => void;
  editHabit: (id: string, name: string, category: Habit['category'], color: Habit['color']) => void;
  deleteHabit: (id: string) => void;
  restoreHabit: (id: string) => void;
  permanentlyDeleteHabit: (id: string) => void;
  clearOldTrash: () => void;
  toggleHabitLog: (habitId: string, date: string) => void;
  reorderHabits: (activeId: string, overId: string) => void;
}

const SEED_HABITS: Habit[] = [
  { id: '1', user_id: 'user1', name: 'Redacción y revisión de tesis', category: 'Académico', color: 'Blue', created_at: new Date().toISOString(), is_deleted: false },
  { id: '2', user_id: 'user1', name: 'Entrenamiento', category: 'Salud', color: 'Green', created_at: new Date().toISOString(), is_deleted: false },
  { id: '3', user_id: 'user1', name: 'Lectura', category: 'Responsabilidades', color: 'Orange', created_at: new Date().toISOString(), is_deleted: false },
  { id: '4', user_id: 'user1', name: 'Meditación', category: 'Planificación', color: 'Purple', created_at: new Date().toISOString(), is_deleted: false },
];

export const useHabitStore = create<HabitStore>((set) => ({
  habits: SEED_HABITS,
  logs: [
    { id: 'log1', habit_id: '1', date: new Date().toISOString().split('T')[0], completed: true },
    { id: 'log2', habit_id: '2', date: new Date().toISOString().split('T')[0], completed: false },
  ],
  addHabit: (name, category, color) => set((state) => ({
    habits: [...state.habits, {
      id: Math.random().toString(36).substr(2, 9),
      user_id: 'user1',
      name, category, color,
      created_at: new Date().toISOString(),
      is_deleted: false
    }]
  })),
  editHabit: (id, name, category, color) => set((state) => ({
    habits: state.habits.map(h => h.id === id ? { ...h, name, category, color } : h)
  })),
  deleteHabit: (id) => set((state) => ({
    habits: state.habits.map(h => h.id === id ? { ...h, is_deleted: true, deleted_at: new Date().toISOString() } : h)
  })),
  restoreHabit: (id) => set((state) => ({
    habits: state.habits.map(h => h.id === id ? { ...h, is_deleted: false, deleted_at: null } : h)
  })),
  permanentlyDeleteHabit: (id) => set((state) => ({
    habits: state.habits.filter(h => h.id !== id),
    logs: state.logs.filter(l => l.habit_id !== id)
  })),
  clearOldTrash: () => set((state) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    const habitsToKeep = state.habits.filter(h => {
      if (!h.is_deleted) return true;
      if (!h.deleted_at) return true;
      return h.deleted_at > cutoffDate;
    });
    
    const activeHabitIds = new Set(habitsToKeep.map(h => h.id));
    const logsToKeep = state.logs.filter(l => activeHabitIds.has(l.habit_id));

    return { habits: habitsToKeep, logs: logsToKeep };
  }),
  reorderHabits: (activeId, overId) => set((state) => {
    const oldIndex = state.habits.findIndex(h => h.id === activeId);
    const newIndex = state.habits.findIndex(h => h.id === overId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newHabits = [...state.habits];
      const [movedHabit] = newHabits.splice(oldIndex, 1);
      newHabits.splice(newIndex, 0, movedHabit);
      return { habits: newHabits };
    }
    return state;
  }),
  toggleHabitLog: (habitId, date) => set((state) => {
    const existingLogIndex = state.logs.findIndex(l => l.habit_id === habitId && l.date === date);
    if (existingLogIndex >= 0) {
      const newLogs = [...state.logs];
      newLogs[existingLogIndex] = {
        ...newLogs[existingLogIndex],
        completed: !newLogs[existingLogIndex].completed
      };
      return { logs: newLogs };
    }
    return {
      logs: [...state.logs, {
        id: Math.random().toString(36).substr(2, 9),
        habit_id: habitId,
        date,
        completed: true
      }]
    };
  })
}));

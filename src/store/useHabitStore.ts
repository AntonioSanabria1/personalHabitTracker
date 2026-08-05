import { create } from 'zustand';
import { Habit, HabitLog } from '@/types/database';
import { supabase } from '@/lib/supabase';

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];
  userId: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  isLoading: boolean;
  
  initStore: (userId: string) => Promise<void>;
  resetStore: () => void;
  
  addHabit: (name: string, category: Habit['category'], color: Habit['color']) => Promise<void>;
  editHabit: (id: string, name: string, category: Habit['category'], color: Habit['color']) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  permanentlyDeleteHabit: (id: string) => Promise<void>;
  clearOldTrash: () => Promise<void>;
  toggleHabitLog: (habitId: string, date: string) => Promise<void>;
  reorderHabits: (activeId: string, overId: string) => void;
}

let initPromise: Promise<void> | null = null;

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  logs: [],
  userId: null,
  userEmail: null,
  userAvatar: null,
  isLoading: true,

  initStore: async (userId: string) => {
    if (initPromise) return initPromise;
    
    initPromise = (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || null;
      const userAvatar = user?.user_metadata?.avatar_url || null;
      
      set({ userId, userEmail, userAvatar, isLoading: true });
    
    try {
      const [habitsResponse, logsResponse] = await Promise.all([
        supabase.from('habits').select('*').order('position', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('habit_logs').select('*')
      ]);

      if (habitsResponse.error) throw habitsResponse.error;
      if (logsResponse.error) throw logsResponse.error;

      let fetchedHabits = habitsResponse.data || [];

      // Create default habits for new users
      if (fetchedHabits.length === 0) {
        const defaultHabits = [
          { user_id: userId, name: 'Lectura', category: 'Desarrollo Personal', color: 'Purple' },
          { user_id: userId, name: 'Meditación', category: 'Salud', color: 'Teal' },
          { user_id: userId, name: 'Entrenamiento', category: 'Deporte', color: 'Emerald' },
          { user_id: userId, name: 'Beber agua (2L)', category: 'Salud', color: 'Cyan' }
        ];
        
        const { data: newHabits, error: insertError } = await supabase
          .from('habits')
          .insert(defaultHabits)
          .select();
          
        if (!insertError && newHabits) {
          fetchedHabits = newHabits;
        }
      }

      set({ 
        habits: fetchedHabits, 
        logs: logsResponse.data || [],
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    } finally {
      initPromise = null;
    }
    })();
    return initPromise;
  },

  resetStore: () => {
    set({ habits: [], logs: [], userId: null, userEmail: null, userAvatar: null, isLoading: true });
  },

  addHabit: async (name, category, color) => {
    const { userId, habits } = get();
    if (!userId) return;

    const newHabit = {
      user_id: userId,
      name,
      category,
      color,
      position: habits.length,
    };

    const { data, error } = await supabase.from('habits').insert(newHabit).select().single();
    if (error) {
      console.error('Error adding habit:', error);
      return;
    }

    set({ habits: [...habits, data] });
  },

  editHabit: async (id, name, category, color) => {
    const { error } = await supabase.from('habits').update({ name, category, color }).eq('id', id);
    if (error) {
      console.error('Error editing habit:', error);
      return;
    }

    set(state => ({
      habits: state.habits.map(h => h.id === id ? { ...h, name, category, color } : h)
    }));
  },

  deleteHabit: async (id) => {
    const deleted_at = new Date().toISOString();
    const { error } = await supabase.from('habits').update({ is_deleted: true, deleted_at }).eq('id', id);
    if (error) {
      console.error('Error sending habit to trash:', error);
      return;
    }

    set(state => ({
      habits: state.habits.map(h => h.id === id ? { ...h, is_deleted: true, deleted_at } : h)
    }));
  },

  restoreHabit: async (id) => {
    const { error } = await supabase.from('habits').update({ is_deleted: false, deleted_at: null }).eq('id', id);
    if (error) {
      console.error('Error restoring habit:', error);
      return;
    }

    set(state => ({
      habits: state.habits.map(h => h.id === id ? { ...h, is_deleted: false, deleted_at: null } : h)
    }));
  },

  permanentlyDeleteHabit: async (id) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) {
      console.error('Error permanently deleting habit:', error);
      return;
    }

    set(state => ({
      habits: state.habits.filter(h => h.id !== id),
      logs: state.logs.filter(l => l.habit_id !== id)
    }));
  },

  clearOldTrash: async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();
    
    // El borrado real se debería hacer en supabase, 
    // pero para mantener la UI en sync borramos localmente primero
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('is_deleted', true)
      .lt('deleted_at', cutoffDate);
      
    if (error) {
      console.error('Error clearing old trash:', error);
      return;
    }

    set(state => ({
      habits: state.habits.filter(h => {
        if (!h.is_deleted) return true;
        if (!h.deleted_at) return true;
        return h.deleted_at > cutoffDate;
      })
    }));
  },

  reorderHabits: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.habits.findIndex(h => h.id === activeId);
      const newIndex = state.habits.findIndex(h => h.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newHabits = [...state.habits];
        const [movedHabit] = newHabits.splice(oldIndex, 1);
        newHabits.splice(newIndex, 0, movedHabit);
        
        // Update positions
        const updatedHabits = newHabits.map((h, index) => ({ ...h, position: index }));
        
        // Fire and forget backend updates
        Promise.all(
          updatedHabits.map(h => supabase.from('habits').update({ position: h.position }).eq('id', h.id))
        ).catch(err => console.error('Error syncing order to DB:', err));
        
        return { habits: updatedHabits };
      }
      return state;
    });
  },

  toggleHabitLog: async (habitId, date) => {
    const { logs } = get();
    const existingLog = logs.find(l => l.habit_id === habitId && l.date === date);

    if (existingLog) {
      // Optimistic update
      set(state => {
        const newLogs = [...state.logs];
        const index = newLogs.findIndex(l => l.id === existingLog.id);
        newLogs[index] = { ...newLogs[index], completed: !newLogs[index].completed };
        return { logs: newLogs };
      });
      
      const { error } = await supabase
        .from('habit_logs')
        .update({ completed: !existingLog.completed })
        .eq('id', existingLog.id);
        
      if (error) {
        console.error('Error updating log:', error);
        // Rollback on error
        set(state => {
          const newLogs = [...state.logs];
          const index = newLogs.findIndex(l => l.id === existingLog.id);
          newLogs[index] = { ...newLogs[index], completed: existingLog.completed };
          return { logs: newLogs };
        });
      }
    } else {
      // Optmistic insert requires generating an ID or waiting for DB
      // We will wait for DB to get the real UUID to keep it simple, or generate a fake one
      const tempId = Math.random().toString(36).substr(2, 9);
      
      set(state => ({
        logs: [...state.logs, { id: tempId, habit_id: habitId, date, completed: true }]
      }));
      
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, date, completed: true })
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting log:', error);
        set(state => ({ logs: state.logs.filter(l => l.id !== tempId) }));
      } else {
        // Swap temp ID for real ID
        set(state => {
          const newLogs = [...state.logs];
          const index = newLogs.findIndex(l => l.id === tempId);
          if (index !== -1) newLogs[index] = data;
          return { logs: newLogs };
        });
      }
    }
  }
}));

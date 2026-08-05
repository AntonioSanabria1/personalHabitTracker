export type HabitCategory = 
  | 'Académico' 
  | 'Salud' 
  | 'Responsabilidades' 
  | 'Planificación' 
  | 'Finanzas' 
  | 'Deporte' 
  | 'Social' 
  | 'Desarrollo Personal' 
  | 'Hobbies' 
  | 'Hogar' 
  | 'Otros';

export type HabitColor = 
  | 'Red'
  | 'Orange'
  | 'Amber'
  | 'Lime'
  | 'Green'
  | 'Emerald'
  | 'Teal'
  | 'Cyan'
  | 'Sky'
  | 'Blue'
  | 'Indigo'
  | 'Purple'
  | 'Pink'
  | 'Rose';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: HabitCategory;
  color: HabitColor;
  created_at: string;
  is_deleted: boolean;
  deleted_at?: string | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

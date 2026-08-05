import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHabitColorClasses = (color: string, active: boolean) => {
  const activeColors: Record<string, string> = {
    Red: 'bg-red-500 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    Orange: 'bg-orange-500 border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    Amber: 'bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    Lime: 'bg-lime-400 border-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.3)]',
    Green: 'bg-green-500 border-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    Emerald: 'bg-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
    Teal: 'bg-teal-500 border-teal-600 shadow-[0_0_10px_rgba(20,184,166,0.3)]',
    Cyan: 'bg-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
    Sky: 'bg-sky-500 border-sky-600 shadow-[0_0_10px_rgba(14,165,233,0.3)]',
    Blue: 'bg-blue-500 border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    Indigo: 'bg-indigo-400 border-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.3)]',
    Purple: 'bg-purple-500 border-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    Pink: 'bg-pink-500 border-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
    Rose: 'bg-rose-500 border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
  };

  const inactiveColors = 'bg-zinc-800/30 border-zinc-700/50 md:hover:border-zinc-500 active:border-zinc-500 transition-colors cursor-pointer';
  
  if (!active) return inactiveColors;
  return activeColors[color] || activeColors.Blue;
};

// Also keep a text-only variant for icons/badges
export const getHabitTextColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    Red: 'text-red-500',
    Orange: 'text-orange-500',
    Amber: 'text-amber-500',
    Lime: 'text-lime-400',
    Green: 'text-green-500',
    Emerald: 'text-emerald-400',
    Teal: 'text-teal-500',
    Cyan: 'text-cyan-400',
    Sky: 'text-sky-500',
    Blue: 'text-blue-500',
    Indigo: 'text-indigo-400',
    Purple: 'text-purple-500',
    Pink: 'text-pink-500',
    Rose: 'text-rose-500',
  };
  return colors[color] || colors.Blue;
};

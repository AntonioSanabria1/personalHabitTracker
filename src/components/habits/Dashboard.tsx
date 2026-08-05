'use client';

import { useState, useEffect, Suspense } from 'react';
import { useHabitStore } from '@/store/useHabitStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn, getHabitTextColorClasses } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

type TimeRange = 'week' | 'month' | 'year';

function DashboardContent({ serverDate }: { serverDate?: string }) {
  const { habits, logs } = useHabitStore();
  const searchParams = useSearchParams();
  const habitParam = searchParams.get('habit');
  
  const activeHabits = habits.filter(h => !h.is_deleted);
  
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(habitParam || null);

  // Re-sync if URL changes
  useEffect(() => {
    if (habitParam) {
      setSelectedHabitId(habitParam);
    }
  }, [habitParam]);

  const generateChartData = () => {
    let data: { name: string; completados: number }[] = [];
    const baseDate = serverDate ? new Date(serverDate) : new Date();
    
    if (timeRange === 'week') {
      data = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(baseDate, 6 - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const relevantHabits = selectedHabitId ? activeHabits.filter(h => h.id === selectedHabitId) : activeHabits;
        const totalCount = relevantHabits.length || 1;
        const completedCount = logs.filter(l => l.date === dateStr && l.completed && relevantHabits.some(h => h.id === l.habit_id)).length;
        
        return {
          name: format(date, 'EEE', { locale: es }).substring(0, 3).toUpperCase(),
          completados: Math.round((completedCount / totalCount) * 100)
        };
      });
    } else if (timeRange === 'month') {
      data = Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(baseDate, 29 - i);
        const dateStr = date.toISOString().split('T')[0];
        
        return {
          name: format(date, 'd MMM', { locale: es }),
          completados: logs.filter(l => l.date === dateStr && l.completed && (selectedHabitId ? l.habit_id === selectedHabitId : true)).length
        };
      });
    } else if (timeRange === 'year') {
      data = Array.from({ length: 12 }).map((_, i) => {
        const date = subMonths(baseDate, 11 - i);
        const monthStart = startOfMonth(date).toISOString().split('T')[0];
        const monthEnd = endOfMonth(date).toISOString().split('T')[0];
        
        const relevantHabits = selectedHabitId ? activeHabits.filter(h => h.id === selectedHabitId) : activeHabits;
        
        const monthLogs = logs.filter(l => l.date >= monthStart && l.date <= monthEnd && relevantHabits.some(h => h.id === l.habit_id));
        const completedCount = monthLogs.filter(l => l.completed).length;
        const daysInMonth = parseInt(format(endOfMonth(date), 'd'));
        const totalPossible = relevantHabits.length * daysInMonth || 1;
        
        return {
          name: format(date, 'MMM', { locale: es }).toUpperCase(),
          completados: Math.round((completedCount / totalPossible) * 100)
        };
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const selectedHabitName = selectedHabitId ? activeHabits.find(h => h.id === selectedHabitId)?.name : 'Todos los Hábitos';

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10 min-h-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Analíticas</h2>
          <p className="text-zinc-400 mt-1">Explora tu progreso a lo largo del tiempo.</p>
        </div>
        
        {/* Time Range Filters */}
        <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/50 self-start md:self-auto">
          {(['week', 'month', 'year'] as TimeRange[]).map((range) => {
            const labels = { week: '7 Días', month: '30 Días', year: '12 Meses' };
            const isActive = timeRange === range;
            return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all",
                    isActive 
                      ? "bg-zinc-100 text-zinc-900 shadow-sm" 
                      : "text-zinc-400 md:hover:text-zinc-200 active:text-zinc-200"
                  )}
                >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="elevated-card p-6 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              {selectedHabitName}
            </h3>
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider bg-zinc-800/50 px-2 py-1 rounded">
              Porcentaje de Éxito
            </span>
          </div>
          
          <div className="h-[300px] min-h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#525252" 
                  tick={{ fill: '#71717a', fontSize: 11, fontWeight: 500 }} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  interval={timeRange === 'month' ? 3 : 0} // Skip labels for month view so it fits
                />
                <YAxis 
                  stroke="#525252" 
                  tick={{ fill: '#71717a', fontSize: 11 }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fafafa', fontWeight: 600 }}
                  labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 32 }}
                  formatter={(value: any) => [`${value}%`, 'Completado']}
                />
                <Line 
                  type="monotone" 
                  dataKey="completados" 
                  stroke="#fafafa" 
                  strokeWidth={2}
                  dot={{ fill: '#09090b', stroke: '#fafafa', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fafafa', stroke: '#09090b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Selector List */}
        <div className="elevated-card p-6 flex flex-col h-[400px]">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-6">
            Filtrar por Hábito
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            <button
              onClick={() => setSelectedHabitId(null)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                selectedHabitId === null 
                  ? "bg-zinc-800/80 border-zinc-700/50" 
                  : "bg-transparent border-transparent md:hover:bg-zinc-800/30 active:bg-zinc-800/30"
              )}
            >
              <span className={cn(
                "text-sm font-medium", 
                selectedHabitId === null ? "text-zinc-100" : "text-zinc-400"
              )}>
                Todos los Hábitos
              </span>
            </button>
            
            {activeHabits.map(habit => {
              const isSelected = selectedHabitId === habit.id;
              
              // Quick mock percentage for the list item (just total completion over all time)
              const habitLogs = logs.filter(l => l.habit_id === habit.id);
              const totalDays = 30; // Just as a relative baseline
              const completedDays = habitLogs.filter(l => l.completed).length;
              const globalPercentage = Math.min(100, Math.round((completedDays / totalDays) * 100));

              return (
                <button
                  key={habit.id} 
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={cn(
                    "w-full flex flex-col justify-center p-3 rounded-xl transition-all border text-left",
                    isSelected 
                      ? "bg-zinc-800/80 border-zinc-700/50 shadow-sm" 
                      : "bg-transparent border-transparent md:hover:bg-zinc-800/30 active:bg-zinc-800/30"
                  )}
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        getHabitTextColorClasses(habit.color).replace('text-', 'bg-')
                      )} />
                      <h4 className={cn("font-medium text-sm", isSelected ? "text-zinc-200" : "text-zinc-400")}>
                        {habit.name}
                      </h4>
                    </div>
                  </div>
                  <div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-300 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${globalPercentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ serverDate }: { serverDate?: string }) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center p-12 text-zinc-500">Cargando analíticas...</div>}>
      <DashboardContent serverDate={serverDate} />
    </Suspense>
  );
}

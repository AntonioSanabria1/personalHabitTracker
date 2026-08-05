import { WeeklyHabitGrid } from '@/components/habits/WeeklyHabitGrid';
import { TodayProgress } from '@/components/habits/TodayProgress';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Home() {
  const serverDate = new Date().toISOString();
  const todayDateString = format(new Date(serverDate), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 capitalize">
          {todayDateString}
        </h2>
        <p className="text-zinc-400 mt-1">
          Tu resumen de la semana. Haz clic en las celdas para registrar tus hábitos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyHabitGrid serverDate={serverDate} />
        </div>
        <div className="lg:col-span-1">
          <TodayProgress serverDate={serverDate} />
        </div>
      </div>
    </div>
  );
}

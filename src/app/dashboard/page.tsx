import { Dashboard } from '@/components/habits/Dashboard';

export default function DashboardPage() {
  const serverDate = new Date().toISOString();
  return (
    <div className="min-h-full">
      <Dashboard serverDate={serverDate} />
    </div>
  );
}

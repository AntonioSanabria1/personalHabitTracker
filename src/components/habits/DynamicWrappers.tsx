'use client';

import dynamic from 'next/dynamic';

export const WeeklyHabitGridNoSSR = dynamic(
  () => import('./WeeklyHabitGrid').then((mod) => mod.WeeklyHabitGrid),
  { ssr: false }
);

export const TodayProgressNoSSR = dynamic(
  () => import('./TodayProgress').then((mod) => mod.TodayProgress),
  { ssr: false }
);

export const DashboardNoSSR = dynamic(
  () => import('./Dashboard').then((mod) => mod.Dashboard),
  { ssr: false }
);

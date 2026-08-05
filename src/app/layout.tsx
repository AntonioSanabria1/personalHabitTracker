import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { StoreInitializer } from '@/components/StoreInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits with a premium aesthetic.',
  icons: {
    icon: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  }
};

import { AuthProvider } from '@/components/AuthProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased bg-zinc-950 text-zinc-50 overflow-hidden selection:bg-zinc-800`}>
        <StoreInitializer>
          <AuthProvider>
            <div className="flex h-[100dvh] w-full">
              <Navigation />
              <main className="flex-1 overflow-y-auto pb-28 md:pb-0">
                {children}
              </main>
            </div>
          </AuthProvider>
        </StoreInitializer>
      </body>
    </html>
  );
}

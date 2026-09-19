import type { Metadata } from 'next';

import { ToastHost } from '@/features/stop-list/ui/ToastHost';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Стоп-лист смены',
  description: 'Панель стоп-листа кухни: меню смены, фильтры, постановка и снятие позиций со стопа',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>
          {children}
          <ToastHost />
        </Providers>
      </body>
    </html>
  );
}

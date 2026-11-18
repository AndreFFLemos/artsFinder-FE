import type { Metadata } from 'next';
import { Geist, Space_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
import { Brand, Header } from '@/components/header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ArtsFinder',
  description: 'Encontra músicos com quem tocar',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* Sessão e dados da API são lidos por pedido, por isso ficam fora da shell estática */}
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t py-6 text-center text-xs text-muted">ArtsFinder · músicos a tocar juntos</footer>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-20 border-b bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center px-4 py-3">
        <Brand />
      </nav>
    </header>
  );
}

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ArtsFinder',
  description: 'Encontra músicos com quem tocar',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {/* Sessão e dados da API são lidos por pedido, por isso ficam fora da shell estática */}
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-indigo-700">
          ArtsFinder
        </Link>
      </nav>
    </header>
  );
}

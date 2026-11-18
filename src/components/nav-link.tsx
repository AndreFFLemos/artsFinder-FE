'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' || pathname.startsWith('/musicians') : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="relative inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted transition hover:text-fg aria-[current=page]:text-fg aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2 aria-[current=page]:after:-bottom-[13px] aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-gradient-brand"
    >
      {children}
    </Link>
  );
}

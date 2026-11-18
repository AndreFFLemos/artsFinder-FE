import { AudioWaveform, LogOut, Megaphone, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { NavLink } from '@/components/nav-link';
import { logout } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
      <span className="bg-gradient-brand flex size-8 items-center justify-center rounded-lg text-white">
        <AudioWaveform className="size-5" aria-hidden="true" />
      </span>
      <span className="text-gradient">ArtsFinder</span>
    </Link>
  );
}

export async function Header() {
  const me = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-4">
        <Brand />
        <div className="ml-2 hidden items-center gap-1 sm:flex">
          <NavLink href="/">
            <Users className="size-4" aria-hidden="true" />
            Músicos
          </NavLink>
          <NavLink href="/ads">
            <Megaphone className="size-4" aria-hidden="true" />
            Anúncios
          </NavLink>
          {me && (
            <NavLink href="/messages">
              <MessageCircle className="size-4" aria-hidden="true" />
              Mensagens
            </NavLink>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {me ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm transition hover:bg-raised">
                <Avatar id={me.id} name={me.name} size="sm" />
                <span className="hidden max-w-32 truncate sm:inline">{me.name}</span>
              </Link>
              <form action={logout}>
                <button type="submit" aria-label="Sair" title="Sair" className="rounded-md p-2 text-muted transition hover:bg-raised hover:text-fg">
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="px-2 text-sm text-muted transition hover:text-fg">
                Entrar
              </Link>
              <Link href="/register" className="btn">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Em ecrãs pequenos a navegação passa para uma segunda linha */}
      <div className="flex items-center justify-center gap-2 border-t px-4 py-1.5 sm:hidden">
        <NavLink href="/">Músicos</NavLink>
        <NavLink href="/ads">Anúncios</NavLink>
        {me && <NavLink href="/messages">Mensagens</NavLink>}
      </div>
    </header>
  );
}

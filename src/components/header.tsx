import Link from 'next/link';
import { logout } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export async function Header() {
  const me = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3 text-sm">
        <Link href="/" className="text-lg font-semibold text-indigo-700">
          ArtsFinder
        </Link>
        <Link href="/" className="hover:text-indigo-700">
          Músicos
        </Link>
        <Link href="/ads" className="hover:text-indigo-700">
          Anúncios
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {me ? (
            <>
              <Link href="/messages" className="hover:text-indigo-700">
                Mensagens
              </Link>
              <Link href="/profile" className="hover:text-indigo-700">
                {me.name}
              </Link>
              <form action={logout}>
                <button type="submit" className="text-zinc-500 hover:text-zinc-900">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-700">
                Entrar
              </Link>
              <Link href="/register" className="btn">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

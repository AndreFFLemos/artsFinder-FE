import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Loading } from '@/components/loading';
import { login } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';

export default function LoginPage(props: PageProps<'/login'>) {
  return (
    <Suspense fallback={<Loading />}>
      <LoginContent {...props} />
    </Suspense>
  );
}

async function LoginContent(props: PageProps<'/login'>) {
  if (await getCurrentUser()) redirect('/');
  const { next } = await props.searchParams;

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Entrar</h1>
      <ActionForm action={login} submitLabel="Entrar" className="card space-y-4">
        <input type="hidden" name="next" value={typeof next === 'string' ? next : '/'} />
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
      </ActionForm>
      <p className="text-sm text-muted">
        Ainda não tens conta?{' '}
        <Link href="/register" className="link">
          Cria uma
        </Link>
      </p>
    </div>
  );
}

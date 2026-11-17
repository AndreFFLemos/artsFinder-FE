import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Loading } from '@/components/loading';
import { SpecialtyCheckboxes } from '@/components/specialties';
import { register } from '@/lib/actions';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/session';
import type { Specialty } from '@/lib/types';

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterContent />
    </Suspense>
  );
}

async function RegisterContent() {
  if (await getCurrentUser()) redirect('/');
  const specialties = await api<Specialty[]>('/specialties/all');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <ActionForm action={register} submitLabel="Criar conta" className="card space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Nome
          </label>
          <input id="name" name="name" required maxLength={100} autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={255} autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password (mínimo 8 caracteres)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="location" className="label">
            Localização
          </label>
          <input id="location" name="location" required maxLength={255} placeholder="ex.: Lisboa" className="input" />
        </div>
        <SpecialtyCheckboxes specialties={specialties} />
      </ActionForm>
      <p className="text-sm text-zinc-600">
        Já tens conta?{' '}
        <Link href="/login" className="text-indigo-700 hover:underline">
          Entra
        </Link>
      </p>
    </div>
  );
}

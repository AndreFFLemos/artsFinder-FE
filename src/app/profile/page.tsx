import { ActionForm } from '@/components/action-form';
import { SpecialtyCheckboxes } from '@/components/specialties';
import { updateProfile } from '@/lib/actions';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/session';
import type { Specialty } from '@/lib/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const me = await getCurrentUser();
  if (!me) redirect('/login?next=/profile');
  const specialties = await api<Specialty[]>('/specialties/all');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">O meu perfil</h1>
      <ActionForm action={updateProfile} submitLabel="Guardar" className="card space-y-4">
        <div>
          <span className="label">Email</span>
          <p className="text-sm text-zinc-600">{me.email}</p>
        </div>
        <div>
          <label htmlFor="name" className="label">
            Nome
          </label>
          <input id="name" name="name" required maxLength={100} defaultValue={me.name} className="input" />
        </div>
        <div>
          <label htmlFor="location" className="label">
            Localização
          </label>
          <input id="location" name="location" required maxLength={255} defaultValue={me.location} className="input" />
        </div>
        <SpecialtyCheckboxes specialties={specialties} selected={me.specialties.map((s) => s.id)} />
      </ActionForm>
    </div>
  );
}

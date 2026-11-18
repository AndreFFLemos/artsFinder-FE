import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Loading } from '@/components/loading';
import { SpecialtyCheckboxes } from '@/components/specialties';
import { updateAd } from '@/lib/actions';
import { api, ApiError } from '@/lib/api';
import { getCurrentUser } from '@/lib/session';
import type { Ad, Specialty } from '@/lib/types';

export default function EditAdPage(props: PageProps<'/ads/[id]/edit'>) {
  return (
    <Suspense fallback={<Loading />}>
      <EditAdContent {...props} />
    </Suspense>
  );
}

async function EditAdContent(props: PageProps<'/ads/[id]/edit'>) {
  const { id } = await props.params;
  if (!/^\d+$/.test(id)) notFound();

  let ad: Ad;
  let specialties: Specialty[];
  try {
    [ad, specialties] = await Promise.all([api<Ad>(`/add/${id}`), api<Specialty[]>('/specialties/all')]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  // A API volta a validar o dono ao guardar
  const me = await getCurrentUser();
  if (!me || me.id !== ad.user?.id) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Editar anúncio</h1>
      <ActionForm action={updateAd.bind(null, ad.id)} submitLabel="Guardar" className="card space-y-4">
        <div>
          <label htmlFor="title" className="label">
            Título
          </label>
          <input id="title" name="title" required maxLength={255} defaultValue={ad.title} className="input" />
        </div>
        <div>
          <label htmlFor="body" className="label">
            Descrição
          </label>
          <textarea id="body" name="body" required maxLength={255} rows={4} defaultValue={ad.body} className="input" />
        </div>
        <SpecialtyCheckboxes
          specialties={specialties}
          selected={ad.specialties.map((s) => s.id)}
          legend="Instrumentos procurados"
        />
      </ActionForm>
    </div>
  );
}

import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Loading } from '@/components/loading';
import { SpecialtyCheckboxes } from '@/components/specialties';
import { createAd } from '@/lib/actions';
import { api } from '@/lib/api';
import type { Specialty } from '@/lib/types';

export default function NewAdPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewAdContent />
    </Suspense>
  );
}

async function NewAdContent() {
  const specialties = await api<Specialty[]>('/specialties/all');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Novo anúncio</h1>
      <ActionForm action={createAd} submitLabel="Publicar" className="card space-y-4">
        <div>
          <label htmlFor="title" className="label">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={255}
            placeholder="ex.: Procuro baterista para banda de rock"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="body" className="label">
            Descrição
          </label>
          <textarea id="body" name="body" required maxLength={255} rows={4} className="input" />
        </div>
        <SpecialtyCheckboxes specialties={specialties} legend="Instrumentos procurados" />
      </ActionForm>
    </div>
  );
}

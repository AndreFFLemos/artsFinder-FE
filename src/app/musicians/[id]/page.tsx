import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Loading } from '@/components/loading';
import { SpecialtyTags } from '@/components/specialties';
import { sendMessage } from '@/lib/actions';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { getCurrentUser } from '@/lib/session';
import type { Ad, User } from '@/lib/types';

export default function MusicianPage(props: PageProps<'/musicians/[id]'>) {
  return (
    <Suspense fallback={<Loading />}>
      <MusicianContent {...props} />
    </Suspense>
  );
}

async function MusicianContent(props: PageProps<'/musicians/[id]'>) {
  const { id } = await props.params;
  if (!/^\d+$/.test(id)) notFound();

  let user: User;
  let ads: Ad[];
  try {
    [user, ads] = await Promise.all([api<User>(`/user/${id}`), api<Ad[]>(`/user/${id}/ads`)]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  const me = await getCurrentUser();

  return (
    <div className="space-y-8">
      <section className="card space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <span className="text-zinc-500">{user.location}</span>
        </div>
        <SpecialtyTags specialties={user.specialties} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Anúncios</h2>
        {ads.length ? (
          <ul className="space-y-3">
            {ads.map((ad) => (
              <li key={ad.id} className="card">
                <p className="font-medium">{ad.title}</p>
                <p className="text-sm whitespace-pre-line text-zinc-700">{ad.body}</p>
                <p className="mt-1 text-xs text-zinc-500">{formatDate(ad.created_at)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">Sem anúncios.</p>
        )}
      </section>

      {me?.id !== user.id && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Enviar mensagem</h2>
          {me ? (
            <ActionForm action={sendMessage} submitLabel="Enviar" className="card space-y-4">
              <input type="hidden" name="receiverId" value={user.id} />
              <div>
                <label htmlFor="subject" className="label">
                  Assunto
                </label>
                <input id="subject" name="subject" required maxLength={255} className="input" />
              </div>
              <div>
                <label htmlFor="message" className="label">
                  Mensagem
                </label>
                <textarea id="message" name="message" required maxLength={255} rows={4} className="input" />
              </div>
            </ActionForm>
          ) : (
            <p className="text-sm text-zinc-600">
              <Link href={`/login?next=/musicians/${user.id}`} className="text-indigo-700 hover:underline">
                Entra
              </Link>{' '}
              para enviar uma mensagem.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

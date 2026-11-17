import Link from 'next/link';
import { Suspense } from 'react';
import { ConfirmButton } from '@/components/confirm-button';
import { Loading } from '@/components/loading';
import { SpecialtyTags } from '@/components/specialties';
import { deleteAd } from '@/lib/actions';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { getCurrentUser } from '@/lib/session';
import type { Ad } from '@/lib/types';

export default function AdsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdsContent />
    </Suspense>
  );
}

async function AdsContent() {
  const [ads, me] = await Promise.all([api<Ad[]>('/add/all'), getCurrentUser()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Anúncios</h1>
        <Link href="/ads/new" className="btn">
          Novo anúncio
        </Link>
      </div>

      {ads.length ? (
        <ul className="space-y-4">
          {ads.map((ad) => (
            <li key={ad.id} className="card space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-medium">{ad.title}</h2>
                {me && me.id === ad.user?.id && (
                  <div className="flex gap-3 text-sm">
                    <Link href={`/ads/${ad.id}/edit`} className="text-indigo-700 hover:underline">
                      Editar
                    </Link>
                    <form action={deleteAd.bind(null, ad.id)}>
                      <ConfirmButton message="Apagar este anúncio?" className="text-red-600 hover:underline">
                        Apagar
                      </ConfirmButton>
                    </form>
                  </div>
                )}
              </div>
              <p className="text-sm whitespace-pre-line text-zinc-700">{ad.body}</p>
              <SpecialtyTags specialties={ad.specialties} />
              <p className="text-xs text-zinc-500">
                {ad.user && (
                  <>
                    <Link href={`/musicians/${ad.user.id}`} className="text-indigo-700 hover:underline">
                      {ad.user.name}
                    </Link>{' '}
                    · {ad.user.location} ·{' '}
                  </>
                )}
                {formatDate(ad.created_at)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">Ainda não há anúncios.</p>
      )}
    </div>
  );
}

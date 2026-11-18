import { MapPin, Megaphone, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Avatar } from '@/components/avatar';
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
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">Anúncios</h1>
        <Link href="/ads/new" className="btn">
          <Plus className="size-4" aria-hidden="true" />
          Novo anúncio
        </Link>
      </div>

      {ads.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {ads.map((ad, i) => (
            <li key={ad.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}>
              <article className="card card-hover flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg leading-snug font-semibold">{ad.title}</h2>
                  {me && me.id === ad.user?.id && (
                    <div className="flex shrink-0 items-center gap-3 text-sm">
                      <Link href={`/ads/${ad.id}/edit`} className="link inline-flex items-center gap-1">
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Editar
                      </Link>
                      <form action={deleteAd.bind(null, ad.id)}>
                        <ConfirmButton message="Apagar este anúncio?" className="text-rose-400 hover:underline">
                          Apagar
                        </ConfirmButton>
                      </form>
                    </div>
                  )}
                </div>
                <p className="text-sm whitespace-pre-line text-fg/80">{ad.body}</p>
                <SpecialtyTags specialties={ad.specialties} />
                <footer className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted">
                  {ad.user && (
                    <>
                      <Avatar id={ad.user.id} name={ad.user.name} size="sm" />
                      <div className="min-w-0">
                        <Link href={`/musicians/${ad.user.id}`} className="link block truncate text-sm">
                          {ad.user.name}
                        </Link>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden="true" />
                          {ad.user.location} · {formatDate(ad.created_at)}
                        </span>
                      </div>
                    </>
                  )}
                </footer>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <Megaphone className="size-8 text-muted" aria-hidden="true" />
          <p className="text-muted">Ainda não há anúncios. Publica o primeiro!</p>
        </div>
      )}
    </div>
  );
}

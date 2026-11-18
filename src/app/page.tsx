import { ChevronLeft, ChevronRight, MapPin, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Avatar } from '@/components/avatar';
import { CardSkeleton } from '@/components/loading';
import { SearchControls } from '@/components/search-controls';
import { SoundWaves } from '@/components/sound-waves';
import { SpecialtyTags } from '@/components/specialties';
import { api } from '@/lib/api';
import type { Ad, Paginated, Specialty, User } from '@/lib/types';

const PAGE_SIZE = 20;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

export default function Home(props: PageProps<'/'>) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent {...props} />
    </Suspense>
  );
}

async function HomeContent(props: PageProps<'/'>) {
  const searchParams = await props.searchParams;
  const specialtyId = first(searchParams.specialtyId);
  const location = first(searchParams.location).slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(searchParams.page), 10) || 1);
  const selectedId = /^\d+$/.test(specialtyId) ? Number(specialtyId) : null;

  const query = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (selectedId) query.set('specialtyId', String(selectedId));
  if (location) query.set('location', location);

  const [specialties, results, everyone, ads] = await Promise.all([
    api<Specialty[]>('/specialties/all'),
    api<Paginated<User>>(`/user/search?${query}`),
    api<Paginated<User>>('/user/search?limit=1'),
    api<Ad[]>('/add/all'),
  ]);
  const totalPages = Math.max(1, Math.ceil(results.total / results.limit));
  const filtered = selectedId !== null || location !== '';

  const pageHref = (p: number) => {
    const q = new URLSearchParams(query);
    q.set('page', String(p));
    q.delete('limit');
    return `/?${q}`;
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border bg-surface/60 px-5 pt-10 pb-16 sm:px-10 sm:pt-14 sm:pb-24">
        <SoundWaves />
        <div className="relative space-y-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Encontra a tua <span className="text-gradient">próxima banda</span>
            </h1>
            <p className="text-base text-muted sm:text-lg">
              Procura músicos por instrumento e localização, publica anúncios e combina o próximo ensaio.
            </p>
          </div>
          <div className="card max-w-3xl bg-ink/70 p-4 sm:p-5">
            <SearchControls specialties={specialties} selectedId={selectedId} initialLocation={location} />
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <Stat value={everyone.total} label="músicos" />
            <Stat value={ads.length} label="anúncios" />
            <Stat value={specialties.length} label="instrumentos" />
          </dl>
        </div>
      </section>

      <section className="space-y-5" aria-live="polite">
        <h2 className="font-display text-xl font-semibold">
          {results.total === 1 ? '1 músico' : `${results.total} músicos`}
          {filtered && <span className="text-muted"> para a tua pesquisa</span>}
        </h2>

        {results.items.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {results.items.map((user, i) => (
              <li key={user.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}>
                <Link href={`/musicians/${user.id}`} className="card card-hover flex h-full gap-4">
                  <Avatar id={user.id} name={user.name} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="truncate font-display text-lg leading-tight font-semibold">{user.name}</p>
                      <p className="flex items-center gap-1 text-sm text-muted">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        <span className="truncate">{user.location}</span>
                      </p>
                    </div>
                    <SpecialtyTags specialties={user.specialties} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-center gap-3 py-12 text-center">
            <SearchX className="size-8 text-muted" aria-hidden="true" />
            <p className="text-muted">Ainda não há músicos para esta pesquisa.</p>
            <Link href="/" className="btn-secondary">
              Limpar filtros
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-4 text-sm" aria-label="Páginas">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="btn-secondary">
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </Link>
            )}
            <span className="text-muted">
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="btn-secondary">
                Seguinte
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-3xl font-bold">{value}</dd>
      <span aria-hidden="true" className="text-sm text-muted">
        {label}
      </span>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-10" role="status" aria-label="A carregar">
      <div className="skeleton h-96 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

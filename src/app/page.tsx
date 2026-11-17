import Link from 'next/link';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { SpecialtyTags } from '@/components/specialties';
import { api } from '@/lib/api';
import type { Paginated, Specialty, User } from '@/lib/types';

const PAGE_SIZE = 20;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

export default function Home(props: PageProps<'/'>) {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent {...props} />
    </Suspense>
  );
}

async function HomeContent(props: PageProps<'/'>) {
  const searchParams = await props.searchParams;
  const specialtyId = first(searchParams.specialtyId);
  const location = first(searchParams.location).slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(searchParams.page), 10) || 1);

  const query = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (/^\d+$/.test(specialtyId)) query.set('specialtyId', specialtyId);
  if (location) query.set('location', location);

  const [specialties, results] = await Promise.all([
    api<Specialty[]>('/specialties/all'),
    api<Paginated<User>>(`/user/search?${query}`),
  ]);
  const totalPages = Math.max(1, Math.ceil(results.total / results.limit));

  const pageHref = (p: number) => {
    const q = new URLSearchParams(query);
    q.set('page', String(p));
    q.delete('limit');
    return `/?${q}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Encontra músicos com quem tocar</h1>

      <form className="card flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="specialtyId" className="label">
            Instrumento
          </label>
          <select id="specialtyId" name="specialtyId" defaultValue={specialtyId} className="input">
            <option value="">Todos</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="location" className="label">
            Localização
          </label>
          <input id="location" name="location" defaultValue={location} maxLength={100} placeholder="ex.: Lisboa" className="input" />
        </div>
        <button type="submit" className="btn">
          Pesquisar
        </button>
      </form>

      <p className="text-sm text-zinc-600">
        {results.total === 1 ? '1 músico encontrado' : `${results.total} músicos encontrados`}
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {results.items.map((user) => (
          <li key={user.id}>
            <Link href={`/musicians/${user.id}`} className="card block space-y-2 hover:border-indigo-300">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-zinc-500">{user.location}</span>
              </div>
              <SpecialtyTags specialties={user.specialties} />
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 text-sm">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn-secondary">
              Anterior
            </Link>
          )}
          <span>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="btn-secondary">
              Seguinte
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

'use client';

import { LoaderCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type CSSProperties } from 'react';
import { SpecialtyIcon, specialtyStyle } from '@/components/specialty-style';
import type { Specialty } from '@/lib/types';

const VISIBLE_CHIPS = 10;

function href(specialtyId: number | null, location: string): string {
  const params = new URLSearchParams();
  if (specialtyId) params.set('specialtyId', String(specialtyId));
  if (location.trim()) params.set('location', location.trim());
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

export function SearchControls({
  specialties,
  selectedId,
  initialLocation,
}: {
  specialties: Specialty[];
  selectedId: number | null;
  initialLocation: string;
}) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const lastPushed = useRef(initialLocation);

  // Pesquisa enquanto se escreve, com um pequeno atraso para não pedir a cada tecla
  useEffect(() => {
    if (location.trim() === lastPushed.current.trim()) return;
    const timer = setTimeout(() => {
      lastPushed.current = location;
      startTransition(() => router.replace(href(selectedId, location), { scroll: false }));
    }, 350);
    return () => clearTimeout(timer);
  }, [location, selectedId, router]);

  const visible = specialties.filter((s, i) => expanded || i < VISIBLE_CHIPS || s.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="relative">
        <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <label htmlFor="location" className="sr-only">
          Localização
        </label>
        <input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={100}
          placeholder="Onde? ex.: Lisboa, Porto, Braga…"
          className="input py-3 pr-10 pl-9 text-base"
        />
        {pending && (
          <LoaderCircle className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-brand" aria-label="A pesquisar" />
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Instrumento">
        <Link
          href={href(null, location)}
          scroll={false}
          aria-current={selectedId === null ? 'true' : undefined}
          className="chip"
        >
          Todos
        </Link>
        {visible.map((s) => (
          <Link
            key={s.id}
            href={href(s.id, location)}
            scroll={false}
            aria-current={selectedId === s.id ? 'true' : undefined}
            style={{ '--h': specialtyStyle(s.name).hue } as CSSProperties}
            className="chip"
          >
            <SpecialtyIcon name={s.name} className="size-4" />
            {s.name}
          </Link>
        ))}
        {specialties.length > VISIBLE_CHIPS && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="chip" aria-expanded={expanded}>
            {expanded ? 'Menos' : `+${specialties.length - VISIBLE_CHIPS}`}
          </button>
        )}
      </div>
    </div>
  );
}

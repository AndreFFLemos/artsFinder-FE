import type { CSSProperties } from 'react';
import type { Specialty } from '@/lib/types';
import { SpecialtyIcon, specialtyStyle } from './specialty-style';

interface Props {
  specialties: Specialty[];
  selected?: number[];
  legend?: string;
}

const hue = (name: string) => ({ '--h': specialtyStyle(name).hue }) as CSSProperties;

export function SpecialtyCheckboxes({ specialties, selected = [], legend = 'Instrumentos / especialidades' }: Props) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <label key={s.id} style={hue(s.name)} className="chip cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-400">
            <input type="checkbox" name="specialtyIds" value={s.id} defaultChecked={selected.includes(s.id)} className="sr-only" />
            <SpecialtyIcon name={s.name} className="size-4" />
            {s.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SpecialtyTags({ specialties }: { specialties: Specialty[] }) {
  if (!specialties.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {specialties.map((s) => (
        <span key={s.id} style={hue(s.name)} className="tag">
          <SpecialtyIcon name={s.name} className="size-3" />
          {s.name}
        </span>
      ))}
    </div>
  );
}

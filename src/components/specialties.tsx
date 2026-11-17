import type { Specialty } from '@/lib/types';

interface Props {
  specialties: Specialty[];
  selected?: number[];
  legend?: string;
}

export function SpecialtyCheckboxes({ specialties, selected = [], legend = 'Instrumentos / especialidades' }: Props) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {specialties.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="specialtyIds" value={s.id} defaultChecked={selected.includes(s.id)} />
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
    <div className="flex flex-wrap gap-1">
      {specialties.map((s) => (
        <span key={s.id} className="tag">
          {s.name}
        </span>
      ))}
    </div>
  );
}

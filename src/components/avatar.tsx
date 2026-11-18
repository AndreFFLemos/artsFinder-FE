import type { CSSProperties } from 'react';

const SIZES = {
  sm: 'size-9 text-sm',
  md: 'size-12 text-base',
  lg: 'size-20 text-2xl',
} as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? '?').slice(0, 2);
  return letters.toUpperCase();
}

// Cor própria de cada músico, estável a partir do id
export function Avatar({ id, name, size = 'md' }: { id: number; name: string; size?: keyof typeof SIZES }) {
  const hue = (id * 47) % 360;
  const style = {
    backgroundImage: `linear-gradient(135deg, oklch(0.62 0.21 ${hue}), oklch(0.55 0.23 ${(hue + 70) % 360}))`,
  } satisfies CSSProperties;

  return (
    <span
      aria-hidden="true"
      style={style}
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white shadow-inner ring-2 ring-white/10`}
    >
      {initials(name)}
    </span>
  );
}

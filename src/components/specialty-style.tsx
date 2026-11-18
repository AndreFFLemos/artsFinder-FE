import {
  AudioWaveform,
  Disc3,
  Drum,
  Guitar,
  Headphones,
  KeyboardMusic,
  Mic,
  Music4,
  PenLine,
  Piano,
  Wind,
  type LucideIcon,
} from 'lucide-react';

interface Style {
  icon: LucideIcon;
  hue: number;
}

const STYLES: Record<string, Style> = {
  voz: { icon: Mic, hue: 350 },
  guitarra: { icon: Guitar, hue: 55 },
  'guitarra elétrica': { icon: Guitar, hue: 25 },
  'guitarra portuguesa': { icon: Guitar, hue: 75 },
  baixo: { icon: Guitar, hue: 285 },
  contrabaixo: { icon: Guitar, hue: 300 },
  cavaquinho: { icon: Guitar, hue: 45 },
  ukulele: { icon: Guitar, hue: 95 },
  bateria: { icon: Drum, hue: 25 },
  'percussão': { icon: Drum, hue: 40 },
  piano: { icon: Piano, hue: 255 },
  teclas: { icon: KeyboardMusic, hue: 240 },
  sintetizador: { icon: KeyboardMusic, hue: 220 },
  'acordeão': { icon: KeyboardMusic, hue: 200 },
  violino: { icon: Music4, hue: 160 },
  viola: { icon: Music4, hue: 175 },
  violoncelo: { icon: Music4, hue: 145 },
  saxofone: { icon: Wind, hue: 85 },
  trompete: { icon: Wind, hue: 65 },
  trombone: { icon: Wind, hue: 105 },
  flauta: { icon: Wind, hue: 190 },
  clarinete: { icon: Wind, hue: 210 },
  'harmónica': { icon: Wind, hue: 130 },
  dj: { icon: Disc3, hue: 320 },
  'produção': { icon: Headphones, hue: 270 },
  'composição': { icon: PenLine, hue: 330 },
};

const FALLBACK: Style = { icon: AudioWaveform, hue: 295 };

export function specialtyStyle(name: string): Style {
  return STYLES[name.trim().toLowerCase()] ?? FALLBACK;
}

export function SpecialtyIcon({ name, className }: { name: string; className?: string }) {
  const { icon: Icon } = specialtyStyle(name);
  return <Icon className={className} aria-hidden="true" />;
}

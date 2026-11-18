'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Algo correu mal</h1>
      <p className="text-sm text-muted">Confirma que a API está a correr e tenta outra vez.</p>
      <button type="button" onClick={reset} className="btn">
        Tentar novamente
      </button>
    </div>
  );
}

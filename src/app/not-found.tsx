import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Página não encontrada</h1>
      <Link href="/" className="link">
        Voltar ao início
      </Link>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <Link href="/" className="text-indigo-700 hover:underline">
        Voltar ao início
      </Link>
    </div>
  );
}

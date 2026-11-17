import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { getCurrentUser } from '@/lib/session';
import type { Message, User } from '@/lib/types';

interface Conversation {
  other: User;
  last: Message;
  unread: number;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MessagesContent />
    </Suspense>
  );
}

async function MessagesContent() {
  const me = await getCurrentUser();
  if (!me) redirect('/login?next=/messages');
  const messages = await api<Message[]>('/messages', { auth: true });

  // A API devolve as mensagens da mais recente para a mais antiga; agrupa por interlocutor
  const conversations = new Map<number, Conversation>();
  for (const msg of messages) {
    const other = msg.sender.id === me.id ? msg.receiver : msg.sender;
    const conv = conversations.get(other.id) ?? { other, last: msg, unread: 0 };
    if (msg.receiver.id === me.id && !msg.isRead) conv.unread++;
    conversations.set(other.id, conv);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mensagens</h1>
      {conversations.size ? (
        <ul className="space-y-3">
          {[...conversations.values()].map(({ other, last, unread }) => (
            <li key={other.id}>
              <Link href={`/messages/${other.id}`} className="card block hover:border-indigo-300">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">
                    {other.name}
                    {unread > 0 && <span className="tag ml-2">{unread} por ler</span>}
                  </span>
                  <span className="text-xs text-zinc-500">{formatDate(last.createdAt)}</span>
                </div>
                <p className="truncate text-sm text-zinc-600">
                  {last.sender.id === me.id && 'Tu: '}
                  {last.message}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">
          Ainda não tens mensagens.{' '}
          <Link href="/" className="text-indigo-700 hover:underline">
            Procura músicos
          </Link>{' '}
          e envia a primeira.
        </p>
      )}
    </div>
  );
}

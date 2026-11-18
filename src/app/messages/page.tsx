import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Avatar } from '@/components/avatar';
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
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Mensagens</h1>
      {conversations.size ? (
        <ul className="space-y-3">
          {[...conversations.values()].map(({ other, last, unread }, i) => (
            <li key={other.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}>
              <Link href={`/messages/${other.id}`} className="card card-hover flex items-center gap-4">
                <Avatar id={other.id} name={other.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-display font-semibold">{other.name}</span>
                    <span className="shrink-0 text-xs text-muted">{formatDate(last.createdAt)}</span>
                  </div>
                  <p className={`truncate text-sm ${unread ? 'text-fg' : 'text-muted'}`}>
                    {last.sender.id === me.id && 'Tu: '}
                    {last.message}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="bg-gradient-brand flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    <span className="sr-only">Por ler: </span>
                    {unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <MessageCircle className="size-8 text-muted" aria-hidden="true" />
          <p className="text-muted">Ainda não tens mensagens.</p>
          <Link href="/" className="btn-secondary">
            Procurar músicos
          </Link>
        </div>
      )}
    </div>
  );
}

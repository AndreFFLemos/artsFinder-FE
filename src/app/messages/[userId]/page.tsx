import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
import { Avatar } from '@/components/avatar';
import { ConfirmButton } from '@/components/confirm-button';
import { Loading } from '@/components/loading';
import { MarkAsRead } from '@/components/mark-as-read';
import { deleteConversation, sendMessage } from '@/lib/actions';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { getCurrentUser } from '@/lib/session';
import type { Message, User } from '@/lib/types';

export default function ConversationPage(props: PageProps<'/messages/[userId]'>) {
  return (
    <Suspense fallback={<Loading />}>
      <ConversationContent {...props} />
    </Suspense>
  );
}

async function ConversationContent(props: PageProps<'/messages/[userId]'>) {
  const { userId } = await props.params;
  if (!/^\d+$/.test(userId)) notFound();

  const me = await getCurrentUser();
  if (!me) redirect(`/login?next=/messages/${userId}`);
  if (me.id === Number(userId)) redirect('/messages');

  let other: User;
  let messages: Message[];
  try {
    [other, messages] = await Promise.all([
      api<User>(`/user/${userId}`),
      api<Message[]>(`/messages/conversation/${userId}`, { auth: true }),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  // A API devolve da mais recente para a mais antiga
  const latest = messages[0];
  const chronological = [...messages].reverse();
  const unreadIds = messages.filter((m) => m.receiver.id === me.id && !m.isRead).map((m) => m.id);
  const subject = latest ? (latest.subject.startsWith('Re: ') ? latest.subject : `Re: ${latest.subject}`) : '';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <MarkAsRead ids={unreadIds} />
      <div className="flex items-center justify-between gap-4">
        <Link href={`/musicians/${other.id}`} className="flex min-w-0 items-center gap-3">
          <Avatar id={other.id} name={other.name} />
          <h1 className="truncate font-display text-2xl font-bold tracking-tight">{other.name}</h1>
        </Link>
        <div className="flex shrink-0 items-center gap-4 text-sm">
          {messages.length > 0 && (
            <form action={deleteConversation.bind(null, other.id)}>
              <ConfirmButton
                message={`Apagar a conversa com ${other.name}? Será apagada também para a outra pessoa.`}
                className="inline-flex items-center gap-1 text-rose-400 hover:underline"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Apagar
              </ConfirmButton>
            </form>
          )}
          <Link href="/messages" className="inline-flex items-center gap-1 text-muted hover:text-fg">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Voltar
          </Link>
        </div>
      </div>

      <ul className="space-y-3">
        {chronological.map((msg) => {
          const mine = msg.sender.id === me.id;
          return (
            <li key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  mine ? 'bg-gradient-brand rounded-br-sm text-white' : 'rounded-bl-sm border bg-raised'
                }`}
              >
                <p className={`text-xs font-medium ${mine ? 'text-white/80' : 'text-muted'}`}>{msg.subject}</p>
                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                <p className={`mt-1 text-xs ${mine ? 'text-white/60' : 'text-muted/70'}`}>{formatDate(msg.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <ActionForm key={messages.length} action={sendMessage} submitLabel="Enviar" className="card space-y-4">
        <input type="hidden" name="receiverId" value={other.id} />
        {latest && <input type="hidden" name="threadId" value={latest.threadId} />}
        <div>
          <label htmlFor="subject" className="label">
            Assunto
          </label>
          <input id="subject" name="subject" required maxLength={255} defaultValue={subject} className="input" />
        </div>
        <div>
          <label htmlFor="message" className="label">
            Mensagem
          </label>
          <textarea id="message" name="message" required maxLength={255} rows={3} className="input" />
        </div>
      </ActionForm>
    </div>
  );
}

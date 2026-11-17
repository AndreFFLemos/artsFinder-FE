import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ActionForm } from '@/components/action-form';
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
    <div className="space-y-6">
      <MarkAsRead ids={unreadIds} />
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">
          Conversa com{' '}
          <Link href={`/musicians/${other.id}`} className="text-indigo-700 hover:underline">
            {other.name}
          </Link>
        </h1>
        <div className="flex items-center gap-4 text-sm">
          {messages.length > 0 && (
            <form action={deleteConversation.bind(null, other.id)}>
              <ConfirmButton
                message={`Apagar a conversa com ${other.name}? Será apagada também para a outra pessoa.`}
                className="text-red-600 hover:underline"
              >
                Apagar conversa
              </ConfirmButton>
            </form>
          )}
          <Link href="/messages" className="text-zinc-600 hover:underline">
            Voltar
          </Link>
        </div>
      </div>

      <ul className="space-y-3">
        {chronological.map((msg) => {
          const mine = msg.sender.id === me.id;
          return (
            <li key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${mine ? 'bg-indigo-600 text-white' : 'border border-zinc-200 bg-white'}`}>
                <p className={`text-xs font-medium ${mine ? 'text-indigo-100' : 'text-zinc-500'}`}>{msg.subject}</p>
                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                <p className={`mt-1 text-xs ${mine ? 'text-indigo-200' : 'text-zinc-400'}`}>{formatDate(msg.createdAt)}</p>
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

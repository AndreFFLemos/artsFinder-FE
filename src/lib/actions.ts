'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, ApiError } from './api';
import { clearToken, getCurrentUser, setToken } from './session';
import type { FormState, Message } from './types';

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function ids(formData: FormData, name: string): number[] {
  return formData
    .getAll(name)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
}

// Só aceita caminhos internos, para evitar redirecionamentos para outros sites
function safeNext(value: string): string {
  return value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : '/';
}

function failure(err: unknown): FormState {
  if (err instanceof ApiError) return { error: err.message };
  throw err;
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const { access_token } = await api<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: { email: text(formData, 'email'), password: formData.get('password') },
    });
    await setToken(access_token);
  } catch (err) {
    return failure(err);
  }
  redirect(safeNext(text(formData, 'next')));
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const { access_token } = await api<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: {
        name: text(formData, 'name'),
        email: text(formData, 'email'),
        password: formData.get('password'),
        location: text(formData, 'location'),
        specialtyIds: ids(formData, 'specialtyIds'),
      },
    });
    await setToken(access_token);
  } catch (err) {
    return failure(err);
  }
  redirect('/');
}

export async function logout(): Promise<void> {
  await clearToken();
  redirect('/');
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await getCurrentUser();
  if (!me) redirect('/login?next=/profile');
  try {
    await api(`/user/${me.id}`, {
      method: 'PUT',
      auth: true,
      body: {
        name: text(formData, 'name'),
        location: text(formData, 'location'),
        specialtyIds: ids(formData, 'specialtyIds'),
      },
    });
  } catch (err) {
    return failure(err);
  }
  revalidatePath('/', 'layout');
  return { success: 'Perfil atualizado.' };
}

export async function createAd(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await api('/add/new', {
      method: 'POST',
      auth: true,
      body: {
        title: text(formData, 'title'),
        body: text(formData, 'body'),
        specialtyIds: ids(formData, 'specialtyIds'),
      },
    });
  } catch (err) {
    return failure(err);
  }
  redirect('/ads');
}

export async function updateAd(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await api(`/add/${id}`, {
      method: 'PUT',
      auth: true,
      body: {
        title: text(formData, 'title'),
        body: text(formData, 'body'),
        specialtyIds: ids(formData, 'specialtyIds'),
      },
    });
  } catch (err) {
    return failure(err);
  }
  redirect('/ads');
}

export async function deleteAd(id: number): Promise<void> {
  await api(`/add/${id}`, { method: 'DELETE', auth: true });
  redirect('/ads');
}

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const receiverId = Number(formData.get('receiverId'));
  const threadId = Number(formData.get('threadId'));
  try {
    await api('/messages', {
      method: 'POST',
      auth: true,
      body: {
        receiverId,
        subject: text(formData, 'subject'),
        message: text(formData, 'message'),
        ...(threadId > 0 ? { threadId } : {}),
      },
    });
  } catch (err) {
    return failure(err);
  }
  redirect(`/messages/${receiverId}`);
}

// Uma conversa entre duas pessoas pode ter vários threads; apaga todos (para ambos os participantes)
export async function deleteConversation(otherUserId: number): Promise<void> {
  if (!Number.isInteger(otherUserId) || otherUserId < 1) redirect('/messages');
  const messages = await api<Message[]>(`/messages/conversation/${otherUserId}`, { auth: true });
  const threadIds = [...new Set(messages.map((m) => m.threadId))];
  await Promise.all(threadIds.map((threadId) => api(`/messages/thread/${threadId}`, { method: 'DELETE', auth: true })));
  redirect('/messages');
}

export async function markAsRead(messageIds: number[]): Promise<void> {
  await Promise.all(
    messageIds
      .filter((id) => Number.isInteger(id) && id > 0)
      .map((id) => api(`/messages/${id}/read`, { method: 'PATCH', auth: true })),
  );
}

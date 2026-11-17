import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { api, ApiError } from './api';
import type { User } from './types';

export const SESSION_COOKIE = 'af_session';
const DEFAULT_MAX_AGE = 3600;

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function setToken(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: secondsUntilExpiry(token),
  });
}

export async function clearToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

// Utilizador autenticado, ou null se não houver sessão válida; memorizado por pedido
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getToken())) return null;
  try {
    return await api<User>('/user/me', { auth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});

// Lê o 'exp' do JWT só para alinhar a validade do cookie; a verificação é feita pela API
function secondsUntilExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { exp?: number };
    if (payload.exp) return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  } catch {
    // Token com formato inesperado
  }
  return DEFAULT_MAX_AGE;
}

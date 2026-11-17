import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'af_session';

// Verificação otimista: sem cookie de sessão, envia para o login. A API valida o token em cada pedido
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const login = new URL('/login', request.url);
  login.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/messages/:path*', '/profile', '/ads/new', '/ads/:id/edit'],
};

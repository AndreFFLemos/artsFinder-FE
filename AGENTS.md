# AGENTS.md

Frontend do ArtsFinder (músicos a encontrar outros músicos). A API NestJS está em `../artsFinder`; ver o `AGENTS.md` e o `project-context/PROJECT_CONTEXT.md` desse projeto.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- Padrão backend-for-frontend: todos os pedidos à API são feitos no servidor ([src/lib/api.ts](src/lib/api.ts)); o browser nunca vê o JWT
- Sessão: JWT da API num cookie `httpOnly` (`af_session`), gerido em [src/lib/session.ts](src/lib/session.ts)
- Escrita por Server Actions em [src/lib/actions.ts](src/lib/actions.ts), ligadas aos formulários por [src/components/action-form.tsx](src/components/action-form.tsx)
- [src/proxy.ts](src/proxy.ts) só faz a verificação otimista do cookie; a autorização real é da API

## Comandos

No Windows/PowerShell usar `npm.cmd`/`npx.cmd`.

- `npm run dev` – desenvolvimento em `http://localhost:3000` (a API tem de estar a correr em `API_URL`)
- `npm run build`, `npm run lint`

## Variáveis de ambiente (`.env.local`)

`API_URL` (por omissão `http://localhost:3001`). Modelo em [.env.example](.env.example). Não usar `NEXT_PUBLIC_` para nada sensível.

## Convenções

- Textos da interface e comentários em português.
- `params`, `searchParams` e `cookies()` são assíncronos (Next 16); usar os tipos globais `PageProps<'/rota'>`.
- Validar ids de rota (`/^\d+$/`) antes de os passar à API; redirecionamentos só para caminhos internos.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

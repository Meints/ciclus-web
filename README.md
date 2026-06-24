# Ciclus — Frontend

SaaS B2B de gestão de serviços recorrentes (ar-condicionado, dedetização, limpeza,
manutenção predial). Frontend em Next.js 15 (App Router) consumindo uma API Fastify
multi-tenant (Company → User/Employee/Customer/Contract/Service).

Última atualização: 2026-06-17.

## Status geral

**Toda a estrutura inicial do frontend foi entregue e validada** (`npm run build` e
`tsc --noEmit` passam sem erros). O projeto está navegável de ponta a ponta usando uma
camada de **mock** própria, já que o backend real (Fastify) ainda não está integrado.

## Como rodar agora (com dados mockados)

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. Contas de teste (senha `123456` para todas):

| Papel | E-mail |
|---|---|
| OWNER | `owner@ciclus.com` |
| ADMIN | `admin@ciclus.com` |
| TECHNICIAN | `tecnico@ciclus.com` |

Os dados (clientes, contratos, OS, equipe) vivem em memória no processo do `next dev`
(`src/mock/seed.ts`) e resetam a cada reinício do servidor.

## O que já está implementado

### Infraestrutura
- Next.js 15 (App Router) + TypeScript strict + Tailwind v4
- React Query v5 (toda chamada assíncrona passa por hooks, sem `useEffect` para fetch)
- Zustand (`auth.store`, `ui.store`)
- React Hook Form + Zod em todos os formulários
- Axios (`src/lib/api.ts`) com interceptors de CSRF e logout automático em 401
- `src/middleware.ts`: decodifica o JWT do cookie httpOnly e aplica guard de rota por
  role (`OWNER`/`ADMIN`/`TECHNICIAN`) antes de qualquer página do dashboard renderizar
- shadcn/ui: 17 componentes escritos manualmente em `src/components/ui` (sem acesso ao
  CLI `npx shadcn add` neste ambiente)

### Telas funcionais
- Login (`/login`)
- Dashboard (`/`) com cards de resumo e listas (serviços da semana, contratos vencendo)
- Clientes: lista com busca + paginação, novo cliente (com máscara/validação real de
  CPF/CNPJ), detalhe com tabs (Contratos / Histórico / Equipamentos), editar e desativar
- Contratos: lista com filtros (status/tipo/período), novo contrato (autocomplete de
  cliente, agenda a 1ª OS automaticamente), detalhe com cancelamento
- Serviços/OS: lista com filtros (status/técnico/data, respeitando o que cada role pode
  ver), detalhe com registro de execução (fotos + assinatura via canvas) e geração de
  laudo em PDF
- Equipe: lista + cadastro de novo membro
- Configurações: dados da empresa, uso atual (dados reais do dashboard), troca de senha

### Camada de mock (`src/mock/` + `src/app/api/**`)
Route handlers do Next.js que respondem em `/api/*` com dados fictícios, simulando o
backend Fastify ainda não conectado. Isso inclui um endpoint que gera um PDF mínimo
válido para o laudo de OS e um endpoint de upload de foto que devolve a imagem como
data URL.

**Detalhe técnico importante**: o proxy real para o backend (`next.config.ts`) usa a
fase `rewrites().fallback`, não `afterFiles`/array simples — isso porque rewrites em
formato de array são resolvidos *antes* das rotas dinâmicas (`[id]`) do Next, o que
fazia as rotas de detalhe (`/api/customers/[id]`, `/api/services/[id]`, etc.) caírem no
proxy em vez de bater no mock. Usando `fallback`, as rotas do Next (mock ou reais,
inclusive dinâmicas) sempre têm prioridade; só o que não existir localmente vai para o
backend.

## O que falta para ligar ao backend real

1. Remover (ou ignorar) `src/mock/` e as rotas em `src/app/api/**` — elas têm
   precedência sobre o proxy, então o backend real só passa a ser usado depois disso.
2. Confirmar no backend Fastify os nomes exatos de cookie/headers:
   - Cookie do JWT esperado pelo frontend: `ciclus_token` (`AUTH_COOKIE_NAME` em
     `src/lib/auth.ts`)
   - Cookie de CSRF lido pelo frontend: `ciclus_csrf`, enviado como header
     `X-CSRF-Token` em requisições POST/PUT/PATCH/DELETE
3. Confirmar/criar no backend os endpoints que o frontend já assume mas não estavam na
   lista original fornecida (foram adicionados por necessidade das telas):
   - `PATCH /auth/password` (troca de senha em Configurações)
   - Filtros de query extras: `customerId` em `GET /contracts` e `GET /services`,
     `contractId` em `GET /services` (usados nas abas de detalhe de cliente/contrato)
   - `POST /services/:id/photos` (upload de foto da execução, multipart/form-data,
     deve devolver `{ url: string }`)
4. Configurar `.env.local` a partir de `.env.local.example` (`API_URL` apontando para o
   Fastify).
5. Rodar `npm run build` e `tsc --noEmit` de novo após apontar para o backend real —
   os tipos em `src/types/*` precisam ser confrontados com o schema real do Swagger.

## O que NÃO foi implementado (fora do escopo do scaffold inicial)

- Dark mode (explicitamente fora de escopo)
- Notificações em tempo real / WebSocket (explicitamente fora de escopo)
- Página de detalhe/edição de Employee individual (só listagem + criação)
- Reenvio de senha/recuperação de acesso
- Upload de logo da empresa em Configurações (não há endpoint definido para isso)

## Estrutura de pastas

Ver `src/` — segue exatamente o desenho combinado: `app/(auth)`, `app/(dashboard)`,
`components/{ui,layout,shared,customers,contracts,services,employees}`, `hooks/`,
`lib/` (incluindo `lib/validations/`), `services/`, `store/`, `types/`, mais `mock/`
(camada temporária de dados fictícios, não fazia parte do desenho original).




1
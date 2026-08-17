# Levi — Frontend

A React single-page app for Levi, a multi-tenant, Jira-style project management tool. Organizations, Kanban boards with live drag-and-drop, sprint backlogs, role-based permissions, and a productivity dashboard, built on Material UI.

The companion backend lives at [levi](https://github.com/sengarsumit/levi).

## Features

- **Public landing page** at `/`, self-redirecting to the app for already-authenticated visitors
- **Org-scoped auth** — general login/signup plus a dedicated `/login/:orgSlug` and `/register/:orgSlug` experience per organization, with an optional role-preference step when requesting to join
- **Kanban board** with real drag-and-drop (`dnd-kit`) between workflow columns, kept in sync live across tabs/users over WebSocket
- **Sprint backlog** planning
- **Project membership roster**, with add/remove for org admins
- **Issue detail** with comments and an activity feed
- **Productivity dashboard** — completion-rate stat cards, a per-teammate completed-issues bar chart (`@mui/x-charts`), and a breakdown table
- **Organization settings** — custom role creation, member invites, pending-request approval (with the requester's role preference pre-filled), and per-member shift configuration for time tracking
- **Light/dark theme**, built on a deliberate teal/coral palette and persisted across sessions

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **Redux Toolkit** — RTK Query for all server-cache state, plain slices for client-only state (auth, current organization, theme)
- **Material UI** (`@mui/material` + `@emotion`) — no Tailwind/shadcn/Radix in this codebase
- **React Router** (v8) for client-side routing
- **`@dnd-kit`** for the Kanban board's drag-and-drop
- **`@stomp/stompjs` + `sockjs-client`** for the live WebSocket connection to the backend
- **`@mui/x-charts`** for the productivity dashboard's bar chart
- **`sonner`** for toast notifications
- **oxlint** for linting
- Deployed on [Netlify](https://netlify.com)

## Getting started

### Prerequisites

- Node.js
- The [backend](https://github.com/sengarsumit/levi) running locally on port `8080` — the dev server proxies API calls to it

### Setup

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. It proxies `/api/*` to `http://127.0.0.1:8080` (stripping the `/api` prefix, since the backend's real routes have no prefix — e.g. the app calls `/api/boards`, which reaches the backend at `/boards`) and proxies `/ws-levi` for the WebSocket handshake. Both are configured in `vite.config.ts`; run the backend locally on 8080 for the frontend to work end-to-end.

### Available scripts

```bash
npm run dev        # start the Vite dev server with HMR
npm run build       # type-check (tsc -b) and build for production
npm run lint         # run oxlint
npm run preview       # locally preview a production build
```

No test runner is currently configured.

## Architecture

Feature-oriented structure under `src/`:

- **`app/`** — `store.ts` (the Redux store, combining `baseApi` with the plain client-state slices), `routes.tsx` (the route tree), `App.tsx`.
- **`api/`** — RTK Query slices (auth, organization, project, board, issue, sprint, comment, user, workflow-state, project-member), all injected into a single shared `baseApi` (`api/baseApi.ts`), which owns the `fetchBaseQuery` and tag types. New API slices should extend `baseApi.injectEndpoints` rather than creating a separate `createApi` instance.
- **`features/`** — plain Redux slices for client-only state (auth, current organization, theme), distinct from the server-cache state RTK Query owns.
- **`theme/`** — the light/dark palette and `getTheme(mode)`, consumed by `AppThemeProvider` (mounted in `main.tsx`, wraps the router, reads `mode` from the theme slice).
- **`components/`** — grouped by domain (`board/`, `issue/`, `organization/`, `project/`, `backlog/`, `layout/`, `common/`, `marketing/`, `auth/`).
- **`pages/`** — route-level components wired up in `app/routes.tsx`.
- **`hooks/useWebSocket.ts`** — the STOMP/SockJS client for the backend's `/ws-levi` endpoint.
- **`lib/jwt.ts`** — client-side JWT decoding, used for reading tenant/role claims for UI decisions.

### Auth & tenancy plumbing

`baseApi`'s `fetchBaseQuery` reads `token` and `tenantId` from `localStorage` and attaches them as `Authorization: Bearer` and `X-Tenant-ID` on every request — mirroring the backend's tenancy header contract. A `baseQueryWithReauth` wrapper logs the user out on any `401`. `ProtectedRoute` gates the entire authenticated route subtree.

### Path alias

`@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Routing shape

Public: `/` (landing page), `/login`, `/login/:orgSlug`, `/register`, `/register/:orgSlug`. Everything else nests under `ProtectedRoute` + the main app shell: `/projects`, `/projects/:id`, `/projects/:id/board`, `/projects/:id/backlog`, `/projects/:id/productivity`, `/issues/:issueId`, `/organization`, `/organization/:id/settings`.

## Deployment

The app deploys to [Netlify](https://netlify.com) as a static build, with `netlify.toml` proxying `/api/*` and `/ws-levi/*` to the deployed backend and falling back to `index.html` for client-side routes. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full walkthrough, including the WebSocket caveat under Netlify's redirect proxy.

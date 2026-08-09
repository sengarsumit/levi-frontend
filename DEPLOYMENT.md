# Deploying the frontend (free, Netlify)

This assumes the backend is already deployed per `levi/DEPLOYMENT.md`
(Render + Aiven MySQL). Nothing here affects local dev — `npm run dev` still
uses Vite's own proxy exactly as before; `netlify.toml` only takes effect on
Netlify's own build/serve.

## What's new

- `netlify.toml` — build command/output dir, plus three redirect rules (order
  matters, proxy rules must come before the catch-all):
  1. `/api/*` → your Render backend, stripping the `/api` prefix (mirrors
     `vite.config.ts`'s dev proxy — the backend's real routes have no `/api`
     prefix).
  2. `/ws-levi/*` → same backend, for the STOMP/SockJS handshake.
  3. `/*` → `/index.html` — required so refreshing or deep-linking into a
     client-side route (e.g. `/projects/3/board`) doesn't 404.

## Steps

1. **Update the backend URL.** `netlify.toml` currently points at
   `https://levi-backend.onrender.com` (the name set in `levi/render.yaml`).
   If Render gave your service a different URL (e.g. that name was taken),
   edit both `to =` lines in `netlify.toml` to match before deploying.
2. Push this repo to GitHub (`git add netlify.toml DEPLOYMENT.md`, commit,
   push to `main`) if it isn't already.
3. On [netlify.com](https://netlify.com) (no card required): **Add new site**
   → **Import an existing project** → connect GitHub → select `levi-frontend`.
   Netlify reads `netlify.toml` automatically for the build command and
   publish directory — you shouldn't need to type anything in manually.
4. Deploy. You'll get a URL like `https://<random-name>.netlify.app` (you can
   rename the site or attach a custom domain later, both free).
5. **Close the loop on CORS**: go back to the Render backend's environment
   variables and set `APP_CORS_ALLOWED_ORIGINS` to that exact Netlify URL
   (no trailing slash). Render redeploys automatically when you save an env
   var. Until this is set to the real value, API calls from the deployed
   frontend will fail CORS even though the proxy path is correct.
6. Sign up/log in through the deployed site and confirm a real API call
   works (e.g. the login form, or creating an org) — check the browser's
   Network tab if something 404s or CORS-errors, since that's the fastest way
   to tell which of the two (proxy path vs. CORS origin) is misconfigured.

## Known limitation: realtime updates over WebSocket

Netlify's redirect proxying is documented as HTTP request/response only (26s
timeout per request, no documented WebSocket upgrade support). `useWebSocket.ts`
uses SockJS specifically because it's designed to fall back to HTTP-polling
transports when a true WebSocket upgrade isn't available — so it should still
work, but live board updates may arrive via short polling cycles instead of
an instant push. If this turns out to matter in practice, a dedicated
WebSocket-capable host (e.g. running the frontend on Render as a static site,
or a proxy layer that does support upgrades) would be the fix — not something
to solve preemptively before seeing whether it's actually a problem.

# Ovrload Web

Vue 3 + TS, Tailwind v4, shadcn-vue, Pinia. Backend: [`ovrload-api`](../ovrload-api).

## Local

```bash
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api
npm i && npm run dev    # http://localhost:5173
npm test                # vitest
```

## Deploy on Railway

The image builds the app with `VITE_API_URL=/api` and serves it with nginx (non-root). nginx proxies
`/api/*` to the API service, so the auth cookie is first-party on this domain.

1. Deploy [`ovrload-api`](../ovrload-api) first (same Railway project).
2. New service → **Deploy from GitHub repo** → this repo (`railway.json` → Dockerfile + `/healthz` healthcheck).
3. Variables:

   | Variable | Value |
   |---|---|
   | `API_UPSTREAM` | `http://${{ovrload-api.RAILWAY_PRIVATE_DOMAIN}}:4000` (use your API service name) |

   Railway injects `PORT`. The container refuses to start without `API_UPSTREAM`.
4. **Settings → Networking → Generate Domain** — this is the app URL.

```bash
docker build -t ovrload-web .
docker run --rm -p 8080:8080 -e API_UPSTREAM=http://host.docker.internal:4000 ovrload-web
```

`nginx/15-resolver.sh` writes a `resolver` from the container's DNS so the API hostname is re-resolved
after redeploys; `nginx/default.conf.template` holds the server block (SPA fallback, asset caching, `/api` proxy).

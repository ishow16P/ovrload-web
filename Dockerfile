# Ovrload Web — Railway-ready (static Vue build on nginx, /api proxied to the API service)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Browser calls same-origin /api → nginx forwards it, so the auth cookie stays first-party
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
# PORT is injected by Railway; API_UPSTREAM e.g. http://ovrload-api.railway.internal:3000
ENV PORT=8080 \
    API_UPSTREAM=""
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --chmod=755 nginx/15-resolver.sh /docker-entrypoint.d/15-resolver.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080

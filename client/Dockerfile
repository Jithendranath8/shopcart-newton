# syntax=docker/dockerfile:1.7

# ----- Stage 1: builder -----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Override Vite base from "/shopsmart" → "/" for container hosting
RUN npm run build -- --base=/

# ----- Stage 2: runtime (nginx) -----
FROM nginx:1.27-alpine AS runtime

# wget for HEALTHCHECK (busybox wget shipped with alpine)
RUN apk add --no-cache wget

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

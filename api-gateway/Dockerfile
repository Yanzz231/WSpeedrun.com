# syntax=docker/dockerfile:1.7
FROM node:22.16.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm,sharing=locked npm ci --prefer-offline --no-audit --no-fund

FROM node:22.16.0-bookworm-slim AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.16.0-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3003
CMD ["node", "dist/main.js"]

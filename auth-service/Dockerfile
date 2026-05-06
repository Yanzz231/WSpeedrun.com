FROM node:22.16.0-bookworm-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22.16.0-bookworm-slim AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL=mysql://root:root@mysql:3306/wspeedrun
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

FROM node:22.16.0-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]

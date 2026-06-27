# Backend Dockerfile - Node.js Service Layer
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace package files
COPY package*.json ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci

# Build TypeScript
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api ./apps/api
COPY package*.json ./

# Build TypeScript to JavaScript
RUN npm run build --workspace=apps/api

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/

USER nodejs

EXPOSE 4000

ENV PORT=4000

CMD ["node", "apps/api/dist/index.js"]

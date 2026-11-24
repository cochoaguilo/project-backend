# syntax=docker/dockerfile:1

# ---- Build stage: compile TypeScript to dist/
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage: production dependencies + compiled output only
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Secrets are never baked into the image (.dockerignore excludes .env*).
# Provide them at runtime, e.g. `docker run --env-file .env.production`.
USER node
EXPOSE 3000
CMD ["node", "dist/main"]

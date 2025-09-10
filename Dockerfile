# ---- Builder ----
FROM node:18-slim AS builder

# Install required dependencies (OpenSSL for Prisma)
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy rest of the project files
COPY . .

# Skip validation for .env presence
ENV SKIP_ENV_VALIDATION=1

# Generate Prisma client (requires DATABASE_URL at runtime, not build)
RUN npx prisma generate

# Build Next.js (uses types, does not execute Prisma migrations yet)
RUN npm run build

# ---- Runner ----
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL (needed for Prisma in Alpine)
RUN apk add --no-cache openssl

# Copy only necessary runtime artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Use .env from Render's environment injection, not during build
# Do NOT copy .env or .env.example (Render sets vars automatically)

EXPOSE 3000

# Run migration before starting app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

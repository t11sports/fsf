# 1. Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1

# Copy only dependency files initially
COPY package*.json ./
RUN npm install

# Copy Prisma schema directory
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy rest of source code
COPY . .

# Build the Next.js application
RUN npm run build

# 2. Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache openssl

# Copy production build files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

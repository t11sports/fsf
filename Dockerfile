# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

ENV SKIP_ENV_VALIDATION=1

# Copy entire app (including prisma directory and schema)
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client AFTER schema is copied
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl (needed for Prisma in Alpine)
RUN apk add --no-cache openssl

# Copy only needed files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example

# Expose port and start
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

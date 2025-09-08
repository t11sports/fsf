# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Skip env validation if needed
ENV SKIP_ENV_VALIDATION=1

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Now copy the rest of the app and build
COPY . .

# Generate Prisma client and build Next app
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

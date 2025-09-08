# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
COPY package*.json ./
RUN npm install
COPY . .
# Generate Prisma client and build Next app
RUN npx prisma generate
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# copy production deps (pruned in builder step for simplicity)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.example ./.env.example
# Port & start
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

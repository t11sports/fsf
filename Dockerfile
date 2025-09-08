# ------------------------------
#         Builder Stage
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Environment config
ENV SKIP_ENV_VALIDATION=1

# Install OS dependencies (for Prisma / OpenSSL)
RUN apk add --no-cache openssl

# Copy dependency files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build


# ------------------------------
#         Runner Stage
# ------------------------------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

ENV NODE_ENV=production

# Install OS dependencies (again for runtime support)
RUN apk add --no-cache openssl

# Copy production files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example

# Expose port for the app
EXPOSE 3000

# Run Prisma deploy & start Next.js in production
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

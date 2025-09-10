# Dockerfile
FROM node:18-slim AS builder

# Install required dependencies (OpenSSL & libssl-dev)
RUN apt-get update && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*
    
# Set working directory
WORKDIR /app

# Set environment variable ONLY for build time
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Ensure openssl is available (for Prisma)
# RUN apk add --no-cache openssl1.1

# Environment: skip .env validation during build
ENV SKIP_ENV_VALIDATION=1

# Install dependencies in two steps to optimize Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Now copy the rest of the project
COPY . .

# Dummy DATABASE_URL to prevent Prisma crash during build
# ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Prisma client generation AFTER schema is copied
RUN npx prisma generate

# Copy env early so it's available during build
#COPY .env .env

# Build Next.js app (includes TypeScript checks)
RUN npm run build

# Run app
#CMD ["npm", "start"]

# ---- Runner ----
FROM node:18-alpine AS runner

# Install openssl (required by Prisma for Alpine)
RUN apk add --no-cache openssl

# WORKDIR /app
 ENV NODE_ENV=production

# Copy only the necessary build output and runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example
#COPY --from=builder /app/.env ./.env

# Expose the port
EXPOSE 3000

# Final command: run Prisma migrations, then start the app
#CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

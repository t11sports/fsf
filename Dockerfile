# Dockerfile
FROM node:18-slim AS builder

# Install required packages (no libssl1.1)
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
    
# Set working directory
WORKDIR /app

ENV SKIP_ENV_VALIDATION=1

# Install dependencies in two steps to optimize Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Now copy the rest of the project
COPY . .

# Prisma client generation AFTER schema is copied
RUN npx prisma generate

# Build Next.js app (includes TypeScript checks)
RUN npm run build

# Run app
CMD ["npm", "start"]

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl (required by Prisma for Alpine)
RUN apk add --no-cache openssl

# Copy only the necessary build output and runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env.example

# Expose the port
EXPOSE 3000

# Final command: run Prisma migrations, then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node node_modules/.bin/next start -p 3000"]

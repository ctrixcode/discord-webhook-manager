FROM node:20-alpine

WORKDIR /app

# Enable pnpm via Corepack (bundled with Node 20)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfile and workspace files first (better cache)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch

# Copy sources
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install from local store (cached by fetch)
RUN pnpm install --frozen-lockfile --offline

# Expose port
EXPOSE 3000

# Run dev server
CMD ["pnpm", "--filter", "web", "run", "dev"]
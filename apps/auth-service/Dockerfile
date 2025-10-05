FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY pnpm-workspace.yaml turbo.json package.json ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service
RUN pnpm i
CMD ["pnpm","--filter","auth-service","dev"]

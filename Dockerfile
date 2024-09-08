FROM node:22-alpine AS base
ARG PNPM_VERSION=9.6.0
ENV PNPM_HOME=/usr/local/bin


RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

FROM base AS setup
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM base AS builder
RUN apk add --update --no-cache libc6-compat && rm -rf /var/cache/apk/*
COPY .gitignore .gitignore

COPY --from=setup /app/out/full/ ./ 
RUN pnpm install
COPY turbo.json turbo.json
ENV CACHEBUST=1
RUN pnpm add -g turbo
RUN pnpm add -g @nestjs/cli
# RUN pnpm install
RUN ls -al
WORKDIR /app/apps/server
RUN pnpm prisma generate
RUN pnpm prisma db push
RUN pnpm run build

FROM base AS dev
COPY --from=builder /app/ ./
WORKDIR /app/apps/server
# RUN pnpm prisma generate
# RUN pnpm prisma db push

# FROM builder AS pruned
# RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
#   pnpm --filter=server --prod deploy pruned --config.ignore-scripts=true

# FROM node:22-alpine AS runner
# WORKDIR /app
# COPY --from=pruned /app/pruned/ ./

# # Don't run production as root
# RUN addgroup --system --gid 0 nodejs
# RUN adduser --system --uid 0 nodejs
USER root
EXPOSE 8080

CMD ["node", "./dist/main"]

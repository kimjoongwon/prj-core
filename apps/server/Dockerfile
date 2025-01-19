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
COPY --from=setup /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=setup /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch

COPY --from=setup /app/out/json/ ./


COPY --from=setup /app/out/full/ ./ 
COPY turbo.json turbo.json


FROM base AS dev
COPY --from=builder /app/ ./
WORKDIR /app/apps/server
RUN pnpm install
RUN pnpm prisma generate
RUN pnpm prisma db push
RUN pnpm run build --filter=server


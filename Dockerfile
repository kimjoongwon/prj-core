FROM node:22-alpine AS base
ARG PNPM_VERSION=9.6.0
ENV PNPM_HOME=/usr/local/bin
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
RUN pnpm add -g nest
WORKDIR /app

FROM base AS setup
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM base AS builder
RUN apk add --update --no-cache libc6-compat && rm -rf /var/cache/apk/*
COPY .gitignore .gitignore
WORKDIR /app
COPY --from=setup /app/out/full/ ./ 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY turbo.json turbo.json
# RUN pnpm install
WORKDIR /app/apps/server
RUN pnpm prisma db push --force-reset
RUN pnpm prisma generate
WORKDIR /app
RUN turbo build


FROM node:22-alpine AS dev
WORKDIR /app
COPY --from=builder /app/ .
USER root
EXPOSE 8080

CMD ["node", "/app/apps/server/dist/main"]

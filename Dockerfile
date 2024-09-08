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
# RUN pnpm install
WORKDIR /app/apps/server
RUN pnpm prisma generate
RUN pnpm prisma db push
RUN pnpm run build

FROM builder AS dev
COPY --from=builder /app/ ./
RUN pnpm i --prod
WORKDIR /app/apps/server
USER root
EXPOSE 8080

CMD ["node", "./dist/main"]

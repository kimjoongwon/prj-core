# Dockerfile.idp-api 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.idp-api

## 역할

`idp-api` 이미지를 빌드하기 위한 멀티스테이지 Dockerfile입니다.
`turbo prune`으로 idp-api 의존 그래프만 추출하고, pnpm store와 turbo 작업 캐시를 BuildKit cache mount로 유지해 재빌드 시간을 단축합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| base 이미지 | `node:24.21.0-alpine3.24@sha256:be80f76cf40ec8e42b9bec49f60a55e0660f30af58d3e5a25530785b30ea67e2`로 digest 고정 (admin-web runner와 동일) |
| 도구체인 | pnpm `10.34.5`, turbo `2.9.14` (레포 표준 도구체인) |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=idp-api --docker` |
| builder 단계 | `out/json` 복사 → `pnpm install --frozen-lockfile --store-dir /pnpm/store --prefer-offline` → `out/full` 복사 → `pnpm exec turbo build --concurrency=2 --filter=idp-api...` 단일 빌드 |
| 러너 단계 | 루트 `node_modules`, `packages/`, `apps/`, 루트 manifest를 복사한 워크스페이스 트리에서 앱 실행 |
| 러너 검증 | 배포 트리에서 `node --check`, 필수 native/runtime 패키지 require, `app.module` 로드, 금지 패키지 require 해석 불가 검사 |
| 런타임 프로세스 | `CMD ["node", "apps/idp/api/dist/main.js"]` (워크스페이스 내 앱 경로) |
| 캐시 정책 | `/pnpm/store`(pnpm store), `/app/.turbo`(turbo 작업 캐시)에 BuildKit cache mount 적용 |

## 구조 개요

- prune → install → 단일 turbo build 흐름으로 빌드한다.
- 이전 구조의 이중 빌드(`--filter=idp-api^... --concurrency=1` 전체 그래프 빌드 후 `pnpm --filter idp-api run build` 재빌드)를 제거하고 `--filter=idp-api...` 단일 turbo 빌드로 통합했다.
- runner는 ArgoCD PreSync 마이그레이션 Job이 `/app/packages/be-prisma`에서 `node_modules/.bin/prisma`, `tsx`를 실행하는 계약을 보존하기 위해 루트 `node_modules`(.pnpm 심링크), `packages/`, `apps/`, 루트 manifest를 그대로 복사한다. 앱과 마이그레이션 Job 모두 이 워크스페이스 구조에서 실행된다(deploy 산출물 단독 실행은 중복 `@nestjs` 패키지 해석으로 `DiscoveryModule` DI가 실패한다).
- 금지 패키지(`socket.io`, `@nestjs/websockets`, `@nestjs/platform-socket.io`)는 "이미지에 존재하는가"가 아니라 앱 디렉토리(`/app/apps/idp/api`)에서 `require.resolve`로 해석되지 않음으로 검증한다. 워크스페이스 트리는 마이그레이션 계약상 dev 도구를 포함하므로 이름 기반 스캔은 배포 산출물과 맞지 않다.
- idp-api에는 Nest Devtools 모듈이 없으므로 core-api의 Devtools 비활성 가드는 적용하지 않는다.

## 구현 체크리스트

- [x] `idp-api` 대상만 `turbo prune --scope=idp-api --docker` 수행
- [x] `out/json`을 먼저 복사하고 `pnpm install --frozen-lockfile --store-dir /pnpm/store --prefer-offline` 이후 `out/full`을 복사해 prune 산출물의 최신 lockfile이 오래된 `out/full/pnpm-lock.yaml`에 덮어써지지 않도록 보장
- [x] `pnpm install` 단계 캐시 유지(`/pnpm/store`)
- [x] `turbo build` 단계 캐시 유지(`/app/.turbo`) 및 `--concurrency=2` 병렬 빌드
- [x] runner가 PreSync 마이그레이션 Job 계약(`/app/packages/be-prisma` 실행, 루트 `node_modules`의 .pnpm 심링크)을 보존하면서 앱과 마이그레이션 Job 모두 워크스페이스 구조에서 실행
- [x] 러너 단계에서 배포 트리 기반 런타임 계약 검증(`node --check`, 필수 패키지 require, `app.module` 로드, 금지 패키지 해석 불가)
- [x] 런타임 계약(`ENV NODE_ENV=production`, `ENV APP_PORT=3007`, `EXPOSE 3007`, `CMD ["node", ...]`) 유지
- [x] base 이미지 digest 고정으로 공급망 재현성 확보

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-09-21 | 러너를 워크스페이스 실행 형태로 확정하고 검증을 배포 트리 기준으로 신설: 배포되지 않는 `pnpm deploy` 산출물 구성 단계를 제거하고, 러너 단계에서 앱 디렉터리 기준 스모크/금지 패키지 해석 검사를 수행한다 | zcode |
| 2026-09-20 | 러너를 PreSync 마이그레이션 Job 계약에 맞춰 재구성: 루트 `node_modules`, `packages/`, 루트 manifest를 복사해 워크스페이스 구조를 보존하고 앱은 `/app/runtime`에서 실행. `ENV`/`EXPOSE`/`CMD`는 불변 | zcode |
| 2026-09-20 | core-api 최신 패턴으로 재작성: base 이미지 digest 고정(`node:24.21.0-alpine3.24@sha256:be80f...ea67e2`), pnpm `10.34.5`/turbo `2.9.14` 상향, 이중 빌드를 `--filter=idp-api... --concurrency=2` 단일 turbo 빌드로 통합, `pnpm deploy --prod --legacy` 산출물만 복사하는 슬림 runner로 전환 | zcode |
| 2026-09-19 | idp-api 재구축(a8b8addde)으로 복원된 실제 빌드 단계(`--filter=idp-api^... --concurrency=1` + `pnpm --filter idp-api run build`)에 맞춰 문서 재동기화 | zcode |
| 2026-03-09 | `idp-api` Docker 빌드에서 `--filter=idp-api^...`, `--concurrency=1`, 후행 `tsc` 단계를 제거하고 prune 결과 전체에 대해 `pnpm exec turbo build`를 실행하도록 단순화 | codex |
| 2026-03-09 | `builder` 단계의 Turbo 실행을 `pnpm exec turbo build`로 전환해 설치 이후에는 로컬 workspace 버전을 사용하도록 정리 | codex |
| 2026-03-09 | 전역 `turbo` 설치 버전을 루트 워크스페이스와 동일한 `2.8.14`로 고정해 Docker prune/build 버전 불일치를 제거 | codex |
| 2026-03-08 | `devops/Dockerfile.idp-api`에 `/app/.turbo` 캐시 마운트를 추가해 turbo 빌드 캐시 재사용성 개선 | codex |
| 2026-03-08 | `pnpm install`이 실제 Store 캐시를 쓰도록 `PNPM_STORE_DIR=/pnpm/store` 및 `--store-dir` 지정 | codex |
| 2026-03-08 | `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`로 빌드가 멈추는 이슈를 해결하기 위해 `pnpm install`에서 `--frozen-lockfile` 제거 | codex |
| 2026-03-08 | `pnpm-lock` 동기화 후 `devops/Dockerfile.idp-api`에 `--frozen-lockfile --prefer-offline` 재적용해 락/캐시 일관성 회복 | codex |
| 2026-03-08 | `idp-api` 빌드에서 `turbo prune` 결과와 lockfile 경로 불일치로 인한 frozen lock mismatch 해결 위해 `out/pnpm-lock.yaml` 복사 단계 추가 | codex |
| 2026-03-08 | `out/full/pnpm-lock.yaml`가 최신 lockfile을 덮어써 install이 실패하던 문제를 막기 위해 `out/json -> pnpm install -> out/full` 순서로 빌드 단계 정정 | codex |

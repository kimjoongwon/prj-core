# Dockerfile.core-api 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.core-api

## 역할

`core-api` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune --scope=core-api --docker` 결과를 기반으로 관련 워크스페이스를 빌드하고,
최종 런타임에서는 Node API 프로세스를 단일 프로세스로 실행합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| base 이미지 | `node:24.21.0-alpine3.24@sha256:be80f...ea67e2`로 digest 고정 |
| setup 단계 | `COPY . .` 후 `turbo prune core-api --docker`, route catalog용 admin/web 원본 보존 |
| builder 단계 | `out/json` 복사 → `pnpm install --frozen-lockfile` → `out/full` 복사 → `turbo build --filter=core-api...` |
| 러너 단계 | 루트 `node_modules`, `packages/`, `apps/`, 루트 manifest를 복사한 워크스페이스 트리에서 앱 실행 |
| 런타임 프로세스 | Node가 `/app`에서 `apps/core/api/dist/main.js`를 단일 프로세스로 직접 실행 |
| 러너 검증 | 배포 트리에서 `node --check`, 필수 native/runtime 패키지 require, `app.module` 로드, Nest Devtools 비활성 가드, 금지 패키지 require 해석 불가 검사 |
| 노출 포트 | `3006` |

## 러너 트리와 검증 계약

- PreSync 마이그레이션 Job이 `/app/packages/be-prisma`에서 `node_modules/.bin/prisma`, `tsx`를 실행하므로 러너는 워크스페이스 구조(루트 `node_modules`의 .pnpm 심링크, `packages/`, `apps/`, 루트 manifest)를 통째로 배포한다. dev 도구(typescript, prisma CLI 등)도 함께 포함되는 것이 이 계약의 의도다.
- 검증은 배포되는 트리 그대로, 실제 실행 디렉토리(`/app/apps/core/api`) 기준으로 수행한다.
- 금지 패키지(`socket.io`, `@nestjs/websockets`, `@nestjs/platform-socket.io`)는 디렉터리 이름이 아니라 앱에서 `require.resolve`로 해석되지 않음으로 검증한다. 워크스페이스 트리는 dev 도구를 포함하므로 이름 기반 스캔은 배포 산출물과 맞지 않는다.
- `@nestjs/devtools-integration`은 앱 devDependency로 이미지에 존재하므로, 런타임 가드(`isNestDevtoolsEnabled()`가 production에서 항상 false)로 비활성을 검증한다.

## 구현 체크리스트

- [x] `core-api` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 lockfile/의존성 설치의 기준점을 고정
- [x] `pnpm install --frozen-lockfile --store-dir /pnpm/store --prefer-offline`로 설치 캐시 유지
- [x] `/app/.turbo` 캐시 마운트로 Turbo 작업 캐시를 재사용하고 `turbo build --concurrency=2 --filter=core-api...`로 빌드
- [x] 러너가 PreSync 마이그레이션 Job 계약(`/app/packages/be-prisma` 실행, 루트 `node_modules`의 .pnpm 심링크)을 보존
- [x] 러너 단계에서 배포 트리 기반 런타임 계약 검증(`node --check`, 필수 패키지 require, `app.module` 로드, Devtools 가드, 금지 패키지 해석 불가)
- [x] 런타임에서 Node 단일 프로세스 실행 구조 유지(`CMD ["node", "apps/core/api/dist/main.js"]`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-09-21 | 러너를 워크스페이스 실행 형태로 확정하고 검증을 배포 트리 기준으로 재정립: 배포되지 않는 `pnpm deploy` 산출물 검증 단계를 제거하고, 러너 단계에서 앱 디렉터리 기준 스모크/금지 패키지 해석 검사를 수행한다. 금지 패키지 검증 기준을 "이름 존재"에서 "require 해석 가능"으로 전환 | zcode |
| 2026-09-20 | 러너를 PreSync 마이그레이션 Job 계약에 맞춰 재구성: 루트 `node_modules`, `packages/`, 루트 manifest를 복사해 워크스페이스 구조를 보존하고 앱은 `/app/runtime`에서 실행. `ENV`/`EXPOSE`/`USER`/`CMD`는 불변 | zcode |

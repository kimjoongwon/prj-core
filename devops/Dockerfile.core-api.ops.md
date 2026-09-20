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
| setup 단계 | `COPY . .` 후 `turbo prune --scope=core-api --docker` |
| builder 단계 | `out/json`을 먼저 복사해 install 실행 후 `out/full`을 덮어쓴 뒤 로컬 `turbo`로 `type-check:prod` 후 `build` 수행 |
| 러너 단계 | PreSync 마이그레이션 Job용 워크스페이스(루트 `node_modules`, `packages/`, 루트 manifest)와 앱 deploy 산출물(`/app/runtime`)을 분리해 복사 |
| 런타임 프로세스 | Node가 `/app/runtime/dist/main.js`를 단일 프로세스로 직접 실행 |
| 노출 포트 | `3006` |

## 구현 체크리스트

- [x] `core-api` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 lockfile/의존성 설치의 기준점을 고정
- [x] `pnpm exec turbo type-check:prod --filter=core-api... --concurrency=1`로 배포용 타입 체크를 먼저 수행
- [x] 빌드 단계에서 Turbo를 통해 관련 워크스페이스를 함께 빌드
- [x] `/app/.turbo` 캐시 마운트로 Turbo 작업 캐시를 재사용하고 `turbo build --concurrency=2`로 빌드 시간을 단축함
- [x] 런타임에서 Node 단일 프로세스 실행 구조 유지
- [x] ArgoCD PreSync 마이그레이션 Job이 `/app/packages/be-prisma`에서 `node_modules/.bin/prisma`, `tsx`를 실행하므로 러너에 루트 `node_modules`(.pnpm 심링크), `packages/`, 루트 manifest를 복사해 워크스페이스 의존성 구조를 보존
- [x] 앱은 마이그레이션용 루트 `node_modules`와 경로 충돌하지 않도록 `/app/runtime`의 deploy 산출물에서 `dist/main.js` 실행

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-09-20 | 러너를 PreSync 마이그레이션 Job 계약에 맞춰 재구성: 루트 `node_modules`, `packages/`, 루트 manifest를 복사해 워크스페이스 구조를 보존하고 앱은 `/app/runtime`에서 실행. `ENV`/`EXPOSE`/`USER`/`CMD`는 불변 | zcode |

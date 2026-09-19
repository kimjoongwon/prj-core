# Dockerfile.idp-api 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.idp-api

## 역할

`idp-api` 이미지를 빌드하기 위한 멀티스테이지 Dockerfile입니다.
`turbo` 빌드 단계에서 `.turbo` 캐시를 Podman 레이어 캐시와 분리해 유지하여 재빌드 시 가능하면 캐시 적중률을 높입니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=idp-api --docker` |
| builder 단계 | `out/json`만 먼저 복사해 `pnpm install` 후 `out/full` 소스를 덮어써 `pnpm exec turbo build --filter=idp-api^... --concurrency=1`으로 의존 워크스페이스를 빌드하고 `pnpm --filter=idp-api run build`으로 본체를 빌드 |
| 러너 단계 | `CMD ["node", "apps/idp/api/dist/main.js"]` |
| 캐시 정책 | `PNPM_STORE_DIR=/pnpm/store` 고정 후 `/pnpm/store`, `/app/.turbo`에 BuildKit cache mount 적용 |

## 구현 체크리스트

- [x] `idp-api` 대상만 `turbo prune --scope=idp-api --docker` 수행
- [x] `pnpm install` 단계에서 `PNPM_STORE_DIR=/pnpm/store` 및 `--store-dir /pnpm/store` 사용
- [x] `pnpm install` 단계 캐시 유지(`/pnpm/store`)
- [x] `turbo build` 단계 캐시 유지(`/app/.turbo`) 추가
- [x] prune 결과에 포함된 `turbo.json`을 그대로 사용해 별도 루트 설정 파일 복사를 제거
- [x] `pnpm install`에 `--frozen-lockfile --prefer-offline` 적용으로 재현 가능한 캐시 빌드 보장
- [x] 의존 워크스페이스를 `pnpm exec turbo build --filter=idp-api^... --concurrency=1`로, 본체를 `pnpm --filter=idp-api run build`로 빌드
- [x] `out/json`을 먼저 복사하고 `pnpm install` 이후 `out/full`을 복사해 prune 산출물의 최신 lockfile이 오래된 `out/full/pnpm-lock.yaml`에 덮어써지지 않도록 보장

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-09-19 | idp-api 재구축(a8b8addde)으로 복원된 실제 빌드 단계(`--filter=idp-api^... --concurrency=1` + `pnpm --filter=idp-api run build`)에 맞춰 문서 재동기화 | zcode |
| 2026-03-09 | `idp-api` Docker 빌드에서 `--filter=idp-api^...`, `--concurrency=1`, 후행 `tsc` 단계를 제거하고 prune 결과 전체에 대해 `pnpm exec turbo build`를 실행하도록 단순화 | codex |
| 2026-03-09 | `builder` 단계의 Turbo 실행을 `pnpm exec turbo build`로 전환해 설치 이후에는 로컬 workspace 버전을 사용하도록 정리 | codex |
| 2026-03-09 | 전역 `turbo` 설치 버전을 루트 워크스페이스와 동일한 `2.8.14`로 고정해 Docker prune/build 버전 불일치를 제거 | codex |
| 2026-03-08 | `devops/Dockerfile.idp-api`에 `/app/.turbo` 캐시 마운트를 추가해 turbo 빌드 캐시 재사용성 개선 | codex |
| 2026-03-08 | `pnpm install`이 실제 Store 캐시를 쓰도록 `PNPM_STORE_DIR=/pnpm/store` 및 `--store-dir` 지정 | codex |
| 2026-03-08 | `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`로 빌드가 멈추는 이슈를 해결하기 위해 `pnpm install`에서 `--frozen-lockfile` 제거 | codex |
| 2026-03-08 | `pnpm-lock` 동기화 후 `devops/Dockerfile.idp-api`에 `--frozen-lockfile --prefer-offline` 재적용해 락/캐시 일관성 회복 | codex |
| 2026-03-08 | `idp-api` 빌드에서 `turbo prune` 결과와 lockfile 경로 불일치로 인한 frozen lock mismatch 해결 위해 `out/pnpm-lock.yaml` 복사 단계 추가 | codex |
| 2026-03-08 | `out/full/pnpm-lock.yaml`가 최신 lockfile을 덮어써 install이 실패하던 문제를 막기 위해 `out/json -> pnpm install -> out/full` 순서로 빌드 단계 정정 | codex |

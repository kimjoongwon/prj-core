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
| builder 단계 | `pnpm install` 후 `turbo build --filter=idp-api^...` |
| 러너 단계 | `CMD ["node", "apps/idp/api/dist/main.js"]` |
| 캐시 정책 | `PNPM_STORE_DIR=/pnpm/store` 고정 후 `/pnpm/store`, `/app/.turbo`에 BuildKit cache mount 적용 |

## 구현 체크리스트

- [x] `idp-api` 대상만 `turbo prune --scope=idp-api --docker` 수행
- [x] `pnpm install` 단계에서 `PNPM_STORE_DIR=/pnpm/store` 및 `--store-dir /pnpm/store` 사용
- [x] `pnpm install` 단계 캐시 유지(`/pnpm/store`)
- [x] `turbo build` 단계 캐시 유지(`/app/.turbo`) 추가
- [x] `pnpm install`에 `--frozen-lockfile --prefer-offline` 적용으로 재현 가능한 캐시 빌드 보장
- [x] `out/pnpm-lock.yaml`를 빌더 루트(`/app`)로 복사해 frozen lockfile이 항상 일치하도록 보장

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | `devops/Dockerfile.idp-api`에 `/app/.turbo` 캐시 마운트를 추가해 turbo 빌드 캐시 재사용성 개선 | codex |
| 2026-03-08 | `pnpm install`이 실제 Store 캐시를 쓰도록 `PNPM_STORE_DIR=/pnpm/store` 및 `--store-dir` 지정 | codex |
| 2026-03-08 | `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`로 빌드가 멈추는 이슈를 해결하기 위해 `pnpm install`에서 `--frozen-lockfile` 제거 | codex |
| 2026-03-08 | `pnpm-lock` 동기화 후 `devops/Dockerfile.idp-api`에 `--frozen-lockfile --prefer-offline` 재적용해 락/캐시 일관성 회복 | codex |
| 2026-03-08 | `idp-api` 빌드에서 `turbo prune` 결과와 lockfile 경로 불일치로 인한 frozen lock mismatch 해결 위해 `out/pnpm-lock.yaml` 복사 단계 추가 | codex |

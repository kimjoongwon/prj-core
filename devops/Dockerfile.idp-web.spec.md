# Dockerfile.idp-web 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.idp-web

## 역할

`idp-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune` 결과만 대상으로 빌드해 컨텍스트 크기를 줄이고,
`pnpm` 의존성 설치 및 `next build`를 통해 `standalone` 런타임 이미지를 생성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=idp-web --docker` |
| builder 단계 | `out/json`을 먼저 복사해 `pnpm-lock.yaml` 기준을 고정한 뒤 `pnpm install --frozen-lockfile --prefer-offline` 실행, 그 후 `out/full`로 소스 복원 및 `next build` |
| 러너 단계 | `CMD ["node", "apps/idp/web/server.js"]` |
| 런타임 | `PORT=3008`, `HOSTNAME=0.0.0.0` |

## 구현 체크리스트

- [x] `turbo prune --scope=idp-web --docker`로 불필요한 workspace를 제거
- [x] `out/json`을 먼저 복사해 설치 단계에서 `turbo prune` 산출물의 최신 lockfile을 유지
- [x] `pnpm-lock` 동기화 상태를 반영해 `pnpm install`에서 `--frozen-lockfile` 사용
- [x] Podman 빌드 메모리 피크를 줄이기 위해 `next build` 단일 실행으로 통합
- [x] 빌드 캐시 경로(`PNPM_STORE_DIR`, `--mount=type=cache`)를 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | `devops/Dockerfile.idp-web`의 `next build`를 `compile`/`generate` 분할 실행에서 단일 실행으로 변경하고, lockfile/캐시/설치 옵션을 고정해 podman 빌드 안정성 개선 | codex |
| 2026-03-08 | `idp-web` 빌드에서 `out/pnpm-lock.yaml`이 `out/full`의 구버전 lockfile에 덮어써지지 않도록 `out/json` → install → `out/full` 순서를 적용 | codex |

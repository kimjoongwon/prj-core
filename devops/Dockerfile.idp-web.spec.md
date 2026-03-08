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
| builder 단계 | `out/json`을 먼저 복사한 뒤 prune된 워크스페이스 기준으로 `pnpm install --no-frozen-lockfile --prefer-offline` 실행, `out/full` 복원 후 `@cocrepo/constant`/`@cocrepo/toolkit`를 선행 빌드하고 `next build` 수행 |
| 러너 단계 | `CMD ["node", "apps/idp/web/server.js"]` |
| 런타임 | `PORT=3008`, `HOSTNAME=0.0.0.0` |

## 구현 체크리스트

- [x] `turbo prune --scope=idp-web --docker`로 불필요한 workspace를 제거
- [x] `out/json`을 먼저 복사해 설치 단계에서 `turbo prune` 산출물의 최신 lockfile을 유지
- [x] `turbo prune --docker` 산출물의 importer 메타 불일치에 대응하도록 `pnpm install`에서 `--no-frozen-lockfile` 사용
- [x] `dist` 엔트리를 요구하는 공용 패키지(`@cocrepo/constant`, `@cocrepo/toolkit`)를 `next build` 전에 선행 빌드
- [x] Podman 빌드 메모리 피크를 줄이기 위해 `next build` 단일 실행으로 통합
- [x] 빌드 캐시 경로(`PNPM_STORE_DIR`, `--mount=type=cache`)를 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | `@cocrepo/constant`, `@cocrepo/toolkit`가 `dist` 엔트리를 사용하므로 prune Docker 빌드에서 `next build` 전에 선행 빌드 단계 추가 | codex |
| 2026-03-08 | `turbo prune --docker`가 제외된 workspace importer 메타를 남겨 `pnpm install --frozen-lockfile`가 실패하는 문제를 피하기 위해 `idp-web` Docker 빌드 설치 옵션을 `--no-frozen-lockfile`로 조정 | codex |
| 2026-03-08 | `devops/Dockerfile.idp-web`의 `next build`를 `compile`/`generate` 분할 실행에서 단일 실행으로 변경하고, lockfile/캐시/설치 옵션을 고정해 podman 빌드 안정성 개선 | codex |
| 2026-03-08 | `idp-web` 빌드에서 `out/pnpm-lock.yaml`이 `out/full`의 구버전 lockfile에 덮어써지지 않도록 `out/json` → install → `out/full` 순서를 적용 | codex |

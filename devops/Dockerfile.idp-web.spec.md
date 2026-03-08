# Dockerfile.idp-web 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.idp-web

## 역할

`idp-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune` 결과만 대상으로 빌드해 컨텍스트 크기를 줄이고,
`pnpm` 의존성 설치 후 prune된 워크스페이스 전체에 대해 `turbo build`를 실행해 `standalone` 런타임 이미지를 생성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=idp-web --docker` |
| builder 단계 | `out/json`을 먼저 복사한 뒤 prune된 워크스페이스 기준으로 `pnpm install --no-frozen-lockfile --prefer-offline` 실행, `out/full` 복원 후 로컬 `turbo`(`pnpm exec turbo build`) 수행 |
| 러너 단계 | `CMD ["node", "apps/idp/web/server.js"]` |
| 런타임 | `PORT=3008`, `HOSTNAME=0.0.0.0` |

## 구현 체크리스트

- [x] `turbo prune --scope=idp-web --docker`로 불필요한 workspace를 제거
- [x] `out/json`을 먼저 복사해 설치 단계에서 `turbo prune` 산출물의 최신 lockfile을 유지
- [x] `turbo prune --docker` 산출물의 importer 메타 불일치에 대응하도록 `pnpm install`에서 `--no-frozen-lockfile` 사용
- [x] prune된 워크스페이스에 남은 패키지 전체를 `turbo build`로 빌드해 `idp-web` 의존 그래프를 함께 충족
- [x] 앱 내부 `*.e2e.ts(x)` 제외는 Dockerfile 삭제 대신 앱 tsconfig 계약으로 처리
- [x] 빌드 캐시 경로(`PNPM_STORE_DIR`, `/app/.turbo`, `--mount=type=cache`)를 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | `builder` 단계의 Turbo 실행을 `pnpm exec turbo build`로 전환해 전역 설치본 의존을 `setup` 단계의 prune으로 한정 | codex |
| 2026-03-09 | `idp-web` Docker 빌드에서 `*.e2e.ts` 삭제와 `NEXT_IGNORE_BUILD_ERRORS` 환경 설정을 제거하고, 앱 설정에서 테스트 파일 제외 및 정상 타입 체크를 수행하도록 정리 | codex |
| 2026-03-09 | `idp-web` Docker 빌드에서 `NODE_OPTIONS` 메모리 오버라이드와 `--filter=idp-web...`를 제거하고, prune 결과 전체에 대해 `turbo build`를 실행하도록 단순화 | codex |
| 2026-03-09 | `idp-web` Docker 빌드의 `turbo build`에서 `--concurrency=1` 제한을 제거해 기본 병렬 실행 정책을 따르도록 정리 | codex |
| 2026-03-09 | 전역 `turbo` 설치 버전을 루트 워크스페이스와 동일한 `2.8.14`로 고정해 Docker prune/build 버전 드리프트를 방지 | codex |
| 2026-03-09 | `idp-web` Docker 빌드를 개별 패키지 선행 빌드에서 `turbo build --filter=idp-web...` 기반 의존 워크스페이스 통합 빌드로 전환 | codex |
| 2026-03-08 | `@cocrepo/constant`, `@cocrepo/toolkit`가 `dist` 엔트리를 사용하므로 prune Docker 빌드에서 `next build` 전에 선행 빌드 단계 추가 | codex |
| 2026-03-08 | `turbo prune --docker`가 제외된 workspace importer 메타를 남겨 `pnpm install --frozen-lockfile`가 실패하는 문제를 피하기 위해 `idp-web` Docker 빌드 설치 옵션을 `--no-frozen-lockfile`로 조정 | codex |
| 2026-03-08 | `devops/Dockerfile.idp-web`의 `next build`를 `compile`/`generate` 분할 실행에서 단일 실행으로 변경하고, lockfile/캐시/설치 옵션을 고정해 podman 빌드 안정성 개선 | codex |
| 2026-03-08 | `idp-web` 빌드에서 `out/pnpm-lock.yaml`이 `out/full`의 구버전 lockfile에 덮어써지지 않도록 `out/json` → install → `out/full` 순서를 적용 | codex |

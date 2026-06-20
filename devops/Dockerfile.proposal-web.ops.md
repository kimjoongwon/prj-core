# Dockerfile.proposal-web 기획서

> 생성일: 2026-03-20
> 타입: dockerfile
> 위치: devops/Dockerfile.proposal-web

## 역할

`proposal-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune` 결과만 대상으로 빌드해 컨텍스트 크기를 줄이고,
`pnpm` 의존성 설치 후 `proposal-web` 의존 그래프를 `type-check:prod`로 먼저 검증하고 `turbo build`로 빌드해 `standalone` 런타임 이미지를 생성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=proposal-web --docker` |
| builder 단계 | `out/json`을 먼저 복사한 뒤 prune된 워크스페이스 기준으로 `pnpm install --no-frozen-lockfile --prefer-offline` 실행, `out/full` 복원 후 로컬 `turbo`로 `type-check:prod` 후 `proposal-web` 의존 그래프만 빌드하고, `.next/static` 및 optional `public`을 standalone 트리에 동봉 |
| 러너 단계 | `CMD ["node", "apps/proposal/web/server.js"]` |
| 런타임 | `PORT=3011`, `HOSTNAME=0.0.0.0` |

## 구현 체크리스트

- [x] `turbo prune --scope=proposal-web --docker`로 불필요한 workspace를 제거
- [x] `out/json`을 먼저 복사해 설치 단계에서 `turbo prune` 산출물의 최신 lockfile을 유지
- [x] `turbo prune --docker` 산출물의 importer 메타 불일치에 대응하도록 `pnpm install`에서 `--no-frozen-lockfile` 사용
- [x] `pnpm exec turbo type-check:prod --filter=proposal-web...`로 배포용 타입 체크를 먼저 수행
- [x] `pnpm exec turbo build --filter=proposal-web...`로 `proposal-web`과 필요한 의존 워크스페이스만 빌드
- [x] Next.js standalone 런타임이 `.next/static`과 optional `public`을 직접 서빙할 수 있도록 builder 단계에서 함께 패키징
- [x] 앱 내부 `*.e2e.ts(x)` 제외는 Dockerfile 삭제 대신 앱 tsconfig 계약으로 처리
- [x] 빌드 캐시 경로(`PNPM_STORE_DIR`, `/app/.turbo`, `--mount=type=cache`)를 유지

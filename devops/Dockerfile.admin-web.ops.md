# Dockerfile.admin-web 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.admin-web

## 역할

`admin-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune --scope=admin-web --docker`로 축소된 모노레포 트리를 기준으로 빌드하고,
Next.js standalone 런타임 이미지로 배포합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=admin-web --docker` |
| builder 단계 | `out/json`을 먼저 복사해 lockfile 기준으로 `pnpm install` 실행 후 `out/full` 복사, prune된 `admin-web` 워크스페이스 전체에 대해 로컬 `turbo`로 `type-check:prod` 후 `build` 수행 |
| 러너 단계 | `CMD ["node", "apps/admin/web/server.js"]` |
| 런타임 | `PORT=3000`, `HOSTNAME=0.0.0.0`, non-root(`nextjs`) 실행 |

## 구현 체크리스트

- [x] `admin-web` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 최신 `pnpm-lock.yaml` 기준으로 `pnpm install` 수행
- [x] prune 결과에 포함된 `turbo.json`을 그대로 사용해 별도 루트 설정 파일 복사를 제거
- [x] `/app/.turbo` 캐시 마운트로 prune 워크스페이스 내 Turbo 캐시 재사용
- [x] `pnpm exec turbo type-check:prod --filter=admin-web...`로 배포용 타입 체크를 먼저 수행
- [x] `next build` 실행 전 런타임 산출물을 위한 standalone 번들 사용
- [x] `nextjs` non-root 사용자로 실행 보안 유지

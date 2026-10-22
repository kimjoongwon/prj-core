# Dockerfile.design-web 기획서

> 생성일: 2026-10-22
> 타입: dockerfile
> 위치: devops/Dockerfile.design-web

## 역할

`design-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`Dockerfile.proposal-web`과 같은 구조(base → setup → builder → runner)를 그대로 따르며,
`turbo prune` 결과만 빌드해 standalone 런타임 이미지를 만듭니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` (proposal-web 패턴 복제) |
| 베이스 이미지 | Node `24.21.0-alpine3.24` tag+digest 고정 |
| 빌드 도구 | `pnpm 10.34.5`, `turbo 2.9.14` |
| setup 단계 | `turbo prune --scope=design-web --docker` |
| builder 단계 | `out/json` 복사 → `pnpm install --no-frozen-lockfile --prefer-offline` → `out/full` 복원 → `turbo build --filter=design-web...` → `.next/static`·`public`을 standalone 트리에 동봉 |
| 러너 단계 | `CMD ["node", "apps/design/web/server.js"]` |
| 런타임 | `PORT=3015`, `HOSTNAME=0.0.0.0` |

## 구현 체크리스트

- [x] `turbo prune --scope=design-web --docker`로 불필요한 workspace 제거
- [x] prune 산출물 importer 메타 불일치 대응 `--no-frozen-lockfile`
- [x] Next.js standalone 런타임이 `.next/static`과 optional `public`을 직접 서빙하도록 패키징
- [x] Node 베이스 이미지 digest 고정(Dependabot `/devops` 감시 대상)
- [x] design-web은 정적 콘텐츠 앱이라 빌드 시 환경변수 주입 없음

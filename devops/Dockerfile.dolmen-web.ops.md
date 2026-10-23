# Dockerfile.dolmen-web 기획서

> 생성일: 2026-10-19
> 타입: dockerfile
> 위치: devops/Dockerfile.dolmen-web

## 역할

> 2026-10-22 Dockerfile·호출 소스 대조. 이미지 빌드·실행을 새로 수행한 검증 기록은 아니다. 날짜가 붙은 변경 이력은 당시 기록으로 구분한다.

`dolmen-web`(Next.js 채팅 화면, basePath `/dolmen`)의 standalone 이미지를 빌드한다.
`Dockerfile.proposal-web` 패턴 그대로(turbo prune → standalone → static/public 미러링).

## 공개 계약

| 항목 | 설명 |
|------|------|
| 베이스 | `node:24.21.0-alpine3.24` digest 고정 + pnpm 10.34.5 + turbo 2.9.14 |
| prune 스코프 | `dolmen-web` |
| 포트 | 3013 (`node apps/dolmen/web/server.js`) |
| 런타임 env | `DOLMEN_API_URL` — `src/app/api/[...path]/route.ts`가 요청마다 읽는 `/dolmen/api/*` 프록시 대상(차트 extraEnv 주입). next.config rewrites 미사용 |

## 비고

- `pnpm install --no-frozen-lockfile`: prune 트리의 stale importer 문제 대응(proposal-web 동일).

# Dockerfile.live-web 기획서

> 생성일: 2026-10-19  
> 타입: dockerfile  
> 위치: devops/Dockerfile.live-web

## 역할

`live-web`(라이브 커머스 클라이언트 시연 데모) 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`Dockerfile.proposal-web`과 동일한 base → setup → builder → runner 구조를 따르며,
`turbo prune --scope=live-web` 결과만 빌드해 standalone 런타임 이미지를 만듭니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` (proposal-web과 동일 계약) |
| 베이스 이미지 | Node `24.21.0-alpine3.24` tag+digest 고정 |
| 빌드 도구 | `pnpm 10.34.5`, `turbo 2.9.14` |
| setup 단계 | `turbo prune --scope=live-web --docker` |
| builder 단계 | `out/json` 복사 → `pnpm install --no-frozen-lockfile --prefer-offline` → `out/full` 복원 → `turbo build --filter=live-web...` → `.next/static`·`public`(루프 영상 포함)을 standalone 트리에 동봉 |
| 러너 단계 | `CMD ["node", "apps/live/web/server.js"]` |
| 런타임 | `PORT=3013`, `HOSTNAME=0.0.0.0`, nextuid 1001 |
| 포트 비고 | dev 스크립트는 3014(dolmen-web 3013과 dev 충돌 회피). 컨테이너 PORT는 3013 유지 — 포드 단위로 분리되어 무충돌 |

## 구현 체크리스트

- [x] proposal-web 계약을 그대로 복제해 앱 식별자·경로·포트만 교체함
- [x] `public/videos/live-loop.mp4`(CC0)가 standalone 트리에 포함되어 러너가 서빙함

## 운영 노트

- 이 앱은 외부 API 의존이 전혀 없는 시연 목업이라 빌드 환경변수·시크릿 주입이 필요 없다.
- `LIVE_DEMO_JWT_SECRET`은 시연용 목업 서명 키로 기본값(live-demo-mock-secret)을 그대로 사용한다 — 실서비스 전환 시 values-prod의 extraEnv로 교체한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-10-19 | proposal-web 계약 복제로 최초 작성 | zcode |

# start-dev 스크립트 기획서

> 생성일: 2026-04-07
> 타입: dev-script
> 위치: packages/common-constant/scripts/start-dev.mjs

## 역할

`@cocrepo/constant` 개발 watch 시 generated route catalog를 초기 1회 생성하고, `page.tsx` / `route.meta.ts` 변경을 polling으로 감지해 재생성한 뒤 `tsc --build --watch`를 함께 실행합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| createRouteDefinitionSignature | 현재 admin page / route meta 파일 집합의 변경 서명 계산 |
| runGenerator | 중복 실행을 직렬화하는 generated catalog 재생성 |
| pollTimer | admin page / route meta 파일 추가·수정·삭제 polling 감시 |
| tscProcess | dist 갱신용 TypeScript watch 프로세스 |

## 규칙

- dev 실행 중 `page.tsx` 또는 `route.meta.ts`가 바뀌면 generated source를 갱신하고, 이어서 `tsc --build --watch`가 dist를 다시 내보냅니다.
- polling 기본 간격은 `ADMIN_ROUTE_META_POLL_MS` 없으면 1000ms 입니다.
- generator 실행이 겹치면 최신 변경 1회를 큐잉해 직렬화합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | admin page와 route meta coverage까지 감시하도록 watch 대상을 확장 | codex |
| 2026-04-07 | route meta 변경 자동 반영용 common-constant dev watch script 신규 추가 | codex |

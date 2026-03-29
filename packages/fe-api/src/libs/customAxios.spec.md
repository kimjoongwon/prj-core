# customAxios 라이브러리 기획서

> 생성일: 2026-03-29
> 타입: library
> 위치: packages/fe-api/src/libs/customAxios.ts

## 역할

브라우저와 SSR 환경에서 Core API 호출을 일관되게 수행하고, 현재 선택된 Space를 `x-space-id` 헤더로 전달합니다.

## 동작 규칙

- 브라우저 첫 요청 직전에 `PersistStore`가 아직 hydrate되지 않았다면 동기 hydrate를 먼저 수행합니다.
- hydrate 이후 `spaceId`가 있으면 모든 Core API 요청 헤더에 `x-space-id`를 추가합니다.
- 401 응답은 브라우저에서 refresh 흐름을 시도한 뒤 실패 시 로그인 화면으로 이동합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | 첫 Core API 요청 전에 PersistStore를 hydrate해 space header 누락 캐시를 방지하도록 규칙 추가 | codex |

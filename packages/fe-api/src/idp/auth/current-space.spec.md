# current-space auth wrapper 기획서

> 생성일: 2026-04-08
> 타입: api-wrapper
> 위치: packages/fe-api/src/idp/auth/current-space.ts

## 역할

Orval generated current-space endpoint 위에 admin/storybook이 쓰기 쉬운 React Query 래퍼를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `getCurrentSpace` | 현재 선택 Space 조회 |
| `useGetCurrentSpace` | 현재 Space 조회용 query hook |
| `setCurrentSpace` | `{ spaceId }` payload로 현재 Space 변경 |
| `useSetCurrentSpace` | 간단한 payload 계약의 mutation hook |

## 규칙

- mutation payload는 generated wrapper의 `{ data: payload }` 형식이 아니라 `{ spaceId }` 단일 객체를 사용합니다.
- 응답은 `{ data?: SpaceDto | null }` 형태로 current-space read/write 흐름에 맞춰 단순화합니다.
- current-space도 다른 IDP auth 호출과 동일하게 `customIdpInstance` 기본 경로 해석을 사용하며, 브라우저에서는 same-origin `/api/v1/auth/current-space` 프록시를 우선 사용합니다.
- 현재 Space는 `PersistStore.spaceId` → `x-space-id` request header 흐름으로 전달합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | admin 개발 환경 CORS를 막기 위해 current-space 전용 direct IDP baseURL 우회를 제거하고 same-origin 프록시 사용으로 정리 | codex |
| 2026-04-14 | current-space wrapper 설명을 selectedSpace 쿠키가 아닌 `PersistStore.spaceId` + `x-space-id` 흐름 기준으로 갱신 | codex |
| 2026-04-08 | current-space만 direct IDP baseURL(`NEXT_PUBLIC_IDP_API_URL` 또는 localhost:3007)로 호출하고 미설정 환경은 상대 경로로 폴백하도록 확장 | codex |
| 2026-04-08 | current-space 전용 수동 query/mutation 래퍼 신규 추가 | codex |

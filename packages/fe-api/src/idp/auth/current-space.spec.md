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
- 브라우저 런타임에서는 `NEXT_PUBLIC_IDP_API_URL`이 있으면 해당 origin을, localhost 개발 환경이면 `http://localhost:3007`을 current-space 전용 direct baseURL로 사용합니다.
- direct baseURL이 결정되면 `withCredentials: true`를 강제해 `selectedSpaceId` 쿠키가 admin/storybook과 같은 host 범위에 저장되도록 합니다.
- direct baseURL을 찾지 못한 환경은 기존 상대 경로 호출로 폴백해 기존 ingress/rewrite 구성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | current-space만 direct IDP baseURL(`NEXT_PUBLIC_IDP_API_URL` 또는 localhost:3007)로 호출하고 미설정 환경은 상대 경로로 폴백하도록 확장 | codex |
| 2026-04-08 | current-space 전용 수동 query/mutation 래퍼 신규 추가 | codex |

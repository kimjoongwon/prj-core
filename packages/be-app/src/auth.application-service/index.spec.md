# auth.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/auth.application-service/index.ts

## 역할

인증 유즈케이스를 조합하는 application service를 정의합니다. OIDC client는 DB에서 조회하고, 외부 OIDC 프로토콜 호출은 `OidcFacade`로 분리합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthApplicationService | 인증 유즈케이스 공개 계약 |
| OidcClientService | DB 기반 OIDC client 조회 dependency |
| OidcFacade | 외부 OIDC 연동 dependency |

## 구현 메모

- `getAuthAuditLogs()`는 표준 API 응답 계약에 맞춰 목록을 `data`, 페이지네이션을 `meta`로 반환합니다.
- OIDC state는 Redis payload의 `returnTo`, `clientId` 필드에 분리 저장하고, 이전 인코딩 포맷은 callback에서 레거시 호환으로만 복원합니다.
- legacy `clientKey=storybook` 또는 이전 state payload의 `clientId=storybook`은 callback에서 `storybook-web`으로 복원합니다.
- direct query/session/state로 들어오는 legacy `clientId`(`storybook`, `prj-core-mobile`, `prj-core-swagger`)는 canonical 식별자로 정규화합니다.
- canonical `clientId`가 아직 DB에 없고 legacy row만 남아 있으면 auth flow lookup은 legacy row(`storybook`, `prj-core-mobile`, `prj-core-swagger`)까지 fallback 합니다.
- 세션 ID는 `{clientId}.{random}` 형태로 저장하여 refresh/logout/revoke 시 client를 복원합니다.
- `handleOidcCallback()`은 `returnTo`, `defaultReturnTo`, `loginUrl`을 반환해 controller가 리다이렉트 결정을 하도록 합니다.
- `getAuthorizationUrl()`은 요청마다 DB에서 auth shell client를 조회한 뒤 explicit client protocol config로 authorization URL을 생성합니다.
- `verifyToken()`은 `x-space-id`가 있으면 현재 CLS `TENANT`가 반드시 있어야 하며, 해당 tenant role이 `FULL_ACCESS`일 때만 `hasFullAccess`를 true로 반환합니다.
- `getCurrentSpace()`는 요청의 `x-space-id` 헤더가 유효하면 해당 Space를, 아니면 접근 가능한 tenant 순서 기준 기본 Space를 반환합니다.
- `setCurrentSpace()`는 쿠키를 쓰지 않고, body의 `spaceId`가 접근 가능한 대상인지 검증한 뒤 해당 Space DTO를 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | `verifyToken()`이 `x-space-id` tenant 미매칭을 false가 아니라 403으로 반환하도록 명시 | codex |
| 2026-04-16 | `getCurrentSpace()` 기본 선택에서 FULL_ACCESS tenant 우선 규칙을 제거하고 접근 가능 순서로 고정 | codex |
| 2026-04-16 | `verifyToken()`이 현재 선택 tenant만 기준으로 `hasFullAccess`를 계산한다는 점을 명시 | codex |
| 2026-04-15 | `verifyToken()`의 `hasFullAccess` 기준을 merged ability의 `manage all`이 아니라 tenant role `FULL_ACCESS`로 단순화 | codex |
| 2026-04-14 | Space 선택 canonical source를 `x-space-id` 헤더로 전환하고 login/refresh에서 selectedSpace 쿠키 write를 제거 | codex |
| 2026-04-14 | direct query/session/state의 legacy clientId를 canonical로 정규화하고 migration 전 legacy DB row까지 fallback 하는 auth lookup 규칙을 추가 | codex |
| 2026-04-14 | Storybook RP canonical clientId를 `storybook-web`으로 올리고 legacy state/clientKey 복원 규칙을 갱신 | codex |
| 2026-04-06 | selectedSpace 기본 선택 우선순위를 `manage all` 해석에서 되돌리고 기존 `FULL_ACCESS` tenant 우선 규칙으로 복원 | codex |
| 2026-04-06 | `verifyToken()`의 `hasFullAccess` 계산을 tenant role 이름이 아닌 `manage all` merged ability 기준으로 정리 | codex |
| 2026-03-25 | DB 조회 기반 clientId 계약과 explicit protocol client config 흐름으로 정리 | codex |
| 2026-03-16 | Storybook RP 식별자를 `storybook`으로 단순화하고 세션 prefix/clientId 복원 설명도 동일하게 정리 | codex |
| 2026-03-16 | storybook 전용 OIDC RP와 state payload + sessionId prefix 기반 clientId 복원 규칙을 추가 | codex |
| 2026-03-14 | 인증 감사 로그 목록 반환 키를 `logs`에서 표준 `data`로 정렬해 Orval/React Query 소비 shape를 수정 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | 기존 인증 조합 레이어를 AuthApplicationService와 OidcFacade로 분리 | codex |
| 2026-03-12 | 인증 감사 로그 조회/통계를 ApplicationService로 이관 | codex |
| 2026-03-12 | 인증 감사 로그 목록 반환 시 페이지 메타 계산을 ApplicationService로 이관 | codex |
| 2026-03-13 | `auth.application-service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |

# auth.application-service.spec 테스트 기획서

> 생성일: 2026-04-06
> 타입: test
> 위치: packages/be-app/__tests__/auth.application-service.spec.ts

## 역할

`AuthApplicationService`의 인증 플로우와 보조 규칙을 단위 테스트로 검증합니다.

## 주요 시나리오

| 시나리오 | 설명 |
|------|------|
| OIDC redirect | clientId별 authorization URL 생성 규칙 검증 |
| callback/login/logout | OIDC callback, refresh, logout의 세션 처리 검증 |
| verifyToken | 토큰 만료 시각, 현재 `x-space-id` tenant role 기반 `hasFullAccess`, tenant 미매칭 403 검증 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | `x-space-id`가 있으나 현재 tenant를 찾지 못하면 `verifyToken`이 403을 던지는 회귀 추가 | codex |
| 2026-04-16 | `getCurrentSpace()`가 무효한 `x-space-id`를 FULL_ACCESS tenant로 승격하지 않고 접근 가능 기본 순서를 유지하는 회귀를 추가 | codex |
| 2026-04-16 | 다른 tenant의 FULL_ACCESS는 무시하고 현재 tenant만 `hasFullAccess`에 반영하는 회귀를 명시 | codex |
| 2026-04-15 | `verifyToken`이 merged ability의 `manage all`이 아니라 tenant role `FULL_ACCESS`로 `hasFullAccess`를 계산하도록 회귀 테스트를 갱신 | codex |
| 2026-04-14 | legacy direct clientId(`storybook`) 정규화와 canonical `swagger-web`의 legacy DB fallback 회귀 시나리오를 추가 | codex |
| 2026-04-14 | Storybook RP canonical clientId를 `storybook-web`으로 바꾸고 legacy 복원 회귀 시나리오를 반영 | codex |
| 2026-04-06 | `verifyToken`이 tenant 역할명이 아닌 `manage all` merged ability로 `hasFullAccess`를 계산하는 회귀 테스트를 추가 | codex |
| 2026-04-14 | AuthApplicationService 단위 테스트가 selectedSpace cookie write 없이 current-space helper semantics를 따르도록 갱신 | codex |

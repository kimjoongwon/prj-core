# auth.application-service 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-app/src/auth.application-service/index.ts

## 역할

인증 유즈케이스를 조합하는 application service를 정의합니다. 외부 OIDC 프로토콜 호출은 `OidcFacade`로 분리합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthApplicationService | 인증 유즈케이스 공개 계약 |
| OidcFacade | 외부 OIDC 연동 dependency |

## 구현 메모

- `getAuthAuditLogs()`는 표준 API 응답 계약에 맞춰 목록을 `data`, 페이지네이션을 `meta`로 반환합니다.
- OIDC state는 Redis payload의 `returnTo`, `clientKey` 필드에 분리 저장하고, 이전 인코딩 포맷은 callback에서 레거시 호환으로만 복원합니다.
- 세션 ID는 `{clientKey}.{random}` 형태로 저장하여 refresh/logout/revoke 시 RP client를 복원합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | Storybook RP 식별자를 `storybook`으로 단순화하고 세션 prefix/clientKey 복원 설명도 동일하게 정리 | codex |
| 2026-03-16 | storybook 전용 OIDC RP와 state payload + sessionId prefix 기반 clientKey 복원 규칙을 추가 | codex |
| 2026-03-14 | 인증 감사 로그 목록 반환 키를 `logs`에서 표준 `data`로 정렬해 Orval/React Query 소비 shape를 수정 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | 기존 인증 조합 레이어를 AuthApplicationService와 OidcFacade로 분리 | codex |
| 2026-03-12 | 인증 감사 로그 조회/통계를 ApplicationService로 이관 | codex |
| 2026-03-12 | 인증 감사 로그 목록 반환 시 페이지 메타 계산을 ApplicationService로 이관 | codex |
| 2026-03-13 | `auth.application-service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |

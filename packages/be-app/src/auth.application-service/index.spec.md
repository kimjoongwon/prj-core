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

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | 기존 인증 조합 레이어를 AuthApplicationService와 OidcFacade로 분리 | codex |
| 2026-03-12 | 인증 감사 로그 조회/통계를 ApplicationService로 이관 | codex |
| 2026-03-12 | 인증 감사 로그 목록 반환 시 페이지 메타 계산을 ApplicationService로 이관 | codex |
| 2026-03-13 | `auth.application-service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |

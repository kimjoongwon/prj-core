# oidc login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: packages/fe-e2e/src/oidc-login.ts

## 역할

웹 E2E에서 공통 사용하는 OIDC 로그인 시퀀스를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `navigateToOidcLoginForm(page, options)` | 시작 경로 진입 후 로그인 폼 대기 |
| `submitOidcCredentials(page, options)` | 로그인 계정 입력 및 제출 |
| `waitForOidcConsentForm(page, options)` | 동의 화면 노출 대기 |
| `runOidcLoginFlow(page, options)` | 로그인/동의/최종 URL 검증까지 통합 수행 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | OIDC 공통 로그인 유틸을 `@cocrepo/e2e` 패키지로 분리 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-04 | IDP/Admin E2E 공통 OIDC 로그인 유틸을 @cocrepo/ui로 이관 | codex |

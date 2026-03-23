# oidc login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: packages/fe-e2e/src/oidc-login.ts

## 역할

웹 E2E에서 공통 사용하는 OIDC 로그인 시퀀스를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `navigateToOidcLoginForm(page, options)` | 시작 경로 진입 후 로그인 폼/동의 화면 중 선행 화면을 판별 |
| `submitOidcCredentials(page, options)` | 로그인 계정 입력 및 제출 |
| `waitForOidcConsentForm(page, options)` | 동의 화면 노출 대기 |
| `runOidcLoginFlow(page, options)` | 로그인/동의/최종 URL 검증까지 통합 수행 (직접 리다이렉트 미발생 시 동의 처리와 전체 플로우 재시도 지원) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | interaction timeout 시 시작 경로부터 다시 진입하는 전체 OIDC 로그인 재시도 루프를 추가 | codex |
| 2026-03-23 | parallel 실행 시 /interaction 대기 루프를 빠져나오도록 consent 재시도 및 로그인/동의 진입점 판별 로직을 추가 | qa-fe-e2e-testing |
| 2026-03-06 | OIDC 공통 로그인 유틸을 `@cocrepo/e2e` 패키지로 분리 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-04 | IDP/Admin E2E 공통 OIDC 로그인 유틸을 @cocrepo/ui로 이관 | codex |

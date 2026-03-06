# idp login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: packages/fe-e2e/src/idp-login.ts

## 역할

IDP E2E 시나리오에서 사용하는 로그인 진입 헬퍼를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `loginToConsole(page)` | 로그인 완료 후 `/oidc-clients` 진입 보장 |
| `navigateToLoginForm(page)` | 로그인 폼 렌더링까지만 이동 |
| `navigateToConsentForm(page)` | 로그인 제출 후 동의 화면 렌더링까지 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | IDP 로그인 헬퍼를 `@cocrepo/e2e` 패키지로 분리 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-04 | IDP 로그인 헬퍼를 @cocrepo/ui 공통 모듈로 이관 | codex |

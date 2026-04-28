# Storybook 인증 E2E 테스트 기획

## 대상 코드

- `storybook-auth.e2e.ts`

## 목적

- 보호된 Storybook 스토리 접근 시 Storybook 인증 셸이 표시되는지 검증한다.
- IDP 로그인 진입 링크가 generic auth endpoint와 Storybook auth shell용 `storybook` client alias를 사용해 원래 스토리 URL을 유지하는지 검증한다.
- 로그인 완료 후 원래 스토리로 복귀하고 Storybook 세션 API가 인증 상태를 반환하는지 검증한다.

## 실행 조건

- Playwright `storybook-chromium` 프로젝트에서 실행한다.
- `E2E_STORYBOOK_BASE_URL`이 없으면 `http://localhost:6006/`을 사용한다.
- 기본 로그인 계정은 `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` 환경변수를 우선 사용하고 없으면 로컬 시드 관리자 계정을 사용한다.

## 구현 메모

- Storybook 패키지는 ESM 패키지이므로 런타임 `test`/`expect`는 `apps/test/e2e` 패키지의 Playwright 엔트리에서 가져온다.
- 이 경로는 Playwright 설정 파일과 CLI가 사용하는 패키지 인스턴스를 일치시키기 위한 E2E 전용 경계이다.

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-04-29 | Storybook E2E의 Playwright 런타임 import를 E2E 패키지 엔트리로 통일하고 sidecar spec을 추가했다. |
| 2026-04-29 | Storybook auth shell의 legacy client alias `storybook` 기대값을 E2E 계약에 반영했다. |

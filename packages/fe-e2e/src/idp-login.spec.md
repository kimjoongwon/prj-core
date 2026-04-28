# idp-login.ts

## 목적

IDP 웹 콘솔 E2E 테스트에서 OIDC 로그인 플로우를 프로그램 방식으로 완료하고, 콘솔 화면 진입에 필요한 기본 Space 선택 상태를 준비한다.

## 주요 계약

- `loginToConsole`은 IDP 웹 클라이언트 로그인 엔트리로 진입해 login/consent interaction을 처리한다.
- 로그인 후 `/dashboard`에 도달하면 `idp-persist` localStorage에 System Space를 기록해 콘솔의 Space bootstrap과 권한 gate가 같은 기준으로 동작하게 한다.
- System Space ID는 `E2E_SYSTEM_SPACE_ID` 환경 변수를 우선 사용하고, 없으면 로컬 seed 기준 ID를 사용한다.
- interaction API 호출은 `E2E_IDP_API_BASE_URL`을 기준으로 수행한다.

## 변경 이력

| 날짜 | 변경 |
| --- | --- |
| 2026-04-29 | 콘솔 로그인 후 System Space persist를 주입해 IDP 콘솔 E2E의 FULL_ACCESS 화면 접근을 안정화했다. |

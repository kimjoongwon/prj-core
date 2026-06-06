# idp-login.ts

## 목적

통합 인증 콘솔 E2E 테스트에서 native 로그인 플로우를 완료하고, 콘솔 화면 진입에 필요한 기본 Space 선택 상태를 준비한다. OIDC 로그인 폼/동의 화면 탐색 helper는 OIDC protocol flow 테스트용으로 별도 유지한다.

## 주요 계약

- `loginToConsole`은 admin web native 로그인 화면으로 진입해 시드 관리자 계정으로 인증한다.
- 로그인 후 `/settings/auth`에 도달하면 admin persist localStorage에 System Space를 기록해 콘솔의 Space bootstrap과 권한 gate가 같은 기준으로 동작하게 한다.
- System Space ID는 `E2E_SYSTEM_SPACE_ID` 환경 변수를 우선 사용하고, 없으면 로컬 seed 기준 ID를 사용한다.
- current-space 검증 API 호출은 native access token을 `Authorization` 헤더에 담아 `E2E_CORE_API_BASE_URL` 기준으로 수행한다.

## 변경 이력

| 날짜 | 변경 |
| --- | --- |
| 2026-06-06 | admin 콘솔 기본 인증 준비를 OIDC interaction에서 native login으로 전환했다. |
| 2026-04-29 | 콘솔 로그인 후 System Space persist를 주입해 IDP 콘솔 E2E의 FULL_ACCESS 화면 접근을 안정화했다. |

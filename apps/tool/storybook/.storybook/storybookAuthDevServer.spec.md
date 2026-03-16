# storybookAuthDevServer.js Spec

## 목적
- 로컬 Storybook 개발 서버에서만 인증 셸, 세션 확인, API 프록시를 제공합니다.
- Storybook manager/preview 진입 전에 기존 IDP 쿠키 세션을 검사합니다.

## 핵심 동작
- `/__storybook_auth/login`은 `/api/v1/auth/storybook/login?returnTo=...` 플로우를 감싸는 로컬 로그인 셸을 렌더링합니다.
- `/__storybook_auth/logout`은 로그아웃 API 호출 뒤 Storybook 관련 local/session storage를 정리하고 로그인 셸로 복귀시킵니다.
- `/__storybook_auth/session`은 `verify-token`을 프록시 대신 서버 측에서 확인해 JSON 상태를 반환합니다.
- 로그인 alias(`/admin/auth/login`, `/auth/login`) 요청을 Storybook 로그인 셸로 흡수합니다.
- auth gate를 끄더라도 로그인/로그아웃/세션 셸 라우트는 유지해 로컬 redirect 경로를 흡수합니다.
- `/api/v1/auth`, `/api/v1/idp`, `/api/v1/oidc-clients`, `/api/v1/oidc-sessions`, `/api/interaction`, `/api/forgot-password`, `/api/password-policy`, `/api/reset-password`는 IDP API로 프록시하고 나머지 `/api/v1/*`는 Core API로 프록시합니다.
- manager/preview HTML 자체의 가시성 차단은 dev server middleware가 HTML/JSON 진입점을 로그인 셸로 리다이렉트해서 처리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | auth-off 시에도 유지되는 shell 라우트와 middleware 기반 HTML/JSON gate 동작을 문서화 | codex |
| 2026-03-16 | 로컬 dev 전용 Storybook 인증 셸, 세션 확인 라우트, API 프록시 규칙 신규 추가 | codex |

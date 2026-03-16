# preview-head.html Spec

## 목적
- Preview iframe 진입 직전에 로컬 Storybook 인증 상태를 확인합니다.
- 비로그인 상태에서 story iframe이 독립적으로 노출되는 것을 방지합니다.

## 핵심 동작
- `/__storybook_auth/*` 경로에서는 아무 것도 하지 않습니다.
- 그 외 preview HTML에서는 body를 잠시 숨긴 뒤 `/__storybook_auth/session`을 조회합니다.
- 세션이 유효하면 body를 다시 노출하고, 세션이 없으면 top-level Storybook을 `/__storybook_auth/login?returnTo=<top-level storybook url>`로 이동시킵니다.
- 정적 빌드처럼 `/__storybook_auth/session`이 존재하지 않는 환경(404)에서는 no-op으로 빠져 기존 Storybook 동작을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | iframe 내부에서는 `returnTo`를 top-level Storybook URL로 고정해 로그인 후 manager shell 복귀 보장 | codex |
| 2026-03-16 | preview iframe용 로컬 auth gate head 스크립트 신규 추가 | codex |

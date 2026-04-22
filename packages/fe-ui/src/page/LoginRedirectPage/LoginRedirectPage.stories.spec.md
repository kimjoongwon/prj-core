# LoginRedirectPage.stories.tsx Spec

## 목적
- `page/LoginRedirectPage`에서 관리자 인증 재시도, 리다이렉트, 복구 불가 상태를 실제 페이지 UI로 확인합니다.
- scaffold 대신 운영자 인증 실패 흐름을 Storybook canvas에서 바로 검토할 수 있게 합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/LoginRedirectPage`입니다.
- 스토리 파일 기준 경로는 `page/LoginRedirectPage/LoginRedirectPage.stories.tsx`입니다.
- `RetryRequired`, `Redirecting`, `RetryUnavailable` 시나리오를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 story page id와 component 이름을 semantic 기준으로 갱신 | codex |
| 2026-04-14 | scaffold를 실제 관리자 인증 실패/리다이렉트 시나리오 스토리로 교체 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |

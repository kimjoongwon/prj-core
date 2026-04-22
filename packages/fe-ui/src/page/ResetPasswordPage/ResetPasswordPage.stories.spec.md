# ResetPasswordPage.stories.tsx Spec

## 목적
- `page/ResetPasswordPage`에서 토큰 검증, 재설정 폼, 만료 링크 상태를 실제 페이지 UI로 확인합니다.
- scaffold 대신 재설정 단계별 화면을 Storybook에서 바로 검토할 수 있게 합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/ResetPasswordPage`입니다.
- 스토리 파일 기준 경로는 `page/ResetPasswordPage/ResetPasswordPage.stories.tsx`입니다.
- `ValidatingLink`, `ReadyToReset`, `ExpiredLink` 시나리오를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 story page id와 component 이름을 semantic 기준으로 갱신 | codex |
| 2026-04-14 | scaffold를 실제 비밀번호 재설정 단계 스토리로 교체 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |

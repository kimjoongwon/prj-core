# LoginPage.stories.tsx Spec

## 목적
- `page/LoginPage` 스토리를 통해 로그인 화면의 기본, 오류, 로딩 상태를 확인합니다.
- 스토리 파일 구조를 반영한 탐색 경로를 유지합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/LoginPage`입니다.
- 스토리 파일 기준 경로는 `page/LoginPage/LoginPage.stories.tsx`입니다.
- 기본 입력 상태, 로그인 오류 상태, 제출 중 상태를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | story render에서도 object literal observable 대신 `LoginPageStoryState` MobX class를 사용하도록 정리 | codex |
| 2026-04-22 | page가 `onSubmitLoginForm`만 소유하고 child form은 state-only contract를 쓰도록 story args를 정리 | codex |
| 2026-04-22 | story args를 `state.loginForm` 중첩 구조로 바꾸고 page state slice 계약에 맞췄다 | codex |
| 2026-04-14 | Storybook 9 args 계약에 맞춰 `state` 기본값과 상태별 override 구성을 정리 | Codex |
| 2026-04-05 | placeholder를 실제 페이지 스토리로 교체하고 로그인 상태별 시나리오를 추가 | Codex |
| 2026-03-15 | `Auto/*` title을 실제 스토리 경로 기준으로 정규화하고 sidecar spec을 추가 | codex |

# manager-head.html Spec

## 목적
- Storybook Manager 문서 헤더 메타를 정의합니다.
- Plate 전용 favicon 및 설명 메타를 제공합니다.
- Storybook 문자열 흔적(타이틀/홍보 카드)을 제거합니다.

## 핵심 동작
- `./plate-favicon.svg`를 favicon으로 설정해 `/storybook` 같은 하위 경로 배포에서도 아이콘 로딩을 유지합니다.
- `theme-color`를 Plate 다크 배경 색상으로 고정합니다.
- Plate 설명 메타를 추가합니다.
- 사이드바 하단 영역(`#sidebar-bottom-wrapper`)을 숨겨 Storybook 관련 하단 UI를 제거합니다.
- 문서 제목에서 `Storybook` 문자열을 `PLATE`로 치환합니다.
- 로컬 dev auth 모드에서는 세션 확인이 끝날 때까지 body를 숨기고, 비로그인 상태면 `/__storybook_auth/login`으로 즉시 이동시켜 manager UI 노출을 차단합니다.
- shared package가 `/admin/auth/login`, `/auth/login`으로 리다이렉트해도 Storybook 로그인 셸로 다시 연결합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-18 | favicon 경로를 상대 경로로 바꿔 하위 prefix 배포(`/storybook`)에서도 동일하게 동작하도록 조정 | codex |
| 2026-03-16 | manager 진입 전 auth gate 스크립트와 login alias 흡수 규칙 추가 | codex |
| 2026-03-05 | Plate favicon/meta 설정 파일 신규 추가 | codex |
| 2026-03-05 | Storybook 문자열/홍보 카드 제거 스크립트·스타일 추가 | codex |
| 2026-03-05 | title 정규화 시 변경분이 있을 때만 반영하도록 안정화 | codex |
| 2026-03-05 | 사이드바 하단 Storybook 관련 영역 전체 숨김 처리 | codex |
| 2026-03-06 | 설명 메타 문구 정리 | codex |

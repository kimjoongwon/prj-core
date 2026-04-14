# AdminAssetsPage.stories.tsx Spec

## 목적
- `page/AdminAssetsPage` Storybook 엔트리에서 실제 페이지 컴포넌트를 렌더링합니다.
- 대표 상태를 canvas에서 바로 확인할 수 있도록 scaffold를 실제 시나리오 스토리로 교체합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/AdminAssetsPage`입니다.
- 스토리 파일 기준 경로는 `page/AdminAssetsPage/AdminAssetsPage.stories.tsx`입니다.
- `Default`, `Loading`, `EmptyState` 시나리오를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | query state setter mock을 함수 형태로 보정해 실제 Storybook 상호작용 계약과 정렬 | Codex |
| 2026-04-14 | scaffold를 실제 페이지 시나리오 스토리로 교체하고 Default, Loading, EmptyState 상태를 추가 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |

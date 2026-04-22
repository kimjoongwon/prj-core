# AssetDetailPage.stories.tsx Spec

## 목적
- `page/AssetDetailPage` Storybook 엔트리에서 실제 페이지 컴포넌트를 렌더링합니다.
- 대표 상태를 canvas에서 바로 확인할 수 있도록 scaffold를 실제 시나리오 스토리로 교체합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/AssetDetailPage`입니다.
- 스토리 파일 기준 경로는 `page/AssetDetailPage/AssetDetailPage.stories.tsx`입니다.
- `Default`, `Loading`, `EmptyState` 시나리오를 제공합니다.
- fixture는 유효한 folder id/name 조합을 사용해 Select 경고 없이 상세 이동 시나리오를 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | folder fixture를 실제 selectable option과 일치시키고 Storybook Select warning이 나지 않도록 정제 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 story page id와 component 이름을 semantic 기준으로 갱신 | codex |
| 2026-04-14 | scaffold를 실제 페이지 시나리오 스토리로 교체하고 Default, Loading, EmptyState 상태를 추가 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |

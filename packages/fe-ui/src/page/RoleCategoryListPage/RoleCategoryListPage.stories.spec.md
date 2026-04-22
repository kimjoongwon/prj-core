# RoleCategoryListPage.stories.tsx Spec

## 목적
- `page/RoleCategoryListPage` Storybook 엔트리에서 실제 페이지 컴포넌트를 렌더링합니다.
- 대표 상태를 canvas에서 바로 확인할 수 있도록 scaffold를 실제 시나리오 스토리로 교체합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/RoleCategoryListPage`입니다.
- 스토리 파일 기준 경로는 `page/RoleCategoryListPage/RoleCategoryListPage.stories.tsx`입니다.
- `Default`, `Loading`, `EmptyState` 시나리오를 제공합니다.
- fixture row는 고유 id/name/date 조합을 사용해 chart/grid가 duplicate key warning 없이 렌더링됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | role category list fixture의 id/name/date 값을 정제해 Storybook grid/chart warning을 제거 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 story page id와 component 이름을 semantic 기준으로 갱신 | codex |
| 2026-04-14 | scaffold를 실제 페이지 시나리오 스토리로 교체하고 Default, Loading, EmptyState 상태를 추가 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |

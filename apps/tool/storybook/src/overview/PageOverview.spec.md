# PageOverview.tsx Spec

## 목적
- Storybook 안에서 page inventory와 flow lane을 동시에 보여주는 전용 overview UI를 제공합니다.
- 디자인 리뷰 시 routed page, standalone page, scaffold 상태를 한 화면에서 빠르게 확인할 수 있게 합니다.

## 핵심 동작
- 상단 hero 영역에서 전체 page 수, routed 수, standalone 수, scenario/scaffold 수를 요약 카드로 노출합니다.
- 필터는 `App`, `Lane`, `Page Kind`, `Story Status`, `Search`를 제공합니다.
- catalog 테이블은 component path, 연결된 route path, app 배지, story 상태, canonical story 링크를 표시합니다.
- flow 섹션은 lane 단위로 node 카드와 edge chip을 렌더링합니다.
- `standalone` 필터에서는 routed flow를 숨기고 catalog만 남깁니다.
- story 링크는 preview iframe 내부가 아니라 top-level Storybook manager로 이동하도록 `target="_top"`을 사용합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PageOverview` | overview manifest를 받아 Storybook 전용 catalog/flow UI를 렌더링합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | page catalog, filter, lane map을 렌더링하는 Storybook overview UI 신규 추가 | codex |

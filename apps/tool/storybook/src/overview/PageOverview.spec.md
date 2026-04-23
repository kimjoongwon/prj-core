# PageOverview.tsx Spec

## 목적
- Storybook 안에서 page inventory와 React Flow 기반 화면 연결을 동시에 보여주는 overview workspace를 제공합니다.
- 디자인 리뷰 시 routed page, standalone page, scaffold 상태와 story deep-link를 한 화면에서 빠르게 확인할 수 있게 합니다.

## 핵심 동작
- 상단 hero 영역에서 전체 page 수, routed 수, standalone 수, scenario/scaffold 수를 요약 카드로 노출합니다.
- 필터는 `App`, `Lane`, `Page Kind`, `Story Status`, `Search`를 제공합니다.
- catalog 테이블은 component path, 연결된 route path, app 배지, story 상태, canonical story 링크를 표시합니다.
- flow 섹션은 lane별 node/edge를 React Flow 캔버스로 렌더링하고, manual override edge는 다른 stroke 스타일로 강조합니다.
- flow node는 session-local drag position을 저장해, 사용자가 겹치는 카드를 직접 재배치할 수 있습니다.
- graph 좌측에는 lane legend를, 우측에는 현재 선택 node의 route/component/story/planning 연결 상태를 요약하는 detail panel을 배치합니다.
- `standalone` 필터에서는 routed flow를 숨기고 catalog만 남깁니다.
- story 링크는 preview iframe 내부가 아니라 top-level Storybook manager로 이동하도록 `target="_top"`을 사용합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PageOverview` | overview manifest를 받아 Storybook 전용 catalog/flow UI를 렌더링합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-23 | React Flow node를 draggable로 전환하고 session-local drag position을 overlay하는 계약을 추가 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 overview의 canonical story deep-link fixture를 semantic page slug 기준으로 정리 | codex |
| 2026-04-15 | React Flow 캔버스, lane legend, selected node detail panel을 포함한 page flow workspace로 확장 | codex |
| 2026-04-08 | page catalog, filter, lane map을 렌더링하는 Storybook overview UI 신규 추가 | codex |

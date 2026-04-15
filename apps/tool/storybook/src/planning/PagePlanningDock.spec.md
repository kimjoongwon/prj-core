# PagePlanningDock.tsx Spec

## 목적
- `page/*` Canvas story에서 planning 때문에 본문 폭이 줄어들지 않도록, 우하단 floating launcher와 전체 화면 planning overlay를 제공합니다.

## 핵심 동작
- Storybook preview decorator가 `page/*` story를 감싸면 canvas는 full width를 유지하고, 우하단 fixed floating button만 기본 노출합니다.
- launcher를 누르면 planning이 전체 화면 overlay로 열려 긴 route/pure page spec도 잘리지 않고 스크롤할 수 있습니다.
- overlay 안에서는 `full` variant planning panel을 사용해 summary/raw spec과 Codex 액션을 그대로 재사용합니다.
- 필요하면 `pagePlanning.codex.enabled = false`로 canvas overlay의 Codex 액션을 끌 수 있습니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PagePlanningDock` | story 본문과 expandable planning shelf를 함께 렌더링하는 wrapper입니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | 하단 shelf를 제거하고 우하단 floating launcher + 전체 화면 planning overlay 구조로 전환 | codex |
| 2026-04-15 | page별로 Codex bridge 액션을 opt-out할 수 있도록 `codexEnabled` 전달 계약 추가 | codex |
| 2026-04-15 | inline planning을 하단 expandable shelf로 바꿔 좌우 이동 없이 card 단위 탐색이 가능하도록 조정 | codex |
| 2026-04-15 | canvas 폭 축소 문제를 막기 위해 2열 dock를 floating compact summary overlay로 전환 | codex |
| 2026-04-15 | page story canvas에서도 planning을 즉시 볼 수 있는 우측 도킹 wrapper 신규 추가 | codex |

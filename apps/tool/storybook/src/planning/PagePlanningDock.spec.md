# PagePlanningDock.tsx Spec

## 목적
- `page/*` Canvas story에서 planning 때문에 본문 폭이 줄어들지 않도록, canvas 아래쪽에 펼치고 접을 수 있는 planning shelf를 제공합니다.

## 핵심 동작
- Storybook preview decorator가 `page/*` story를 감싸면 canvas는 full width를 유지하고, planning은 하단 fixed shelf로 렌더링합니다.
- shelf는 접고 펼칠 수 있으며, 펼친 상태에서는 `board` variant planning card들을 가로 공간에 배치합니다.
- viewport가 좁아지면 shelf를 자동으로 접어 canvas 가독성을 우선합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PagePlanningDock` | story 본문과 expandable planning shelf를 함께 렌더링하는 wrapper입니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | inline planning을 하단 expandable shelf로 바꿔 좌우 이동 없이 card 단위 탐색이 가능하도록 조정 | codex |
| 2026-04-15 | canvas 폭 축소 문제를 막기 위해 2열 dock를 floating compact summary overlay로 전환 | codex |
| 2026-04-15 | page story canvas에서도 planning을 즉시 볼 수 있는 우측 도킹 wrapper 신규 추가 | codex |

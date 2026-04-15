# PagePlanningPanel.tsx Spec

## 목적
- Storybook 우측 패널에서 현재 선택된 page story의 기획을 요약과 raw markdown으로 보여줍니다.

## 핵심 동작
- `storyId`를 기준으로 overview manifest에서 연결된 page entry를 찾아 pure page spec와 route page spec를 묶어 보여주며, autodocs `Docs` entry도 같은 page 기획으로 해석합니다.
- 우측 manager addon뿐 아니라 page canvas dock에서도 동일한 panel view를 재사용합니다.
- compact variant에서는 `Summary`만 노출하고 section/document 수를 줄여 canvas 보조 정보로 동작합니다.
- board variant에서는 summary card를 grid로 배치하고, 카드별 `더 보기/접기`로 section을 공간적으로 탐색할 수 있게 합니다.
- 기본 탭은 `Summary`이며 route spec은 사용자 시나리오, rendering decision, API 호출, 이벤트 핸들러를 우선 요약합니다.
- pure page spec은 역할, 공개 계약, 구성 요소, 의존성을 우선 요약합니다.
- `Raw Spec` 탭에서는 연결된 모든 spec markdown 원문을 그대로 렌더링합니다.
- header의 `Codex로 수정` 액션은 현재 story에 연결된 spec allowlist만 대상으로 local Codex bridge를 호출합니다.
- Codex dialog는 실행 로그, summary, touched files, `Publish PR` 액션을 제공하고, 결과는 `main` 대상 draft PR로만 발행합니다.
- Codex bridge 응답이 404면 `endpoint 없음`, HTML이면 `로그인/리다이렉트 응답`으로 해석해 구체적인 복구 안내를 노출합니다.
- page story가 아니거나 spec가 없으면 비어 있는 상태를 명확히 안내합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PagePlanningPanelView` | manifest와 `storyId`를 받아 planning panel UI를 렌더링합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Codex bridge 파싱 실패를 404 endpoint 누락과 HTML 리다이렉트 응답으로 구분해 복구 안내 문구를 구체화 | codex |
| 2026-04-15 | local Codex bridge를 호출해 page planning spec 수정 제안과 draft PR 발행까지 수행하는 dialog/action 계약 추가 | codex |
| 2026-04-15 | planning shelf용 board variant와 카드 단위 확장/접기 계약 추가 | codex |
| 2026-04-15 | canvas overlay용 compact summary variant 계약 추가 | codex |
| 2026-04-15 | page canvas dock에서도 같은 planning panel view를 재사용하도록 계약 설명 보강 | codex |
| 2026-04-15 | autodocs `Docs` story에서도 page planning이 열리도록 story id 해석 범위 확장 | codex |
| 2026-04-15 | Storybook 우측 패널용 page planning summary/raw view 신규 추가 | codex |

# PagePlanningDock.test.tsx Spec

## 목적
- page canvas planning dock가 기본적으로 floating launcher만 노출하고, 클릭 시 전체 화면 overlay로 전환되는지 검증합니다.

## 핵심 동작
- story canvas는 planning overlay를 열기 전에도 그대로 렌더링됩니다.
- 우하단 floating launcher 버튼이 기본 노출됩니다.
- launcher 클릭 후 `Planning overlay` header, planning panel heading, close button이 나타나는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 planning dock fixture story id를 semantic page 기준으로 갱신 | codex |
| 2026-04-15 | floating launcher와 전체 화면 overlay 전환 흐름 검증용 sidecar spec 신규 추가 | codex |

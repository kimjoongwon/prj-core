# flow-overrides.ts Spec

## 목적
- Storybook page flow에서 자동 추론만으로 부족한 주요 여정을 수동 edge로 보강합니다.

## 핵심 동작
- lane 단위로 `fromPath -> toPath` 수동 edge를 정의할 수 있습니다.
- override는 manifest 조립 단계에서 자동 edge와 병합됩니다.
- 현재 기본 export는 빈 배열이며, 필요할 때만 로컬 기획 의도를 추가합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `FlowOverrideEdge` | lane 안에서 추가할 수동 연결선 정의 |
| `FlowOverride` | 하나 이상의 수동 연결선 묶음 |
| `FLOW_OVERRIDES` | Storybook page flow 수동 보강 source of truth |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | React Flow 기반 overview에서 수동 flow edge를 보강하기 위한 override 계약 추가 | codex |

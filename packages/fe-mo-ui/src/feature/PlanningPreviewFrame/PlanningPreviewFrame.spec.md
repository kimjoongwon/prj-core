# PlanningPreviewFrame

## 역할

- 모바일 Storybook에서 기획 시나리오 메타데이터와 실제 화면 preview를 함께 보여주는 Feature입니다.
- `PlanningScenario`를 받아 경로, owner, 실행 context, API scenario, acceptance를 읽기 전용으로 표시합니다.
- 실제 화면은 `children`으로 받아 preview 영역에 렌더링합니다.

## 공개 Props

- `scenario`: 표시할 `PlanningScenario`
- `children`: preview 영역에 넣을 화면 또는 컴포넌트

## 조합 컴포넌트

- `PlanningPreviewField`: label/value 표시
- `PlanningApiRequestList`: API request 요약 표시
- `PlanningAcceptanceList`: acceptance 체크 항목 표시

## 경계

- API query, mutation, route params, navigation side effect를 소유하지 않습니다.
- Storybook 또는 route가 시나리오와 mock transport를 연결합니다.

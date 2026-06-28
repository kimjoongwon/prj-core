# PlanningPreviewFrame

## 역할

- Storybook에서 기획 시나리오 메타데이터와 실제 화면 preview를 함께 보여주는 Feature입니다.
- `PlanningScenario`를 받아 경로, owner, 실행 context, API scenario, acceptance를 읽기 전용으로 표시합니다.
- 실제 화면은 `children`으로 받아 중앙 preview 영역에 렌더링합니다.

## 공개 Props

- `scenario`: 표시할 `PlanningScenario`
- `children`: preview 영역에 넣을 화면 또는 컴포넌트

## 조합 컴포넌트

- `PlanningPreviewField`: label/value 표시
- `PlanningApiRequestList`: API request 요약 표시
- `PlanningAcceptanceList`: acceptance 체크 항목 표시

## 경계

- 데이터 fetching, 라우터 이동, MSW handler 등록은 소유하지 않습니다.
- Storybook story가 `parameters.planning`을 설정하고, Storybook 런타임이 handler를 연결합니다.

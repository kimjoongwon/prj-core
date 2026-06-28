# PlanningPreviewFrame

## 역할

- Storybook에서 기획 시나리오 메타데이터와 실제 화면 preview를 함께 보여주는 Feature입니다.
- `PlanningScenario`를 받아 mock session, 경로, owner, 실행 context, API scenario, acceptance, notes를 읽기 전용으로 표시합니다.
- 실제 화면은 `children`으로 받아 중앙 preview 영역에 렌더링합니다.

## 공개 Props

- `scenario`: 표시할 `PlanningScenario`
- `children`: preview 영역에 넣을 화면 또는 컴포넌트
- `onSpaceChange`: mock tenant/space 선택이 바뀌었을 때 story가 선택 값을 받을 수 있는 선택 callback

## 화면 러프

- 상단: 실제 인증/API 없이 동작하는 mock 로그인 상태와 tenant/space selector
- 중앙 왼쪽: story가 렌더링한 화면 preview
- 오른쪽: Planning, Context, API Scenario, Acceptance, Notes 패널

## 조합 컴포넌트

- `PlanningSessionBar`: mock 로그인 상태와 tenant/space 선택 UI
- `PlanningPreviewField`: label/value 표시
- `PlanningApiRequestList`: API request 요약 표시
- `PlanningAcceptanceList`: acceptance 체크 항목 표시
- `PlanningNotesList`: 기획 메모 표시

## 경계

- 데이터 fetching, 라우터 이동, 실제 인증, 실제 tenant 선택, MSW handler 등록은 소유하지 않습니다.
- Storybook story가 `parameters.planning`을 설정하고, Storybook 런타임이 handler를 연결합니다.
- 기획 프레임 UI는 전역 decorator가 아니라 story `render`에서 수동으로 감쌉니다.

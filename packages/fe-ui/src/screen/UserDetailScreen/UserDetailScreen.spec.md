# UserDetailScreen 기획서

> 생성일: 2026-03-21
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `user` | 이용자 기본 정보 |
| `policies` | 선택 가능한 정책 목록 |
| `assignedPolicyIds` | 저장된 사용자 직접 정책 ID |
| `selectedPolicyIds` | 편집 중 또는 조회 중인 정책 ID |
| `policyAssignments` | 저장된 UserPolicy assignment 목록 |
| `selectedPolicyAssignments` | 편집 중 또는 조회 중인 UserPolicy assignment 목록 |
| `isEditingPolicies` | 정책 편집 모드 |
| `onTogglePolicy` | 정책 선택 토글 |
| `onChangePolicyAssignmentActive` | UserPolicy 활성 여부 변경 |
| `onChangePolicyAssignmentPriority` | UserPolicy 우선순위 변경 |
| `onClickSavePoliciesButton` | 사용자 정책 동기화 요청 |

## 시각 Composition

- `ScreenSurface` route wrapper 안에서 screen이 기본 정보와 사용자 정책 할당 `SectionSurface`를 배치합니다.
- 회원 식별 정보는 compact info grid로 표시합니다.
- 정책 목록은 역할 상세와 동일한 카드형 row를 사용하되 문구는 사용자 직접 할당에 맞춥니다.
- 편집 모드에서 선택된 정책은 활성 Switch와 priority 입력을 노출합니다.
# RoleDetailPage 기획서

> 생성일: 2026-02-18
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `role` | 역할 기본 정보 |
| `policies` | 선택 가능한 정책 목록 |
| `assignedPolicyIds` | 저장된 역할 정책 ID |
| `selectedPolicyIds` | 편집 중 또는 조회 중인 정책 ID |
| `policyAssignments` | 저장된 RolePolicy assignment 목록 |
| `selectedPolicyAssignments` | 편집 중 또는 조회 중인 RolePolicy assignment 목록 |
| `isEditingPolicies` | 정책 편집 모드 |
| `onTogglePolicy` | 정책 선택 토글 |
| `onChangePolicyAssignmentActive` | RolePolicy 활성 여부 변경 |
| `onChangePolicyAssignmentPriority` | RolePolicy 우선순위 변경 |
| `onClickConfirmSavePoliciesButton` | 역할 정책 동기화 확인 |

## 시각 Composition

- `DetailPageSurface` 아래 기본 정보와 정책 할당 `DetailSectionCard`를 배치합니다.
- 시스템 역할은 수정/삭제 버튼을 숨기고 정책 할당은 조회 및 편집 가능합니다.
- 정책 유형, 할당 상태, assignment 활성 여부, 우선순위, Ability 수는 `Chip`과 카드형 row로 표시합니다.
- 편집 모드에서 선택된 정책은 활성 Switch와 priority 입력을 노출합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | Ability 직접 편집 UI를 정책 할당 UI로 교체 | codex |
| 2026-04-28 | RolePolicy active/priority assignment 편집 UI 반영 | codex |

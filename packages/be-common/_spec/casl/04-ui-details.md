# 04. 권한 관리 UI 계약

## Role 상세

Role 상세 화면의 Policy 할당 영역은 다음 정보를 보여 줍니다.

| 항목 | 출처 | 편집 |
|---|---|---|
| Policy 이름과 설명 | `assignment.policy` | 선택·해제 |
| 활성 상태 | `assignment.isActive` | 가능 |
| 우선순위 | `assignment.priority` | 가능 |
| 현재 할당 수 | Assignment 목록 | 읽기 전용 |
| 활성 할당 수 | `isActive=true` 개수 | 읽기 전용 |

화면 상태는 `RoleAssignmentFormState.assignments`가 소유합니다. 저장 payload도 같은 이름을 사용합니다.

```ts
interface RoleAssignmentFormState {
  assignments: Array<{
    policyId: string;
    isActive: boolean;
    priority: number;
  }>;
}
```

## Policy 생성·수정

Policy 화면은 Ability 후보를 체크 목록으로 보여 줍니다. UI 내부에서는 선택 편의를 위해 `abilityIds` 배열을 사용할 수 있지만, API 경계에서는 반드시 `entries`로 변환합니다.

```ts
const payload = {
  entries: state.abilityIds.map((abilityId) => ({ abilityId })),
};
```

Policy 상세의 선택 상태는 `policy.entries[].abilityId`에서 복원합니다.

## 사용자 Tenant 상세

사용자 기본 상세에는 Tenant 요약만 둡니다. Tenant 하나를 선택했을 때 별도 조회한 상세에서 다음 순서로 표시합니다.

```text
Space
└─ FitnessCenter
   └─ Company

Role
└─ Assignment
   └─ Policy
      └─ Entry
         └─ Ability
            ├─ Action
            └─ Subject
```

비활성 Assignment는 관리자가 상태를 이해할 수 있게 표시하되 실제 권한으로 오해하지 않도록 “비활성” 상태를 분명히 보여 줍니다.

## 접근성과 피드백

- 선택 control에는 Policy 또는 Ability 이름을 접근 가능한 label로 제공합니다.
- 저장 중에는 중복 제출을 막습니다.
- 저장 성공 후 서버 값을 다시 조회해 로컬 상태를 확정합니다.
- 실패 시 사용자가 편집한 값을 유지합니다.
- 빈 목록, 로딩, 조회 실패를 서로 다른 상태로 표시합니다.

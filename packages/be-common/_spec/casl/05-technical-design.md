# 05. CASL 기술 설계

## Prisma 관계

```prisma
model Role {
  assignments RoleAssignment[]
}

model RoleAssignment {
  roleId   String
  policyId String
  isActive Boolean @default(true)
  priority Int     @default(0)

  role   Role
  policy Policy

  @@unique([roleId, policyId])
  @@map("role_assignments")
}

model Policy {
  entries         PolicyEntry[]
  roleAssignments RoleAssignment[]
}

model PolicyEntry {
  policyId  String
  abilityId String

  policy  Policy
  ability Ability

  @@unique([policyId, abilityId])
  @@map("policy_entries")
}

model Ability {
  policyEntries PolicyEntry[]
  action        Action
  subject       Subject
}
```

관계 row의 ID, 시각과 soft-delete 필드는 실제 schema에 그대로 존재합니다. 위 코드는 관계를 읽는 데 필요한 부분만 줄여서 표시한 것입니다.

## 조회 규칙

`RoleAssignmentsRepository.findByRoleIdInSpace`는 관리 화면용입니다.

- Assignment의 `removedAt`이 `null`
- Policy의 `spaceId`가 현재 Space
- Policy의 `removedAt`이 `null`
- Entry와 Ability의 `removedAt`이 `null`
- Assignment는 priority 내림차순, 생성 시각 내림차순
- Entry는 생성 시각 오름차순
- 활성·비활성 Assignment 모두 반환

`RoleAssignmentsRepository.findActiveByRoleIdsInSpace`는 CASL 계산용이며 위 조건에 `isActive=true`를 추가합니다.

## CASL 변환

```ts
const assignments =
  await roleAssignmentsRepository.findActiveByRoleIdsInSpace(
    [tenant.roleId],
    tenant.spaceId,
  );

const abilities = assignments.flatMap((assignment) =>
  (assignment.policy?.entries ?? [])
    .filter((entry) => entry.ability)
    .map((entry) => ({
      ...entry.ability!,
      priority: assignment.priority,
    })),
);
```

이후 Ability의 `action.name`, `subject.name`, `fields`, `conditions`, `inverted`를 CASL rule로 변환합니다. 같은 규칙이 겹칠 때는 높은 Assignment priority를 먼저 적용합니다.

## 쓰기 규칙

### Role Assignment

- Role이 존재해야 합니다.
- 모든 Policy가 현재 Space에 속해야 합니다.
- `(roleId, policyId)`는 유일합니다.
- 동기화 요청에 없는 기존 항목은 soft-delete 합니다.
- 다시 포함된 항목은 기존 ID를 유지하며 복원합니다.

### Policy Entry

- Policy가 현재 Space에 존재해야 합니다.
- 모든 Ability가 존재해야 합니다.
- `(policyId, abilityId)`는 유일합니다.
- 동기화 요청에 없는 기존 항목은 soft-delete 합니다.
- 다시 포함된 항목은 기존 ID를 유지하며 복원합니다.

## 공개 응답 방향

API 응답은 다음 한 방향만 공개합니다.

```text
Role.assignments[].policy.entries[].ability
```

`Policy.roleAssignments`와 `Ability.policyEntries`는 내부 역방향 관계입니다. 공개 DTO에는 싣지 않아 순환 응답과 중복 데이터를 피합니다.

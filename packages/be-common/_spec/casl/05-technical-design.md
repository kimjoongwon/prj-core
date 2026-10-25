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

### 조건 템플릿과 사용자 식별자

`CaslAbilityFactory`는 `${user.id}` 형식의 허용된 변수만 치환합니다. `{{ user.id }}` 문법은 지원하지 않습니다.

| 변수 | 값의 출처 | 런타임 타입 | 소비 용도 |
|---|---|---|---|
| `${user.id}` | `ContextUserSnapshot.id` | `string` (공개 ULID) | 공개 사용자 ID 조건 |
| `${user.seq}` | 현재 `ContextTenantSnapshot.userSeq` | `bigint` (내부 FK) | `Reservation.userSeq` 조건 |

본인 예약의 READ·UPDATE 조건은 `{ "userSeq": "${user.seq}" }`입니다. 문자열 전체가 변수 하나이면 원래 타입을 유지하므로 큰 내부 ID에도 정밀도 손실이 없습니다. 문자열의 일부로 포함한 변수는 문자열로 치환됩니다. 내부 FK 조건에는 변수 하나만 사용합니다.

조건이 `null` 또는 `undefined`인 경우에만 조건 없는 규칙으로 취급합니다. 객체가 아닌 조건, 미허용 변수, 누락된 컨텍스트, 잘못된 템플릿 또는 양의 signed-BIGINT 범위를 벗어나는 `user.seq`는 오류입니다. 허용·거부 중 어느 규칙에서든 오류가 발생하면 사용자 Ability 전체를 빈 규칙으로 반환합니다. 조건 오류를 무시하여 허용하거나, 거부 규칙만 제거해 접근 범위를 넓히지 않습니다.

### 객체 조건 검사 경계

CASL의 문자열 subject 검사는 대상 종류에 허용 가능한 규칙이 있는지 확인합니다. 소유자 조건은 `ability.can("READ", subject("entity:Reservation", reservation))`처럼 `userSeq`가 있는 실제 객체로 검사해야 합니다. `AppAbility`는 문자열 subject와 `subject()`가 반환하는 객체를 모두 받습니다. `ManageEntityPolicy`는 문자열 subject만 전달하므로 행별 소유자 검사를 대신할 수 없습니다.

현재 예약 Controller와 UseCase는 CASL 객체 검사를 호출하지 않습니다. 내 예약 조회·생성은 인증 컨텍스트의 공개 `userId`와 현재 `spaceId`를 Aggregate/Repository에 전달하여 범위를 제한합니다. 예약 객체에 CASL 조건을 적용하는 기능을 추가할 때는 UseCase owner가 조회한 객체의 내부 `userSeq`를 전달해야 합니다.

공식 근거: [CASL 조건 안내](https://casl.js.org/v6/en/guide/conditions-in-depth/), [subject 판별 안내](https://casl.js.org/v6/en/guide/subject-type-detection/), [CASL Rule.matchesConditions 구현](https://github.com/stalniy/casl/blob/main/packages/casl-ability/src/Rule.ts).

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

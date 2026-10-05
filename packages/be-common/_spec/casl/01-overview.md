# 01. CASL 권한 구조 개요

이 문서는 현재 권한 모델의 이름과 책임을 설명합니다.

## 한눈에 보기

사용자는 Space 안에서 `Tenant`로 참여하며, Tenant 하나는 Role 하나를 가집니다.
Role은 Policy를 직접 품지 않고 `RoleAssignment`를 통해 할당받습니다.
Policy는 `PolicyEntry` 목록으로 Ability를 구성합니다.

```text
User
└─ tenants[]
   └─ Tenant
      └─ role
         └─ assignments[]
            └─ RoleAssignment
               └─ policy
                  └─ entries[]
                     └─ PolicyEntry
                        └─ ability
                           ├─ action
                           └─ subject
```

코드에서 전체 관계를 읽는 경로는 다음과 같습니다.

```ts
tenant.role.assignments[0].policy.entries[0].ability
```

## 모델별 책임

| 모델 | 데이터 타입 | 책임 |
|---|---|---|
| `Tenant` | `MASTER` | User가 특정 Space에서 맡는 Role을 결정합니다. |
| `Role` | `REFERENCE` | 여러 Tenant가 공유하는 역할 이름과 분류를 제공합니다. |
| `RoleAssignment` | `CONFIGURATION` | Role에 Policy를 할당하고 활성 상태와 우선순위를 관리합니다. |
| `Policy` | `CONFIGURATION` | 한 Space에서 적용할 권한 규칙 묶음을 관리합니다. |
| `PolicyEntry` | `CONFIGURATION` | Policy 안에 포함되는 Ability 항목을 나타냅니다. |
| `Ability` | `REFERENCE` | Action과 Subject, 조건, 필드 제한을 묶은 재사용 가능한 권한 정의입니다. |
| `Action` | `REFERENCE` | `read`, `create`처럼 수행할 행동을 정의합니다. |
| `Subject` | `REFERENCE` | 엔티티, 메뉴, 기능처럼 행동의 대상을 정의합니다. |

`RoleAssignment`은 “Role에 무엇을 할당했는가”를 나타냅니다.
`PolicyEntry`는 “Policy 안에 어떤 항목이 들어 있는가”를 나타냅니다.
사용자에게 Role을 부여하는 별도 관계 모델은 두지 않으며 `Tenant.roleId`가 그 책임을 가집니다.

## 런타임 권한 계산

CASL 권한을 만들 때는 현재 Space의 Tenant만 사용합니다.

1. 현재 Space에 속한 Tenant와 Role을 찾습니다.
2. 삭제되지 않고 활성화된 `RoleAssignment`만 조회합니다.
3. 현재 Space의 삭제되지 않은 Policy만 사용합니다.
4. 삭제되지 않은 `PolicyEntry`와 Ability를 생성 순서로 읽습니다.
5. Ability의 Action, Subject, 조건과 필드 제한을 CASL rule로 바꿉니다.
6. 같은 Action·Subject 규칙이 겹치면 Assignment의 우선순위를 적용합니다.

관리 화면은 비활성 Assignment도 `isActive`와 함께 보여 주지만, 실제 CASL 계산에서는 제외합니다.

## 주요 소스

| 레이어 | 파일 |
|---|---|
| Prisma | `packages/be-prisma/schema/role-assignment.prisma` |
| Prisma | `packages/be-prisma/schema/policy-entry.prisma` |
| Repository | `packages/be-repository/src/role-assignments.repository.ts` |
| Repository | `packages/be-repository/src/policy-entries.repository.ts` |
| Aggregate | `packages/be-aggregate/src/policy/role-assignment.aggregate.ts` |
| Aggregate | `packages/be-aggregate/src/policy/policy.aggregate.ts` |
| CASL | `packages/be-common/src/casl/casl-ability.factory.ts` |

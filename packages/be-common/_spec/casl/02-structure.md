# 02. CASL API와 조회 구조

## 관리 API

### Role의 Policy 할당 조회

```http
GET /api/v1/roles/:roleId/assignments
```

현재 Space의 삭제되지 않은 Policy에 연결된 Assignment를 반환합니다.
편집 화면에서 비활성 상태도 확인할 수 있도록 `isActive=false`인 항목도 포함합니다.

### Role의 Policy 할당 전체 동기화

```http
PUT /api/v1/roles/:roleId/assignments
Content-Type: application/json

{
  "assignments": [
    {
      "policyId": "policy-uuid",
      "isActive": true,
      "priority": 10
    }
  ]
}
```

- 요청에 빠진 기존 Assignment는 soft-delete 합니다.
- 같은 `policyId`가 반복되면 마지막 입력을 사용합니다.
- 다른 Space의 Policy는 할당할 수 없습니다.
- 기존 soft-delete Assignment를 다시 보내면 새 row를 만들지 않고 복원합니다.

### Policy의 Ability 항목 전체 동기화

```http
PUT /api/v1/policies/:policyId/entries
Content-Type: application/json

{
  "entries": [
    {
      "abilityId": "ability-uuid"
    }
  ]
}
```

- 요청에 빠진 기존 Entry는 soft-delete 합니다.
- 같은 `abilityId`가 반복되면 Entry 하나만 유지합니다.
- 존재하지 않는 Ability는 추가할 수 없습니다.
- 응답은 삭제되지 않은 Entry와 Ability를 생성 순서로 반환합니다.

## 사용자 조회 API

```http
GET /api/v1/users/:userId
```

사용자 기본 정보와 Tenant 요약을 반환합니다. 권한 그래프 전체를 반복해서 싣지 않습니다.

```http
GET /api/v1/users/:userId/tenants/:tenantId
```

현재 접근 가능한 Space에서 해당 User가 소유한 Tenant만 조회합니다. 응답의 핵심 구조는 다음과 같습니다.

```text
tenant
├─ space
│  └─ fitnessCenter
│     └─ company
└─ role
   └─ assignments[]
      └─ policy
         └─ entries[]
            └─ ability
               ├─ action
               └─ subject
```

URL의 `userId`, `tenantId`, 현재 `spaceId` 중 하나라도 실제 관계와 다르면 Tenant 상세을 반환하지 않습니다.

## 캐시 무효화

- Role Assignment 저장 후 해당 Role Assignment 조회와 User Tenant 상세 조회를 무효화합니다.
- Policy Entry 저장 후 Policy 상세, 관련 Role Assignment 조회와 User Tenant 상세 조회를 무효화합니다.
- 사용자 요약 응답에는 전체 권한 그래프가 없으므로 Role·Policy 편집 때 불필요하게 큰 사용자 목록을 다시 받지 않습니다.

# 03. 권한 관리 상호작용

## Role Assignment 편집

관리자는 Role 상세에서 현재 Policy 할당을 확인하고 편집합니다.

1. `getRoleById`로 Role 기본 정보를 조회합니다.
2. `getPolicies`로 현재 Space의 Policy 후보를 조회합니다.
3. `getRoleAssignments`로 활성·비활성 Assignment를 조회합니다.
4. Policy 선택 여부, 활성 상태와 우선순위를 로컬 상태에서 편집합니다.
5. 저장하면 `syncRoleAssignments`가 전체 목록을 동기화합니다.
6. 성공 후 Role Assignment와 User Tenant 상세 query를 무효화합니다.

Assignment 편집 가능 여부는 서버의 인가 정책과 공간 범위를 최종 기준으로 판단합니다.

## Policy Entry 편집

관리자는 Policy 생성·수정 화면에서 포함할 Ability를 선택합니다.

1. `getAbilities`로 Ability 후보를 조회합니다.
2. Policy 상세의 `entries[].abilityId`를 선택 상태로 바꿉니다.
3. 저장하면 `syncPolicyEntries`에 `entries` 배열을 보냅니다.
4. 성공 후 Policy 상세, 관련 Role Assignment와 User Tenant 상세 query를 무효화합니다.

```json
{
  "entries": [
    {
      "abilityId": "ability-uuid"
    }
  ]
}
```

## 사용자 권한 확인

사용자 상세은 기본 정보와 Tenant 요약을 보여 줍니다. 특정 Tenant의 권한을 확인할 때만 다음 API를 사용합니다.

```http
GET /api/v1/users/:userId/tenants/:tenantId
```

서버는 URL의 User와 Tenant 관계, 현재 접근 가능한 Space를 모두 확인합니다. 성공하면 `space.fitnessCenter.company`와 `role.assignments[].policy.entries[].ability`를 반환합니다.

## 실패 처리

| 상황 | 서버 처리 | 화면 처리 |
|---|---|---|
| Role이 없음 | 404 | 상세 없음 상태 |
| Policy가 다른 Space에 속함 | 400 | 저장 실패 안내 후 편집 상태 유지 |
| Ability가 없음 | 400 | 저장 실패 안내 후 목록 재조회 |
| User·Tenant·Space 관계 불일치 | 404 | Tenant 상세을 표시하지 않음 |
| 인증되지 않음 | 401 | 로그인 흐름으로 이동 |

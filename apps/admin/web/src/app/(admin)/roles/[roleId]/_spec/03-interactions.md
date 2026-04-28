# 03-interactions: 역할 상세

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Policy 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-002: 역할 상세 화면 (`/roles/[roleId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-008 | 수정 버튼 클릭 | 페이지 헤더 영역 actions 영역 버튼 클릭 | 수정 화면으로 이동 (`/roles/[roleId]/edit`) | `can('update', 'role')`, isSystem=false |
| ROL-L5-ACT-009 | 삭제 버튼 클릭 | 페이지 헤더 영역 actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'role')`, isSystem=false |
| ROL-L5-ACT-010 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/roles/:id 호출 | - |
| ROL-L5-ACT-011 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-012 | Policy 체크박스 토글 | Policy 할당 목록에서 체크박스 클릭 | 해당 Policy의 할당/해제 상태 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-013 | RolePolicy isActive 토글 | 할당된 Policy의 활성화 Switch 클릭 | isActive 상태 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-014 | RolePolicy priority 변경 | priority NumberInput 값 변경 | priority 값 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-015 | Policy 목록 확인 | Policy 할당 영역 표시 | 현재 Space의 Policy 목록 확인 | - |
| ROL-L5-ACT-016 | Policy 선택 변경 | Policy 할당 영역 선택 변경 | 로컬 assignment 변경 | - |
| ROL-L5-ACT-017 | 일괄 저장 버튼 클릭 | Policy 할당 영역 "저장" 버튼 클릭 | 저장 확인 모달 표시 | 변경사항이 1건 이상 |
| ROL-L5-ACT-018 | 일괄 저장 확인 | 모달에서 저장 버튼 클릭 | PUT /api/v1/policy-assignments/roles/:roleId 호출 | - |
| ROL-L5-ACT-019 | 일괄 저장 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-020 | Policy 이름 클릭 | Policy row에서 이름 클릭 | Policy 상세 화면으로 이동 (`/policies/[policyId]`) | - |
| ROL-L5-ACT-021 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 역할 목록 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles/:id + GET /api/v1/policies + GET /api/v1/policy-assignments/roles/:roleId 병렬 호출 → 상세 + RolePolicy 할당 표시 | 에러 메시지 (404: "역할을 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 → 성공 토스트 → 역할 목록으로 이동 | 에러 토스트 (400: "시스템 역할은 삭제할 수 없습니다" / "연결된 사용자가 있어 삭제할 수 없습니다") |
| RolePolicy 변경 (체크/활성화/우선순위) | 로컬 상태 업데이트 → 변경사항 카운트 표시 | - |
| 일괄 저장 확인 | PUT 호출 → 성공 토스트 → RolePolicy 목록 재조회 | 에러 토스트 |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET roles/:id + policies + policy-assignments/roles/:roleId (병렬)
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |                +-- 수정 버튼 --> [수정 화면 이동]
    |                +-- 삭제 버튼 --> [삭제 확인 모달]
    |                |                    |
    |                |                    +-- 확인 --> [삭제 처리] --> 성공 --> [목록 이동]
    |                |                    +-- 취소 --> [데이터 표시]
    |                |
    |                +-- RolePolicy 변경 --> [변경사항 추적]
    |                |                    |
    |                |                    +-- 일괄 저장 --> [저장 확인 모달]
    |                |                    |                    |
    |                |                    |                    +-- 확인 --> [저장 처리] --> 성공 --> [RolePolicy 재조회]
    |                |                    |                    +-- 취소 --> [변경사항 추적]
    |                |                    |
    |                |                    +-- 필터 변경 --> [필터링된 목록 표시]
    |
    +-- 실패 --> [에러 상태] --> 재시도 또는 목록 이동
```

---

## 모달 정의

### 삭제 확인 모달 (역할)

```
+------------------------------------+
|         삭제 확인                    |
+------------------------------------+
|                                     |
|  정말로 삭제하시겠습니까?            |
|  이 작업은 되돌릴 수 없습니다.       |
|                                     |
+------------------------------------+
|    [취소]           [삭제]          |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "삭제 확인" |
| 본문 | "정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다." |
| 추가 경고 (Role) | 연결된 사용자가 있을 경우: "연결된 사용자가 있어 삭제할 수 없습니다." (삭제 버튼 비활성화) |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

### RolePolicy 일괄 저장 확인 모달

```
+------------------------------------+
|         권한 할당 저장               |
+------------------------------------+
|                                     |
|  다음과 같이 권한 할당을 변경합니다:  |
|                                     |
|  - 추가: N건                        |
|  - 해제: N건                        |
|  - 수정: N건                        |
|                                     |
|  계속 진행하시겠습니까?              |
|                                     |
+------------------------------------+
|    [취소]           [저장]          |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "권한 할당 저장" |
| 본문 | 변경사항 요약 (추가/해제/수정 건수) |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 저장 버튼 | PUT API 호출 (color="primary") |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-002: 역할 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-002 |
| **Method** | GET |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `getRoleById` |
| **설명** | ID로 역할을 상세 조회합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` |
| **에러** | 401, 403, 404 (역할 없음), 500 |

---

### ROL-L6-API-005: 역할 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-005 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `deleteRole` |
| **설명** | 역할을 소프트 삭제합니다. 시스템 역할 및 연결된 사용자가 있는 역할은 삭제 불가. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` (삭제된 역할 정보) |
| **에러** | 400 (시스템 역할 / 연결된 사용자 존재), 401, 403, 404, 500 |

---

### ROL-L6-API-006: 내 권한 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-006 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities/my` |
| **Operation ID** | `getMyAbilities` |
| **설명** | 현재 Space의 RolePolicy + UserPolicy를 PolicyAbility로 펼친 뒤 병합하여 조회합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Response** | `AbilityResponseDto[]` |
| **에러** | 400 (Role 없음), 401 (미인증), 500 |

---

### ROL-L6-API-007: RolePolicy 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-007 |
| **Method** | GET |
| **Endpoint** | `/api/v1/policy-assignments/roles/:roleId` |
| **Operation ID** | `getRolePolicies` |
| **설명** | 특정 Role에 할당된 현재 Space의 Policy assignment 목록을 조회합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Path Params** | `roleId` (UUID) - Role ID |
| **Response** | `PolicyAssignmentResponseDto[]` |
| **에러** | 401, 500 |

**Response Body 구조** (`PolicyAssignmentResponseDto`):

```json
{
  "id": "uuid",
  "actionId": "uuid",
  "action": {
    "id": "uuid",
    "name": "read",
    "displayName": "읽기",
    "group": "crud"
  },
  "subjectId": "uuid",
  "subject": {
    "id": "uuid",
    "name": "entity:User",
    "displayName": "이용자",
    "group": "entity"
  },
  "fields": ["email", "name"],
  "conditions": { "departmentId": "${user.departmentId}" },
  "inverted": false,
  "reason": null,
  "name": "Read User",
  "description": "사용자 정보 조회 권한",
  "createdAt": "2026-01-20T14:30:00.000Z",
  "updatedAt": null
}
```

---

### ROL-L6-API-020: Ability 전체 목록 조회 (신규)

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-020 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities` |
| **Operation ID** | `getAbilities` |
| **설명** | 전체 Ability 목록을 조회합니다. 권한 정의 목록 화면에서 사용합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Status** | **신규 구현 필요** |

**Query Params**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| skip | number | - | 건너뛸 항목 수 (offset) |
| take | number | - | 조회할 항목 수 (기본: 20) |
| subjectId | string (UUID) | - | Subject 필터 |
| actionId | string (UUID) | - | Action 필터 |
| inverted | boolean | - | 허용/거부 필터 |
| name | string | - | 이름 검색 (부분 일치) |

**Response**:

```json
{
  "httpStatus": 200,
  "message": "권한 정의 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "Read User",
      "description": "사용자 조회 권한",
      "actionId": "uuid",
      "action": { "id": "uuid", "name": "read", "displayName": "읽기", "group": "crud" },
      "subjectId": "uuid",
      "subject": { "id": "uuid", "name": "entity:User", "displayName": "이용자", "group": "entity" },
      "fields": [],
      "conditions": null,
      "inverted": false,
      "reason": null,
      "createdAt": "2026-01-20T14:30:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "skip": 0,
    "take": 20
  }
}
```

**에러**: 401, 403, 500

---

### ROL-L6-API-021: RolePolicy 전체 동기화

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-021 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/policy-assignments/roles/:roleId` |
| **Operation ID** | `syncRolePolicies` |
| **설명** | 특정 Role에 대한 Policy assignment를 전체 동기화합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `roleId` (UUID) - Role ID |
| **Status** | **신규 구현 필요** |

**Request Body**:

```json
{
  "rolePolicies": [
    {
      "policyId": "uuid-1",
      "isActive": true,
      "priority": 0
    },
    {
      "policyId": "uuid-2",
      "isActive": true,
      "priority": 5
    },
    {
      "policyId": "uuid-3",
      "isActive": false,
      "priority": 0
    }
  ]
}
```

**동작 설명**:
- 요청에 포함된 policyId 목록과 현재 RolePolicy 목록을 비교
- **추가**: 요청에 있고 현재 RolePolicy에 없는 항목 → 새 RolePolicy 생성
- **유지/수정**: 요청에 있고 현재 RolePolicy에도 있는 항목 → isActive, priority 업데이트
- **해제**: 현재 RolePolicy에 있지만 요청에 없는 항목 → RolePolicy 삭제 (소프트 삭제)

**Response**:

```json
{
  "httpStatus": 200,
  "message": "정책 할당이 저장되었습니다",
  "data": []
}
```

**에러**: 400 (유효성 오류), 401, 403, 404 (Role 없음), 500

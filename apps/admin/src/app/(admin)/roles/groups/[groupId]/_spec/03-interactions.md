# 03-interactions: 역할 그룹 상세

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 12개 기능
  - 역할 그룹: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
  - 역할 카테고리: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
- **L4 Screens**: 8개 화면
  - 역할 그룹: 목록/상세/등록/수정 (4개)
  - 역할 카테고리: 목록/상세/등록/수정 (4개)

---

## L5: 인터랙션 정의

### RGC-L4-SCR-002: 역할 그룹 상세 화면 (`/roles/groups/[groupId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-005 | 수정 버튼 클릭 | PageSurface actions 영역 "수정" 버튼 클릭 | 수정 화면으로 이동 (`/roles/groups/[groupId]/edit`) | `can('update', 'group')` |
| RGC-L5-ACT-006 | 삭제 버튼 클릭 | PageSurface actions 영역 "삭제" 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'group')` |
| RGC-L5-ACT-007 | 삭제 확인 | 모달에서 "삭제" 버튼 클릭 | DELETE /api/v1/groups/:id 호출 | - |
| RGC-L5-ACT-008 | 삭제 취소 | 모달에서 "취소" 버튼 클릭 | 모달 닫기 | - |
| RGC-L5-ACT-009 | 소속 역할 클릭 | 소속 역할 목록에서 역할명 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |
| RGC-L5-ACT-010 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 그룹 목록 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/groups/:id 호출 -> 상세 정보 + 소속 역할 목록 표시 | 에러 메시지 (404: "역할 그룹을 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 -> "역할 그룹이 삭제되었습니다" 성공 토스트 -> 그룹 목록으로 이동 | 에러 토스트 |
| 삭제 취소 | 모달 닫기 | - |

#### 삭제 모달 분기

```
삭제 버튼 클릭
    |
    v
소속 역할 수 확인 (클라이언트에서 상세 데이터 기반 판단)
    |
    +-- 0개 --> [기본 삭제 확인 모달]
    |               "정말로 삭제하시겠습니까?"
    |
    +-- N개 --> [경고 삭제 확인 모달]
                "이 그룹에 N개의 역할이 소속되어 있습니다.
                 삭제하면 연결이 해제됩니다."
```

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/groups/:id
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |                +-- 수정 버튼 --> [수정 화면 이동]
    |                +-- 삭제 버튼 --> [삭제 확인 모달]
    |                |                    |
    |                |                    +-- 확인 --> [삭제 처리] --> 성공 --> [목록 이동]
    |                |                    +-- 취소 --> [데이터 표시]
    |                |
    |                +-- 역할 클릭 --> [역할 상세 이동]
    |
    +-- 실패 --> [에러 상태] --> 목록 이동
```

---

## L6: API 엔드포인트 정의

### 신규 API (이 기획에서 구현 필요)

Group과 Category는 범용 모델이므로 `/api/v1/groups`, `/api/v1/categories`로 범용 엔드포인트를 구현합니다. 프론트엔드에서 `type=Role` 쿼리 파라미터로 필터링하여 사용합니다.

---

#### RGC-L6-API-001: 그룹 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-001 |
| **Method** | GET |
| **Endpoint** | `/api/v1/groups` |
| **Operation ID** | `getGroups` |
| **설명** | 그룹 목록을 조회합니다. type 쿼리 파라미터로 그룹 유형별 필터링 가능. 소속 연결 수(_count) 포함. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Query Parameters** (`QueryGroupDto`):

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| name | string | - | 이름 부분 일치 검색 (containsFilter) |
| type | GroupTypes | - | 그룹 유형 필터 (Role, User, Space, File) |
| skip | number | - | 건너뛸 항목 수 (페이지네이션) |
| take | number | - | 조회할 항목 수 (페이지네이션) |

**Response** (`GroupDto[]` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "TRUSTED",
      "type": "Role",
      "label": "신뢰",
      "spaceId": "uuid",
      "creatorId": "uuid",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleAssociations": 2
      }
    }
  ]
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 500 | 서버 에러 |

**프론트엔드 호출 예시**: `GET /api/v1/groups?type=Role`

---

#### RGC-L6-API-002: 그룹 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-002 |
| **Method** | GET |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `getGroupById` |
| **설명** | ID로 그룹을 상세 조회합니다. roleAssociations(소속 역할) 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 상세 조회 성공",
  "data": {
    "id": "uuid",
    "name": "TRUSTED",
    "type": "Role",
    "label": "신뢰",
    "spaceId": "uuid",
    "creatorId": "uuid",
    "space": { "id": "uuid", "name": "System" },
    "roleAssociations": [
      {
        "id": "uuid",
        "roleId": "uuid",
        "groupId": "uuid",
        "role": {
          "id": "uuid",
          "name": "FULL_ACCESS",
          "displayName": "전체 접근",
          "isSystem": true
        }
      },
      {
        "id": "uuid",
        "roleId": "uuid",
        "groupId": "uuid",
        "role": {
          "id": "uuid",
          "name": "MANAGE",
          "displayName": "관리",
          "isSystem": true
        }
      }
    ],
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-003: 그룹 생성

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-003 |
| **Method** | POST |
| **Endpoint** | `/api/v1/groups` |
| **Operation ID** | `createGroup` |
| **설명** | 새로운 그룹을 생성합니다. type과 spaceId는 프론트엔드에서 전달합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |

**Request Body** (`CreateGroupDto`):

```json
{
  "name": "VIP",
  "type": "Role",
  "label": "VIP 전용",
  "spaceId": "uuid",
  "tenantId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 그룹 이름 (영문 대문자 + 언더스코어) |
| type | GroupTypes | O | 그룹 유형 (프론트엔드에서 'Role' 고정) |
| label | string | - | 한글 표시명 |
| spaceId | UUID | O | Space ID (현재 Space 자동 설정) |
| tenantId | UUID | O | Tenant ID (현재 Tenant 자동 설정) |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 201,
  "message": "그룹 생성 성공",
  "data": {
    "id": "uuid",
    "name": "VIP",
    "type": "Role",
    "label": "VIP 전용",
    "spaceId": "uuid",
    "createdAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (name 형식, 필수 필드 누락) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 이름 중복 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-004: 그룹 수정

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-004 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `updateGroup` |
| **설명** | 그룹 정보를 수정합니다. 부분 수정(Partial Update) 지원. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Request Body** (`UpdateGroupDto` - Partial):

```json
{
  "label": "수정된 라벨"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | - | 그룹 이름 (프론트엔드에서 readonly, 전송하지 않음) |
| label | string | - | 한글 표시명 |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 수정 성공",
  "data": {
    "id": "uuid",
    "name": "TRUSTED",
    "type": "Role",
    "label": "수정된 라벨",
    "spaceId": "uuid",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-005: 그룹 삭제

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-005 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `deleteGroup` |
| **설명** | 그룹을 소프트 삭제합니다. 소속 역할의 RoleAssociation도 함께 해제(삭제)됩니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 삭제 성공",
  "data": {
    "id": "uuid",
    "name": "VIP",
    "type": "Role",
    "removedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-006: 카테고리 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-006 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories` |
| **Operation ID** | `getCategories` |
| **설명** | 카테고리 목록을 조회합니다. type 쿼리 파라미터로 카테고리 유형별 필터링 가능. 부모 카테고리, 연결 수(_count) 포함. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Query Parameters** (`QueryCategoryDto`):

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| name | string | - | 이름 부분 일치 검색 (containsFilter) |
| type | CategoryTypes | - | 카테고리 유형 필터 (Role, User, Space, File) |
| parentId | UUID | - | 상위 카테고리 ID 정확 매칭 |
| spaceId | UUID | - | Space ID 정확 매칭 |
| skip | number | - | 건너뛸 항목 수 (페이지네이션) |
| take | number | - | 조회할 항목 수 (페이지네이션) |

**Response** (`CategoryDto[]` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "PLATFORM",
      "type": "Role",
      "parentId": null,
      "spaceId": "uuid",
      "creatorId": "uuid",
      "parent": null,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 0
      }
    },
    {
      "id": "uuid",
      "name": "WORKSPACE",
      "type": "Role",
      "parentId": null,
      "spaceId": "uuid",
      "parent": null,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 2
      }
    },
    {
      "id": "uuid",
      "name": "PUBLIC",
      "type": "Role",
      "parentId": "uuid (WORKSPACE)",
      "spaceId": "uuid",
      "parent": { "id": "uuid", "name": "WORKSPACE" },
      "createdAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 0
      }
    }
  ]
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 500 | 서버 에러 |

**프론트엔드 호출 예시**: `GET /api/v1/categories?type=Role`

---

#### RGC-L6-API-007: 카테고리 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-007 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `getCategoryById` |
| **설명** | ID로 카테고리를 상세 조회합니다. roleClassifications(분류된 역할), children(하위 카테고리), parent(부모 카테고리) 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 상세 조회 성공",
  "data": {
    "id": "uuid",
    "name": "WORKSPACE",
    "type": "Role",
    "parentId": null,
    "spaceId": "uuid",
    "creatorId": "uuid",
    "parent": null,
    "space": { "id": "uuid", "name": "System" },
    "children": [
      {
        "id": "uuid",
        "name": "PUBLIC",
        "type": "Role",
        "parentId": "uuid",
        "_count": { "roleClassifications": 1 }
      },
      {
        "id": "uuid",
        "name": "PROJECT",
        "type": "Role",
        "parentId": "uuid",
        "_count": { "roleClassifications": 0 }
      }
    ],
    "roleClassifications": [
      {
        "id": "uuid",
        "roleId": "uuid",
        "categoryId": "uuid",
        "role": {
          "id": "uuid",
          "name": "MANAGE",
          "displayName": "관리",
          "isSystem": true
        }
      }
    ],
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-008: 카테고리 생성

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-008 |
| **Method** | POST |
| **Endpoint** | `/api/v1/categories` |
| **Operation ID** | `createCategory` |
| **설명** | 새로운 카테고리를 생성합니다. type과 spaceId는 프론트엔드에서 전달합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |

**Request Body** (`CreateCategoryDto`):

```json
{
  "name": "ANALYTICS",
  "type": "Role",
  "parentId": null,
  "spaceId": "uuid",
  "tenantId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 카테고리 이름 (영문 대문자 + 언더스코어, unique) |
| type | CategoryTypes | O | 카테고리 유형 (프론트엔드에서 'Role' 고정) |
| parentId | UUID | - | 상위 카테고리 ID (null이면 최상위) |
| spaceId | UUID | O | Space ID (현재 Space 자동 설정) |
| tenantId | UUID | O | Tenant ID (현재 Tenant 자동 설정) |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 201,
  "message": "카테고리 생성 성공",
  "data": {
    "id": "uuid",
    "name": "ANALYTICS",
    "type": "Role",
    "parentId": null,
    "spaceId": "uuid",
    "createdAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (name 형식, 필수 필드 누락) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 이름 중복 (Category name은 @unique) |
| 500 | 서버 에러 |

---

#### RGC-L6-API-009: 카테고리 수정

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-009 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `updateCategory` |
| **설명** | 카테고리 정보를 수정합니다. 부분 수정(Partial Update) 지원. parentId 변경 시 순환 참조를 서버에서 검증합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Request Body** (`UpdateCategoryDto` - Partial):

```json
{
  "parentId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | - | 카테고리 이름 (프론트엔드에서 readonly, 전송하지 않음) |
| parentId | UUID | - | 상위 카테고리 ID (null이면 최상위로 변경) |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 수정 성공",
  "data": {
    "id": "uuid",
    "name": "PUBLIC",
    "type": "Role",
    "parentId": "uuid (새 부모)",
    "spaceId": "uuid",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (순환 참조, 자기 자신 선택 등) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-010: 카테고리 삭제

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-010 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `deleteCategory` |
| **설명** | 카테고리를 소프트 삭제합니다. 하위 카테고리가 있으면 서버에서 삭제를 거부합니다. 분류된 역할의 RoleClassification은 함께 해제(삭제)됩니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 삭제 성공",
  "data": {
    "id": "uuid",
    "name": "ANALYTICS",
    "type": "Role",
    "removedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 하위 카테고리 존재 ("하위 카테고리를 먼저 삭제하거나 이동해주세요.") |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

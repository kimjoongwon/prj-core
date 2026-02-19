# 03-interactions: 역할 목록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-001: 역할 목록 화면 (`/roles`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-001 | 검색어 입력 | 검색창 입력 후 Enter 또는 디바운스 | 역할 목록 필터링 (클라이언트 사이드) | - |
| ROL-L5-ACT-002 | 카테고리 필터 선택 | 카테고리 Select 변경 | 선택된 카테고리의 역할만 필터링 | - |
| ROL-L5-ACT-003 | 그룹 필터 선택 | 그룹 Select 변경 | 선택된 그룹의 역할만 필터링 | - |
| ROL-L5-ACT-004 | 시스템 여부 필터 | 시스템 여부 Select 변경 | 시스템/커스텀 역할 필터링 | - |
| ROL-L5-ACT-005 | 역할 행 클릭 | DataGrid 행 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |
| ROL-L5-ACT-006 | 역할 등록 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 역할 등록 화면으로 이동 (`/roles/new`) | `can('create', 'role')` |
| ROL-L5-ACT-007 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, displayName, createdAt 기준 오름차순/내림차순 전환 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles 호출 → 목록 표시 | 에러 메시지 + 재시도 버튼 |
| 검색/필터 변경 | 클라이언트 사이드 필터링 (전체 목록은 이미 로드됨) | - |
| 역할 행 클릭 | `/roles/[roleId]`로 라우팅 | - |
| 역할 등록 버튼 | `/roles/new`로 라우팅 | - |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/roles
    |
    +-- 성공 --> [데이터 표시] <--> [검색/필터/정렬]
    |                |
    |                +-- 행 클릭 --> [상세 화면 이동]
    |                +-- 등록 버튼 --> [등록 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼 --> [로딩 상태]
```

---

## L6: API 엔드포인트 정의

### ROL-L6-API-001: 역할 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-001 |
| **Method** | GET |
| **Endpoint** | `/api/v1/roles` |
| **Operation ID** | `getRoles` |
| **설명** | 모든 역할 목록을 조회합니다. Group/Category 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Request** | 없음 (전체 목록 반환) |
| **Response** | `RoleDto[]` |
| **에러** | 401 (인증 실패), 403 (권한 없음), 500 (서버 에러) |

**Response Body 구조** (`RoleDto`):

```json
{
  "httpStatus": 200,
  "message": "역할 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "FULL_ACCESS",
      "displayName": "전체 접근",
      "description": "시스템의 모든 기능에 접근 가능합니다",
      "isSystem": true,
      "classification": {
        "id": "uuid",
        "roleId": "uuid",
        "categoryId": "uuid",
        "category": { "id": "uuid", "name": "PLATFORM" }
      },
      "associations": [
        {
          "id": "uuid",
          "roleId": "uuid",
          "groupId": "uuid",
          "group": { "id": "uuid", "name": "TRUSTED" }
        }
      ],
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

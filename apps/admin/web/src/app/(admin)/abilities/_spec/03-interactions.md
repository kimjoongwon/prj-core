# 03-interactions: 권한 정의 목록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-005: 권한 정의 목록 화면 (`/abilities`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-035 | 검색어 입력 | 이름 검색창 입력 | 이름/설명 기준 필터링 | - |
| ROL-L5-ACT-036 | Subject 필터 선택 | Subject Select 변경 | 선택된 Subject의 Ability만 필터링 | - |
| ROL-L5-ACT-037 | Action 필터 선택 | Action Select 변경 | 선택된 Action의 Ability만 필터링 | - |
| ROL-L5-ACT-038 | 유형 필터 선택 | 허용/거부 Select 변경 | inverted 기준 필터링 | - |
| ROL-L5-ACT-039 | Ability 행 클릭 | DataGrid 행 클릭 | Ability 상세 화면으로 이동 | - |
| ROL-L5-ACT-040 | 권한 정의 등록 버튼 | 페이지 헤더 영역 actions 영역 버튼 클릭 | 등록 화면으로 이동 (`/abilities/new`) | `can('create', 'ability')` |
| ROL-L5-ACT-041 | 페이지 변경 | 페이지네이션 버튼 클릭 | 해당 페이지 데이터 로드 | - |
| ROL-L5-ACT-042 | 페이지 크기 변경 | 페이지 크기 Select 변경 (10/20/50) | 페이지 크기 변경 후 1페이지로 이동 | - |
| ROL-L5-ACT-043 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, createdAt 기준 정렬 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities 호출 → 목록 표시 | 에러 메시지 + 재시도 |
| 필터 선택 (Subject) | GET /api/v1/subjects 사전 로드 → Select 옵션 표시 | - |
| 필터 선택 (Action) | GET /api/v1/actions 사전 로드 → Select 옵션 표시 | - |
| 검색/필터 변경 | 클라이언트 사이드 필터링 또는 서버 재요청 | - |
| 페이지/크기 변경 | 서버 재요청 → 목록 갱신 | 에러 토스트 |

**참고**: 현재 Ability 전체 목록 조회 API가 없음. 신규 API 필요 (GET /api/v1/abilities, 쿼리 파라미터로 필터링/페이지네이션 지원).

---

## L6: API 엔드포인트 정의

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

### ROL-L6-API-012: Action 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-012 |
| **Method** | GET |
| **Endpoint** | `/api/v1/actions` |
| **Operation ID** | `getActions` |
| **설명** | 모든 Action 목록을 조회합니다. group 쿼리 파라미터로 그룹별 필터링 가능. |
| **인증** | 불필요 (`@Public()`) |
| **Query Params** | `group` (string, optional) - crud / visibility / workflow |
| **Response** | `ActionDto[]` (목록 조회 시 config, description, order, isSystem 제외) |
| **에러** | 500 |

---

### ROL-L6-API-017: Subject 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-017 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects` |
| **Operation ID** | `getSubjects` |
| **설명** | 모든 Subject 목록을 조회합니다. group 쿼리 파라미터로 필터링 가능. |
| **인증** | 불필요 (`@Public()`) |
| **Query Params** | `group` (string, optional) - entity / menu / feature / ui |
| **Response** | `SubjectDto[]` |
| **에러** | 500 |

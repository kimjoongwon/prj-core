# 03-interactions: 권한 정의 등록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-007: 권한 정의 등록 화면 (`/abilities/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-049 | name 입력 | 이름 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-050 | description 입력 | 설명 Textarea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-051 | Subject 선택 | Subject Select(검색 가능) 변경 | 선택값 업데이트 + DMMF 필드 자동 조회 | - |
| ROL-L5-ACT-052 | Action 선택 | Action Select(검색 가능) 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-053 | fields 선택 | 필드 TagInput에서 항목 추가/제거 | fields 배열 업데이트 | Subject가 entity 그룹인 경우만 활성화 |
| ROL-L5-ACT-054 | conditions 입력 | JSON 에디터에 조건 입력 | conditions JSON 업데이트 + 실시간 JSON 유효성 검사 | - |
| ROL-L5-ACT-055 | inverted 토글 | 거부 여부 Switch 토글 | inverted 상태 변경 → true이면 reason 필드 활성화 | - |
| ROL-L5-ACT-056 | reason 입력 | 거부 사유 Input 입력 | reason 값 업데이트 | inverted=true일 때만 활성화 |
| ROL-L5-ACT-057 | 등록 버튼 클릭 | 등록 버튼 클릭 | 유효성 검사 후 POST /api/v1/abilities 호출 | name, subjectId, actionId 필수 |
| ROL-L5-ACT-058 | 취소 버튼 클릭 | 취소 버튼 클릭 | 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/subjects + GET /api/v1/actions 병렬 호출 → Select 옵션 로드 | 에러 메시지 |
| Subject 선택 | entity 그룹이면 GET /api/v1/subjects/:id/fields → fields TagInput 자동완성 활성화 | 에러 토스트 |
| 등록 버튼 | POST 호출 → "권한 정의가 등록되었습니다" 토스트 → Ability 목록으로 이동 | 에러 토스트 (400: 유효성 오류) |

#### 동적 동작

1. Subject 선택 시 group이 "entity"인 경우:
   - GET /api/v1/subjects/:id/fields 호출
   - 반환된 필드 목록을 TagInput의 자동완성 후보로 설정
2. inverted 토글 시:
   - true: reason 입력 필드 활성화 (필수는 아님)
   - false: reason 필드 비활성화 + 값 초기화

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수 | "권한 정의 이름을 입력해주세요" |
| subjectId | 필수 | "Subject를 선택해주세요" |
| actionId | 필수 | "Action을 선택해주세요" |
| conditions | JSON 형식 | "올바른 JSON 형식으로 입력해주세요" |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-009: Ability 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-009 |
| **Method** | POST |
| **Endpoint** | `/api/v1/abilities` |
| **Operation ID** | `createAbility` |
| **설명** | 새로운 권한 정의(Ability)를 생성합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Status Code** | 201 Created |
| **Response** | `AbilityResponseDto` |
| **에러** | 400 (유효성 오류), 401, 500 |

**Request Body** (`CreateAbilityDto`):

```json
{
  "name": "Read User Email Masked",
  "description": "사용자 이메일 마스킹 읽기 권한",
  "actionId": "uuid",
  "subjectId": "uuid",
  "fields": ["email", "phone"],
  "conditions": { "departmentId": "${user.departmentId}" },
  "inverted": false,
  "reason": null
}
```

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

---

### ROL-L6-API-019: Subject 필드 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-019 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects/:id/fields` |
| **Operation ID** | `getSubjectFields` |
| **설명** | Subject의 DMMF 기반 필드 목록을 조회합니다. entity 그룹만 필드 반환, 그 외는 빈 배열. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Subject ID |
| **Response** | `SubjectFieldDto[]` |
| **에러** | 404 (Subject 없음), 500 |

**Response Body 구조** (`SubjectFieldDto`):

```json
[
  {
    "name": "id",
    "displayName": null,
    "type": "String",
    "isRequired": true,
    "isRelation": false
  },
  {
    "name": "email",
    "displayName": null,
    "type": "String",
    "isRequired": true,
    "isRelation": false
  },
  {
    "name": "tenants",
    "displayName": null,
    "type": "Tenant[]",
    "isRequired": false,
    "isRelation": true
  }
]
```

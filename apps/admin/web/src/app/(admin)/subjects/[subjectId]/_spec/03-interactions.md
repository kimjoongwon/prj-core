# 03-interactions: 대상 상세

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Policy 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-014: 대상 상세 화면 (`/subjects/[subjectId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-089 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 대상 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/subjects/:id + GET /api/v1/subjects/:id/fields 병렬 호출 → 상세 + 필드 목록 표시 | 에러 메시지 (404) |

**참고**: entity 그룹이 아닌 Subject는 필드 목록이 빈 배열로 반환되며 "필드 정보가 없습니다" 안내 표시.

---

## L6: API 엔드포인트 정의

### ROL-L6-API-018: Subject 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-018 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects/:id` |
| **Operation ID** | `getSubjectById` |
| **설명** | ID로 Subject를 상세 조회합니다. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Subject ID |
| **Response** | `SubjectDto` |
| **에러** | 404, 500 |

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

# 03-interactions: 권한 정의 수정

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Policy 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-008: 권한 정의 수정 화면 (`/abilities/[abilityId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-059 | 필드 수정 | 등록 화면과 동일한 필드 수정 | 값 업데이트 | - |
| ROL-L5-ACT-060 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/abilities/:id 호출 | - |
| ROL-L5-ACT-061 | 취소 버튼 클릭 | 취소 버튼 클릭 | Ability 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities/:id + GET /api/v1/subjects + GET /api/v1/actions 병렬 호출 → 기존 데이터 prefill | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "권한 정의가 수정되었습니다" 토스트 → 상세 화면 이동 | 에러 토스트 |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-008: Ability 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-008 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `getAbilityById` |
| **설명** | ID로 특정 Ability를 상세 조회합니다. Subject, Action 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` |
| **에러** | 401, 404 (Ability 없음), 500 |

---

### ROL-L6-API-010: Ability 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-010 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `updateAbility` |
| **설명** | 기존 Ability의 설정을 수정합니다. Role Assignment 메타데이터(isActive, priority)는 변경되지 않습니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` |
| **에러** | 400, 401, 404, 500 |

**Request Body** (`UpdateAbilityDto`, 모든 필드 optional):

```json
{
  "name": "Updated Name",
  "description": "수정된 설명",
  "actionId": "uuid",
  "subjectId": "uuid",
  "fields": ["email"],
  "conditions": null,
  "inverted": true,
  "reason": "관리자만 접근 가능합니다"
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

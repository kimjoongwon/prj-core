# 03-interactions: 역할 수정

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-004: 역할 수정 화면 (`/roles/[roleId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-029 | displayName 수정 | 표시명 Input 변경 | 값 업데이트 | - |
| ROL-L5-ACT-030 | description 수정 | 설명 Textarea 변경 | 값 업데이트 | - |
| ROL-L5-ACT-031 | categoryId 변경 | 카테고리 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-032 | groupId 변경 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-033 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/roles/:id 호출 | - |
| ROL-L5-ACT-034 | 취소 버튼 클릭 | 취소 버튼 클릭 | 역할 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles/:id → 기존 데이터 prefill. isSystem=true이면 목록으로 리다이렉트 | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "역할이 수정되었습니다" 토스트 → 역할 상세 화면 이동 | 에러 토스트 |

#### 제약사항

- name(역할 식별자) 필드는 `readonly` 표시
- isSystem=true인 역할은 접근 시 목록으로 리다이렉트

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

### ROL-L6-API-004: 역할 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-004 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `updateRole` |
| **설명** | 역할 정보를 수정합니다. displayName, description만 수정 가능. 시스템 역할은 수정 불가. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` |
| **에러** | 400 (시스템 역할 수정 시도), 401, 403, 404, 500 |

**Request Body** (`UpdateRoleDto`):

```json
{
  "displayName": "수정된 표시명",
  "description": "수정된 설명"
}
```

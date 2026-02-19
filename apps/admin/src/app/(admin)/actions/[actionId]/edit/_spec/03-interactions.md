# 03-interactions: 행위 수정

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-012: 행위 수정 화면 (`/actions/[actionId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-081 | 필드 수정 | 등록 화면과 동일한 필드 수정 | 값 업데이트 | - |
| ROL-L5-ACT-082 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/actions/:id 호출 | - |
| ROL-L5-ACT-083 | 취소 버튼 클릭 | 취소 버튼 클릭 | 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/actions/:id → 기존 데이터 prefill. isSystem=true이면 목록으로 리다이렉트 | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "행위가 수정되었습니다" 토스트 → 상세 화면 이동 | 에러 토스트 (400: "시스템 Action은 수정할 수 없습니다") |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-013: Action 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-013 |
| **Method** | GET |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `getActionById` |
| **설명** | ID로 Action을 상세 조회합니다. config 포함 전체 필드 반환. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` |
| **에러** | 404 (Action 없음), 500 |

---

### ROL-L6-API-015: Action 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-015 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `updateAction` |
| **설명** | Action 정보를 수정합니다. 시스템 Action(isSystem=true)은 수정 불가. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` |
| **에러** | 400 (시스템 Action 수정 불가 / 유효성 오류), 401, 403, 404, 500 |

**Request Body** (`UpdateActionDto`, 모든 필드 optional):

```json
{
  "displayName": "수정된 표시명",
  "description": "수정된 설명",
  "group": "visibility",
  "order": 12,
  "config": { "type": "masking", "preset": "PRESET_PHONE_V2" }
}
```

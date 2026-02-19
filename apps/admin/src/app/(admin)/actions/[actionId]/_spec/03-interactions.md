# 03-interactions: 행위 상세

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-010: 행위 상세 화면 (`/actions/[actionId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-068 | 수정 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 수정 화면으로 이동 | isSystem=false, RoleCategoryGuard(WORKSPACE) |
| ROL-L5-ACT-069 | 삭제 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | isSystem=false, RoleCategoryGuard(WORKSPACE) |
| ROL-L5-ACT-070 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/actions/:id 호출 | - |
| ROL-L5-ACT-071 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/actions/:id → 상세 정보 + config JSON 표시 | 에러 메시지 (404) |
| 삭제 확인 | DELETE 호출 → "행위가 삭제되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (400: "시스템 Action은 삭제할 수 없습니다") |

---

## 모달 정의

### 삭제 확인 모달 (Action)

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
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

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

### ROL-L6-API-016: Action 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-016 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `deleteAction` |
| **설명** | Action을 소프트 삭제합니다. 시스템 Action(isSystem=true)은 삭제 불가. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` (삭제된 Action 정보) |
| **에러** | 400 (시스템 Action 삭제 불가), 401, 403, 404, 500 |

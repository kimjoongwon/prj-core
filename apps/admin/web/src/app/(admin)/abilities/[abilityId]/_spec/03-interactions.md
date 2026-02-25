# 03-interactions: 권한 정의 상세

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-006: 권한 정의 상세 화면 (`/abilities/[abilityId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-044 | 수정 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 수정 화면으로 이동 (`/abilities/[abilityId]/edit`) | `can('update', 'ability')` |
| ROL-L5-ACT-045 | 삭제 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'ability')` |
| ROL-L5-ACT-046 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/abilities/:id 호출 | - |
| ROL-L5-ACT-047 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-048 | 할당된 Role 클릭 | 할당 현황 섹션에서 Role명 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities/:id 호출 → 상세 정보 표시 | 에러 메시지 (404: "권한 정의를 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 → "권한 정의가 삭제되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (연결된 Grant 관련 에러) |

---

## 모달 정의

### 삭제 확인 모달 (Ability)

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
| 추가 경고 (Ability) | 연결된 Grant가 있을 경우: "이 권한 정의에 연결된 Grant N건도 함께 삭제됩니다." |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

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

### ROL-L6-API-011: Ability 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-011 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `deleteAbility` |
| **설명** | Ability를 소프트 삭제합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` (삭제된 Ability 정보) |
| **에러** | 400 (삭제 실패), 401, 404, 500 |

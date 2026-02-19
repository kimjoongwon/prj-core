# 03-interactions: 역할 등록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-003: 역할 등록 화면 (`/roles/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-022 | name 입력 | 역할 식별자 Input 입력 | 실시간 유효성 검사 (영문 대문자 + 언더스코어) | - |
| ROL-L5-ACT-023 | displayName 입력 | 표시명 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-024 | description 입력 | 설명 Textarea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-025 | categoryId 선택 | 카테고리 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-026 | groupId 선택 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-027 | 등록 버튼 클릭 | 등록 버튼 클릭 | 유효성 검사 후 POST /api/v1/roles 호출 | name 필수 |
| ROL-L5-ACT-028 | 취소 버튼 클릭 | 취소 버튼 클릭 | 역할 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 등록 버튼 클릭 | POST 호출 → "역할이 등록되었습니다" 토스트 → 역할 상세 화면 이동 | 에러 토스트 (400: 유효성 오류, 409: 중복 이름) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, `^[A-Z][A-Z0-9_]*$`, 최대 50자 | "역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |
| displayName | 선택, 최대 50자 | "표시명은 50자 이내로 입력해주세요" |
| description | 선택, 최대 200자 | "설명은 200자 이내로 입력해주세요" |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-003: 역할 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-003 |
| **Method** | POST |
| **Endpoint** | `/api/v1/roles` |
| **Operation ID** | `createRole` |
| **설명** | 새로운 역할을 생성합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |
| **Response** | `RoleDto` |
| **에러** | 400 (유효성 오류), 401, 403, 409 (이름 중복), 500 |

**Request Body** (`CreateRoleDto`):

```json
{
  "name": "CUSTOM_ROLE",
  "displayName": "커스텀 역할",
  "description": "사용자 정의 역할입니다"
}
```

**참고**: `isSystem`, `classification`, `associations`는 CreateRoleDto에서 제외됨. Group/Category 연결은 별도 API 또는 확장 필요.

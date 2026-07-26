# 03-interactions: 행위 등록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Policy 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-011: 행위 등록 화면 (`/actions/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-072 | name 입력 | 이름 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-073 | displayName 입력 | 표시명 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-074 | description 입력 | 설명 TextArea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-075 | group 선택 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-076 | order 입력 | 정렬 순서 NumberInput 변경 | 값 업데이트 | - |
| ROL-L5-ACT-077 | isSystem 토글 | 시스템 여부 Switch 토글 | 값 업데이트 | - |
| ROL-L5-ACT-078 | config 입력 | JSON 에디터에 설정 입력 | config JSON 업데이트 + 실시간 유효성 검사 | - |
| ROL-L5-ACT-079 | 등록 버튼 클릭 | 등록 버튼 클릭 | POST /api/v1/actions 호출 | name 필수 |
| ROL-L5-ACT-080 | 취소 버튼 클릭 | 취소 버튼 클릭 | 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 등록 버튼 | POST 호출 → "행위가 등록되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (400: 유효성 오류) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, unique, 영소문자+콜론+언더스코어 | "이름을 입력해주세요" |
| config | JSON 형식 (입력 시) | "올바른 JSON 형식으로 입력해주세요" |

---

## L6: API 엔드포인트 정의

### ROL-L6-API-014: Action 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-014 |
| **Method** | POST |
| **Endpoint** | `/api/v1/actions` |
| **Operation ID** | `createAction` |
| **설명** | 새로운 Action을 생성합니다. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Status Code** | 201 Created |
| **Response** | `ActionDto` |
| **에러** | 400 (유효성 오류), 401, 403, 500 |

**Request Body** (`CreateActionDto`):

```json
{
  "name": "read:masked:phone",
  "displayName": "전화번호 마스킹 읽기",
  "description": "전화번호 필드를 마스킹하여 표시합니다",
  "group": "visibility",
  "order": 11,
  "isSystem": false,
  "config": {
    "type": "masking",
    "preset": "PRESET_PHONE"
  }
}
```

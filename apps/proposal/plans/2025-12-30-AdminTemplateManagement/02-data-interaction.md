# 데이터 요구사항 및 인터랙션

## 1. 필요한 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/v1/admin/templates | 템플릿 목록 조회 | Admin Token |
| GET | /api/v1/admin/templates/:id | 템플릿 상세 조회 | Admin Token |
| POST | /api/v1/admin/templates | 템플릿 생성 | Admin Token |
| PUT | /api/v1/admin/templates/:id | 템플릿 수정 | Admin Token |
| DELETE | /api/v1/admin/templates/:id | 템플릿 삭제 | Admin Token |
| POST | /api/v1/admin/templates/:id/test | 테스트 발송 | Admin Token |
| POST | /api/v1/admin/templates/:id/preview | 미리보기 렌더링 | Admin Token |

### API 응답 예시

**GET /api/v1/admin/templates**
```json
{
  "data": [
    {
      "id": "template-uuid-1",
      "name": "이메일 인증",
      "type": "EMAIL",
      "key": "email_verification",
      "subject": "이메일 인증을 완료해주세요",
      "content": "<!DOCTYPE html>...",
      "variables": ["userName", "verificationCode", "expiresAt"],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 20
  }
}
```

**POST /api/v1/admin/templates/:id/test**
```json
{
  "recipient": "test@example.com",
  "variables": {
    "userName": "홍길동",
    "verificationCode": "123456",
    "expiresAt": "2025-01-01 12:00:00"
  }
}
```

---

## 2. 필요한 상태

| 상태 | 타입 | 설명 | 초기값 |
|------|------|------|--------|
| selectedTab | TemplateType | 선택된 템플릿 타입 | 'EMAIL' |
| templates | Template[] | 템플릿 목록 | [] |
| selectedTemplateId | string \| null | 선택된 템플릿 ID | null |
| selectedTemplate | Template \| null | 선택된 템플릿 상세 | null |
| isEditing | boolean | 편집 모드 여부 | false |
| previewHtml | string | 미리보기 HTML | "" |
| isLoading | boolean | 로딩 상태 | false |
| isSaving | boolean | 저장 중 상태 | false |
| isSendingTest | boolean | 테스트 발송 중 | false |

---

## 3. 타입 정의

```typescript
enum TemplateType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  HTML = 'HTML',
}

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  key: string; // 시스템 내부 키 (email_verification, password_reset 등)
  subject?: string; // 이메일/푸시 제목
  content: string; // 템플릿 내용 (HTML/Text)
  variables: string[]; // 사용 가능한 변수 목록
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateVariable {
  name: string;
  description: string;
  example: string;
}
```

### 템플릿 변수 예시

**이메일 인증 템플릿:**
```typescript
const emailVerificationVariables: TemplateVariable[] = [
  { name: 'userName', description: '사용자 이름', example: '홍길동' },
  { name: 'verificationCode', description: '인증 코드', example: '123456' },
  { name: 'expiresAt', description: '만료 시간', example: '2025-01-01 12:00' },
  { name: 'verificationLink', description: '인증 링크', example: 'https://example.com/verify?code=xxx' },
];
```

**회원 탈퇴 템플릿:**
```typescript
const withdrawalVariables: TemplateVariable[] = [
  { name: 'userName', description: '사용자 이름', example: '홍길동' },
  { name: 'withdrawalDate', description: '탈퇴 처리 일시', example: '2025-01-01' },
  { name: 'dataRetentionPeriod', description: '데이터 보관 기간', example: '30일' },
];
```

---

## 4. 인터랙션 정의

### 사용자 액션

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 탭 변경 | 상단 탭 클릭 | 해당 타입의 템플릿 목록 조회 및 표시 |
| 템플릿 선택 | 좌측 목록에서 템플릿 클릭 | 템플릿 상세 조회 및 편집 영역 표시 |
| 새 템플릿 생성 | [+ 새 템플릿] 버튼 클릭 | 빈 편집 폼 표시 |
| 템플릿 편집 | 에디터 영역 수정 | isEditing = true |
| 미리보기 | [미리보기] 버튼 클릭 | 현재 템플릿 렌더링하여 미리보기 표시 |
| 테스트 발송 | [테스트 발송] 버튼 클릭 | 모달 열림 (수신자 입력) -> 테스트 발송 |
| 저장 | [저장] 버튼 클릭 | POST/PUT API 호출하여 저장 |
| 삭제 | [삭제] 버튼 클릭 | 확인 모달 -> DELETE API 호출 |

### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onChangeTab | type: TemplateType | 탭 변경, 해당 타입 템플릿 목록 조회 |
| onSelectTemplate | templateId: string | 템플릿 상세 조회 |
| onCreateTemplate | - | 새 템플릿 폼 초기화 |
| onChangeTemplate | field: string, value: any | 템플릿 필드 업데이트 |
| onClickPreview | - | 미리보기 API 호출 |
| onClickTestSend | - | 테스트 발송 모달 열기 |
| onSendTest | recipient: string, variables: Record<string, any> | 테스트 발송 API 호출 |
| onSaveTemplate | - | 생성/수정 API 호출 |
| onDeleteTemplate | templateId: string | 삭제 API 호출 |

### 상태 변화 흐름

```
페이지 진입
    |
    v
selectedTab = 'EMAIL'
isLoading = true
    |
    v
API 호출 (GET /api/v1/admin/templates?type=EMAIL)
    |
    v
templates = response.data, isLoading = false
    |
    v
사용자가 템플릿 선택
    |
    v
selectedTemplateId = clickedId
API 호출 (GET /api/v1/admin/templates/:id)
    |
    v
selectedTemplate = response.data
    |
    v
사용자가 템플릿 수정
    |
    v
isEditing = true
    |
    v
[저장] 버튼 클릭
    |
    v
isSaving = true
API 호출 (PUT /api/v1/admin/templates/:id)
    |
    v
성공 -> selectedTemplate 업데이트, isEditing = false, isSaving = false
실패 -> 에러 메시지 표시, isSaving = false
```

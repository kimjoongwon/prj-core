# 📋 AdminTemplateManagement 화면 기획서

**플랫폼:** Admin Web

## 1. 화면 개요

### 목적
관리자가 시스템에서 사용하는 각종 템플릿(이메일, SMS, 푸시, HTML)을 관리하는 화면입니다. 이메일 인증, 회원 탈퇴, 비밀번호 재설정 등 다양한 상황에서 사용되는 템플릿을 생성, 수정, 미리보기, 테스트 발송할 수 있습니다.

### 진입 조건
- 관리자 로그인 완료
- `menu:templates` Subject 접근 권한 보유

### 이탈 조건
- 다른 메뉴로 이동
- 로그아웃

---

## 2. 화면 구조

### 레이아웃 (Admin Web)

```
┌─────────────────────────────────────────────────────────────────┐
│ [AdminLayout Header]                                            │
├─────────────────────────────────────────────────────────────────┤
│ 이메일 템플릿 │ SMS 템플릿 │ 푸시 템플릿 │ HTML 템플릿          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │   템플릿 목록       │  │      템플릿 편집/미리보기         │  │
│  │                    │  │                                  │  │
│  │  □ 이메일 인증     │  │  템플릿 이름: [________]         │  │
│  │  □ 비밀번호 재설정  │  │                                  │  │
│  │  □ 회원 탈퇴 안내  │  │  제목: [__________________]      │  │
│  │  □ 예약 확인      │  │                                  │  │
│  │  □ 예약 취소      │  │  내용:                           │  │
│  │  ...              │  │  ┌────────────────────────────┐  │  │
│  │                    │  │  │                            │  │  │
│  │  [+ 새 템플릿]     │  │  │  [에디터 영역]              │  │  │
│  │                    │  │  │                            │  │  │
│  └────────────────────┘  │  │                            │  │  │
│                          │  └────────────────────────────┘  │  │
│                          │                                  │  │
│                          │  [미리보기] [테스트 발송] [저장]  │  │
│                          └──────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 컴포넌트 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| Tab Navigation | Tabs (HeroUI) | 템플릿 타입별 탭 |
| Left Panel | TemplateList | 템플릿 목록 및 선택 |
| Right Panel | TemplateEditor | 템플릿 편집 영역 |
| Right Panel | TemplatePreview | 템플릿 미리보기 |
| Action Buttons | Button Group | 미리보기, 테스트 발송, 저장 버튼 |

---

## 3. 데이터 요구사항

### 필요한 API

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

### 필요한 상태

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

### 타입 정의

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
| 테스트 발송 | [테스트 발송] 버튼 클릭 | 모달 열림 (수신자 입력) → 테스트 발송 |
| 저장 | [저장] 버튼 클릭 | POST/PUT API 호출하여 저장 |
| 삭제 | [삭제] 버튼 클릭 | 확인 모달 → DELETE API 호출 |

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
    ↓
selectedTab = 'EMAIL'
isLoading = true
    ↓
API 호출 (GET /api/v1/admin/templates?type=EMAIL)
    ↓
templates = response.data, isLoading = false
    ↓
사용자가 템플릿 선택
    ↓
selectedTemplateId = clickedId
API 호출 (GET /api/v1/admin/templates/:id)
    ↓
selectedTemplate = response.data
    ↓
사용자가 템플릿 수정
    ↓
isEditing = true
    ↓
[저장] 버튼 클릭
    ↓
isSaving = true
API 호출 (PUT /api/v1/admin/templates/:id)
    ↓
성공 → selectedTemplate 업데이트, isEditing = false, isSaving = false
실패 → 에러 메시지 표시, isSaving = false
```

---

## 5. UI 상세

### 템플릿 타입별 탭

- EMAIL, SMS, PUSH, HTML 4개 탭
- 선택된 탭 강조 표시
- 탭 변경 시 해당 타입의 템플릿 목록 자동 로드

### 템플릿 목록 (좌측 패널)

**표시 정보:**
- 템플릿 이름
- 템플릿 키 (key) - 부제목 스타일
- 활성화 상태 (Badge: Active/Inactive)

**정렬:**
- 생성일 최신순

**액션:**
- [+ 새 템플릿] 버튼 (목록 하단)

### 템플릿 편집 영역 (우측 패널)

**이메일 템플릿:**
- 템플릿 이름 입력
- 템플릿 키 입력 (고유값)
- 제목 입력
- HTML 에디터 (Rich Text Editor 또는 Code Editor)
- 사용 가능한 변수 목록 표시

**SMS 템플릿:**
- 템플릿 이름 입력
- 템플릿 키 입력
- 내용 입력 (Text Area, 최대 90자)
- 글자 수 카운터
- 사용 가능한 변수 목록 표시

**푸시 템플릿:**
- 템플릿 이름 입력
- 템플릿 키 입력
- 제목 입력 (최대 50자)
- 내용 입력 (최대 100자)
- 사용 가능한 변수 목록 표시

**HTML 템플릿:**
- 템플릿 이름 입력
- 템플릿 키 입력
- HTML Code Editor
- 사용 가능한 변수 목록 표시

### 변수 사용 가이드

**변수 목록 표시:**
```
사용 가능한 변수:
- {{userName}} : 사용자 이름 (예: 홍길동)
- {{verificationCode}} : 인증 코드 (예: 123456)
- {{expiresAt}} : 만료 시간 (예: 2025-01-01 12:00)
```

**변수 삽입:**
- 변수 클릭 시 에디터 커서 위치에 자동 삽입

### 미리보기 모달

**구조:**
- 모달 헤더: "템플릿 미리보기"
- 모달 바디: 렌더링된 템플릿 (iframe 또는 div)
- 변수 입력 폼 (미리보기용 샘플 데이터)

### 테스트 발송 모달

**구조:**
- 모달 헤더: "테스트 발송"
- 수신자 입력 (이메일/SMS/푸시 타입에 따라 달라짐)
- 변수 값 입력 폼
- [발송] [취소] 버튼

---

## 6. 기존 컴포넌트 활용 제안

### 사용 가능한 기존 컴포넌트

| 컴포넌트 | 용도 | 경로 |
|----------|------|------|
| Tabs (HeroUI) | 템플릿 타입 탭 | @heroui/react |
| Card (HeroUI) | 템플릿 목록 카드 | @heroui/react |
| Input (HeroUI) | 입력 필드 | @heroui/react |
| Textarea (HeroUI) | 텍스트 영역 | @heroui/react |
| Button (HeroUI) | 버튼 | @heroui/react |
| Modal (HeroUI) | 모달 | @heroui/react |
| Badge (HeroUI) | 상태 배지 | @heroui/react |
| VStack | 수직 정렬 | components/ui/surfaces/VStack |
| HStack | 수평 정렬 | components/ui/surfaces/HStack |

### 신규 컴포넌트 필요 여부
- [x] 필요함 → 아래 명세 참고

### 신규 컴포넌트 명세

---
**TemplateListItem 컴포넌트를 만들어주세요.**

**Props:**
- template: Template (템플릿 데이터)
- isSelected: boolean (선택 여부)
- onPress?: (template: Template) => void (클릭 핸들러)

**표시 내용:**
- 템플릿 이름 (name)
- 템플릿 키 (key) - 부제목 스타일
- 활성화 상태 Badge

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/TemplateListItem/TemplateListItem.tsx

---

---
**TemplateEditor 컴포넌트를 만들어주세요.**

**Props:**
- template: Template | null (템플릿 데이터)
- templateType: TemplateType (템플릿 타입)
- variables: TemplateVariable[] (사용 가능한 변수)
- onChange: (field: string, value: any) => void (변경 핸들러)
- onPreview: () => void (미리보기 핸들러)
- onTestSend: () => void (테스트 발송 핸들러)
- onSave: () => void (저장 핸들러)
- isSaving: boolean (저장 중 상태)

**표시 내용:**
- 템플릿 타입에 따른 입력 폼
- 변수 가이드 패널
- 액션 버튼 (미리보기, 테스트 발송, 저장)

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/TemplateEditor/TemplateEditor.tsx

---

---
**TemplatePreviewModal 컴포넌트를 만들어주세요.**

**Props:**
- isOpen: boolean (모달 열림 상태)
- onClose: () => void (닫기 핸들러)
- previewHtml: string (미리보기 HTML)
- variables: TemplateVariable[] (변수 목록)
- onRender: (variables: Record<string, any>) => void (렌더링 핸들러)

**표시 내용:**
- 변수 값 입력 폼
- 렌더링된 템플릿 미리보기

**카테고리:** admin
**Storybook:** 필요
**경로:** packages/ui/src/components/admin/TemplatePreviewModal/TemplatePreviewModal.tsx

---

---

## 7. 페이지 빌더 전달 내용

### 페이지-빌더에게 요청할 내용

---
**AdminTemplateManagementPage를 만들어주세요.**

**기능:**
- 템플릿 타입별 탭 (EMAIL, SMS, PUSH, HTML)
- 템플릿 목록 조회 및 표시
- 템플릿 선택 시 상세 조회
- 템플릿 생성/수정/삭제
- 미리보기 기능
- 테스트 발송 기능

**필요한 상태:**
- selectedTab: TemplateType
- templates: Template[]
- selectedTemplateId: string | null
- selectedTemplate: Template | null
- isEditing: boolean
- previewHtml: string
- isLoading: boolean
- isSaving: boolean

**필요한 핸들러:**
- onChangeTab(type: TemplateType): 탭 변경
- onSelectTemplate(templateId: string): 템플릿 선택
- onCreateTemplate(): 새 템플릿 생성
- onChangeTemplate(field: string, value: any): 템플릿 수정
- onPreview(): 미리보기
- onTestSend(recipient: string, variables: Record<string, any>): 테스트 발송
- onSaveTemplate(): 저장
- onDeleteTemplate(templateId: string): 삭제

**페이지 경로:** /admin/templates/:type (email, sms, push, html)

**레이아웃:** AdminLayout 사용
---

---

## 8. 백엔드 빌더 전달 내용

### 백엔드-빌더에게 요청할 내용

---
**템플릿 관리 API를 만들어주세요.**

**엔드포인트 목록:**

1. **GET /api/v1/admin/templates**
   - Query: `type` (EMAIL|SMS|PUSH|HTML), `page`, `limit`
   - 템플릿 목록 조회

2. **GET /api/v1/admin/templates/:id**
   - 템플릿 상세 조회

3. **POST /api/v1/admin/templates**
   - Body: `name`, `type`, `key`, `subject`, `content`, `variables`
   - 템플릿 생성

4. **PUT /api/v1/admin/templates/:id**
   - Body: `name`, `subject`, `content`, `isActive`
   - 템플릿 수정

5. **DELETE /api/v1/admin/templates/:id**
   - 템플릿 삭제 (soft delete)

6. **POST /api/v1/admin/templates/:id/preview**
   - Body: `variables` (Record<string, any>)
   - 템플릿 미리보기 렌더링

7. **POST /api/v1/admin/templates/:id/test**
   - Body: `recipient`, `variables`
   - 테스트 발송

**비즈니스 로직:**
- 템플릿 key는 고유값 (unique constraint)
- 템플릿 변수는 JSON 배열로 저장
- 미리보기: Handlebars 또는 EJS로 변수 치환
- 테스트 발송: 실제 이메일/SMS/푸시 발송 (테스트 모드)

**에러 처리:**
- 401: 인증 실패
- 403: 권한 없음
- 404: 템플릿 없음
- 409: 중복된 key
- 500: 서버 에러
---

---

## 9. 템플릿 시스템 설계

### 템플릿 키 (Key) 규칙

| 키 | 타입 | 설명 |
|----|------|------|
| `email_verification` | EMAIL | 이메일 인증 |
| `password_reset` | EMAIL | 비밀번호 재설정 |
| `user_withdrawal` | EMAIL | 회원 탈퇴 안내 |
| `reservation_confirmed` | EMAIL/SMS/PUSH | 예약 확인 |
| `reservation_cancelled` | EMAIL/SMS/PUSH | 예약 취소 |
| `payment_receipt` | EMAIL | 결제 영수증 |
| `inquiry_answered` | EMAIL/PUSH | 문의 답변 등록 |

### 템플릿 렌더링 엔진

**Handlebars 사용:**
```handlebars
<h1>안녕하세요, {{userName}}님!</h1>
<p>인증 코드는 <strong>{{verificationCode}}</strong>입니다.</p>
<p>만료 시간: {{expiresAt}}</p>
```

**변수 치환 예시:**
```typescript
const template = "안녕하세요, {{userName}}님!";
const variables = { userName: "홍길동" };
const result = Handlebars.compile(template)(variables);
// "안녕하세요, 홍길동님!"
```

### 템플릿 버전 관리

- 템플릿 수정 시 이전 버전 보관 (TemplateHistory 테이블)
- 롤백 기능 제공 (향후 고려)

---

## 10. 보안 고려사항

| 항목 | 대응 방안 |
|------|----------|
| HTML Injection | HTML 템플릿 저장 시 XSS 방지 sanitize |
| 변수 검증 | 허용된 변수만 사용 가능하도록 검증 |
| 테스트 발송 제한 | 일일 테스트 발송 횟수 제한 (예: 10회) |
| 권한 확인 | `menu:templates:*` Subject 권한 체크 |

---

## 11. 성능 고려사항

| 항목 | 대응 방안 |
|------|----------|
| 템플릿 목록 조회 | 페이지네이션 적용 (기본 20개) |
| 미리보기 렌더링 | 서버 사이드 렌더링, 캐싱 |
| HTML 에디터 | 코드 에디터 lazy loading |

---

---

## 🔧 기술 설계

### 1. Entity 상세 설계

#### 1.1 새로운 Entity

##### Template

**파일 경로:** `packages/prisma/prisma/schema/template.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| seq | Int | 시퀀스 | @unique @default(autoincrement()) |
| name | String | 템플릿 이름 | @db.VarChar(100) |
| type | TemplateType | 템플릿 타입 | Enum |
| key | String | 시스템 키 | @db.VarChar(100) |
| subject | String? | 제목 (이메일/푸시) | @db.VarChar(200) |
| content | String | 템플릿 내용 | @db.Text |
| variables | String[] | 사용 가능한 변수 목록 | @db.VarChar(50)[] |
| isActive | Boolean | 활성화 여부 | @default(true) |
| spaceId | String | Space FK | |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |
| deletedAt | DateTime? | 삭제일 (soft delete) | |

**Prisma 스키마:**

```prisma
enum TemplateType {
  EMAIL
  SMS
  PUSH
  HTML
}

model Template {
  id        String       @id @default(uuid())
  seq       Int          @unique @default(autoincrement())
  name      String       @db.VarChar(100)
  type      TemplateType
  key       String       @db.VarChar(100)
  subject   String?      @db.VarChar(200)
  content   String       @db.Text
  variables String[]     @db.VarChar(50)
  isActive  Boolean      @default(true)
  spaceId   String
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?

  space Space @relation(fields: [spaceId], references: [id])

  @@unique([key, spaceId])
  @@index([type])
  @@index([spaceId])
  @@index([isActive])
  @@map("templates")
}
```

**인덱스 설계:**

| 인덱스명 | 필드 | 용도 |
|----------|------|------|
| @@unique | key, spaceId | 동일 Space 내 key 중복 방지 |
| idx_template_type | type | 타입별 조회 성능 최적화 |
| idx_template_spaceId | spaceId | Space별 조회 성능 최적화 |
| idx_template_isActive | isActive | 활성 템플릿 조회 최적화 |

**관계:**

```
Space 1 ──── N Template
         └──── FK: spaceId
```

##### TemplateHistory (선택적, 향후 구현)

버전 관리를 위한 이력 테이블

```prisma
model TemplateHistory {
  id         String       @id @default(uuid())
  templateId String
  version    Int
  name       String       @db.VarChar(100)
  subject    String?      @db.VarChar(200)
  content    String       @db.Text
  variables  String[]     @db.VarChar(50)
  changedBy  String       // 수정한 관리자 ID
  createdAt  DateTime     @default(now())

  template Template @relation(fields: [templateId], references: [id])

  @@index([templateId])
  @@map("template_histories")
}
```

#### 1.2 기존 Entity 수정

**Space 수정사항:**

```prisma
model Space {
  // 기존 필드...

  // 추가할 관계
  templates Template[]  // 추가
}
```

---

### 2. Repository 레이어 설계

**파일:** `packages/repository/src/template.repository.ts`

**메서드 명세:**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findManyByTypeAndSpace | type: TemplateType, spaceId: string, pagination: { skip, take } | { items: Template[]; count: number } | 타입 및 Space별 목록 조회 |
| findByKeyAndSpace | key: string, spaceId: string | Template \| null | key와 spaceId로 조회 (실제 사용 시) |
| findById | id: string | Template \| null | ID로 조회 |
| findActiveById | id: string | Template \| null | 활성화된 템플릿 조회 |
| create | data: Prisma.TemplateCreateInput | Template | 생성 |
| updateById | id: string, data: Prisma.TemplateUpdateInput | Template | 수정 |
| softRemoveById | id: string | Template | 소프트 삭제 (deletedAt 설정) |
| countByTypeAndSpace | type: TemplateType, spaceId: string | number | 개수 조회 |

**구현 예시:**

```typescript
async findManyByTypeAndSpace(
  type: TemplateType,
  spaceId: string,
  pagination: { skip: number; take: number }
): Promise<{ items: Template[]; count: number }> {
  const where = {
    type,
    spaceId,
    deletedAt: null,
  };

  const [items, count] = await this.prisma.$transaction([
    this.prisma.template.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.template.count({ where }),
  ]);

  return { items, count };
}

async findByKeyAndSpace(
  key: string,
  spaceId: string
): Promise<Template | null> {
  return this.prisma.template.findUnique({
    where: {
      key_spaceId: {
        key,
        spaceId,
      },
      deletedAt: null,
    },
  });
}
```

---

### 3. Service 레이어 설계

**파일:** `packages/service/src/service/template.service.ts`

**비즈니스 로직:**

| 메서드명 | 책임 | 호출하는 Repository 메서드 |
|----------|------|---------------------------|
| getTemplatesByType | 타입별 템플릿 목록 조회 | findManyByTypeAndSpace, countByTypeAndSpace |
| getTemplateById | 템플릿 상세 조회 | findById |
| getTemplateByKey | key로 템플릿 조회 (실제 사용 시) | findByKeyAndSpace |
| createTemplate | 템플릿 생성 (중복 key 검증) | findByKeyAndSpace, create |
| updateTemplate | 템플릿 수정 (History 저장, 선택적) | findById, updateById |
| deleteTemplate | 템플릿 삭제 | softRemoveById |
| renderTemplate | Handlebars로 템플릿 렌더링 | findById |
| sendTestTemplate | 테스트 발송 (이메일/SMS/푸시) | findById, renderTemplate |

**구현 예시:**

```typescript
async renderTemplate(
  templateId: string,
  variables: Record<string, any>
): Promise<string> {
  const template = await this.templateRepository.findActiveById(templateId);
  if (!template) {
    throw new NotFoundException('템플릿을 찾을 수 없습니다');
  }

  // Handlebars 컴파일
  const compiled = Handlebars.compile(template.content);
  return compiled(variables);
}

async sendTestTemplate(
  templateId: string,
  recipient: string,
  variables: Record<string, any>
): Promise<void> {
  const template = await this.templateRepository.findActiveById(templateId);
  if (!template) {
    throw new NotFoundException('템플릿을 찾을 수 없습니다');
  }

  const renderedContent = await this.renderTemplate(templateId, variables);

  switch (template.type) {
    case TemplateType.EMAIL:
      await this.emailService.send({
        to: recipient,
        subject: template.subject || '',
        html: renderedContent,
      });
      break;
    case TemplateType.SMS:
      await this.smsService.send({
        to: recipient,
        content: renderedContent,
      });
      break;
    case TemplateType.PUSH:
      await this.pushService.send({
        to: recipient,
        title: template.subject || '',
        body: renderedContent,
      });
      break;
    default:
      throw new BadRequestException('지원하지 않는 템플릿 타입입니다');
  }
}
```

---

### 4. Controller 레이어 설계

**파일:** `apps/server/src/module/template/template.controller.ts`

**엔드포인트 상세:**

#### GET /api/v1/admin/templates

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 목록 조회 |
| 인증 | Bearer Token |
| 권한 | CASL Subject: `menu:templates` |

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| type | TemplateType | N | 템플릿 타입 필터 (EMAIL, SMS, PUSH, HTML) |
| page | number | N | 페이지 번호 (default: 1) |
| limit | number | N | 페이지당 개수 (default: 20) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "이메일 인증",
      "type": "EMAIL",
      "key": "email_verification",
      "subject": "이메일 인증을 완료해주세요",
      "content": "<!DOCTYPE html>...",
      "variables": ["userName", "verificationCode"],
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

#### POST /api/v1/admin/templates

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 생성 |
| 인증 | Bearer Token |
| 권한 | CASL Subject: `menu:templates` |

**Request Body:**
```json
{
  "name": "이메일 인증",
  "type": "EMAIL",
  "key": "email_verification",
  "subject": "이메일 인증을 완료해주세요",
  "content": "<!DOCTYPE html>...",
  "variables": ["userName", "verificationCode", "expiresAt"]
}
```

**Error Responses:**
| 코드 | 설명 |
|------|------|
| 400 | 유효성 검증 실패 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 중복된 key |

#### POST /api/v1/admin/templates/:id/preview

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 미리보기 렌더링 |
| 인증 | Bearer Token |

**Request Body:**
```json
{
  "variables": {
    "userName": "홍길동",
    "verificationCode": "123456",
    "expiresAt": "2025-01-01 12:00:00"
  }
}
```

**Response (200):**
```json
{
  "html": "<!DOCTYPE html><html>...</html>"
}
```

#### POST /api/v1/admin/templates/:id/test

| 항목 | 내용 |
|------|------|
| 설명 | 테스트 발송 |
| 인증 | Bearer Token |

**Request Body:**
```json
{
  "recipient": "test@example.com",
  "variables": {
    "userName": "홍길동",
    "verificationCode": "123456"
  }
}
```

**Response (200):**
```json
{
  "message": "테스트 발송이 완료되었습니다"
}
```

---

### 5. DTO 설계

**파일:** `packages/dto/src/template/`

| DTO 클래스 | 용도 | 필드 |
|------------|------|------|
| CreateTemplateDto | 생성 요청 | name, type, key, subject?, content, variables[] |
| UpdateTemplateDto | 수정 요청 | name?, subject?, content?, isActive? |
| TemplateResponseDto | 응답 | id, name, type, key, subject, content, variables, isActive, createdAt, updatedAt |
| PreviewTemplateDto | 미리보기 요청 | variables: Record<string, any> |
| TestSendTemplateDto | 테스트 발송 요청 | recipient, variables: Record<string, any> |
| GetTemplatesQueryDto | 목록 조회 쿼리 | type?, page?, limit? |

**구현 예시:**

```typescript
// CreateTemplateDto
import { IsString, IsEnum, IsOptional, IsArray, MaxLength } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsString()
  @MaxLength(100)
  key: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  subject?: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  variables: string[];
}

// TestSendTemplateDto
export class TestSendTemplateDto {
  @IsString()
  recipient: string;

  @IsObject()
  variables: Record<string, any>;
}
```

---

### 6. 기술 고려사항

#### 6.1 보안

| 항목 | 대응 방안 |
|------|----------|
| HTML Injection | DOMPurify로 HTML sanitize (저장 전) |
| XSS | 템플릿 변수 escape 처리 |
| 변수 검증 | variables 배열에 정의된 변수만 허용 |
| 권한 확인 | CASL ability로 `menu:templates` 체크 |
| 테스트 발송 제한 | Rate limiting (1분당 10회) |
| SQL Injection | Prisma ORM 사용 (파라미터화 쿼리) |

#### 6.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 템플릿 조회 | Redis 캐싱 (key: `template:{spaceId}:{key}`, TTL: 1시간) |
| 렌더링 최적화 | Handlebars 컴파일 결과 캐싱 |
| 목록 조회 | 페이지네이션 (기본 20개) |
| 인덱스 활용 | type, spaceId, key 인덱스 활용 |

#### 6.3 에러 처리

| 에러 상황 | HTTP 코드 | 에러 메시지 |
|----------|-----------|-------------|
| 템플릿 없음 | 404 | "템플릿을 찾을 수 없습니다" |
| 중복 key | 409 | "이미 존재하는 템플릿 키입니다" |
| 변수 검증 실패 | 400 | "유효하지 않은 변수입니다: {variable}" |
| 렌더링 실패 | 500 | "템플릿 렌더링에 실패했습니다" |
| 발송 실패 | 500 | "테스트 발송에 실패했습니다" |

#### 6.4 템플릿 렌더링

**Handlebars 사용:**

```typescript
import Handlebars from 'handlebars';

// Helper 등록
Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR');
});

// 렌더링
const template = Handlebars.compile(templateContent);
const result = template(variables);
```

#### 6.5 테스트 발송

**이메일 발송 (NodeMailer):**
```typescript
await this.mailer.sendMail({
  from: 'noreply@example.com',
  to: recipient,
  subject: subject,
  html: renderedContent,
});
```

**SMS 발송 (알리고 API):**
```typescript
await this.smsService.send({
  receiver: recipient,
  msg: renderedContent,
});
```

**푸시 발송 (FCM):**
```typescript
await this.fcm.send({
  token: userDeviceToken,
  notification: {
    title: subject,
    body: renderedContent,
  },
});
```

---

### 7. 마이그레이션 계획

**순서:**

1. `packages/prisma/prisma/schema/template.prisma` 파일 생성
2. TemplateType Enum 추가
3. Space 모델에 templates 관계 추가
4. `pnpm prisma:migrate dev --name add-template-system` 실행
5. Entity 클래스 생성 (`packages/entity/src/template.entity.ts`)
6. 기본 템플릿 시드 데이터 추가

**시드 데이터 예시:**

```typescript
// prisma/seed/template.seed.ts
const defaultTemplates = [
  {
    name: '이메일 인증',
    type: 'EMAIL',
    key: 'email_verification',
    subject: '이메일 인증을 완료해주세요',
    content: `
      <h1>안녕하세요, {{userName}}님!</h1>
      <p>인증 코드는 <strong>{{verificationCode}}</strong>입니다.</p>
      <p>만료 시간: {{expiresAt}}</p>
    `,
    variables: ['userName', 'verificationCode', 'expiresAt'],
  },
  {
    name: '비밀번호 재설정',
    type: 'EMAIL',
    key: 'password_reset',
    subject: '비밀번호 재설정 안내',
    content: `
      <h1>비밀번호 재설정</h1>
      <p>{{userName}}님, 비밀번호 재설정 링크입니다.</p>
      <a href="{{resetLink}}">재설정하기</a>
    `,
    variables: ['userName', 'resetLink'],
  },
  {
    name: '회원 탈퇴 안내',
    type: 'EMAIL',
    key: 'user_withdrawal',
    subject: '회원 탈퇴 완료',
    content: `
      <h1>{{userName}}님, 그동안 감사했습니다</h1>
      <p>탈퇴 처리일: {{withdrawalDate}}</p>
      <p>데이터 보관 기간: {{dataRetentionPeriod}}</p>
    `,
    variables: ['userName', 'withdrawalDate', 'dataRetentionPeriod'],
  },
];
```

**롤백 계획:**
- 마이그레이션 실패 시 `prisma migrate reset` 고려
- 운영 환경에서는 down migration 스크립트 준비

---

## 12. 관련 문서

- [AdminLayoutAndMenuSystem](./2025-12-30-AdminLayoutAndMenuSystem.md) - 어드민 레이아웃 및 메뉴
- [SignupSystem](./2025-12-30-SignupSystem.md) - 회원가입 시스템 (이메일 인증 사용)

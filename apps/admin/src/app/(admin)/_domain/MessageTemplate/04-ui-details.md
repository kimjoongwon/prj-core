# L7-L8: 데이터 모델, UI 컴포넌트

## 이전 레이어 요약 (L0-L6)

- **L0-L2**: 시스템 관리자가 Email/SMS/Push 템플릿 CRUD + 변수 관리 + 미리보기 + 발송 테스트
- **L3**: 13개 기능 (FEA-001~013) - 목록/검색/유형필터/상태필터/상세/변수목록/등록폼/수정폼/삭제/토글/미리보기/발송테스트/변수관리
- **L4**: 4개 화면 (목록/상세/등록/수정)
- **L5**: 25개 인터랙션 (ACT-001~025)
- **L6**: 8개 API (API-001~008, 모두 신규)

---

## L7: 데이터 모델 (Entity)

### 엔티티 목록

| ID | 엔티티 | 위치 | 상태 | 설명 |
|----|--------|------|------|------|
| MT-L7-ENT-001 | Template | `@cocrepo/prisma` | 신규 | 템플릿 (Email/SMS/Push) |
| MT-L7-ENT-002 | TemplateVariable | `@cocrepo/prisma` | 신규 | 템플릿 변수 (플레이스홀더 정의) |

### Enum 정의

| ID | Enum | 값 | 설명 |
|----|------|----|------|
| MT-L7-ENM-001 | TemplateType | `EMAIL`, `SMS`, `PUSH` | 메시지 채널 유형 |

### 엔티티 관계

```
┌───────────────────────────┐
│    Template        │       ┌───────────────────────────┐
│                           │       │    TemplateVariable       │
│ id          (PK, UUID)    │ 1:N   │                           │
│ code        (unique)      │──────>│ id          (PK, UUID)    │
│ name                      │       │ name                      │
│ type        (Enum)        │       │ description               │
│ subject                   │       │ defaultValue              │
│ content                   │       │ isRequired                │
│ description               │       │ templateId (FK)    │
│ isActive                  │       │ createdAt                 │
│ createdAt                 │       │ updatedAt                 │
│ updatedAt                 │       │                           │
│ removedAt                 │       │ @@unique([templateId, name]) │
│                           │       └───────────────────────────┘
│ @@map("templates")│
└───────────────────────────┘
```

**관계 설명**:
- Template (1) -> TemplateVariable (N): 한 템플릿이 여러 변수를 가짐
- onDelete: Cascade (템플릿 삭제 시 변수도 함께 삭제)
- 같은 템플릿 내 변수명 중복 방지 (복합 unique 제약)

### 주요 엔티티 상세

#### Template (신규)

```prisma
/// @displayName 템플릿
model Template {
  id          String              @id @default(uuid())
  createdAt   DateTime            @default(now()) @db.Timestamptz(6)
  updatedAt   DateTime?           @updatedAt @db.Timestamptz(6)
  removedAt   DateTime?           @db.Timestamptz(6)

  code        String              @unique                     /// 고유 코드 (예: WELCOME_EMAIL)
  name        String                                          /// 한글 이름
  type        TemplateType                             /// 유형 (EMAIL, SMS, PUSH)
  subject     String?                                         /// 제목 (EMAIL, PUSH에서 사용)
  content     String                                          /// 본문 (EMAIL: HTML, SMS/PUSH: 텍스트)
  description String?                                         /// 설명
  isActive    Boolean             @default(true)              /// 활성 상태

  variables   TemplateVariable[]                              /// 변수 목록

  @@map("templates")
}
```

#### TemplateVariable (신규)

```prisma
/// @displayName 템플릿 변수
model TemplateVariable {
  id                String           @id @default(uuid())
  createdAt         DateTime         @default(now()) @db.Timestamptz(6)
  updatedAt         DateTime?        @updatedAt @db.Timestamptz(6)

  name              String                                     /// 변수명 (camelCase, 예: userName)
  description       String?                                    /// 한글 설명
  defaultValue      String?                                    /// 기본값
  isRequired        Boolean          @default(false)           /// 필수 여부

  templateId String                                     /// FK -> Template.id
  template   Template  @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@unique([templateId, name])
  @@map("template_variables")
}
```

#### TemplateType (신규 Enum)

```prisma
enum TemplateType {
  EMAIL
  SMS
  PUSH
}
```

### 엔티티 필드 매트릭스

#### Template

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | String (UUID) | PK, required | uuid() | 고유 식별자 |
| createdAt | DateTime | required | now() | 생성 시간 |
| updatedAt | DateTime | optional | @updatedAt | 수정 시간 |
| removedAt | DateTime | optional | - | 소프트 삭제 시간 |
| code | String | unique, required | - | 시스템 고유 코드 (예: WELCOME_EMAIL) |
| name | String | required | - | 한글 이름 |
| type | TemplateType | required | - | 유형 (EMAIL/SMS/PUSH) |
| subject | String | optional | - | 제목 (EMAIL, PUSH에서 사용) |
| content | String | required | - | 본문 (EMAIL: HTML, SMS/PUSH: 텍스트) |
| description | String | optional | - | 설명 |
| isActive | Boolean | required | true | 활성 상태 |

#### TemplateVariable

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | String (UUID) | PK, required | uuid() | 고유 식별자 |
| createdAt | DateTime | required | now() | 생성 시간 |
| updatedAt | DateTime | optional | @updatedAt | 수정 시간 |
| name | String | required, unique(복합) | - | 변수명 (camelCase) |
| description | String | optional | - | 한글 설명 |
| defaultValue | String | optional | - | 기본값 |
| isRequired | Boolean | required | false | 필수 여부 |
| templateId | String | FK, required, index | - | 소속 템플릿 ID |

### DTO 목록

| DTO | 위치 | 용도 |
|-----|------|------|
| TemplateDto | `@cocrepo/dto` | 템플릿 응답용 (variables 포함) |
| CreateTemplateDto | `@cocrepo/dto` | 등록 요청 (variables 배열 포함) |
| UpdateTemplateDto | `@cocrepo/dto` | 수정 요청 (variables 배열 - 전체 교체) |
| QueryTemplateDto | `@cocrepo/dto` | 목록 쿼리 (search, type, isActive, sort, skip, take) |
| TemplateVariableDto | `@cocrepo/dto` | 변수 응답용 |
| CreateTemplateVariableDto | `@cocrepo/dto` | 변수 생성 요청 (등록 시 배열 항목) |
| UpdateTemplateVariableDto | `@cocrepo/dto` | 변수 수정 요청 (수정 시 배열 항목, id 선택적) |
| PreviewTemplateDto | `@cocrepo/dto` | 미리보기 요청 (variables: Record<string, string>) |
| SendTestTemplateDto | `@cocrepo/dto` | 발송 테스트 요청 (recipient + variables) |

---

## L8: UI 컴포넌트

### 기존 컴포넌트 재사용 현황

프로젝트 기존 컴포넌트를 먼저 확인하여 재사용 가능 여부를 판단합니다.

#### 재사용 가능한 기존 컴포넌트

| 컴포넌트 | 유형 | 위치 | 현재 용도 | 이번 기능 용도 |
|----------|------|------|----------|----------------|
| DataGrid | ui | `components/ui/data-display/DataGrid` | 목록 테이블 | 템플릿 목록 |
| PageSurface | ui | `components/ui/surfaces/PageSurface` | 페이지 래퍼 | 모든 페이지 래퍼 |
| SectionSurface | ui | `components/ui/surfaces/SectionSurface` | 섹션 래퍼 | 기본정보/콘텐츠/변수 섹션 |
| SearchFilterBar | widget | `components/widget/SearchFilterBar` | 검색+필터 영역 | 목록 검색+필터 |
| DetailPanel | widget | `components/widget/DetailPanel` | 상세 정보 표시 | 상세 화면 기본 정보 |
| SecretField | widget | `components/widget/SecretField` | 마스킹 필드 | - (이번 기능에서 불필요) |
| RedirectUriListInput | widget | `components/widget/RedirectUriListInput` | URI 동적 입력 | - (이번 기능에서 불필요) |
| OidcClientForm | widget/form | `components/widget/form/OidcClientForm` | OIDC 폼 | - (참고용, 폼 패턴 참고) |

#### 재사용 가능한 기존 Cell 컴포넌트

| Cell | 위치 | 현재 용도 | 재사용 가능 |
|------|------|----------|:-----------:|
| ActiveStatusCell | `components/ui/data-display/cells/ActiveStatusCell` | 활성/비활성 뱃지 | O (그대로 사용) |
| DateTimeCell | `components/ui/data-display/cells/DateTimeCell` | 날짜 포맷팅 | O (그대로 사용) |
| DefaultCell | `components/ui/data-display/cells/DefaultCell` | 기본 텍스트 | O (코드, 이름 등) |
| StatusChipCell | `components/ui/data-display/cells/StatusChipCell` | 상태 Chip | O (유형 표시 가능) |
| BooleanCell | `components/ui/data-display/cells/BooleanCell` | 불리안 표시 | O (필수 여부) |

#### 재사용 가능한 기존 Input 컴포넌트

| Input | 위치 | 현재 용도 | 이번 기능 용도 |
|-------|------|----------|----------------|
| Input | `components/inputs/Input` | 텍스트 입력 | 코드, 이름, 제목, 변수명 |
| Textarea | `components/inputs/Textarea` | 장문 입력 | 설명, SMS/PUSH 본문 |
| Select | `components/inputs/Select` | 드롭다운 | 유형 필터, 상태 필터 |
| RadioGroup | `components/inputs/RadioGroup` | 라디오 선택 | 유형 선택 (EMAIL/SMS/PUSH) |
| Switch | `components/inputs/Switch` | 토글 스위치 | 활성/비활성 토글 |
| Button | `components/inputs/Button` | 버튼 | 모든 액션 버튼 |
| CharacterCounter | `components/inputs/CharacterCounter` | 글자 수 표시 | PUSH 글자 수 제한 |

### 컴포넌트 계층 구조

#### 템플릿 목록 페이지 (SCR-001)

```
Page (TemplateListPage)
└── PageSurface (title="템플릿", description="...", actions=[등록 버튼])
    ├── SearchFilterBar [기존]
    │   ├── SearchInput (이름/코드 검색)
    │   ├── Select (유형 필터: 전체/EMAIL/SMS/PUSH)
    │   └── Select (상태 필터: 전체/활성/비활성)
    └── SectionSurface (padding="none") [기존]
        └── DataGrid [기존]
            ├── Column: code → DefaultCell [기존]
            ├── Column: name → DefaultCell [기존]
            ├── Column: type → TemplateTypeChipCell [신규]
            ├── Column: isActive → TemplateActiveToggleCell [신규]
            ├── Column: description → DefaultCell (truncate) [기존]
            └── Column: createdAt → DateTimeCell [기존]
```

#### 템플릿 상세 페이지 (SCR-002)

```
Page (TemplateDetailPage)
└── PageSurface (title=name, description=description, actions=[미리보기, 테스트발송, 수정, 삭제])
    ├── SectionSurface (기본 정보) [기존]
    │   └── DetailPanel [기존]
    │       ├── DetailRow: 코드 (code)
    │       ├── DetailRow: 이름 (name)
    │       ├── DetailRow: 유형 → TemplateTypeBadge [신규]
    │       ├── DetailRow: 설명 (description)
    │       ├── DetailRow: 활성 상태 → Switch [기존] (인라인 토글)
    │       ├── DetailRow: 생성일 (createdAt)
    │       └── DetailRow: 수정일 (updatedAt)
    ├── SectionSurface (콘텐츠) [기존]
    │   └── TemplateContentViewer [신규]
    │       ├── [EMAIL] subject 표시 + HtmlContentRenderer [신규]
    │       ├── [SMS] content 표시 + ByteCounter [신규]
    │       └── [PUSH] subject + content + 글자수 표시
    └── SectionSurface (변수 목록) [기존]
        └── VariableReadTable [신규]
            ├── Column: name ({{변수명}} 형태)
            ├── Column: description
            ├── Column: defaultValue
            └── Column: isRequired (Badge)
```

#### 템플릿 등록 페이지 (SCR-003)

```
Page (TemplateCreatePage)
└── PageSurface (title="템플릿 등록", description="새로운 템플릿을 등록합니다")
    ├── SectionSurface (기본 정보) [기존]
    │   ├── RadioGroup: type (EMAIL/SMS/PUSH) [기존]
    │   ├── Input: code (영문 대문자+언더스코어) [기존]
    │   ├── Input: name [기존]
    │   └── Textarea: description [기존]
    ├── SectionSurface (콘텐츠) [기존]
    │   └── TemplateContentEditor [신규]
    │       ├── [EMAIL] Input: subject + HtmlEditor [신규]
    │       ├── [SMS] Textarea: content + ByteCounter [신규]
    │       └── [PUSH] Input: subject (50자) + Textarea: content (200자) + CharacterCounter [기존]
    ├── SectionSurface (변수 관리) [기존]
    │   └── VariableEditTable [신규]
    │       ├── Column: name (Input, 영문 카멜케이스)
    │       ├── Column: description (Input)
    │       ├── Column: defaultValue (Input)
    │       ├── Column: isRequired (Switch)
    │       ├── Column: actions (삭제 버튼)
    │       └── Footer: [+ 변수 추가] 버튼
    └── 버튼 영역: [취소] [등록]
```

#### 템플릿 수정 페이지 (SCR-004)

```
Page (TemplateEditPage)
└── PageSurface (title="템플릿 수정", description="...")
    ├── SectionSurface (기본 정보) [기존]
    │   ├── TemplateTypeBadge: type (읽기 전용) [신규]
    │   ├── Text: code (읽기 전용)
    │   ├── Input: name [기존]
    │   └── Textarea: description [기존]
    ├── SectionSurface (콘텐츠) [기존]
    │   └── TemplateContentEditor [신규] (등록과 동일, 유형별 동적 필드)
    ├── SectionSurface (변수 관리) [기존]
    │   └── VariableEditTable [신규] (기존 데이터 prefill)
    └── 버튼 영역: [취소] [저장]
```

#### 미리보기 모달 (SCR-002에서 호출)

```
PreviewModal [신규]
├── Modal Header: "템플릿 미리보기"
├── Modal Body
│   ├── 변수 입력 영역
│   │   └── Input * N (변수별, 기본값 prefill, 필수 표시)
│   ├── [미리보기 실행] 버튼
│   └── 렌더링 결과 영역
│       ├── [EMAIL] subject + HtmlContentRenderer
│       ├── [SMS] content + 바이트수 + 장수
│       └── [PUSH] subject + content 카드
│   └── 미치환 변수 경고 배지
└── Modal Footer: [닫기]
```

#### 발송 테스트 모달 (SCR-002에서 호출)

```
SendTestModal [신규]
├── Modal Header: "발송 테스트"
├── Modal Body
│   ├── 수신자 입력 영역
│   │   ├── [EMAIL] Input: 이메일 주소
│   │   ├── [SMS] Input: 전화번호
│   │   └── [PUSH] Input: 디바이스 토큰
│   ├── 변수 입력 영역
│   │   └── Input * N (변수별, 기본값 prefill)
│   ├── [발송] 버튼
│   └── 결과 표시 영역
│       ├── 성공: 체크 아이콘 + 발송 시각
│       └── 실패: 경고 아이콘 + 오류 메시지
└── Modal Footer: [닫기]
```

### 컴포넌트 목록

#### Pure UI (기존 활용)

| ID | 컴포넌트 | 패키지 | 상태 | 이번 기능 용도 |
|----|---------|--------|------|----------------|
| MT-L8-CMP-001 | DataGrid | `@cocrepo/ui` | 기존 | 템플릿 목록 |
| MT-L8-CMP-002 | PageSurface | `@cocrepo/ui` | 기존 | 페이지 래퍼 |
| MT-L8-CMP-003 | SectionSurface | `@cocrepo/ui` | 기존 | 섹션 래퍼 |
| MT-L8-CMP-004 | Input | `@cocrepo/ui` | 기존 | 텍스트 입력 필드 |
| MT-L8-CMP-005 | Textarea | `@cocrepo/ui` | 기존 | 설명, SMS/PUSH 본문 |
| MT-L8-CMP-006 | Select | `@cocrepo/ui` | 기존 | 유형/상태 필터 |
| MT-L8-CMP-007 | RadioGroup | `@cocrepo/ui` | 기존 | 유형 선택 (등록) |
| MT-L8-CMP-008 | Switch | `@cocrepo/ui` | 기존 | 활성/비활성 토글 |
| MT-L8-CMP-009 | Button | `@cocrepo/ui` | 기존 | 모든 액션 버튼 |

#### Cell 컴포넌트

| ID | 컴포넌트 | 위치 | 상태 | 설명 |
|----|---------|------|------|------|
| MT-L8-CMP-010 | TemplateTypeChipCell | `@cocrepo/ui` cells | 신규 | 유형 Chip 표시 (EMAIL: primary, SMS: secondary, PUSH: warning) |
| MT-L8-CMP-011 | TemplateActiveToggleCell | `@cocrepo/ui` cells | 신규 | 인라인 Switch 토글 (목록에서 즉시 API 호출) |
| MT-L8-CMP-012 | ActiveStatusCell | `@cocrepo/ui` cells | 기존 | 활성/비활성 뱃지 (상세 화면 등) |
| MT-L8-CMP-013 | DateTimeCell | `@cocrepo/ui` cells | 기존 | 날짜 포맷팅 |

#### Widget 컴포넌트

| ID | 컴포넌트 | 위치 | 상태 | 설명 |
|----|---------|------|------|------|
| MT-L8-CMP-020 | SearchFilterBar | `@cocrepo/ui` widget | 기존 | 검색+필터 영역 |
| MT-L8-CMP-021 | DetailPanel | `@cocrepo/ui` widget | 기존 | 상세 정보 라벨-값 표시 |
| MT-L8-CMP-022 | TemplateTypeBadge | `@cocrepo/ui` widget | 신규 | 유형 Badge (EMAIL/SMS/PUSH 컬러 코딩) |
| MT-L8-CMP-023 | TemplateContentViewer | `@cocrepo/ui` widget | 신규 | 유형별 콘텐츠 읽기 전용 표시 |
| MT-L8-CMP-024 | TemplateContentEditor | `@cocrepo/ui` widget | 신규 | 유형별 콘텐츠 편집 (조건부 필드 렌더링) |
| MT-L8-CMP-025 | HtmlContentRenderer | `@cocrepo/ui` widget | 신규 | HTML 콘텐츠 안전 렌더링 (iframe/shadow DOM) |
| MT-L8-CMP-026 | HtmlEditor | `@cocrepo/ui` widget | 신규 | HTML 편집기 (EMAIL 본문용) |
| MT-L8-CMP-027 | ByteCounter | `@cocrepo/ui` widget | 신규 | SMS 바이트 수 + 장수 카운터 |
| MT-L8-CMP-028 | VariableReadTable | `@cocrepo/ui` widget | 신규 | 변수 목록 읽기 전용 테이블 |
| MT-L8-CMP-029 | VariableEditTable | `@cocrepo/ui` widget | 신규 | 변수 인라인 편집 테이블 (추가/수정/삭제) |
| MT-L8-CMP-030 | PreviewModal | `@cocrepo/ui` widget | 신규 | 미리보기 모달 (변수 입력 + 렌더링 결과) |
| MT-L8-CMP-031 | SendTestModal | `@cocrepo/ui` widget | 신규 | 발송 테스트 모달 (수신자 + 변수 입력 + 결과) |
| MT-L8-CMP-032 | VariableInputForm | `@cocrepo/ui` widget | 신규 | 변수 입력 폼 (미리보기/발송테스트 모달 공통) |

#### Feature 컴포넌트

| ID | 컴포넌트 | 위치 | 상태 | 설명 |
|----|---------|------|------|------|
| MT-L8-CMP-040 | TemplateForm | `@cocrepo/ui` widget/form | 신규 | 등록/수정 공용 폼 (Store 연결, 유형별 동적 필드) |
| MT-L8-CMP-041 | TemplateActions | `@cocrepo/ui` feature | 신규 | 상세 화면 액션 버튼 그룹 (수정/삭제/토글/미리보기/발송테스트) |

### 컴포넌트 상세

---

#### MT-L8-CMP-010: TemplateTypeChipCell

**용도**: DataGrid에서 메시지 유형을 컬러 코딩된 Chip으로 표시

**Props**:
```typescript
interface TemplateTypeChipCellProps {
  type: "EMAIL" | "SMS" | "PUSH";
}
```

**컬러 매핑**:

| 유형 | 색상 (color) | 라벨 |
|------|-------------|------|
| EMAIL | primary | 이메일 |
| SMS | secondary | SMS |
| PUSH | warning | 푸시 |

**렌더링**:
```
[이메일]   ← primary Chip
[SMS]      ← secondary Chip
[푸시]     ← warning Chip
```

---

#### MT-L8-CMP-011: TemplateActiveToggleCell

**용도**: DataGrid 목록에서 인라인으로 활성/비활성을 토글하는 Switch

**Props**:
```typescript
interface TemplateActiveToggleCellProps {
  isActive: boolean;
  templateId: string;
  onToggle: (id: string) => Promise<void>;
}
```

**동작**:
1. Switch 클릭 시 Optimistic UI로 즉시 상태 변경
2. `onToggle` 콜백으로 PATCH toggle-status API 호출
3. 실패 시 롤백 + 에러 토스트

**렌더링**:
```
[v] (활성)    ← Switch on
[ ] (비활성)  ← Switch off
```

---

#### MT-L8-CMP-022: TemplateTypeBadge

**용도**: 상세/수정 화면에서 메시지 유형을 Badge로 표시

**Props**:
```typescript
interface TemplateTypeBadgeProps {
  type: "EMAIL" | "SMS" | "PUSH";
  size?: "sm" | "md" | "lg";
}
```

**컬러 매핑**: TemplateTypeChipCell과 동일

---

#### MT-L8-CMP-023: TemplateContentViewer

**용도**: 상세 화면에서 유형별 콘텐츠를 읽기 전용으로 표시

**Props**:
```typescript
interface TemplateContentViewerProps {
  type: "EMAIL" | "SMS" | "PUSH";
  subject: string | null;
  content: string;
}
```

**유형별 렌더링**:

```
[EMAIL일 때]
제목:  {{userName}}님, 가입을 환영합니다!
본문:  +-----------------------------------------------+
       | <HtmlContentRenderer>                          |
       | 안녕하세요 {{userName}}님,                      |
       | 가입을 환영합니다...                            |
       +-----------------------------------------------+

[SMS일 때]
본문:  [{{verifyCode}}] 인증코드입니다. 5분 내 입력해주세요.
       바이트: 52 / 90 (1장)

[PUSH일 때]
제목:  새로운 알림이 있습니다 (18/50자)
본문:  {{userName}}님, {{orderNo}} 주문이... (45/200자)
```

---

#### MT-L8-CMP-024: TemplateContentEditor

**용도**: 등록/수정 폼에서 유형에 따라 동적으로 콘텐츠 입력 필드를 렌더링

**Props**:
```typescript
interface TemplateContentEditorProps {
  type: "EMAIL" | "SMS" | "PUSH";
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
  errors?: {
    subject?: string;
    content?: string;
  };
}
```

**유형별 필드**:

| 유형 | subject 필드 | content 필드 | 보조 UI |
|------|:----------:|:----------:|---------|
| EMAIL | Input (필수) | HtmlEditor | - |
| SMS | - (숨김) | Textarea | ByteCounter (90바이트/장) |
| PUSH | Input (필수, 50자) | Textarea (200자) | CharacterCounter |

---

#### MT-L8-CMP-025: HtmlContentRenderer

**용도**: EMAIL 유형의 HTML 본문을 안전하게 렌더링 (XSS 방지)

**Props**:
```typescript
interface HtmlContentRendererProps {
  html: string;
  maxHeight?: number;
}
```

**구현 방식**:
- `<iframe>` 또는 Shadow DOM을 사용하여 격리된 환경에서 HTML 렌더링
- 스크립트 태그 제거 (sanitize)
- 최대 높이 제한 + 스크롤

---

#### MT-L8-CMP-026: HtmlEditor

**용도**: EMAIL 유형의 HTML 본문 편집기

**Props**:
```typescript
interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}
```

**구현 방식**:
- 코드 에디터 기반 (Monaco Editor 또는 CodeMirror)
- HTML 구문 하이라이팅
- 기본 도구: 볼드, 이탤릭, 링크, 이미지, 변수 삽입 버튼
- 실시간 미리보기 (선택적, 에디터 우측)

**참고**: 기존 `MarkdownEditor` 위젯이 있으므로 유사한 패턴으로 구현

---

#### MT-L8-CMP-027: ByteCounter

**용도**: SMS 본문의 바이트 수와 장수를 실시간으로 표시

**Props**:
```typescript
interface ByteCounterProps {
  text: string;
  bytesPerMessage?: number; // 기본: 90
}
```

**렌더링**:
```
바이트: 52 / 90 (1장)       ← 정상 (기본 색상)
바이트: 145 / 90 (2장)      ← 초과 (warning 색상)
```

**계산 규칙**:
- 한글: 2바이트, 영문/숫자/특수문자: 1바이트
- 장수 = ceil(총 바이트 / 90)

---

#### MT-L8-CMP-028: VariableReadTable

**용도**: 상세 화면에서 변수 목록을 읽기 전용으로 표시

**Props**:
```typescript
interface VariableReadTableProps {
  variables: TemplateVariableDto[];
}
```

**컬럼 정의**:

| 컬럼 | 필드 | 너비 | 설명 |
|------|------|------|------|
| 변수명 | name | 160px | `{{변수명}}` 형태로 표시 |
| 설명 | description | 200px | 한글 설명 |
| 기본값 | defaultValue | 150px | 기본값 (없으면 `-`) |
| 필수 | isRequired | 80px | Badge (필수/선택) |

**렌더링**:
```
+------------+------------------+--------+------+
| 변수명     | 설명             | 기본값 | 필수 |
+------------+------------------+--------+------+
| {{userName}}| 사용자 이름      | 고객   | [필수]|
| {{orderNo}} | 주문번호        |  -     | [필수]|
| {{appName}} | 서비스명        | 서비스 | [선택]|
+------------+------------------+--------+------+
```

---

#### MT-L8-CMP-029: VariableEditTable

**용도**: 등록/수정 폼에서 변수를 인라인으로 추가/수정/삭제

**Props**:
```typescript
interface VariableEditTableProps {
  variables: VariableEditItem[];
  onChange: (variables: VariableEditItem[]) => void;
  contentText?: string; // 본문 텍스트 (정합성 검증용)
  errors?: Record<number, Record<string, string>>; // 행별 필드별 에러
}

interface VariableEditItem {
  id?: string;           // 기존 변수 ID (수정 시)
  name: string;          // 변수명 (camelCase)
  description: string;   // 설명
  defaultValue: string;  // 기본값
  isRequired: boolean;   // 필수 여부
}
```

**컬럼 정의**:

| 컬럼 | 필드 | 타입 | 너비 | 필수 | 유효성 |
|------|------|------|------|:----:|--------|
| 변수명 | name | Input | 160px | O | `/^[a-zA-Z][a-zA-Z0-9]*$/` |
| 설명 | description | Input | 200px | X | - |
| 기본값 | defaultValue | Input | 150px | X | - |
| 필수 | isRequired | Switch | 80px | X | - |
| 액션 | - | Button | 60px | - | 삭제 확인 |

**동작**:
- `[+ 변수 추가]` 버튼: 빈 행 추가 (`{ name: "", description: "", defaultValue: "", isRequired: false }`)
- 행 내 직접 수정 (인라인 편집)
- `[X]` 삭제 버튼: 해당 행 제거
  - 본문에서 `{{변수명}}`이 사용 중이면 경고 표시 ("본문에서 사용 중인 변수입니다")

**정합성 검증**:
- 본문 텍스트에서 `{{...}}` 패턴 추출
- 본문에 있지만 변수 목록에 없는 변수 -> 경고 배지 표시
- 변수 목록에 있지만 본문에 없는 변수 -> 정보 표시 (경고 아님)

---

#### MT-L8-CMP-030: PreviewModal

**용도**: 상세 화면에서 템플릿 미리보기를 수행하는 모달

**Props**:
```typescript
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  type: "EMAIL" | "SMS" | "PUSH";
  variables: TemplateVariableDto[];
}
```

**구조**:
1. 변수 입력 영역: `VariableInputForm` 사용 (기본값 prefill)
2. [미리보기 실행] 버튼: POST preview API 호출
3. 렌더링 결과 영역:
   - EMAIL: subject + HtmlContentRenderer
   - SMS: content 텍스트 + ByteCounter
   - PUSH: subject + content 카드 형태
4. 미치환 변수 경고: `unresolvedVariables.length > 0` 이면 경고 배지

**상태**:
- idle: 변수 입력 대기
- loading: API 호출 중
- success: 렌더링 결과 표시
- error: 에러 메시지 표시

---

#### MT-L8-CMP-031: SendTestModal

**용도**: 상세 화면에서 테스트 발송을 수행하는 모달

**Props**:
```typescript
interface SendTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  type: "EMAIL" | "SMS" | "PUSH";
  variables: TemplateVariableDto[];
}
```

**유형별 수신자 입력**:

| 유형 | 필드명 | 타입 | placeholder | 유효성 |
|------|--------|------|-------------|--------|
| EMAIL | 이메일 주소 | Input | "test@example.com" | 이메일 형식 |
| SMS | 전화번호 | Input | "010-1234-5678" | 전화번호 형식 |
| PUSH | 디바이스 토큰 | Input | "디바이스 토큰 입력" | 필수 |

**결과 표시**:
```
[성공]
  ✓ 발송 성공 (2026-02-17 15:30:45)

[실패]
  ✗ 발송 실패: SMTP 연결 오류
```

**상태**:
- idle: 입력 대기
- loading: 발송 중 (버튼 비활성화 + 스피너)
- success: 성공 메시지 표시
- error: 에러 메시지 표시

---

#### MT-L8-CMP-032: VariableInputForm

**용도**: 미리보기/발송테스트 모달에서 공통으로 사용하는 변수 입력 폼

**Props**:
```typescript
interface VariableInputFormProps {
  variables: TemplateVariableDto[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}
```

**렌더링**:
```
userName:  [홍길동_________] (필수)
orderNo:   [ORD-20260217___] (필수)
appName:   [서비스__________] (기본값: 서비스)
```

- 필수 변수: Input에 `isRequired` 표시
- 기본값이 있는 변수: Input에 기본값 prefill + placeholder로 "(기본값: xxx)" 표시

---

#### MT-L8-CMP-040: TemplateForm

**용도**: 등록/수정 공용 폼 (Store 연결)

**Props**:
```typescript
interface TemplateFormProps {
  mode: "create" | "edit";
  initialData?: TemplateDto; // 수정 모드일 때 기존 데이터
  onSubmit: (data: CreateTemplateDto | UpdateTemplateDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
```

**내부 구성**:
1. 기본 정보 섹션
   - `mode === "create"`: RadioGroup(type) + Input(code) + Input(name) + Textarea(description)
   - `mode === "edit"`: TemplateTypeBadge(type, 읽기전용) + Text(code, 읽기전용) + Input(name) + Textarea(description)
2. 콘텐츠 섹션: `TemplateContentEditor`
3. 변수 관리 섹션: `VariableEditTable`
4. 버튼 영역: [취소] [등록/저장]

**유효성 검증** (프론트엔드):
- type: 필수 (등록만)
- code: 필수, `/^[A-Z][A-Z0-9_]*$/` (등록만)
- name: 필수
- subject: EMAIL/PUSH일 때 필수, PUSH 50자 제한
- content: 필수, PUSH 200자 제한
- 변수명: `/^[a-zA-Z][a-zA-Z0-9]*$/`, 목록 내 중복 불가

---

#### MT-L8-CMP-041: TemplateActions

**용도**: 상세 화면의 PageSurface actions 영역에 렌더링되는 액션 버튼 그룹

**Props**:
```typescript
interface TemplateActionsProps {
  templateId: string;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onPreview: () => void;
  onSendTest: () => void;
}
```

**렌더링**:
```
[미리보기]  [테스트 발송]  [수정]  [삭제]
```

- 미리보기: variant="flat", 아이콘 포함
- 테스트 발송: variant="flat", 아이콘 포함
- 수정: variant="flat", color="primary"
- 삭제: variant="flat", color="danger"

---

### DataGrid 컬럼 설정

#### 템플릿 목록

```typescript
const templateColumns: ColumnDef<TemplateDto>[] = [
  {
    id: "code",
    header: "코드",
    accessor: "code",
    width: 180,
  },
  {
    id: "name",
    header: "이름",
    accessor: "name",
    width: 200,
    sortable: true,
  },
  {
    id: "type",
    header: "유형",
    cell: ({ row }) => <TemplateTypeChipCell type={row.type} />,
    width: 100,
  },
  {
    id: "isActive",
    header: "활성",
    cell: ({ row }) => (
      <TemplateActiveToggleCell
        isActive={row.isActive}
        templateId={row.id}
        onToggle={handleToggleStatus}
      />
    ),
    width: 80,
  },
  {
    id: "description",
    header: "설명",
    accessor: "description",
    width: 250,
    // DefaultCell에서 자동 truncate 처리
  },
  {
    id: "createdAt",
    header: "등록일",
    cell: ({ row }) => <DateTimeCell value={row.createdAt} format="YYYY-MM-DD" />,
    width: 120,
    sortable: true,
  },
];
```

#### 변수 읽기 전용 테이블 (VariableReadTable)

```typescript
const variableReadColumns: ColumnDef<TemplateVariableDto>[] = [
  {
    id: "name",
    header: "변수명",
    cell: ({ row }) => <span className="font-mono text-sm">{`{{${row.name}}}`}</span>,
    width: 160,
  },
  {
    id: "description",
    header: "설명",
    accessor: "description",
    width: 200,
  },
  {
    id: "defaultValue",
    header: "기본값",
    cell: ({ row }) => row.defaultValue || <span className="text-default-400">-</span>,
    width: 150,
  },
  {
    id: "isRequired",
    header: "필수",
    cell: ({ row }) => (
      <Chip size="sm" color={row.isRequired ? "primary" : "default"} variant="flat">
        {row.isRequired ? "필수" : "선택"}
      </Chip>
    ),
    width: 80,
  },
];
```

### 반응형 대응

#### 브레이크포인트

| 크기 | 범위 | 대응 방식 | 비고 |
|------|------|----------|------|
| Desktop | >=1280px | 전체 UI 표시 | 기본 레이아웃 |
| Tablet | 768-1279px | 설명 컬럼 숨김, 필터 접기 | 핵심 컬럼만 표시 |
| Mobile | <768px | - | 관리자 도구이므로 미지원 |

#### 목록 DataGrid 반응형

| 컬럼 | Desktop | Tablet | 비고 |
|------|:-------:|:------:|------|
| 코드 | O | O | 항상 표시 |
| 이름 | O | O | 항상 표시 |
| 유형 | O | O | 항상 표시 |
| 활성 | O | O | 항상 표시 |
| 설명 | O | X | Tablet에서 숨김 |
| 등록일 | O | X | Tablet에서 숨김 |

### 상태별 UI

#### 로딩 상태

```
+-----------------------------------------------------------------+
| PageSurface (title, actions)                                     |
+-----------------------------------------------------------------+
|  [=====] [====] [====]  (필터 스켈레톤)                          |
+-----------------------------------------------------------------+
|  ██████████████████████████████████████████████████████████████  |
|  ██████████  ██████████████  ████  ████  ██████████  █████████  |
|  ██████████  ██████████████  ████  ████  ██████████  █████████  |
|  ██████████  ██████████████  ████  ████  ██████████  █████████  |
|  ██████████  ██████████████  ████  ████  ██████████  █████████  |
+-----------------------------------------------------------------+
```

- 목록: DataGrid 스켈레톤 행 5개
- 상세: SectionSurface별 스켈레톤 블록

#### 빈 상태 (Empty State)

```
+-----------------------------------------------------------------+
|                                                                  |
|                      [빈 상자 아이콘]                             |
|                                                                  |
|              "등록된 템플릿이 없습니다."                    |
|           "새로운 템플릿을 등록해보세요."                   |
|                                                                  |
|                     [+ 템플릿 등록]                               |
|                                                                  |
+-----------------------------------------------------------------+
```

#### 에러 상태

```
+-----------------------------------------------------------------+
|                                                                  |
|                       [에러 아이콘]                               |
|                                                                  |
|             "데이터를 불러오지 못했습니다."                        |
|             "잠시 후 다시 시도해주세요."                           |
|                                                                  |
|                      [재시도]                                     |
|                                                                  |
+-----------------------------------------------------------------+
```

### 폼 필드 상세 (등록/수정 공통)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| 유형 | RadioGroup | O (등록) | - | - | 등록만 선택 가능, 수정 시 읽기 전용 |
| 코드 | Input | O (등록) | `/^[A-Z][A-Z0-9_]*$/` | "WELCOME_EMAIL" | 등록만 입력, 수정 시 읽기 전용 |
| 이름 | Input | O | 2-100자 | "가입 환영 메시지" | - |
| 설명 | Textarea | X | 최대 500자 | "템플릿에 대한 설명을 입력하세요 (선택)" | - |
| 제목 | Input | 조건부 | EMAIL/PUSH 필수, PUSH 50자 | "메시지 제목을 입력하세요" | EMAIL/PUSH만 표시 |
| 본문 | HtmlEditor/Textarea | O | EMAIL: 제한 없음, PUSH 200자 | "메시지 본문을 입력하세요" | 유형별 다른 에디터 |

### 신규 컴포넌트 파일 경로 (예상)

```
packages/fe-ui/src/components/
├── ui/data-display/cells/
│   ├── TemplateTypeChipCell/
│   │   ├── TemplateTypeChipCell.tsx
│   │   └── index.ts
│   └── TemplateActiveToggleCell/
│       ├── TemplateActiveToggleCell.tsx
│       └── index.ts
├── widget/
│   ├── TemplateTypeBadge/
│   │   ├── TemplateTypeBadge.tsx
│   │   └── index.ts
│   ├── TemplateContentViewer/
│   │   ├── TemplateContentViewer.tsx
│   │   └── index.ts
│   ├── TemplateContentEditor/
│   │   ├── TemplateContentEditor.tsx
│   │   └── index.ts
│   ├── HtmlContentRenderer/
│   │   ├── HtmlContentRenderer.tsx
│   │   └── index.ts
│   ├── HtmlEditor/
│   │   ├── HtmlEditor.tsx
│   │   └── index.ts
│   ├── ByteCounter/
│   │   ├── ByteCounter.tsx
│   │   └── index.ts
│   ├── VariableReadTable/
│   │   ├── VariableReadTable.tsx
│   │   └── index.ts
│   ├── VariableEditTable/
│   │   ├── VariableEditTable.tsx
│   │   └── index.ts
│   ├── PreviewModal/
│   │   ├── PreviewModal.tsx
│   │   └── index.ts
│   ├── SendTestModal/
│   │   ├── SendTestModal.tsx
│   │   └── index.ts
│   ├── VariableInputForm/
│   │   ├── VariableInputForm.tsx
│   │   └── index.ts
│   └── form/
│       └── TemplateForm/
│           ├── TemplateForm.tsx
│           └── index.ts
└── feature/
    └── message-template/
        ├── TemplateActions/
        │   ├── TemplateActions.tsx
        │   └── index.ts
        └── index.ts
```

---

## Requirement Graph (L7-L8)

```json
{
  "level_range": "L7-L8",
  "nodes": [
    {
      "id": "MT-L7-ENT-001",
      "level": 7,
      "subLevel": "1",
      "type": "entity",
      "name": "Template",
      "description": "템플릿 엔티티 (Email/SMS/Push)",
      "metadata": {
        "tableName": "templates",
        "status": "new"
      }
    },
    {
      "id": "MT-L7-ENT-002",
      "level": 7,
      "subLevel": "1",
      "type": "entity",
      "name": "TemplateVariable",
      "description": "템플릿 변수 엔티티 (플레이스홀더 정의)",
      "metadata": {
        "tableName": "template_variables",
        "status": "new"
      }
    },
    {
      "id": "MT-L7-ENM-001",
      "level": 7,
      "subLevel": "1",
      "type": "entity",
      "name": "TemplateType",
      "description": "메시지 유형 Enum (EMAIL, SMS, PUSH)",
      "metadata": {
        "status": "new"
      }
    },
    {
      "id": "MT-L7-FLD-001",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.id",
      "description": "고유 식별자",
      "metadata": {
        "fieldType": "UUID",
        "constraints": ["pk", "required"],
        "defaultValue": "uuid()"
      }
    },
    {
      "id": "MT-L7-FLD-002",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.createdAt",
      "description": "생성 시간",
      "metadata": {
        "fieldType": "DateTime",
        "constraints": ["required"],
        "defaultValue": "now()"
      }
    },
    {
      "id": "MT-L7-FLD-003",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.updatedAt",
      "description": "수정 시간",
      "metadata": {
        "fieldType": "DateTime",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-004",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.removedAt",
      "description": "소프트 삭제 시간",
      "metadata": {
        "fieldType": "DateTime",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-005",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.code",
      "description": "시스템 고유 코드",
      "metadata": {
        "fieldType": "String",
        "constraints": ["unique", "required", "index"]
      }
    },
    {
      "id": "MT-L7-FLD-006",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.name",
      "description": "한글 이름",
      "metadata": {
        "fieldType": "String",
        "constraints": ["required"]
      }
    },
    {
      "id": "MT-L7-FLD-007",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.type",
      "description": "유형 (EMAIL/SMS/PUSH)",
      "metadata": {
        "fieldType": "Enum",
        "constraints": ["required"],
        "enumValues": ["EMAIL", "SMS", "PUSH"]
      }
    },
    {
      "id": "MT-L7-FLD-008",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.subject",
      "description": "제목 (EMAIL, PUSH에서 사용)",
      "metadata": {
        "fieldType": "String",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-009",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.content",
      "description": "본문 (EMAIL: HTML, SMS/PUSH: 텍스트)",
      "metadata": {
        "fieldType": "String",
        "constraints": ["required"]
      }
    },
    {
      "id": "MT-L7-FLD-010",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.description",
      "description": "설명",
      "metadata": {
        "fieldType": "String",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-011",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "Template.isActive",
      "description": "활성 상태",
      "metadata": {
        "fieldType": "Boolean",
        "constraints": ["required"],
        "defaultValue": "true"
      }
    },
    {
      "id": "MT-L7-FLD-012",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.id",
      "description": "고유 식별자",
      "metadata": {
        "fieldType": "UUID",
        "constraints": ["pk", "required"],
        "defaultValue": "uuid()"
      }
    },
    {
      "id": "MT-L7-FLD-013",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.createdAt",
      "description": "생성 시간",
      "metadata": {
        "fieldType": "DateTime",
        "constraints": ["required"],
        "defaultValue": "now()"
      }
    },
    {
      "id": "MT-L7-FLD-014",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.updatedAt",
      "description": "수정 시간",
      "metadata": {
        "fieldType": "DateTime",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-015",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.name",
      "description": "변수명 (camelCase)",
      "metadata": {
        "fieldType": "String",
        "constraints": ["required"]
      }
    },
    {
      "id": "MT-L7-FLD-016",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.description",
      "description": "한글 설명",
      "metadata": {
        "fieldType": "String",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-017",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.defaultValue",
      "description": "기본값",
      "metadata": {
        "fieldType": "String",
        "constraints": ["optional"]
      }
    },
    {
      "id": "MT-L7-FLD-018",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.isRequired",
      "description": "필수 여부",
      "metadata": {
        "fieldType": "Boolean",
        "constraints": ["required"],
        "defaultValue": "false"
      }
    },
    {
      "id": "MT-L7-FLD-019",
      "level": 7,
      "subLevel": "2",
      "type": "entity",
      "name": "TemplateVariable.templateId",
      "description": "소속 템플릿 ID (FK)",
      "metadata": {
        "fieldType": "UUID",
        "constraints": ["fk", "required", "index"],
        "references": "Template.id"
      }
    },
    {
      "id": "MT-L8-CMP-010",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateTypeChipCell",
      "description": "유형 Chip 표시 (EMAIL: primary, SMS: secondary, PUSH: warning)",
      "metadata": {
        "componentType": "ui",
        "props": {
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\""
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-011",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateActiveToggleCell",
      "description": "인라인 Switch 토글 (목록에서 즉시 API 호출)",
      "metadata": {
        "componentType": "ui",
        "props": {
          "isActive": "boolean",
          "templateId": "string",
          "onToggle": "(id: string) => Promise<void>"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-022",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateTypeBadge",
      "description": "유형 Badge (EMAIL/SMS/PUSH 컬러 코딩)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\"",
          "size": "\"sm\" | \"md\" | \"lg\""
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-023",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateContentViewer",
      "description": "유형별 콘텐츠 읽기 전용 표시",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\"",
          "subject": "string | null",
          "content": "string"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-024",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateContentEditor",
      "description": "유형별 콘텐츠 편집 (조건부 필드 렌더링)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\"",
          "subject": "string",
          "content": "string",
          "onSubjectChange": "(value: string) => void",
          "onContentChange": "(value: string) => void"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-025",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "HtmlContentRenderer",
      "description": "HTML 콘텐츠 안전 렌더링 (iframe/shadow DOM)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "html": "string",
          "maxHeight": "number"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-026",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "HtmlEditor",
      "description": "HTML 편집기 (EMAIL 본문용)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "value": "string",
          "onChange": "(value: string) => void",
          "placeholder": "string"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-027",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "ByteCounter",
      "description": "SMS 바이트 수 + 장수 카운터",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "text": "string",
          "bytesPerMessage": "number"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-028",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "VariableReadTable",
      "description": "변수 목록 읽기 전용 테이블",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "variables": "TemplateVariableDto[]"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-029",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "VariableEditTable",
      "description": "변수 인라인 편집 테이블 (추가/수정/삭제)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "variables": "VariableEditItem[]",
          "onChange": "(variables: VariableEditItem[]) => void",
          "contentText": "string"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-030",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "PreviewModal",
      "description": "미리보기 모달 (변수 입력 + 렌더링 결과)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "isOpen": "boolean",
          "onClose": "() => void",
          "templateId": "string",
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\"",
          "variables": "TemplateVariableDto[]"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-031",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "SendTestModal",
      "description": "발송 테스트 모달 (수신자 + 변수 입력 + 결과)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "isOpen": "boolean",
          "onClose": "() => void",
          "templateId": "string",
          "type": "\"EMAIL\" | \"SMS\" | \"PUSH\"",
          "variables": "TemplateVariableDto[]"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-032",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "VariableInputForm",
      "description": "변수 입력 폼 (미리보기/발송테스트 모달 공통)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "variables": "TemplateVariableDto[]",
          "values": "Record<string, string>",
          "onChange": "(values: Record<string, string>) => void"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-040",
      "level": 8,
      "subLevel": "2",
      "type": "component",
      "name": "TemplateForm",
      "description": "등록/수정 공용 폼 (유형별 동적 필드, 변수 관리 포함)",
      "metadata": {
        "componentType": "widgets",
        "props": {
          "mode": "\"create\" | \"edit\"",
          "initialData": "TemplateDto",
          "onSubmit": "(data) => Promise<void>",
          "onCancel": "() => void",
          "isSubmitting": "boolean"
        },
        "existing": false
      }
    },
    {
      "id": "MT-L8-CMP-041",
      "level": 8,
      "subLevel": "3",
      "type": "component",
      "name": "TemplateActions",
      "description": "상세 화면 액션 버튼 그룹 (수정/삭제/토글/미리보기/발송테스트)",
      "metadata": {
        "componentType": "features",
        "props": {
          "templateId": "string",
          "isActive": "boolean",
          "onEdit": "() => void",
          "onDelete": "() => void",
          "onToggle": "() => void",
          "onPreview": "() => void",
          "onSendTest": "() => void"
        },
        "existing": false
      }
    }
  ],
  "edges": [
    { "id": "e-mt-050", "source": "MT-L6-API-001", "target": "MT-L7-ENT-001", "type": "stores", "label": "목록 조회" },
    { "id": "e-mt-051", "source": "MT-L6-API-002", "target": "MT-L7-ENT-001", "type": "stores", "label": "상세 조회" },
    { "id": "e-mt-052", "source": "MT-L6-API-003", "target": "MT-L7-ENT-001", "type": "stores", "label": "등록" },
    { "id": "e-mt-053", "source": "MT-L6-API-004", "target": "MT-L7-ENT-001", "type": "stores", "label": "수정" },
    { "id": "e-mt-054", "source": "MT-L6-API-005", "target": "MT-L7-ENT-001", "type": "stores", "label": "삭제" },
    { "id": "e-mt-055", "source": "MT-L6-API-006", "target": "MT-L7-ENT-001", "type": "stores", "label": "활성 토글" },
    { "id": "e-mt-056", "source": "MT-L6-API-007", "target": "MT-L7-ENT-001", "type": "stores", "label": "미리보기" },
    { "id": "e-mt-057", "source": "MT-L6-API-008", "target": "MT-L7-ENT-001", "type": "stores", "label": "발송 테스트" },
    { "id": "e-mt-058", "source": "MT-L6-API-002", "target": "MT-L7-ENT-002", "type": "stores", "label": "변수 포함 조회" },
    { "id": "e-mt-059", "source": "MT-L6-API-003", "target": "MT-L7-ENT-002", "type": "stores", "label": "변수 포함 등록" },
    { "id": "e-mt-060", "source": "MT-L6-API-004", "target": "MT-L7-ENT-002", "type": "stores", "label": "변수 포함 수정" },
    { "id": "e-mt-070", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-001", "type": "parent" },
    { "id": "e-mt-071", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-002", "type": "parent" },
    { "id": "e-mt-072", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-003", "type": "parent" },
    { "id": "e-mt-073", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-004", "type": "parent" },
    { "id": "e-mt-074", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-005", "type": "parent" },
    { "id": "e-mt-075", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-006", "type": "parent" },
    { "id": "e-mt-076", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-007", "type": "parent" },
    { "id": "e-mt-077", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-008", "type": "parent" },
    { "id": "e-mt-078", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-009", "type": "parent" },
    { "id": "e-mt-079", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-010", "type": "parent" },
    { "id": "e-mt-080", "source": "MT-L7-ENT-001", "target": "MT-L7-FLD-011", "type": "parent" },
    { "id": "e-mt-081", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-012", "type": "parent" },
    { "id": "e-mt-082", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-013", "type": "parent" },
    { "id": "e-mt-083", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-014", "type": "parent" },
    { "id": "e-mt-084", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-015", "type": "parent" },
    { "id": "e-mt-085", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-016", "type": "parent" },
    { "id": "e-mt-086", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-017", "type": "parent" },
    { "id": "e-mt-087", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-018", "type": "parent" },
    { "id": "e-mt-088", "source": "MT-L7-ENT-002", "target": "MT-L7-FLD-019", "type": "parent" },
    { "id": "e-mt-089", "source": "MT-L7-ENT-002", "target": "MT-L7-ENT-001", "type": "depends", "label": "템플릿 참조 (FK)" },
    { "id": "e-mt-100", "source": "MT-L4-SCR-001", "target": "MT-L8-CMP-010", "type": "uses", "label": "유형 표시" },
    { "id": "e-mt-101", "source": "MT-L4-SCR-001", "target": "MT-L8-CMP-011", "type": "uses", "label": "인라인 토글" },
    { "id": "e-mt-102", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-022", "type": "uses", "label": "유형 Badge" },
    { "id": "e-mt-103", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-023", "type": "uses", "label": "콘텐츠 뷰어" },
    { "id": "e-mt-104", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-028", "type": "uses", "label": "변수 읽기 테이블" },
    { "id": "e-mt-105", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-030", "type": "uses", "label": "미리보기 모달" },
    { "id": "e-mt-106", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-031", "type": "uses", "label": "발송 테스트 모달" },
    { "id": "e-mt-107", "source": "MT-L4-SCR-002", "target": "MT-L8-CMP-041", "type": "uses", "label": "액션 버튼" },
    { "id": "e-mt-108", "source": "MT-L4-SCR-003", "target": "MT-L8-CMP-040", "type": "uses", "label": "등록 폼" },
    { "id": "e-mt-109", "source": "MT-L4-SCR-003", "target": "MT-L8-CMP-024", "type": "uses", "label": "콘텐츠 에디터" },
    { "id": "e-mt-110", "source": "MT-L4-SCR-003", "target": "MT-L8-CMP-029", "type": "uses", "label": "변수 편집 테이블" },
    { "id": "e-mt-111", "source": "MT-L4-SCR-004", "target": "MT-L8-CMP-040", "type": "uses", "label": "수정 폼" },
    { "id": "e-mt-112", "source": "MT-L4-SCR-004", "target": "MT-L8-CMP-024", "type": "uses", "label": "콘텐츠 에디터" },
    { "id": "e-mt-113", "source": "MT-L4-SCR-004", "target": "MT-L8-CMP-029", "type": "uses", "label": "변수 편집 테이블" },
    { "id": "e-mt-114", "source": "MT-L8-CMP-023", "target": "MT-L8-CMP-025", "type": "uses", "label": "HTML 렌더링" },
    { "id": "e-mt-115", "source": "MT-L8-CMP-023", "target": "MT-L8-CMP-027", "type": "uses", "label": "바이트 카운터" },
    { "id": "e-mt-116", "source": "MT-L8-CMP-024", "target": "MT-L8-CMP-026", "type": "uses", "label": "HTML 에디터" },
    { "id": "e-mt-117", "source": "MT-L8-CMP-024", "target": "MT-L8-CMP-027", "type": "uses", "label": "바이트 카운터" },
    { "id": "e-mt-118", "source": "MT-L8-CMP-030", "target": "MT-L8-CMP-032", "type": "uses", "label": "변수 입력 폼" },
    { "id": "e-mt-119", "source": "MT-L8-CMP-030", "target": "MT-L8-CMP-025", "type": "uses", "label": "HTML 렌더링" },
    { "id": "e-mt-120", "source": "MT-L8-CMP-031", "target": "MT-L8-CMP-032", "type": "uses", "label": "변수 입력 폼" },
    { "id": "e-mt-121", "source": "MT-L8-CMP-040", "target": "MT-L8-CMP-024", "type": "uses", "label": "콘텐츠 에디터" },
    { "id": "e-mt-122", "source": "MT-L8-CMP-040", "target": "MT-L8-CMP-029", "type": "uses", "label": "변수 편집 테이블" },
    { "id": "e-mt-123", "source": "MT-L8-CMP-040", "target": "MT-L8-CMP-022", "type": "uses", "label": "유형 Badge (수정모드)" }
  ]
}
```

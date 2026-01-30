# 04. UI 상세

> L7-L8 레이어 기반 기획서

---

## 1. 데이터 모델 (Entity - L7)

### 1.1 Role (역할)

```typescript
// packages/prisma/schema/role.prisma
model Role {
  id           String     @id @default(uuid())
  name         String     @unique // SUPER_ADMIN, ADMIN, USER
  displayName  String?
  description  String?
  isSystem     Boolean    @default(false)
  abilities    Ability[]
  tenants      Tenant[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@map("roles")
}
```

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | 역할 이름 (영문 대문자) | @unique, 예: SUPER_ADMIN |
| displayName | String? | 한글 표시명 | 예: 최고 관리자 |
| description | String? | 설명 | - |
| isSystem | Boolean | 시스템 역할 여부 | @default(false) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

**시스템 기본 역할:**
- `SUPER_ADMIN`: 모든 권한 보유
- `ADMIN`: 관리 권한
- `USER`: 일반 사용자

---

### 1.2 Subject (권한 대상)

```typescript
// packages/prisma/schema/subject.prisma
model Subject {
  id          String     @id @default(uuid())
  name        String     @unique // entity:User, menu:members
  displayName String?
  icon        String?
  order       Int        @default(0)
  isSystem    Boolean    @default(false)
  group       String?    // entity, menu, feature, ui
  abilities   Ability[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("subjects")
}
```

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | Subject 이름 | @unique |
| displayName | String? | 한글 표시명 | - |
| icon | String? | 아이콘 | - |
| order | Int | 정렬 순서 | @default(0) |
| isSystem | Boolean | 시스템 Subject 여부 | @default(false) |
| group | String? | 그룹 | entity, menu, feature, ui |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

**Subject 유형:**
| 유형 | 패턴 | 예시 | 설명 |
|-----|------|------|------|
| 엔티티 | `entity:{ModelName}` | `entity:User`, `entity:Ground` | Prisma 모델 기반 CRUD 권한 |
| 메뉴 | `menu:{path}` | `menu:members`, `menu:settings` | 메뉴 접근 권한 |
| 기능 | `feature:{name}` | `feature:export`, `feature:bulk-delete` | 기능 사용 권한 |
| UI 요소 | `ui:{element}` | `ui:sidebar`, `ui:bottom-tab` | UI 가시성 권한 |

---

### 1.3 Action (행위)

```typescript
// packages/prisma/schema/action.prisma
model Action {
  id          String    @id @default(uuid())
  name        String    @unique // create, read:masked:email
  displayName String?
  description String?
  group       String?   // crud, visibility, bulk, workflow
  order       Int       @default(0)
  isSystem    Boolean   @default(false)
  config      Json?     // 마스킹, 포맷팅 등 설정

  abilities   Ability[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("actions")
}
```

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | Action 이름 | @unique |
| displayName | String? | 한글 표시명 | - |
| description | String? | 설명 | - |
| group | String? | 그룹 | crud, visibility, bulk, workflow |
| order | Int | 정렬 순서 | @default(0) |
| isSystem | Boolean | 시스템 Action 여부 | @default(false) |
| config | Json? | 설정 | 마스킹, 포맷팅 등 |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

**Action 그룹:**
| 그룹 | Action | 설명 |
|-----|--------|------|
| **crud** | CREATE, READ, UPDATE, DELETE, MANAGE | 기본 CRUD 권한 |
| **visibility** | READ:FULL, READ:HIDDEN, READ:MASKED:* | 가시성 및 마스킹 |
| **bulk** | EXPORT, IMPORT | 대량 작업 |
| **workflow** | APPROVE, REJECT | 승인/거절 |

**Action Config 예시 (마스킹):**
```json
{
  "type": "masking",
  "preset": "PRESET_EMAIL"
}
```

---

### 1.4 Ability (권한)

```typescript
// packages/prisma/schema/ability.prisma
model Ability {
  id         String   @id @default(uuid())
  subjectId  String
  actionId   String
  fields     String[] // 대상 필드 목록
  conditions Json?    // 권한 조건 (ABAC)
  inverted   Boolean  @default(false)
  reason     String?
  roleId     String?
  userId     String?
  name       String?
  description String?
  isActive   Boolean  @default(true)
  priority   Int      @default(0)

  subject    Subject  @relation(fields: [subjectId], references: [id])
  action     Action   @relation(fields: [actionId], references: [id])
  role       Role?    @relation(fields: [roleId], references: [id])
  user       User?    @relation(fields: [userId], references: [id])

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("abilities")
}
```

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| subjectId | String | Subject FK | - |
| actionId | String | Action FK | - |
| fields | String[] | 대상 필드 목록 | - |
| conditions | Json? | 권한 조건 (ABAC) | 예: `{ "id": "${user.id}" }` |
| inverted | Boolean | 거부 여부 | false: can, true: cannot |
| reason | String? | 거부 사유 | - |
| roleId | String? | Role FK (기본 권한) | - |
| userId | String? | User FK (예외 권한) | - |
| name | String? | 권한 이름 | - |
| description | String? | 권한 설명 | - |
| isActive | Boolean | 활성화 여부 | @default(true) |
| priority | Int | 우선순위 | 높을수록 우선 |

**권한 유형:**
| 유형 | 설명 | 우선순위 |
|-----|------|---------|
| **Role 기본 권한** | Role에 기본적으로 부여되는 권한 | 낮음 (0) |
| **User 예외 권한** | 특정 사용자에게 예외로 부여/제거하는 권한 | 높음 (10+) |

**Conditions 템플릿 변수:**
| 변수 | 설명 | 예시 |
|-----|------|------|
| `${user.id}` | 사용자 ID | 본인 정보만 접근 |
| `${user.spaceId}` | 사용자 기본 Space ID | 동일 Space 리소스 접근 |
| `${user.currentSpaceId}` | 현재 선택된 Space ID | 현재 Space 리소스 접근 |
| `${user.email}` | 사용자 이메일 | |
| `${user.name}` | 사용자 이름 | |
| `${user.currentTenantId}` | 현재 Tenant ID | |
| `${user.currentRoleId}` | 현재 Role ID | |

---

### 1.5 Tenant (테넌트)

```typescript
// packages/prisma/schema/tenant.prisma
model Tenant {
  id          String   @id @default(uuid())
  userId      String
  spaceId     String
  roleId      String

  user        User     @relation(fields: [userId], references: [id])
  space       Space    @relation(fields: [spaceId], references: [id])
  role        Role     @relation(fields: [roleId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tenants")
}
```

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| userId | String | User FK | - |
| spaceId | String | Space FK | - |
| roleId | String | Role FK | - |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

---

## 2. UI 컴포넌트 (Component - L8)

### 2.1 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 경로 | 용도 |
|----------|------|------|------|
| Button | ui | `packages/ui/src/components/ui/Button` | 액션 버튼 |
| DataTable | ui | `packages/ui/src/components/ui/DataTable` | 테이블 표시 |
| TextInput | inputs | `packages/ui/src/components/inputs/TextInput` | 폼 입력 |
| TextArea | inputs | `packages/ui/src/components/inputs/TextArea` | 긴 텍스트 입력 |
| Select | inputs | `packages/ui/src/components/inputs/Select` | 드롭다운 선택 |
| Switch | inputs | `packages/ui/src/components/inputs/Switch` | 토글 스위치 |
| Tab | features | `packages/ui/src/components/features/Tab` | 탭 네비게이션 |
| PageSurface | layouts | `packages/ui/src/components/layouts/PageSurface` | 페이지 레이아웃 |
| SectionSurface | layouts | `packages/ui/src/components/layouts/SectionSurface` | 섹션 래퍼 |
| Modal | ui | `packages/ui/src/components/ui/Modal` | 모달/다이얼로그 |

---

### 2.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| AbilityMatrix | widgets | Subject × Action 매트릭스 (체크박스 그리드) | widget-builder |
| ConditionsEditor | features | JSON 기반 Conditions 편집기 | feature-builder |
| SystemBadge | ui | 시스템 여부 뱃지 (아이콘) | ui-component-builder |
| PriorityInput | inputs | 우선순위 입력 (숫자 + 설명) | input-component-builder |
| VisibilityMatrix | widgets | UI 요소 × Role 가시성 매트릭스 | widget-builder |

---

### 2.3 컴포넌트 상세 설계

#### 컴포넌트 1: AbilityMatrix (Widget)

**파일 경로:** `packages/ui/src/components/widgets/AbilityMatrix.tsx`

**설명:** Subject × Action 매트릭스 형태의 권한 설정 위젯

**Props:**
```typescript
interface AbilityMatrixProps {
  subjects: Subject[];      // Subject 목록
  actions: Action[];       // Action 목록 (그룹 필터링됨)
  abilities: Ability[];    // 현재 권한 목록
  onChange: (subjectId: string, actionId: string, checked: boolean) => void;
  disabled?: boolean;      // 비활성화 여부
}
```

**UI 구조:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Ability Matrix                              │
├─────────────────────────────────────────────────────────────────┤
│               CREATE  READ  UPDATE  DELETE  MANAGE               │
├─────────────────────────────────────────────────────────────────┤
│ entity:User    [ ]    [x]    [ ]      [ ]      [ ]               │
│ entity:Ground  [ ]    [x]    [x]      [ ]      [ ]               │
│ menu:members   [ ]    [ ]    [ ]      [ ]      [ ]               │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 컴포넌트 2: ConditionsEditor (Feature)

**파일 경로:** `packages/ui/src/components/features/ConditionsEditor.tsx`

**설명:** JSON 기반 Conditions 편집기 (템플릿 변수 자동완성)

**Props:**
```typescript
interface ConditionsEditorProps {
  value: object | null;
  onChange: (value: object | null) => void;
  templateVariables?: TemplateVariable[]; // 사용 가능한 템플릿 변수
  disabled?: boolean;
}
```

**UI 구조:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Conditions                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                               │
│    "id": "${user.id}",                                          │
│    "spaceId": "${user.currentSpaceId}"                         │
│  }                                                               │
│                                                                 │
│  [텍스트 영역 - JSON Editor]                                     │
│                                                                 │
│  💡 사용 가능한 템플릿 변수:                                       │
│  - ${user.id}        사용자 ID                                   │
│  - ${user.spaceId}   사용자 Space ID                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 컴포넌트 3: SystemBadge (UI)

**파일 경로:** `packages/ui/src/components/ui/SystemBadge.tsx`

**설명:** 시스템 여부 표시 뱃지

**Props:**
```typescript
interface SystemBadgeProps {
  isSystem: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**UI 구조:**
```
시스템 (아이콘 + 텍스트)
```

---

#### 컴포넌트 4: PriorityInput (Input)

**파일 경로:** `packages/ui/src/components/inputs/PriorityInput.tsx`

**설명:** 우선순위 입력 (숫자 + 설명)

**Props:**
```typescript
interface PriorityInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

**UI 구조:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 우선순위                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Role 기본 권한 (0)                                              │
│  User 예외 권한 (10+)                                           │
│                                                                 │
│  [숫자 입력 필드]  [설명 텍스트]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 컴포넌트 5: VisibilityMatrix (Widget)

**파일 경로:** `packages/ui/src/components/widgets/VisibilityMatrix.tsx`

**설명:** UI 요소 × Role 가시성 매트릭스

**Props:**
```typescript
interface VisibilityMatrixProps {
  uiElements: string[];     // UI 요소 목록
  roles: Role[];            // Role 목록
  visibility: Record<string, Record<string, boolean>>; // 가시성 데이터
  onChange: (uiElement: string, roleId: string, visible: boolean) => void;
  disabled?: boolean;
}
```

**UI 구조:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Visibility Matrix                           │
├─────────────────────────────────────────────────────────────────┤
│              SUPER_ADMIN  ADMIN  USER                           │
├─────────────────────────────────────────────────────────────────┤
│ ui:sidebar         [x]       [x]    [ ]                          │
│ ui:bottom-tab      [ ]       [ ]    [x]                          │
│ menu:members       [x]       [x]    [ ]                          │
│ menu:settings      [x]       [x]    [ ]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.4 컴포넌트 배치도

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           PageSurface (layouts)                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  [Page Title] [Description]                                               │
│                                                                          │
│  [Tab Navigation]                                                         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  SectionSurface (layouts)                                            │ │
│  │                                                                      │ │
│  │  [Filter Section]                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │ Role 선택: [Select]  Subject 그룹: [Select]                  │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                                                                      │ │
│  │  [Ability Matrix Section]                                            │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │               AbilityMatrix (widgets)                       │   │ │
│  │  │                                                               │   │ │
│  │  │               CREATE  READ  UPDATE  DELETE  MANAGE            │   │ │
│  │  │ entity:User    [ ]    [x]    [ ]      [ ]      [ ]            │   │ │
│  │  │ entity:Ground  [ ]    [x]    [x]      [ ]      [ ]            │   │ │
│  │  │                                                               │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                                                                      │ │
│  │  [Conditions Editor Section]                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │            ConditionsEditor (features)                       │   │ │
│  │  │                                                               │   │ │
│  │  │  { "id": "${user.id}" }                                       │   │ │
│  │  │                                                               │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                                                                      │ │
│  │  [Action Buttons]                                                    │ │
│  │  [저장] [초기화]  Button (ui)                                      │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

컴포넌트 계층:
PageSurface (layouts)
├── Tab (features)
└── SectionSurface (layouts)
    ├── Select (inputs) × 2
    ├── AbilityMatrix (widgets)
    ├── ConditionsEditor (features)
    └── Button (ui) × 2
```

---

## 3. Store 설계

### 3.1 PermissionStore

**파일 경로:** `packages/store/src/PermissionStore.ts`

**설명:** 권한 관리 관련 상태 관리

**속성:**
```typescript
class PermissionStore {
  // 역할 목록
  roles: Role[] = [];

  // 현재 선택된 역할
  selectedRole: Role | null = null;

  // Subject 목록
  subjects: Subject[] = [];

  // Action 목록
  actions: Action[] = [];

  // 현재 사용자 권한
  userAbilities: Ability[] = [];

  // CASL Ability 객체
  ability: AppAbility | null = null;
}
```

**메서드:**
```typescript
class PermissionStore {
  // 역할 관리
  loadRoles(): Promise<void>;
  createRole(data: CreateRoleDto): Promise<void>;
  updateRole(id: string, data: UpdateRoleDto): Promise<void>;
  deleteRole(id: string): Promise<void>;

  // 권한 관리
  loadAbilities(): Promise<void>;
  updateRoleAbilities(roleId: string, abilities: UpdateAbilityDto[]): Promise<void>;

  // CASL Ability 생성
  buildAbility(): void;

  // 권한 확인
  can(action: string, subject: string, conditions?: object): boolean;
}
```

---

## 4. 마스킹 프리셋

```typescript
// packages/constant/src/masking.ts

export const MASKING_PRESETS = {
  PRESET_EMAIL: {
    pattern: /^(.{3}).*(.{10})$/,
    replacement: "$1***$2",
    example: "ex***@domain.com"
  },
  PRESET_PHONE: {
    pattern: /^(\d{3})-(\d{4}).*$/,
    replacement: "$1-$2****",
    example: "010-1234-****"
  },
  PRESET_NAME: {
    pattern: /^(.).*$/,
    replacement: "$1***",
    example: "홍***"
  },
  PRESET_SSN: {
    pattern: /^\d{6}-\d{7}$/,
    replacement: "******-*******",
    example: "******-*******"
  },
  PRESET_CARD: {
    pattern: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
    replacement: "****-****-****-$4",
    example: "****-****-****-1234"
  }
};
```

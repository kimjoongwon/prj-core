# CASL 권한 시스템 기술 설계 문서

**원본 기획서:** `.claude/plans/2025-12-30-CASL-Permission-System.md`
**작성일:** 2026-01-08
**작성자:** technical-designer

---

## 1. 컴포넌트 분석

### 1.1 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 경로 | 용도 |
|----------|------|------|------|
| Button | inputs | components/inputs/Button | 저장, 취소, 추가 버튼 |
| Select | inputs | components/inputs/Select | Subject/Action 선택 |
| Input | inputs | components/inputs/Input | 검색, 이름 입력 |
| Switch | inputs | components/inputs/Switch | 권한 활성화/비활성화 |
| Checkbox | inputs | components/inputs/Checkbox | 필드 선택 |
| Tabs | inputs | components/inputs/Tabs | Role/User 탭 전환 |
| Table | ui/data-display | components/ui/data-display/Table | 권한 목록 테이블 |
| DataGrid | ui/data-display | components/ui/data-display/DataGrid | 매트릭스 뷰 |
| Chip | ui/data-display | components/ui/data-display/Chip | 상태 표시 |
| Modal | layouts | components/layouts/Modal | 권한 추가/수정 모달 |
| PageLayout | layouts | components/layouts/PageLayout | 페이지 레이아웃 |

### 1.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| VisibilityCell | ui | 가시성 상태 셀 (전체/부분/숨김) | ui-component-builder |
| MaskingPatternSelector | widget | 마스킹 패턴 선택 위젯 | widget-builder |
| FieldVisibilityMatrix | widget | 필드 가시성 매트릭스 테이블 | widget-builder |
| AbilityRuleList | widget | 권한 규칙 목록 위젯 | widget-builder |
| ConditionEditor | widget | JSON 조건 편집기 | widget-builder |
| AbilityFormModal | widget | 권한 추가/수정 폼 모달 | widget-builder |
| FieldVisibilityManager | feature | 필드 가시성 관리 (Store 연결) | feature-builder |
| RoleAbilityManager | feature | Role별 ABAC 권한 관리 | feature-builder |
| UserAbilityManager | feature | User별 예외 권한 관리 | feature-builder |

### 1.3 Widget -> Feature 분리 기준

```
Widget (순수 UI)                Feature (비즈니스 로직)
-----------------------------------------------------------------
FieldVisibilityMatrix          -> FieldVisibilityManager (Store 연결)
AbilityRuleList                -> RoleAbilityManager (Role API 연결)
AbilityRuleList                -> UserAbilityManager (User API 연결)
ConditionEditor                -> (Widget만으로 충분)
MaskingPatternSelector         -> (Widget만으로 충분)
AbilityFormModal               -> (Widget만으로 충분)
```

### 1.4 컴포넌트 배치도

#### 8.4.2 메인 화면 - 매트릭스 뷰

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              필드 가시성 관리                                                     │ ← PageLayout(layouts)
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                   │
│  엔티티 선택: [User ▼]                                                      [저장] [초기화]       │ ← Select(inputs), Button(inputs)
│                                                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤ ← FieldVisibilityManager(feature) 영역 시작
│                                                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │               │ SUPER │         관리자 (ADMIN)          │          사용자 (USER)           │ │ ← FieldVisibilityMatrix(widget)
│  │ 필드명        │ ADMIN ├─────────┬─────────┬──────┬──────┼─────────┬─────────┬─────────────┤ │
│  │               │ (고정)│ MANAGER │ TRAINER │FRONT │ACCNT │ MEMBER  │ MEMBER  │   MEMBER    │ │
│  │               │       │         │         │ DESK │      │ NORMAL  │   VIP   │  BLACKLIST  │ │
│  ├───────────────┼───────┼─────────┼─────────┼──────┼──────┼─────────┼─────────┼─────────────┤ │
│  │ name          │  ✅   │   ✅    │   ✅    │  ✅  │  ✅  │   ✅    │   ✅    │     ✅      │ │ ← VisibilityCell(ui) x N
│  │ email         │  ✅   │   ✅    │   ✅    │  ❌  │  ⚠️  │   ❌    │   ✅    │     ❌      │ │
│  │ phone         │  ✅   │   ✅    │   ✅    │  ✅  │  ⚠️  │   ❌    │   ✅    │     ❌      │ │
│  │ ...           │  ...  │   ...   │   ...   │  ... │  ... │   ...   │   ...   │     ...     │ │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                   │
│  범례: ✅ 전체 공개  ⚠️ 부분 마스킹  ❌ 숨김                                                       │ ← Chip(ui) x 3
│                                                                                                   │
│  💡 SUPER_ADMIN은 모든 필드에 접근 가능하며, 수정할 수 없습니다 (시스템 고정)                         │
│                                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

컴포넌트 계층 요약:
PageLayout
├── Select (inputs) ─── Subject 선택
├── Button (inputs) x 2 ─── 저장, 초기화
└── FieldVisibilityManager (feature) ─── FieldVisibilityStore 연동
    ├── FieldVisibilityMatrix (widget)
    │   └── VisibilityCell (ui) x N ─── 각 셀 클릭 시 팝오버
    └── Chip (ui) x 3 ─── 범례
```

#### 8.4.3 셀 클릭 시 - 가시성 옵션 선택 팝오버

```
┌─────────────────────────────────────────────┐
│  email - ACCOUNTANT 가시성 설정              │ ← Popover(layouts) 또는 Modal(layouts)
├─────────────────────────────────────────────┤
│                                              │
│  ● 전체 공개                                 │ ← RadioGroup(inputs)
│    예시: minsu.kim92@gmail.com               │
│                                              │
│  ○ 부분 마스킹                    [패턴 설정] │ ← Button(inputs) → MaskingPatternSelector 열기
│    예시: min***@gmail.com                    │
│                                              │
│  ○ 숨김 (필드 제외)                          │
│    해당 필드가 응답에 포함되지 않음            │
│                                              │
│                        [취소]  [적용]        │ ← Button(inputs) x 2
└─────────────────────────────────────────────┘

컴포넌트 계층 요약:
Popover 또는 Modal
├── RadioGroup (inputs) ─── 가시성 옵션 3가지
├── Button (inputs) ─── "패턴 설정" (조건부 표시)
└── Button (inputs) x 2 ─── 취소, 적용
```

#### 8.4.4 마스킹 패턴 설정 모달

```
┌─────────────────────────────────────────────────────────────────┐
│                    마스킹 패턴 설정                               │ ← Modal(layouts)
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  필드: email                                                     │
│  필드 타입: [이메일 ▼]                                            │ ← Select(inputs)
│                                                                  │
│  패턴 선택:                                                       │ ← MaskingPatternSelector(widget)
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ○ 앞 3자리만 표시                                         │  │ ← RadioGroup(inputs)
│  │    min***@***.***                                         │  │
│  │                                                            │  │
│  │  ● 도메인 표시                                              │  │
│  │    min***@gmail.com                                        │  │
│  │                                                            │  │
│  │  ○ 앞뒤 표시                                                │  │
│  │    mi***92@gmail.com                                       │  │
│  │                                                            │  │
│  │  ○ 커스텀 패턴                                              │  │
│  │    [정규식 입력...]                                         │  │ ← Input(inputs) (조건부)
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  미리보기: min***@gmail.com                                      │ ← 텍스트 (동적 렌더링)
│                                                                  │
│                                    [취소]  [저장]                │ ← Button(inputs) x 2
└─────────────────────────────────────────────────────────────────┘

컴포넌트 계층 요약:
Modal
├── Select (inputs) ─── 필드 타입 선택
├── MaskingPatternSelector (widget)
│   ├── RadioGroup (inputs) ─── 패턴 옵션
│   └── Input (inputs) ─── 커스텀 패턴 입력 (조건부)
└── Button (inputs) x 2 ─── 취소, 저장
```

#### 8.1~8.3 Role/User 권한 관리 화면

```
┌─────────────────────────────────────────────────────────────────┐
│                    ABAC 권한 관리                                 │ ← PageLayout(layouts)
├─────────────────────────────────────────────────────────────────┤
│  [Role 기본 권한]  [User 예외 권한]  [필드 가시성]                  │ ← Tabs(inputs)
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  역할 선택: [ADMIN ▼]                           [권한 추가 +]    │ ← Select(inputs), Button(inputs)
├─────────────────────────────────────────────────────────────────┤ ← RoleAbilityManager(feature) 영역
│                                                                  │
│  기본 권한 목록                                                   │ ← AbilityRuleList(widget)
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ #  │ 이름        │ Subject │ Action │ 조건      │ 상태   │  │ ← Table(ui)
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 1  │ 모든 예약    │ Reserv..│ manage │ -         │ ✓ 허용 │  │ ← Switch(inputs) - 상태 토글
│  │ 2  │ 사용자 조회  │ User    │ read   │ -         │ ✓ 허용 │  │
│  │ 3  │ 사용자 삭제  │ User    │ delete │ -         │ ✗ 거부 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [저장] [초기화]                                                  │ ← Button(inputs) x 2
└─────────────────────────────────────────────────────────────────┘

컴포넌트 계층 요약:
PageLayout
├── Tabs (inputs) ─── Role/User/필드가시성 탭
├── Select (inputs) ─── Role 선택
├── Button (inputs) ─── 권한 추가
└── RoleAbilityManager (feature) ─── AbilityStore 연동
    ├── AbilityRuleList (widget)
    │   ├── Table (ui)
    │   └── Switch (inputs) ─── 각 행의 상태 토글
    └── Button (inputs) x 2 ─── 저장, 초기화
```

#### 권한 추가 모달

```
┌─────────────────────────────────────────────────────────────────┐
│                      권한 추가                                    │ ← AbilityFormModal(widget) = Modal + Form
├─────────────────────────────────────────────────────────────────┤
│  규칙 이름:     [HR 부서 사용자 조회                ]              │ ← Input(inputs)
│                                                                  │
│  Subject:       [User ▼]                                         │ ← Select(inputs) ─── 동적 Subject 목록
│  Action:        [read ▼]                                         │ ← Select(inputs)
│  Type:          ● 허용 (can)   ○ 거부 (cannot)                   │ ← RadioGroup(inputs)
│                                                                  │
│  조건 (Conditions):                                               │ ← ConditionEditor(widget)
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ {                                                         │  │ ← CodeEditor 또는 Textarea
│  │   "departmentId": "hr-department-id"                      │  │
│  │ }                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  우선순위:      [10  ]                                           │ ← NumberInput(inputs)
│                                                                  │
│                              [취소]  [저장]                       │ ← Button(inputs) x 2
└─────────────────────────────────────────────────────────────────┘

컴포넌트 계층 요약:
AbilityFormModal (widget)
├── Input (inputs) ─── 규칙 이름
├── Select (inputs) ─── Subject (동적 목록)
├── Select (inputs) ─── Action
├── RadioGroup (inputs) ─── can/cannot
├── ConditionEditor (widget)
│   └── Textarea 또는 CodeEditor
├── NumberInput (inputs) ─── 우선순위
└── Button (inputs) x 2 ─── 취소, 저장
```

---

## 2. Entity 설계

### 2.1 기존 Entity 수정

#### Ability 모델 수정 (core.prisma)

**기존 구조:**
```prisma
model Ability {
  id          String         @id @default(uuid())
  type        AbilityTypes   // CAN, CAN_NOT
  action      AbilityActions
  roleId      String         @map("role_id")
  subjectId   String         @map("subject_id")
  tenantId    String         @map("tenant_id")
  isActive    Boolean        @default(true)
  role        Role           @relation(...)
  subject     Subject        @relation(...)
}
```

**신규 구조:**
```prisma
model Ability {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")
  removedAt   DateTime? @map("removed_at")

  // CASL 필수 필드
  action      String    // 'create', 'read', 'update', 'delete', 'manage'
  subject     String    // Prisma 모델명 또는 'all'
  fields      String[]  // 필드 레벨 제어 ['email', 'phone']
  conditions  Json?     // { "departmentId": "${user.departmentId}" }
  inverted    Boolean   @default(false)  // can(false) vs cannot(true)
  reason      String?   // 거부 시 사용자에게 보여줄 메시지

  // 연결 대상 (둘 중 하나만 설정)
  roleId      String?   @map("role_id")    // Role 기반 (기본 권한)
  userId      String?   @map("user_id")    // User 기반 (예외 권한)

  role        Role?     @relation(fields: [roleId], references: [id])
  user        User?     @relation(fields: [userId], references: [id])

  // 메타데이터
  name        String?   // "본인 예약만 조회"
  description String?
  isActive    Boolean   @default(true) @map("is_active")
  priority    Int       @default(0)  // 높을수록 우선

  @@index([roleId])
  @@index([userId])
  @@index([subject])
  @@index([isActive])
  @@map("abilities")
}
```

#### Subject 모델 변경

**기존:** SubjectTypes enum (Menu, Feature, Entity, API, Column)으로 관리

**신규:** Subject 모델은 삭제하고, Ability.subject 필드에 직접 Prisma 모델명을 문자열로 저장

**동적 Subject 생성 방식:**
- 앱 실행 시 Prisma 스키마에서 모델 목록을 읽어와 Subject 리스트 자동 생성
- `@prisma/client`의 DMMF(Data Model Meta Format) 활용

### 2.2 새로운 Entity

#### FieldVisibility 모델 (신규 생성)

**파일 경로:** `packages/prisma/schema/core.prisma`

```prisma
// @schema-type: REFERENCE
// @description: 필드 가시성 설정 - RoleCategory/RoleGroup별 필드 접근 권한
model FieldVisibility {
  id              String              @id @default(uuid())
  seq             Int                 @unique @default(autoincrement())
  createdAt       DateTime            @default(now()) @map("created_at")
  updatedAt       DateTime?           @updatedAt @map("updated_at")
  removedAt       DateTime?           @map("removed_at")

  // 대상 정의
  subject         String              // Prisma 모델명 (User, Reservation 등)
  field           String              // 필드명 (email, phone 등)

  // 권한 기준
  roleCategoryId  String              @map("role_category_id")
  roleGroupId     String?             @map("role_group_id")  // null이면 기본값

  // 가시성 설정
  visibility      FieldVisibilityType @default(FULL)
  maskingPatternId String?            @map("masking_pattern_id")

  roleCategory    Category            @relation("FieldVisibilityRoleCategory", fields: [roleCategoryId], references: [id])
  roleGroup       Group?              @relation("FieldVisibilityRoleGroup", fields: [roleGroupId], references: [id])
  maskingPattern  MaskingPattern?     @relation(fields: [maskingPatternId], references: [id])

  @@unique([subject, field, roleCategoryId, roleGroupId])
  @@index([subject])
  @@index([roleCategoryId])
  @@index([roleGroupId])
  @@map("field_visibilities")
}

enum FieldVisibilityType {
  FULL      // 전체 공개
  MASKED    // 부분 마스킹
  HIDDEN    // 숨김
}
```

#### MaskingPattern 모델 (신규 생성)

**파일 경로:** `packages/prisma/schema/core.prisma`

```prisma
// @schema-type: REFERENCE
// @description: 마스킹 패턴 정의 - 필드 타입별 마스킹 규칙
model MaskingPattern {
  id              String            @id @default(uuid())
  seq             Int               @unique @default(autoincrement())
  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime?         @updatedAt @map("updated_at")
  removedAt       DateTime?         @map("removed_at")

  name            String            @unique
  fieldType       MaskingFieldType  // 필드 타입
  pattern         String            // 마스킹 패턴 (정규식 또는 프리셋)
  example         String?           // 예시 결과
  description     String?

  fieldVisibilities FieldVisibility[]

  @@map("masking_patterns")
}

enum MaskingFieldType {
  EMAIL         // 이메일
  PHONE         // 전화번호
  SSN           // 주민번호
  CARD_NUMBER   // 카드번호
  ACCOUNT       // 계좌번호
  ADDRESS       // 주소
  NAME          // 이름
  CUSTOM        // 커스텀
}
```

### 2.3 삭제할 Entity

| Entity | 파일 | 이유 |
|--------|------|------|
| Subject 모델 | core.prisma | Ability.subject 필드로 대체 |
| SubjectTypes enum | core.prisma | 문자열로 대체 |
| AbilityTypes enum | core.prisma | inverted 필드로 대체 |
| AbilityActions enum | core.prisma | 문자열로 대체 |

### 2.4 User 모델 수정

**추가할 관계:**

```prisma
model User {
  // ... 기존 필드
  abilities      Ability[]  // User별 예외 권한
  // ...
}
```

---

## 3. 동적 Subject 생성 설계

### 3.1 Prisma DMMF 활용

```typescript
// packages/be-common/src/casl/subject-registry.ts

import { Prisma } from '@prisma/client';

export class SubjectRegistry {
  private static subjects: string[] = [];

  /**
   * Prisma 스키마에서 모든 모델명을 추출하여 Subject로 등록
   */
  static initialize(): void {
    const dmmf = Prisma.dmmf;
    this.subjects = dmmf.datamodel.models.map(model => model.name);
    this.subjects.push('all'); // 전체 Subject
  }

  /**
   * 등록된 Subject 목록 반환
   */
  static getSubjects(): string[] {
    return [...this.subjects];
  }

  /**
   * 유효한 Subject인지 검증
   */
  static isValidSubject(subject: string): boolean {
    return this.subjects.includes(subject);
  }

  /**
   * Subject의 필드 목록 반환
   */
  static getFieldsForSubject(subject: string): string[] {
    if (subject === 'all') return [];

    const dmmf = Prisma.dmmf;
    const model = dmmf.datamodel.models.find(m => m.name === subject);
    if (!model) return [];

    return model.fields.map(f => f.name);
  }
}
```

### 3.2 앱 초기화 시 Subject 등록

```typescript
// apps/server/src/main.ts

import { SubjectRegistry } from '@cocrepo/be-common';

async function bootstrap() {
  // Prisma 모델에서 Subject 자동 등록
  SubjectRegistry.initialize();

  // ... 나머지 부트스트랩 로직
}
```

### 3.3 Subject API 엔드포인트

| Method | Path | 설명 | 권한 |
|--------|------|------|------|
| GET | /api/v1/subjects | Subject 목록 조회 (Prisma 모델 기반) | ADMIN |
| GET | /api/v1/subjects/:name/fields | Subject의 필드 목록 조회 | ADMIN |

---

## 4. API 설계

### 4.1 Abilities API

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/abilities/my | 내 최종 ABAC 권한 조회 | 로그인 |
| GET | /api/v1/abilities/roles/:roleId | Role별 기본 권한 조회 | SUPER_ADMIN |
| GET | /api/v1/abilities/users/:userId | User별 예외 권한 조회 | SUPER_ADMIN |
| POST | /api/v1/abilities | 권한 생성 | SUPER_ADMIN |
| PATCH | /api/v1/abilities/:id | 권한 수정 | SUPER_ADMIN |
| DELETE | /api/v1/abilities/:id | 권한 삭제 | SUPER_ADMIN |
| POST | /api/v1/abilities/roles/:roleId/batch | Role 권한 일괄 설정 | SUPER_ADMIN |
| POST | /api/v1/abilities/users/:userId/batch | User 예외 권한 일괄 설정 | SUPER_ADMIN |

### 4.2 Subjects API (동적 생성)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/subjects | Prisma 모델 기반 Subject 목록 | ADMIN |
| GET | /api/v1/subjects/:name/fields | Subject의 필드 목록 | ADMIN |

### 4.3 FieldVisibilities API

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/field-visibilities | 전체 필드 가시성 목록 | SUPER_ADMIN |
| GET | /api/v1/field-visibilities/subject/:subject | Subject별 가시성 조회 | SUPER_ADMIN |
| GET | /api/v1/field-visibilities/matrix/:subject | Subject별 매트릭스 뷰 | SUPER_ADMIN |
| POST | /api/v1/field-visibilities | 필드 가시성 생성 | SUPER_ADMIN |
| PATCH | /api/v1/field-visibilities/:id | 필드 가시성 수정 | SUPER_ADMIN |
| DELETE | /api/v1/field-visibilities/:id | 필드 가시성 삭제 | SUPER_ADMIN |
| POST | /api/v1/field-visibilities/batch | 일괄 설정 | SUPER_ADMIN |

### 4.4 MaskingPatterns API

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/masking-patterns | 마스킹 패턴 목록 | SUPER_ADMIN |
| GET | /api/v1/masking-patterns/:id | 마스킹 패턴 상세 | SUPER_ADMIN |
| POST | /api/v1/masking-patterns | 마스킹 패턴 생성 | SUPER_ADMIN |
| PATCH | /api/v1/masking-patterns/:id | 마스킹 패턴 수정 | SUPER_ADMIN |
| DELETE | /api/v1/masking-patterns/:id | 마스킹 패턴 삭제 | SUPER_ADMIN |
| POST | /api/v1/masking-patterns/preview | 마스킹 미리보기 | SUPER_ADMIN |

---

## 5. 에이전트 실행 계획

### Phase 1: 스키마 정리 및 마이그레이션

**순서:** schema-builder -> seed-maker

1. 기존 Subject 모델 삭제
2. 기존 enum 삭제 (SubjectTypes, AbilityTypes, AbilityActions)
3. Ability 모델 수정 (roleId/userId 선택적 연결)
4. FieldVisibility 모델 추가
5. MaskingPattern 모델 추가
6. User 모델에 abilities 관계 추가

### Phase 2: 백엔드 레이어

**순서:** entity-builder -> vo-builder -> dto-builder -> repository-builder -> service-builder -> facade-builder -> controller-builder

### Phase 3: 프론트엔드 컴포넌트

**순서:** ui-component-builder -> widget-builder -> feature-builder -> store-builder

### Phase 4: 페이지

**순서:** page-builder -> page-reviewer

### Phase 5: 품질 검증 (QA)

**순서:** fe-testing -> be-testing

---

## 6. 에이전트별 지시사항

### 6.1 schema-builder 지시

**파일:** `packages/prisma/schema/core.prisma`

**삭제:**
```prisma
// 삭제할 모델
model Subject { ... }

// 삭제할 enum
enum SubjectTypes { ... }
enum AbilityTypes { ... }
enum AbilityActions { ... }
```

**수정 - Ability 모델:**
```prisma
model Ability {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")
  removedAt   DateTime? @map("removed_at")

  // CASL 필수 필드
  action      String    // 'create', 'read', 'update', 'delete', 'manage'
  subject     String    // Prisma 모델명 또는 'all'
  fields      String[]  @default([])
  conditions  Json?
  inverted    Boolean   @default(false)
  reason      String?

  // 연결 대상 (둘 중 하나만 설정)
  roleId      String?   @map("role_id")
  userId      String?   @map("user_id")

  role        Role?     @relation(fields: [roleId], references: [id])
  user        User?     @relation(fields: [userId], references: [id])

  // 메타데이터
  name        String?
  description String?
  isActive    Boolean   @default(true) @map("is_active")
  priority    Int       @default(0)

  @@index([roleId])
  @@index([userId])
  @@index([subject])
  @@index([isActive])
  @@map("abilities")
}
```

**추가 - FieldVisibility, MaskingPattern 모델:**
(위 2.2 섹션 참조)

**추가 - enum:**
```prisma
enum FieldVisibilityType {
  FULL
  MASKED
  HIDDEN
}

enum MaskingFieldType {
  EMAIL
  PHONE
  SSN
  CARD_NUMBER
  ACCOUNT
  ADDRESS
  NAME
  CUSTOM
}
```

**User 모델 수정:** (user.prisma)
```prisma
model User {
  // ... 기존 필드
  abilities      Ability[]  // 추가
}
```

---

### 6.2 seed-maker 지시

**파일:** `packages/prisma/seed-data.ts`, `packages/prisma/seed.ts`

**기본 MaskingPattern 시드:**

```typescript
export const defaultMaskingPatterns = [
  {
    name: 'EMAIL_DOMAIN_VISIBLE',
    fieldType: 'EMAIL',
    pattern: 'PRESET_EMAIL_DOMAIN',
    example: 'min***@gmail.com',
    description: '앞 3자리 + 도메인 표시',
  },
  {
    name: 'EMAIL_FULL_MASK',
    fieldType: 'EMAIL',
    pattern: 'PRESET_EMAIL_FULL',
    example: '***@***.***',
    description: '전체 마스킹',
  },
  {
    name: 'PHONE_MIDDLE_MASK',
    fieldType: 'PHONE',
    pattern: 'PRESET_PHONE_MIDDLE',
    example: '010-****-9012',
    description: '중간 4자리 마스킹',
  },
  {
    name: 'SSN_BACK_MASK',
    fieldType: 'SSN',
    pattern: 'PRESET_SSN_BACK',
    example: '920315-1******',
    description: '뒷자리 전체 마스킹',
  },
  {
    name: 'NAME_MIDDLE_MASK',
    fieldType: 'NAME',
    pattern: 'PRESET_NAME_MIDDLE',
    example: '김*수',
    description: '중간 글자 마스킹',
  },
];
```

**Role별 기본 Ability 시드:**

```typescript
export const defaultAbilities = {
  USER: [
    {
      name: '본인 정보 조회',
      action: 'read',
      subject: 'User',
      conditions: { id: '${user.id}' },
      inverted: false,
      priority: 0,
    },
    {
      name: '본인 정보 수정',
      action: 'update',
      subject: 'User',
      conditions: { id: '${user.id}' },
      inverted: false,
      priority: 0,
    },
  ],
  ADMIN: [
    {
      name: '사용자 조회',
      action: 'read',
      subject: 'User',
      inverted: false,
      priority: 0,
    },
    {
      name: '사용자 수정',
      action: 'update',
      subject: 'User',
      inverted: false,
      priority: 0,
    },
    {
      name: '사용자 삭제 금지',
      action: 'delete',
      subject: 'User',
      inverted: true,
      reason: '관리자는 사용자를 삭제할 수 없습니다',
      priority: 0,
    },
  ],
  SUPER_ADMIN: [
    {
      name: '모든 데이터 관리',
      action: 'manage',
      subject: 'all',
      inverted: false,
      priority: 0,
    },
  ],
};
```

---

### 6.3 dto-builder 지시

**파일 경로:** `packages/dto/src/`

**신규 파일:**

1. **ability/create-ability.dto.ts** (수정)
```typescript
import { StringField, BooleanField, NumberField, ArrayField, JsonField } from '@cocrepo/decorator';

export class CreateAbilityDto {
  @StringField({ required: false })
  roleId?: string;

  @StringField({ required: false })
  userId?: string;

  @StringField({ required: true })
  action: string;

  @StringField({ required: true })
  subject: string;

  @ArrayField(() => String, { required: false })
  fields?: string[];

  @JsonField({ required: false })
  conditions?: Record<string, any>;

  @BooleanField({ required: false, default: false })
  inverted?: boolean;

  @StringField({ required: false })
  reason?: string;

  @StringField({ required: false })
  name?: string;

  @StringField({ required: false })
  description?: string;

  @NumberField({ required: false, default: 0 })
  priority?: number;
}
```

2. **field-visibility/create-field-visibility.dto.ts**
```typescript
export class CreateFieldVisibilityDto {
  @StringField({ required: true })
  subject: string;

  @StringField({ required: true })
  field: string;

  @StringField({ required: true })
  roleCategoryId: string;

  @StringField({ required: false })
  roleGroupId?: string;

  @EnumField(FieldVisibilityType, { required: true })
  visibility: FieldVisibilityType;

  @StringField({ required: false })
  maskingPatternId?: string;
}
```

3. **field-visibility/field-visibility-matrix.dto.ts**
```typescript
export class FieldVisibilityMatrixDto {
  @StringField()
  subject: string;

  @ArrayField(() => FieldVisibilityMatrixRowDto)
  rows: FieldVisibilityMatrixRowDto[];
}

export class FieldVisibilityMatrixRowDto {
  @StringField()
  field: string;

  @ObjectField()
  columns: Record<string, FieldVisibilityCellDto>;
}

export class FieldVisibilityCellDto {
  @EnumField(FieldVisibilityType)
  visibility: FieldVisibilityType;

  @StringField({ required: false })
  maskingPatternId?: string;

  @StringField({ required: false })
  maskingExample?: string;
}
```

4. **masking-pattern/create-masking-pattern.dto.ts**
```typescript
export class CreateMaskingPatternDto {
  @StringField({ required: true })
  name: string;

  @EnumField(MaskingFieldType, { required: true })
  fieldType: MaskingFieldType;

  @StringField({ required: true })
  pattern: string;

  @StringField({ required: false })
  example?: string;

  @StringField({ required: false })
  description?: string;
}
```

5. **subject/subject-response.dto.ts** (수정)
```typescript
export class SubjectResponseDto {
  @StringField()
  name: string;

  @ArrayField(() => String)
  fields: string[];
}
```

---

### 6.4 repository-builder 지시

**파일:** `packages/repository/src/`

**abilities.repository.ts (수정):**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findActiveByRoleId | roleId: string | Ability[] | Role ID로 활성 권한 조회 |
| findActiveByUserId | userId: string | Ability[] | User ID로 활성 권한 조회 |
| findBySubject | subject: string | Ability[] | Subject로 권한 조회 |
| create | data: CreateAbilityDto | Ability | 권한 생성 |
| updateById | id, data | Ability | 권한 수정 |
| removeById | id: string | Ability | 소프트 삭제 |
| batchCreateForRole | roleId, abilities[] | Ability[] | Role 권한 일괄 생성 |
| batchCreateForUser | userId, abilities[] | Ability[] | User 권한 일괄 생성 |

**field-visibilities.repository.ts (신규):**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findBySubject | subject: string | FieldVisibility[] | Subject별 가시성 조회 |
| findByRoleCategoryAndGroup | categoryId, groupId? | FieldVisibility[] | 권한 기준으로 조회 |
| findMatrixBySubject | subject: string | FieldVisibilityMatrix | 매트릭스 형태로 조회 |
| create | data | FieldVisibility | 가시성 생성 |
| updateById | id, data | FieldVisibility | 가시성 수정 |
| removeById | id: string | FieldVisibility | 소프트 삭제 |
| batchUpsert | items[] | FieldVisibility[] | 일괄 upsert |

**masking-patterns.repository.ts (신규):**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findAll | - | MaskingPattern[] | 전체 패턴 조회 |
| findById | id: string | MaskingPattern | ID로 조회 |
| findByFieldType | fieldType | MaskingPattern[] | 필드 타입별 조회 |
| create | data | MaskingPattern | 패턴 생성 |
| updateById | id, data | MaskingPattern | 패턴 수정 |
| removeById | id: string | MaskingPattern | 소프트 삭제 |

---

### 6.5 service-builder 지시

**파일:** `packages/service/src/`

**abilities.service.ts (수정):**

| 메서드명 | 책임 |
|----------|------|
| getRoleAbilities | Role별 기본 권한 조회 |
| getUserAbilities | User별 예외 권한 조회 |
| getMergedAbilities | Role + User 권한 병합 |
| createAbility | 권한 생성 + 유효성 검사 |
| updateAbility | 권한 수정 + 유효성 검사 |
| deleteAbility | 권한 삭제 |
| batchSetRoleAbilities | Role 권한 일괄 설정 |
| batchSetUserAbilities | User 예외 권한 일괄 설정 |

**field-visibilities.service.ts (신규):**

| 메서드명 | 책임 |
|----------|------|
| getFieldVisibilities | 필드 가시성 목록 조회 |
| getFieldVisibilityMatrix | 매트릭스 형태로 조회 |
| createFieldVisibility | 가시성 생성 |
| updateFieldVisibility | 가시성 수정 |
| deleteFieldVisibility | 가시성 삭제 |
| batchSetFieldVisibilities | 일괄 설정 |
| getVisibleFields | 사용자의 접근 가능 필드 목록 |
| applyMasking | 데이터에 마스킹 적용 |

**masking-patterns.service.ts (신규):**

| 메서드명 | 책임 |
|----------|------|
| getMaskingPatterns | 패턴 목록 조회 |
| getMaskingPatternById | 패턴 상세 조회 |
| createMaskingPattern | 패턴 생성 |
| updateMaskingPattern | 패턴 수정 |
| deleteMaskingPattern | 패턴 삭제 |
| previewMasking | 마스킹 미리보기 |
| applyPattern | 값에 패턴 적용 |

**subjects.service.ts (신규):**

| 메서드명 | 책임 |
|----------|------|
| getSubjects | Prisma 모델 기반 Subject 목록 |
| getSubjectFields | Subject의 필드 목록 |
| isValidSubject | Subject 유효성 검사 |

---

### 6.6 facade-builder 지시

**파일:** `packages/facade/src/`

**casl-ability.facade.ts (신규):**

| 메서드명 | 조합하는 Service | 책임 |
|----------|----------------|------|
| buildAbilityForUser | AbilitiesService | Role + User 권한 병합하여 CASL Ability 생성 |
| checkDataAccess | AbilitiesService | 데이터 접근 권한 확인 |
| filterAccessibleData | AbilitiesService, FieldVisibilitiesService | 접근 가능 데이터 필터링 + 마스킹 |

**주의사항:**
- Prisma 직접 호출 금지
- 트랜잭션 처리 시 반드시 Repository 사용

---

### 6.7 controller-builder 지시

**파일:** `apps/server/src/module/`

**abilities.controller.ts (수정):**

```typescript
@Controller('abilities')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)
export class AbilitiesController {
  @Get('my')
  @RoleCategories([RoleCategoryNames.COMMON])
  async getMyAbilities(@CurrentUser() user: UserDto) {}

  @Get('roles/:roleId')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async getRoleAbilities(@Param('roleId') roleId: string) {}

  @Get('users/:userId')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async getUserAbilities(@Param('userId') userId: string) {}

  @Post()
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async createAbility(@Body() dto: CreateAbilityDto) {}

  @Patch(':id')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async updateAbility(@Param('id') id: string, @Body() dto: UpdateAbilityDto) {}

  @Delete(':id')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async deleteAbility(@Param('id') id: string) {}

  @Post('roles/:roleId/batch')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async batchSetRoleAbilities(@Param('roleId') roleId: string, @Body() dto: BatchAbilitiesDto) {}

  @Post('users/:userId/batch')
  @RoleCategories([RoleCategoryNames.ADMIN])
  @Roles([Roles.SUPER_ADMIN])
  async batchSetUserAbilities(@Param('userId') userId: string, @Body() dto: BatchAbilitiesDto) {}
}
```

**subjects.controller.ts (신규):**

```typescript
@Controller('subjects')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)
@RoleCategories([RoleCategoryNames.ADMIN])
export class SubjectsController {
  @Get()
  async getSubjects() {}

  @Get(':name/fields')
  async getSubjectFields(@Param('name') name: string) {}
}
```

**field-visibilities.controller.ts (신규):**

```typescript
@Controller('field-visibilities')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)
@Roles([Roles.SUPER_ADMIN])
export class FieldVisibilitiesController {
  @Get()
  async getFieldVisibilities() {}

  @Get('subject/:subject')
  async getFieldVisibilitiesBySubject(@Param('subject') subject: string) {}

  @Get('matrix/:subject')
  async getFieldVisibilityMatrix(@Param('subject') subject: string) {}

  @Post()
  async createFieldVisibility(@Body() dto: CreateFieldVisibilityDto) {}

  @Patch(':id')
  async updateFieldVisibility(@Param('id') id: string, @Body() dto: UpdateFieldVisibilityDto) {}

  @Delete(':id')
  async deleteFieldVisibility(@Param('id') id: string) {}

  @Post('batch')
  async batchSetFieldVisibilities(@Body() dto: BatchFieldVisibilitiesDto) {}
}
```

**masking-patterns.controller.ts (신규):**

```typescript
@Controller('masking-patterns')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)
@Roles([Roles.SUPER_ADMIN])
export class MaskingPatternsController {
  @Get()
  async getMaskingPatterns() {}

  @Get(':id')
  async getMaskingPatternById(@Param('id') id: string) {}

  @Post()
  async createMaskingPattern(@Body() dto: CreateMaskingPatternDto) {}

  @Patch(':id')
  async updateMaskingPattern(@Param('id') id: string, @Body() dto: UpdateMaskingPatternDto) {}

  @Delete(':id')
  async deleteMaskingPattern(@Param('id') id: string) {}

  @Post('preview')
  async previewMasking(@Body() dto: PreviewMaskingDto) {}
}
```

---

### 6.8 ui-component-builder 지시

**생성할 컴포넌트:** VisibilityCell

**경로:** `packages/ui/src/components/ui/data-display/VisibilityCell/`

**요구사항:**
- 가시성 상태 표시 (FULL, MASKED, HIDDEN)
- 아이콘 + 색상으로 시각적 구분
- 클릭 가능 여부 옵션
- size prop (sm, md, lg)

**예상 Props:**
```typescript
interface VisibilityCellProps {
  visibility: 'FULL' | 'MASKED' | 'HIDDEN';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}
```

**디자인:**
```
FULL   -> 초록색 체크 아이콘
MASKED -> 노란색 눈 아이콘 (부분 가림)
HIDDEN -> 빨간색 X 아이콘
```

---

### 6.9 widget-builder 지시

**생성할 컴포넌트:**

#### 1. MaskingPatternSelector

**경로:** `packages/ui/src/components/widget/MaskingPatternSelector/`

**요구사항:**
- 필드 타입에 따른 패턴 필터링
- 패턴 선택 라디오 버튼
- 미리보기 표시
- 커스텀 패턴 입력 옵션

**예상 Props:**
```typescript
interface MaskingPatternSelectorProps {
  fieldType: MaskingFieldType;
  patterns: MaskingPattern[];
  selectedPatternId?: string;
  onSelect: (patternId: string) => void;
  sampleValue?: string;
}
```

#### 2. FieldVisibilityMatrix

**경로:** `packages/ui/src/components/widget/FieldVisibilityMatrix/`

**요구사항:**
- 테이블 형태의 매트릭스 뷰
- 행: 필드명
- 열: RoleCategory + RoleGroup 조합
- 셀: VisibilityCell 컴포넌트
- 셀 클릭 시 팝오버로 옵션 선택
- SUPER_ADMIN 열은 수정 불가 (고정)

**예상 Props:**
```typescript
interface FieldVisibilityMatrixProps {
  subject: string;
  fields: string[];
  columns: MatrixColumn[];
  data: MatrixData;
  onCellChange: (field: string, column: string, value: VisibilityChange) => void;
}

interface MatrixColumn {
  id: string;
  label: string;
  roleCategoryId: string;
  roleGroupId?: string;
  isFixed?: boolean;  // SUPER_ADMIN
}

interface VisibilityChange {
  visibility: FieldVisibilityType;
  maskingPatternId?: string;
}
```

#### 3. AbilityRuleList

**경로:** `packages/ui/src/components/widget/AbilityRuleList/`

**요구사항:**
- 권한 규칙 목록 테이블
- 컬럼: 이름, Subject, Action, 조건, 상태(허용/거부)
- 행 편집/삭제 버튼
- 빈 상태 표시

**예상 Props:**
```typescript
interface AbilityRuleListProps {
  abilities: Ability[];
  onEdit: (ability: Ability) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}
```

#### 4. ConditionEditor

**경로:** `packages/ui/src/components/widget/ConditionEditor/`

**요구사항:**
- JSON 조건 편집기
- 템플릿 변수 자동완성 (${user.id}, ${user.spaceId} 등)
- JSON 유효성 검사
- 포맷팅 버튼

**예상 Props:**
```typescript
interface ConditionEditorProps {
  value: Record<string, any> | null;
  onChange: (value: Record<string, any> | null) => void;
  templateVariables?: string[];
  error?: string;
}
```

#### 5. AbilityFormModal

**경로:** `packages/ui/src/components/widget/AbilityFormModal/`

**요구사항:**
- 권한 추가/수정 폼 모달
- Subject 선택 (동적 Subject 목록)
- Action 선택 (create, read, update, delete, manage)
- Type 선택 (허용/거부)
- 조건 편집 (ConditionEditor 사용)
- 필드 선택 (Subject 필드 목록)
- 우선순위 입력

**예상 Props:**
```typescript
interface AbilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAbilityDto) => void;
  initialData?: Ability;
  subjects: SubjectResponseDto[];
  mode: 'create' | 'edit';
}
```

---

### 6.10 feature-builder 지시

**생성할 컴포넌트:**

#### 1. FieldVisibilityManager

**경로:** `packages/ui/src/components/feature/FieldVisibilityManager/`

**요구사항:**
- Subject 선택 드롭다운
- FieldVisibilityMatrix 렌더링
- 저장/초기화 버튼
- Store 연동

**Store 연동:**
```typescript
// FieldVisibilityStore와 연동
- subjects 상태 읽기
- selectedSubject 상태
- matrixData 상태
- saveFieldVisibilities 액션 호출
```

#### 2. RoleAbilityManager

**경로:** `packages/ui/src/components/feature/RoleAbilityManager/`

**요구사항:**
- Role 선택 드롭다운
- AbilityRuleList 렌더링
- 권한 추가 버튼
- AbilityFormModal 연동
- Store 연동

#### 3. UserAbilityManager

**경로:** `packages/ui/src/components/feature/UserAbilityManager/`

**요구사항:**
- User 검색 및 선택
- 선택된 User의 기본 Role 표시
- AbilityRuleList 렌더링 (예외 권한만)
- 예외 권한 추가 버튼
- Store 연동

---

### 6.11 store-builder 지시

**생성할 Store:**

#### 1. FieldVisibilityStore

**경로:** `apps/admin/app/(admin)/settings/abilities/_stores/FieldVisibilityStore.ts`

**상태:**
```typescript
class FieldVisibilityStore {
  subjects: SubjectResponseDto[] = [];
  selectedSubject: string | null = null;
  matrixData: FieldVisibilityMatrixDto | null = null;
  maskingPatterns: MaskingPattern[] = [];
  isLoading = false;
  error: string | null = null;

  // Actions
  loadSubjects(): Promise<void>;
  selectSubject(subject: string): Promise<void>;
  loadMatrixData(subject: string): Promise<void>;
  loadMaskingPatterns(): Promise<void>;
  updateCellVisibility(field: string, column: string, value: VisibilityChange): void;
  saveFieldVisibilities(): Promise<void>;
  reset(): void;
}
```

#### 2. AbilityStore

**경로:** `apps/admin/app/(admin)/settings/abilities/_stores/AbilityStore.ts`

**상태:**
```typescript
class AbilityStore {
  // Role Abilities
  roles: Role[] = [];
  selectedRoleId: string | null = null;
  roleAbilities: Ability[] = [];

  // User Abilities
  selectedUserId: string | null = null;
  userAbilities: Ability[] = [];

  // Subjects
  subjects: SubjectResponseDto[] = [];

  // UI State
  isLoading = false;
  isModalOpen = false;
  editingAbility: Ability | null = null;
  modalMode: 'create' | 'edit' = 'create';

  // Actions
  loadRoles(): Promise<void>;
  selectRole(roleId: string): Promise<void>;
  loadRoleAbilities(roleId: string): Promise<void>;

  selectUser(userId: string): Promise<void>;
  loadUserAbilities(userId: string): Promise<void>;

  loadSubjects(): Promise<void>;
  getSubjectFields(subject: string): Promise<string[]>;

  openCreateModal(): void;
  openEditModal(ability: Ability): void;
  closeModal(): void;

  createAbility(data: CreateAbilityDto): Promise<void>;
  updateAbility(id: string, data: UpdateAbilityDto): Promise<void>;
  deleteAbility(id: string): Promise<void>;
}
```

---

### 6.12 page-builder 지시

**생성할 페이지:** 필드 가시성 관리 페이지

**경로:** `apps/admin/app/(admin)/settings/abilities/field-visibility/page.tsx`

**요구사항:**
- PageLayout 사용
- FieldVisibilityManager Feature 포함
- Subject 선택 시 매트릭스 로드
- 저장 시 확인 모달

**핸들러 네이밍:**
```typescript
// Page 컴포넌트에서 사용
const onSelectSubject = (subject: string) => { ... };
const onClickSaveButton = () => { ... };
const onClickResetButton = () => { ... };
const onChangeCellVisibility = (field: string, column: string, value: VisibilityChange) => { ... };
```

**URL 파라미터:**
- `?subject=User` - 선택된 Subject

---

## 7. 기술 고려사항

### 7.1 보안

| 항목 | 대응 방안 |
|------|----------|
| 인증 | JWT Bearer Token |
| 인가 (RBAC) | RoleCategoryGuard, @Roles 데코레이터 |
| 인가 (ABAC) | CaslAbilityGuard, @CheckAbilities 데코레이터 |
| 입력 검증 | class-validator |
| Subject 유효성 | SubjectRegistry.isValidSubject() |

### 7.2 성능

| 항목 | 대응 방안 |
|------|----------|
| Ability 캐싱 | Redis에 사용자별 Ability 캐싱 |
| Subject 캐싱 | 앱 시작 시 메모리에 로드 |
| 매트릭스 로딩 | 페이지네이션 없이 전체 로드 (Subject당 필드 수 제한적) |

### 7.3 마이그레이션

| 단계 | 작업 | 위험도 |
|------|------|--------|
| 1 | 기존 Subject 모델 데이터 백업 | 낮음 |
| 2 | 새로운 Ability 스키마로 마이그레이션 | 중간 |
| 3 | 기존 데이터 변환 스크립트 실행 | 중간 |
| 4 | 기존 모델/코드 삭제 | 낮음 |

---

## 8. 최종 체크리스트

### Phase 0: 기존 모델 정리
- [ ] 기존 `Subject` 모델 삭제
- [ ] 관련 enum 삭제 (`SubjectTypes`, `AbilityTypes`, `AbilityActions`)
- [ ] 기존 SubjectsRepository, SubjectsService, SubjectsController 삭제
- [ ] 관련 DTO 삭제
- [ ] Migration 실행

### Phase 1: 스키마 구축
- [ ] 새로운 Ability Prisma 스키마 추가 (roleId + userId)
- [ ] FieldVisibility 모델 추가
- [ ] MaskingPattern 모델 추가
- [ ] FieldVisibilityType, MaskingFieldType enum 추가
- [ ] User 모델에 abilities 관계 추가
- [ ] Migration 실행
- [ ] 시드 데이터 추가

### Phase 2: 백엔드 연동
- [ ] SubjectRegistry 구현 (동적 Subject 생성)
- [ ] AbilitiesRepository 수정
- [ ] FieldVisibilitiesRepository 신규
- [ ] MaskingPatternsRepository 신규
- [ ] AbilitiesService 수정
- [ ] SubjectsService 신규
- [ ] FieldVisibilitiesService 신규
- [ ] MaskingPatternsService 신규
- [ ] CaslAbilityFacade 신규
- [ ] 각 Controller 구현
- [ ] DTO 정의
- [ ] Swagger 문서화
- [ ] Orval API 클라이언트 생성

### Phase 3: 프론트엔드 컴포넌트
- [ ] VisibilityCell UI 컴포넌트
- [ ] MaskingPatternSelector Widget
- [ ] FieldVisibilityMatrix Widget
- [ ] AbilityRuleList Widget
- [ ] ConditionEditor Widget
- [ ] AbilityFormModal Widget
- [ ] FieldVisibilityManager Feature
- [ ] RoleAbilityManager Feature
- [ ] UserAbilityManager Feature

### Phase 4: 페이지 및 Store
- [ ] FieldVisibilityStore 생성
- [ ] AbilityStore 생성
- [ ] 필드 가시성 관리 페이지 구현
- [ ] 기존 권한 관리 페이지 수정

### Phase 5: 테스트
- [ ] RBAC/ABAC 분리 동작 테스트
- [ ] Role 기본 권한 테스트
- [ ] User 예외 권한 우선순위 테스트
- [ ] 동적 Subject 생성 테스트
- [ ] 필드 가시성 적용 테스트
- [ ] 마스킹 패턴 적용 테스트

---

**작성자:** technical-designer
**작성일:** 2026-01-08

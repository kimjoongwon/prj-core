# 05. 기술 설계서

> 원본 기획서: 동일 폴더 내 01~04 문서

---

## 1. 컴포넌트 분석

### 1.1 기존 컴포넌트 재사용

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

### 1.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| AbilityMatrix | widgets | Subject × Action 매트릭스 (체크박스 그리드) | widget-builder |
| ConditionsEditor | features | JSON 기반 Conditions 편집기 | feature-builder |
| SystemBadge | ui | 시스템 여부 뱃지 (아이콘) | ui-component-builder |
| PriorityInput | inputs | 우선순위 입력 (숫자 + 설명) | input-component-builder |
| VisibilityMatrix | widgets | UI 요소 × Role 가시성 매트릭스 | widget-builder |

---

### 1.3 컴포넌트 배치도

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

## 2. Entity 설계

### 2.1 새로운 Entity

#### Role

**파일 경로:** `packages/prisma/schema/role.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | 이름 | @unique |
| displayName | String? | 표시명 | - |
| description | String? | 설명 | - |
| isSystem | Boolean | 시스템 역할 여부 | @default(false) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

---

#### Subject

**파일 경로:** `packages/prisma/schema/subject.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | 이름 | @unique |
| displayName | String? | 표시명 | - |
| icon | String? | 아이콘 | - |
| order | Int | 정렬 순서 | @default(0) |
| isSystem | Boolean | 시스템 Subject 여부 | @default(false) |
| group | String? | 그룹 | entity, menu, feature, ui |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

---

#### Action

**파일 경로:** `packages/prisma/schema/action.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| name | String | 이름 | @unique |
| displayName | String? | 표시명 | - |
| description | String? | 설명 | - |
| group | String? | 그룹 | crud, visibility, bulk, workflow |
| order | Int | 정렬 순서 | @default(0) |
| isSystem | Boolean | 시스템 Action 여부 | @default(false) |
| config | Json? | 설정 | 마스킹, 포맷팅 등 |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

---

#### Ability

**파일 경로:** `packages/prisma/schema/ability.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| subjectId | String | Subject FK | - |
| actionId | String | Action FK | - |
| fields | String[] | 대상 필드 목록 | - |
| conditions | Json? | 권한 조건 (ABAC) | - |
| inverted | Boolean | 거부 여부 | @default(false) |
| reason | String? | 거부 사유 | - |
| roleId | String? | Role FK | - |
| userId | String? | User FK | - |
| name | String? | 권한 이름 | - |
| description | String? | 권한 설명 | - |
| isActive | Boolean | 활성화 여부 | @default(true) |
| priority | Int | 우선순위 | @default(0) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |

---

#### Tenant

**파일 경로:** `packages/prisma/schema/tenant.prisma`

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

## 3. API 설계

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /abilities | Ability 목록 조회 | Bearer Token | ADMIN |
| POST | /abilities | Ability 생성 | Bearer Token | ADMIN |
| GET | /abilities/:id | Ability 상세 조회 | Bearer Token | ADMIN |
| PUT | /abilities/:id | Ability 수정 | Bearer Token | ADMIN |
| DELETE | /abilities/:id | Ability 삭제 | Bearer Token | ADMIN |
| GET | /roles | Role 목록 조회 | Bearer Token | ADMIN |
| POST | /roles | Role 생성 | Bearer Token | ADMIN |
| GET | /roles/:id | Role 상세 조회 | Bearer Token | ADMIN |
| PUT | /roles/:id | Role 수정 | Bearer Token | ADMIN |
| DELETE | /roles/:id | Role 삭제 | Bearer Token | ADMIN |
| PUT | /roles/:id/abilities | Role 권한 일괄 업데이트 | Bearer Token | ADMIN |
| GET | /subjects | Subject 목록 조회 | Bearer Token | ADMIN |
| POST | /subjects | Subject 생성 | Bearer Token | ADMIN |
| GET | /subjects/:id | Subject 상세 조회 | Bearer Token | ADMIN |
| PUT | /subjects/:id | Subject 수정 | Bearer Token | ADMIN |
| DELETE | /subjects/:id | Subject 삭제 | Bearer Token | ADMIN |
| GET | /actions | Action 목록 조회 | Bearer Token | ADMIN |
| POST | /actions | Action 생성 | Bearer Token | ADMIN |
| GET | /actions/:id | Action 상세 조회 | Bearer Token | ADMIN |
| PUT | /actions/:id | Action 수정 | Bearer Token | ADMIN |
| DELETE | /actions/:id | Action 삭제 | Bearer Token | ADMIN |
| GET | /roles/abilities/visibility | UI 가시성 매트릭스 조회 | Bearer Token | ADMIN |
| PUT | /roles/abilities/visibility | UI 가시성 매트릭스 업데이트 | Bearer Token | ADMIN |
| GET | /me/abilities | 현재 사용자의 권한 목록 조회 | Bearer Token | - |

---

## 4. 에이전트 실행 계획

### Phase 1: 백엔드

**순서:** schema-builder → seed-maker → entity-builder → vo-builder → dto-builder → repository-builder → service-builder → facade-builder → controller-builder

### Phase 2: 프론트엔드 컴포넌트

**순서:** ui-component-builder → input-component-builder → widget-builder → feature-builder → store-builder

### Phase 3: 페이지

**순서:** fe-page-builder → /fe-review (Skill)

### Phase 4: 품질 검증 (QA)

**순서:** fe-testing → be-testing

---

## 5. 에이전트별 지시사항

### 5.1 ui-component-builder 지시

**생성할 컴포넌트:** SystemBadge

**요구사항:**
- isSystem prop 필수
- size prop (sm, md, lg) 선택
- 시스템 여부에 따른 아이콘/텍스트 표시

**예상 Props:**
```typescript
interface SystemBadgeProps {
  isSystem: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### 5.2 input-component-builder 지시

**생성할 컴포넌트:** PriorityInput

**요구사항:**
- 숫자 입력 필드
- 우선순위 설명 텍스트 자동 표시
- Role 기본 권한 (0), User 예외 권한 (10+) 힌트

**예상 Props:**
```typescript
interface PriorityInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

---

### 5.3 widget-builder 지시

**생성할 컴포넌트 1:** AbilityMatrix

**요구사항:**
- Subject × Action 매트릭스 렌더링
- 체크박스 그리드 형태
- onChange 이벤트로 상위 컴포넌트에 변경 알림
- disabled prop로 전체 비활성화 지원

**예상 Props:**
```typescript
interface AbilityMatrixProps {
  subjects: Subject[];
  actions: Action[];
  abilities: Ability[];
  onChange: (subjectId: string, actionId: string, checked: boolean) => void;
  disabled?: boolean;
}
```

---

**생성할 컴포넌트 2:** VisibilityMatrix

**요구사항:**
- UI 요소 × Role 매트릭스 렌더링
- 토글 버튼 그리드 형태
- onChange 이벤트로 상위 컴포넌트에 변경 알림
- disabled prop로 전체 비활성화 지원

**예상 Props:**
```typescript
interface VisibilityMatrixProps {
  uiElements: string[];
  roles: Role[];
  visibility: Record<string, Record<string, boolean>>;
  onChange: (uiElement: string, roleId: string, visible: boolean) => void;
  disabled?: boolean;
}
```

---

### 5.4 feature-builder 지시

**생성할 컴포넌트:** ConditionsEditor

**요구사항:**
- JSON 편집기 형태의 Conditions 편집기
- 템플릿 변수 자동완성/힌트 제공
- JSON 형식 검증
- templateVariables prop로 사용 가능한 변수 목록 전달

**예상 Props:**
```typescript
interface ConditionsEditorProps {
  value: object | null;
  onChange: (value: object | null) => void;
  templateVariables?: TemplateVariable[];
  disabled?: boolean;
}
```

---

## 6. 기술 고려사항

### 6.1 보안

| 항목 | 대응 방안 |
|------|----------|
| 인증 | JWT Bearer Token |
| 인가 | CASL ability 검사 |
| 입력 검증 | class-validator |
| 템플릿 변수 | 허용된 변수만 치환 |

---

### 6.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 페이지네이션 | Offset 기반 |
| 검색 | 인덱스 활용 |
| 권한 캐싱 | Ability 객체 캐싱 |
| Lazy Loading | 필요한 권한만 로드 |

---

### 6.3 CASL 통합

**CASL Ability Factory 위치:** `packages/be-common/src/casl/casl-ability.factory.ts`

**기능:**
- DB에서 권한 조회
- 템플릿 변수 치환
- CASL Ability Builder로 변환
- inverted에 따라 can/cannot 호출

---

## 7. 프로젝트 경로 정보

### 프론트엔드

| 경로 | 설명 | 담당 에이전트 |
|------|------|--------------|
| `packages/ui/src/components/ui/` | Pure UI 컴포넌트 | ui-component-builder |
| `packages/ui/src/components/inputs/` | 폼 입력 컴포넌트 | input-component-builder |
| `packages/ui/src/components/widgets/` | 데이터 표시 위젯 | widget-builder |
| `packages/ui/src/components/features/` | 비즈니스 로직 포함 | feature-builder |
| `packages/ui/src/components/layouts/` | 레이아웃 컴포넌트 | layout-builder |
| `apps/admin/app/(admin)/roles/` | 권한 관리 페이지 | fe-page-builder |
| `apps/admin/app/(admin)/roles/abilities/` | 권한 관리 하위 페이지 | fe-page-builder |

### 백엔드

| 경로 | 설명 | 담당 에이전트 |
|------|------|--------------|
| `packages/prisma/schema/` | Prisma 스키마 | schema-builder |
| `packages/prisma/seed*.ts` | 시드 데이터 | seed-maker |
| `packages/entity/src/` | Entity 클래스 | entity-builder |
| `packages/vo/src/` | Value Object | vo-builder |
| `packages/dto/src/` | DTO 클래스 | dto-builder |
| `packages/repository/src/` | Repository 레이어 | repository-builder |
| `packages/service/src/` | Service 레이어 | service-builder |
| `packages/facade/src/` | Facade 레이어 | facade-builder |
| `apps/server/src/module/` | Controller 레이어 | controller-builder |

---

## 8. 5단계 플로우 연계

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: 데이터 설계                                         │
│ orch-requirement (현재) → [사용자 리뷰] ✓                    │
│                                                              │
│ 출력:                                                        │
│ - apps/proposal/plans/project-alpha/admin-web/2026-01-30-Permission/  │
│   ├── README.md                                              │
│   ├── PROGRESS.md                                            │
│   ├── 01-overview.md                                         │
│   ├── 02-structure.md                                        │
│   ├── 03-interactions.md                                     │
│   ├── 04-ui-details.md                                       │
│   └── 05-technical-design.md                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: 스키마 구현                                         │
│ schema → entity → dto → seed → /be-review                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: 백엔드 로직                                         │
│ repository → service → controller → /be-review              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: 컴포넌트 구현                                       │
│ ui → widget → feature → /fe-review                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: 페이지 통합                                         │
│ fe-page-builder → /fe-review                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. 완료 후 출력

```
✅ 기획서 및 기술 설계서가 저장되었습니다.

📁 기획서 폴더: apps/proposal/plans/project-alpha/admin-web/2026-01-30-Permission/
   ├── README.md
   ├── PROGRESS.md
   ├── 01-overview.md
   ├── 02-structure.md
   ├── 03-interactions.md
   ├── 04-ui-details.md
   └── 05-technical-design.md

✅ Stage 1 완료. 사용자 리뷰 후 Stage 2로 진행하세요.

→ 다음 단계:
  /orch-stage start stage=2 plan=project-alpha/admin-web/2026-01-30-Permission
```

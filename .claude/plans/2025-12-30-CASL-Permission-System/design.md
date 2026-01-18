# CASL 권한 시스템 기술 설계서

**기획서:** `.claude/plans/2025-12-30-CASL-Permission-System.md`
**작성일:** 2026-01-08
**수정일:** 2026-01-17
**작성자:** technical-designer

---

## 5단계 개발 플로우 - Stage별 에이전트 지시

### Stage 2: 스키마 구현 ✅ 완료

| 에이전트 | 작업 | 상태 |
|----------|------|------|
| schema-builder | Action 모델 추가 | ✅ |
| schema-builder | Ability 모델 수정 (actionId FK) | ✅ |
| schema-builder | FieldVisibility/MaskingPattern 삭제 | ✅ |
| entity-builder | Action Entity 생성 | ✅ |
| entity-builder | Ability Entity 수정 | ✅ |
| dto-builder | ActionResponseDto, AbilityResponseDto 수정 | ✅ |
| seed-maker | Action 시드 데이터 추가 | ✅ |

### Stage 3: 백엔드 로직 ✅ 완료

| 에이전트 | 작업 | 상태 |
|----------|------|------|
| repository-builder | ActionsRepository 생성 | ✅ |
| repository-builder | AbilitiesRepository 수정 (Action 조인) | ✅ |
| service-builder | ActionsService 생성 | ✅ |
| service-builder | AbilitiesService 수정 | ✅ |
| service-builder | CaslAbilityFactory 수정 | ✅ |
| controller-builder | ActionsController CRUD 완성 | ✅ |
| controller-builder | AbilitiesController CRUD + batch | ✅ |
| controller-builder | SubjectsController fields 추가 | ✅ |

### Stage 4: 컴포넌트 구현 ✅ 완료

| 에이전트 | 컴포넌트 | 유형 | 상태 |
|----------|---------|------|------|
| ui-component-builder | VisibilityCell | ui | ✅ |
| widget-builder | ActionConfigEditor | widget | ✅ |
| widget-builder | AbilityRuleList | widget | ✅ |
| widget-builder | ConditionEditor | widget | ✅ |
| widget-builder | AbilityFormModal | widget | ✅ |
| widget-builder | AbilityMatrixView | widget | ✅ |
| feature-builder | RoleAbilityManager | feature | ✅ |
| feature-builder | UserAbilityManager | feature | ✅ |

### Stage 5: 페이지 통합 ✅ 완료

| 에이전트 | 페이지 | 상태 |
|----------|--------|------|
| page-builder | AbilityManagementPage (Admin) | ✅ |
| page-builder | RolesPage (Admin) | ✅ |

---

## 1. 설계 핵심 원칙

### 1.1 DDD 원칙

| 개념 | 역할 | 설명 |
|------|------|------|
| **Action** | 행위의 완전한 정의 | 마스킹, 포맷팅, 변환 등 config 포함 |
| **Subject** | 권한 대상 | 엔티티, 메뉴, 기능, UI 요소 |
| **Ability** | 연결만 담당 | Role + Subject + Action + fields의 조합 |

### 1.2 Subject 패턴 체계

| 패턴 | 예시 | 용도 |
|------|------|------|
| `all` | `all` | 전체 권한 |
| `entity:xxx` | `entity:User`, `entity:Reservation` | 데이터 엔티티 |
| `menu:xxx` | `menu:settings`, `menu:dashboard` | 메뉴 접근 |
| `feature:xxx` | `feature:export`, `feature:bulk-delete` | 기능 접근 |
| **`ui:xxx`** | `ui:mobile-bottom-tab`, `ui:main-banner` | **UI 요소 가시성** |

### 1.3 UI Subject 예시

| Subject | 설명 |
|---------|------|
| `ui:mobile-bottom-tab` | 모바일 바텀탭 전체 |
| `ui:mobile-bottom-tab:home` | 모바일 바텀탭 - 홈 탭 |
| `ui:mobile-bottom-tab:settings` | 모바일 바텀탭 - 설정 탭 |
| `ui:main-banner` | 메인 배너 |
| `ui:sidebar-menu` | 사이드바 메뉴 |
| `ui:floating-button:chat` | 플로팅 채팅 버튼 |

---

## 2. 컴포넌트 분석

### 2.1 기존 컴포넌트 재사용

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

### 2.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| VisibilityCell | ui | 가시성 상태 셀 (전체/마스킹/숨김) | ui-component-builder |
| ActionConfigEditor | widget | Action config(마스킹 등) 설정 위젯 | widget-builder |
| AbilityRuleList | widget | 권한 규칙 목록 위젯 | widget-builder |
| ConditionEditor | widget | JSON 조건 편집기 | widget-builder |
| AbilityFormModal | widget | 권한 추가/수정 폼 모달 | widget-builder |
| AbilityMatrixView | widget | Subject-Action 매트릭스 뷰 | widget-builder |
| RoleAbilityManager | feature | Role별 ABAC 권한 관리 | feature-builder |
| UserAbilityManager | feature | User별 예외 권한 관리 | feature-builder |

### 2.3 Widget -> Feature 분리 기준

```
Widget (순수 UI)                Feature (비즈니스 로직)
-----------------------------------------------------------------
AbilityMatrixView              -> RoleAbilityManager (Store 연결)
AbilityRuleList                -> RoleAbilityManager (Role API 연결)
AbilityRuleList                -> UserAbilityManager (User API 연결)
ConditionEditor                -> (Widget만으로 충분)
ActionConfigEditor             -> (Widget만으로 충분)
AbilityFormModal               -> (Widget만으로 충분)
```

---

## 3. Entity 설계

### 3.1 Action 모델 (신규 생성)

**파일 경로:** `packages/prisma/schema/core.prisma`

```prisma
// @schema-type: REFERENCE
// @description: CASL Action 정의 - 행위의 완전한 정의 (마스킹 설정 포함)
/// @displayName 액션
model Action {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime? @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime? @map("removed_at") @db.Timestamptz(6)

  /// @displayName 이름
  name        String    @unique  // 'create', 'read', 'read:masked:email' 등
  /// @displayName 표시명
  displayName String?   @map("display_name")
  /// @displayName 설명
  description String?
  /// @displayName 그룹
  group       String?   // 'crud', 'visibility', 'bulk', 'workflow'
  /// @displayName 정렬 순서
  order       Int       @default(0)
  /// @displayName 시스템 여부
  isSystem    Boolean   @default(true) @map("is_system")

  // Action 설정 (DDD: Action이 완전한 정의를 가짐)
  /// @displayName 설정
  config      Json?     // { type: 'masking', preset: 'PRESET_EMAIL' } 등

  // 관계
  abilities   Ability[]

  @@index([group])
  @@map("actions")
}
```

**config 타입 예시:**

```typescript
// 마스킹 (프리셋)
{ "type": "masking", "preset": "PRESET_EMAIL" }

// 마스킹 (커스텀 정규식)
{ "type": "masking", "pattern": "^(.{3}).*(.{2})$", "replacement": "$1***$2" }

// 포맷팅 (확장 가능)
{ "type": "format", "pattern": "YYYY-MM-DD" }

// 변환 (확장 가능)
{ "type": "transform", "rule": "uppercase" }
```

### 3.2 Ability 모델 (수정)

**변경 사항:**
- `action: String` → `actionId: String` FK 관계로 변경
- `maskingPattern` 필드 불필요 (Action.config에서 가져옴)

```prisma
// @schema-type: REFERENCE
// @description: CASL ABAC 권한 - Role/User와 Subject+Action의 연결
/// @displayName 권한
model Ability {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime? @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime? @map("removed_at") @db.Timestamptz(6)

  // CASL 필수 필드
  /// @displayName 액션 ID
  actionId    String    @map("action_id")
  /// @displayName 대상 필드
  fields      String[]  @default([])
  /// @displayName 조건
  conditions  Json?     // { "departmentId": "${user.departmentId}" }
  /// @displayName 거부 여부
  inverted    Boolean   @default(false)
  /// @displayName 거부 사유
  reason      String?

  // 연결 대상
  /// @displayName Subject ID
  subjectId   String    @map("subject_id")
  /// @displayName Role ID
  roleId      String?   @map("role_id")
  /// @displayName User ID
  userId      String?   @map("user_id")

  // 메타데이터
  /// @displayName 이름
  name        String?
  /// @displayName 설명
  description String?
  /// @displayName 활성화 여부
  isActive    Boolean   @default(true) @map("is_active")
  /// @displayName 우선순위
  priority    Int       @default(0)

  // 관계
  action      Action    @relation(fields: [actionId], references: [id])
  subject     Subject   @relation(fields: [subjectId], references: [id])
  role        Role?     @relation(fields: [roleId], references: [id])
  user        User?     @relation(fields: [userId], references: [id])

  @@index([actionId])
  @@index([subjectId])
  @@index([roleId])
  @@index([userId])
  @@index([isActive])
  @@map("abilities")
}
```

### 3.3 Subject 모델 (유지)

기존 Subject 모델 유지, UI Subject 패턴 추가:

```prisma
// UI Subject 시드 데이터 추가
{ name: 'ui:mobile-bottom-tab', displayName: '모바일 바텀탭', group: 'ui', order: 300 }
{ name: 'ui:mobile-bottom-tab:home', displayName: '바텀탭 - 홈', group: 'ui', order: 301 }
{ name: 'ui:mobile-bottom-tab:settings', displayName: '바텀탭 - 설정', group: 'ui', order: 302 }
{ name: 'ui:main-banner', displayName: '메인 배너', group: 'ui', order: 310 }
{ name: 'ui:sidebar-menu', displayName: '사이드바 메뉴', group: 'ui', order: 320 }
{ name: 'ui:floating-button:chat', displayName: '플로팅 채팅 버튼', group: 'ui', order: 330 }
```

### 3.4 삭제할 모델/Enum

| 모델/Enum | 파일 | 이유 |
|-----------|------|------|
| FieldVisibility 모델 | core.prisma | Ability로 통합 (read:masked:email Action 사용) |
| MaskingPattern 모델 | core.prisma | Action.config로 대체 |
| FieldVisibilityType enum | core.prisma | 삭제 |
| MaskingFieldType enum | core.prisma | 삭제 |

### 3.5 삭제할 관계

- Subject: `fieldVisibilities FieldVisibility[]` 제거
- Category: `fieldVisibilities FieldVisibility[]` 제거
- Group: `fieldVisibilities FieldVisibility[]` 제거

---

## 4. Entity 클래스

### 4.1 Action Entity (신규)

**파일:** `packages/entity/src/action.entity.ts`

```typescript
import type { Action as ActionEntity, Prisma } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Ability } from "./ability.entity";

export class Action extends AbstractEntity implements ActionEntity {
  name!: string;
  displayName!: string | null;
  description!: string | null;
  group!: string | null;
  order!: number;
  isSystem!: boolean;
  config!: Prisma.JsonValue | null;

  abilities?: Ability[];

  /**
   * config에서 마스킹 프리셋 가져오기
   */
  getMaskingPreset(): string | null {
    if (!this.config || typeof this.config !== 'object') return null;
    const cfg = this.config as { type?: string; preset?: string };
    if (cfg.type === 'masking' && cfg.preset) {
      return cfg.preset;
    }
    return null;
  }

  /**
   * 마스킹 Action인지 확인
   */
  isMaskingAction(): boolean {
    return this.getMaskingPreset() !== null;
  }

  /**
   * 숨김 Action인지 확인
   */
  isHiddenAction(): boolean {
    return this.name.endsWith(':hidden');
  }
}
```

### 4.2 Ability Entity (수정)

**파일:** `packages/entity/src/ability.entity.ts`

```typescript
import type { Ability as AbilityEntity, Prisma, Subject } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Action } from "./action.entity";
import type { Role } from "./role.entity";
import type { User } from "./user.entity";

export class Ability extends AbstractEntity implements AbilityEntity {
  // CASL 필수 필드
  actionId!: string;
  fields!: string[];
  conditions!: Prisma.JsonValue | null;
  inverted!: boolean;
  reason!: string | null;

  // 연결 대상
  subjectId!: string;
  roleId!: string | null;
  userId!: string | null;

  // 메타데이터
  name!: string | null;
  description!: string | null;
  isActive!: boolean;
  priority!: number;

  // 관계
  action?: Action;
  subject?: Subject;
  role?: Role;
  user?: User;

  /**
   * 역할 기반 권한인지 확인
   */
  isRoleBased(): boolean {
    return this.roleId !== null && this.userId === null;
  }

  /**
   * 사용자 기반 예외 권한인지 확인
   */
  isUserException(): boolean {
    return this.userId !== null;
  }

  /**
   * 허용 권한인지 확인
   */
  isAllowed(): boolean {
    return !this.inverted;
  }

  /**
   * 거부 권한인지 확인
   */
  isDenied(): boolean {
    return this.inverted;
  }

  /**
   * Action config에서 마스킹 프리셋 가져오기
   */
  getMaskingPreset(): string | null {
    return this.action?.getMaskingPreset() ?? null;
  }
}
```

### 4.3 삭제할 Entity 파일

- `packages/entity/src/field-visibility.entity.ts`
- `packages/entity/src/masking-pattern.entity.ts`

---

## 5. CASL Types

### 5.1 Actions 타입 확장

**파일:** `packages/be-common/src/casl/types.ts`

```typescript
export type Actions =
  // 기본 CRUD
  | "CREATE" | "READ" | "UPDATE" | "DELETE" | "MANAGE"
  // 워크플로우
  | "ACCESS" | "EXPORT" | "IMPORT" | "APPROVE" | "REJECT"
  // 가시성 (Visibility)
  | "READ:FULL" | "READ:HIDDEN"
  | "READ:MASKED:EMAIL" | "READ:MASKED:PHONE" | "READ:MASKED:NAME"
  | "READ:MASKED:SSN" | "READ:MASKED:CARD" | "READ:MASKED:ACCOUNT";

// Action config 타입 정의
export interface ActionMaskingConfig {
  type: 'masking';
  preset?: string;  // 'PRESET_EMAIL', 'PRESET_PHONE' 등
  pattern?: string; // 커스텀 정규식
  replacement?: string;
}

export interface ActionFormatConfig {
  type: 'format';
  pattern: string;  // 'YYYY-MM-DD' 등
}

export interface ActionTransformConfig {
  type: 'transform';
  rule: string;  // 'uppercase', 'lowercase' 등
}

export type ActionConfig = ActionMaskingConfig | ActionFormatConfig | ActionTransformConfig | null;
```

---

## 6. API 설계

### 6.1 Actions API (신규)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/actions | Action 목록 조회 | ADMIN |
| GET | /api/v1/actions/:id | Action 상세 조회 | ADMIN |
| GET | /api/v1/actions/group/:group | 그룹별 Action 조회 | ADMIN |
| POST | /api/v1/actions | Action 생성 | SUPER_ADMIN |
| PATCH | /api/v1/actions/:id | Action 수정 | SUPER_ADMIN |
| DELETE | /api/v1/actions/:id | Action 삭제 | SUPER_ADMIN |

### 6.2 Abilities API (수정)

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

### 6.3 Subjects API

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/subjects | Subject 목록 조회 | ADMIN |
| GET | /api/v1/subjects/:id | Subject 상세 조회 | ADMIN |
| GET | /api/v1/subjects/:id/fields | Subject의 필드 목록 (DMMF 기반) | ADMIN |
| GET | /api/v1/subjects/group/:group | 그룹별 Subject 조회 | ADMIN |

---

## 7. Repository/Service 설계

### 7.1 ActionsRepository (신규)

**파일:** `packages/repository/src/actions.repository.ts`

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findAll | - | Action[] | 전체 Action 조회 |
| findById | id: string | Action \| null | ID로 조회 |
| findByName | name: string | Action \| null | 이름으로 조회 |
| findByGroup | group: string | Action[] | 그룹별 조회 |
| create | data | Action | Action 생성 |
| updateById | id, data | Action | Action 수정 |
| removeById | id: string | Action | 소프트 삭제 |

### 7.2 AbilitiesRepository (수정)

**파일:** `packages/repository/src/abilities.repository.ts`

**변경 사항:**
- `findActiveByRoleIds` 등에서 `action` 관계 include 추가

```typescript
const results = await this.txHost.tx.ability.findMany({
  where: {
    roleId: { in: roleIds },
    removedAt: null,
    isActive: true,
  },
  include: {
    action: true,    // Action 관계 추가
    subject: true,
    role: true,
  },
  orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
});
```

### 7.3 ActionsService (신규)

**파일:** `packages/service/src/actions.service.ts`

| 메서드명 | 책임 |
|----------|------|
| getActions | Action 목록 조회 |
| getActionById | Action 상세 조회 |
| getActionsByGroup | 그룹별 Action 조회 |
| createAction | Action 생성 + 유효성 검사 |
| updateAction | Action 수정 + 유효성 검사 |
| deleteAction | Action 삭제 |
| applyActionConfig | 값에 Action config 적용 (마스킹 등) |

### 7.4 SubjectsService (수정)

**파일:** `packages/service/src/subjects.service.ts`

| 메서드명 | 책임 |
|----------|------|
| getSubjects | Subject 목록 조회 |
| getSubjectById | Subject 상세 조회 |
| getSubjectFields | DMMF 기반 필드 목록 조회 |
| getSubjectsByGroup | 그룹별 Subject 조회 |
| isEntitySubject | entity: 패턴인지 확인 |
| isUiSubject | ui: 패턴인지 확인 |

---

## 8. CASL Ability Factory 수정

### 8.1 CaslAbilityFactory

**파일:** `packages/be-common/src/casl/casl-ability.factory.ts`

**변경 사항:**
- `ability.action` (String) → `ability.action.name` (Action 관계)
- Action.config 활용

```typescript
private applyAbilityRule(
  ability: AbilityEntity,
  userContext: Record<string, unknown>,
  can: (...) => void,
  cannot: (...) => void,
): void {
  if (!ability.subject || !ability.action) {
    return;
  }

  // Action 이름 사용
  const action = ability.action.name as Actions;
  const subject = ability.subject.name as Subjects;

  const conditions = this.parseConditions(ability.conditions, userContext);

  if (!ability.inverted) {
    can(action, subject, conditions);
  } else {
    cannot(action, subject, conditions);
  }
}
```

---

## 9. DTO 설계

### 9.1 Action DTO (신규)

**파일:** `packages/dto/src/actions/`

```typescript
// action-response.dto.ts
export class ActionResponseDto {
  @StringField()
  id: string;

  @StringField()
  name: string;

  @StringField({ required: false })
  displayName?: string;

  @StringField({ required: false })
  description?: string;

  @StringField({ required: false })
  group?: string;

  @NumberField()
  order: number;

  @BooleanField()
  isSystem: boolean;

  @JsonField({ required: false })
  config?: ActionConfig;
}

// create-action.dto.ts
export class CreateActionDto {
  @StringField({ required: true })
  name: string;

  @StringField({ required: false })
  displayName?: string;

  @StringField({ required: false })
  description?: string;

  @StringField({ required: false })
  group?: string;

  @NumberField({ required: false })
  order?: number;

  @JsonField({ required: false })
  config?: ActionConfig;
}
```

### 9.2 Ability DTO (수정)

**파일:** `packages/dto/src/abilities/`

```typescript
// create-ability.dto.ts
export class CreateAbilityDto {
  @StringField({ required: true })
  actionId: string;  // action → actionId로 변경

  @StringField({ required: true })
  subjectId: string;

  @StringField({ required: false })
  roleId?: string;

  @StringField({ required: false })
  userId?: string;

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

  @NumberField({ required: false, default: 0 })
  priority?: number;
}

// ability-response.dto.ts
export class AbilityResponseDto {
  @StringField()
  id: string;

  @ObjectField(() => ActionResponseDto)
  action: ActionResponseDto;  // Action 객체 포함

  @ObjectField(() => SubjectResponseDto)
  subject: SubjectResponseDto;

  @ArrayField(() => String)
  fields: string[];

  @JsonField({ required: false })
  conditions?: Record<string, any>;

  @BooleanField()
  inverted: boolean;

  @StringField({ required: false })
  reason?: string;

  @NumberField()
  priority: number;
}
```

---

## 10. Seed 데이터

### 10.1 Action Seed Data

**파일:** `packages/prisma/seed-data.ts`

```typescript
export const actionSeedData = [
  // 기본 CRUD
  { name: 'create', displayName: '생성', group: 'crud', order: 10, isSystem: true, config: null },
  { name: 'read', displayName: '조회', group: 'crud', order: 20, isSystem: true, config: null },
  { name: 'update', displayName: '수정', group: 'crud', order: 30, isSystem: true, config: null },
  { name: 'delete', displayName: '삭제', group: 'crud', order: 40, isSystem: true, config: null },
  { name: 'manage', displayName: '전체 관리', group: 'crud', order: 50, isSystem: true, config: null },

  // 가시성 (Visibility)
  { name: 'read:full', displayName: '전체 조회', group: 'visibility', order: 100, isSystem: true, config: null },
  { name: 'read:hidden', displayName: '숨김', group: 'visibility', order: 110, isSystem: true, config: null },
  {
    name: 'read:masked:email',
    displayName: '이메일 마스킹 조회',
    group: 'visibility',
    order: 120,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_EMAIL' }
  },
  {
    name: 'read:masked:phone',
    displayName: '전화번호 마스킹 조회',
    group: 'visibility',
    order: 130,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_PHONE' }
  },
  {
    name: 'read:masked:name',
    displayName: '이름 마스킹 조회',
    group: 'visibility',
    order: 140,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_NAME' }
  },
  {
    name: 'read:masked:ssn',
    displayName: '주민번호 마스킹 조회',
    group: 'visibility',
    order: 150,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_SSN' }
  },
  {
    name: 'read:masked:card',
    displayName: '카드번호 마스킹 조회',
    group: 'visibility',
    order: 160,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_CARD' }
  },
  {
    name: 'read:masked:account',
    displayName: '계좌번호 마스킹 조회',
    group: 'visibility',
    order: 170,
    isSystem: true,
    config: { type: 'masking', preset: 'PRESET_ACCOUNT' }
  },

  // 워크플로우
  { name: 'access', displayName: '접근', group: 'workflow', order: 200, isSystem: true, config: null },
  { name: 'export', displayName: '내보내기', group: 'bulk', order: 210, isSystem: true, config: null },
  { name: 'import', displayName: '가져오기', group: 'bulk', order: 220, isSystem: true, config: null },
];
```

### 10.2 UI Subject Seed Data

```typescript
export const uiSubjectSeedData = [
  { name: 'ui:mobile-bottom-tab', displayName: '모바일 바텀탭', group: 'ui', order: 300 },
  { name: 'ui:mobile-bottom-tab:home', displayName: '바텀탭 - 홈', group: 'ui', order: 301 },
  { name: 'ui:mobile-bottom-tab:settings', displayName: '바텀탭 - 설정', group: 'ui', order: 302 },
  { name: 'ui:main-banner', displayName: '메인 배너', group: 'ui', order: 310 },
  { name: 'ui:sidebar-menu', displayName: '사이드바 메뉴', group: 'ui', order: 320 },
  { name: 'ui:floating-button:chat', displayName: '플로팅 채팅 버튼', group: 'ui', order: 330 },
];
```

### 10.3 마스킹 패턴 규칙 (프리셋)

| 프리셋 | 패턴 | 예시 |
|--------|------|------|
| PRESET_EMAIL | 앞 3자리 + 도메인 | `min***@gmail.com` |
| PRESET_PHONE | 중간 4자리 마스킹 | `010-****-5678` |
| PRESET_NAME | 중간 글자 마스킹 | `홍*동` |
| PRESET_SSN | 뒷자리 전체 마스킹 | `920315-*******` |
| PRESET_CARD | 중간 8자리 마스킹 | `1234-****-****-3456` |
| PRESET_ACCOUNT | 중간 마스킹 | `***-**-******` |

---

## 11. 에이전트 실행 계획

### Phase 1: 스키마 정리 및 마이그레이션

**순서:** schema-builder -> seed-maker

1. Action 모델 추가
2. Ability 모델 수정 (actionId FK)
3. FieldVisibility, MaskingPattern 모델 삭제
4. 관련 enum 삭제
5. 관계 정리 (Subject, Category, Group)
6. Migration 실행
7. Seed 데이터 추가 (Action, UI Subject)

### Phase 2: 백엔드 레이어

**순서:** entity-builder -> dto-builder -> repository-builder -> service-builder -> controller-builder

1. Action Entity 생성
2. Ability Entity 수정
3. FieldVisibility, MaskingPattern Entity 삭제
4. Action DTO 생성
5. Ability DTO 수정
6. ActionsRepository 생성
7. AbilitiesRepository 수정
8. ActionsService 생성
9. SubjectsService 수정
10. CaslAbilityFactory 수정
11. ActionsController 생성
12. AbilitiesController 수정

### Phase 3: 프론트엔드 컴포넌트

**순서:** ui-component-builder -> widget-builder -> feature-builder -> store-builder

### Phase 4: 페이지

**순서:** page-builder -> page-reviewer

### Phase 5: 품질 검증 (QA)

**순서:** fe-testing -> be-testing

---

## 12. 최종 체크리스트

### Phase 0: 기존 모델 정리

- [ ] FieldVisibility 모델 삭제
- [ ] MaskingPattern 모델 삭제
- [ ] FieldVisibilityType enum 삭제
- [ ] MaskingFieldType enum 삭제
- [ ] 관련 관계 정리 (Subject, Category, Group)
- [ ] Migration 실행

### Phase 1: 스키마 구축

- [ ] Action 모델 추가 (config: Json?)
- [ ] Ability 모델 수정 (actionId FK)
- [ ] UI Subject 시드 데이터 추가
- [ ] Action 시드 데이터 추가
- [ ] Migration 실행
- [ ] 시드 데이터 생성

### Phase 2: 백엔드 연동

- [ ] Action Entity 생성
- [ ] Ability Entity 수정
- [ ] FieldVisibility/MaskingPattern Entity 삭제
- [ ] ActionsRepository 생성
- [ ] AbilitiesRepository 수정 (action include)
- [ ] ActionsService 생성
- [ ] SubjectsService 수정 (DMMF 필드 조회)
- [ ] CaslAbilityFactory 수정 (action.name, action.config)
- [ ] ActionsController 생성
- [ ] AbilitiesController 수정
- [ ] Action DTO 생성
- [ ] Ability DTO 수정
- [ ] Swagger 문서화
- [ ] Orval API 클라이언트 생성

### Phase 3: 프론트엔드 컴포넌트

- [ ] VisibilityCell UI 컴포넌트
- [ ] ActionConfigEditor Widget
- [ ] AbilityRuleList Widget
- [ ] ConditionEditor Widget
- [ ] AbilityFormModal Widget
- [ ] AbilityMatrixView Widget
- [ ] RoleAbilityManager Feature
- [ ] UserAbilityManager Feature

### Phase 4: 페이지 및 Store

- [ ] AbilityStore 생성
- [ ] 권한 관리 페이지 구현

### Phase 5: 테스트

- [ ] RBAC/ABAC 분리 동작 테스트
- [ ] Role 기본 권한 테스트
- [ ] User 예외 권한 우선순위 테스트
- [ ] Action config (마스킹) 적용 테스트
- [ ] UI Subject (ui:xxx) 권한 테스트

---

## Critical Files

| 파일 | 변경 내용 |
|------|----------|
| `packages/prisma/schema/core.prisma` | Action 모델 추가, Ability 수정, FieldVisibility/MaskingPattern 제거 |
| `packages/entity/src/action.entity.ts` | 신규 - config Json 필드 포함 |
| `packages/entity/src/ability.entity.ts` | actionId FK 추가, action 관계 추가 |
| `packages/repository/src/actions.repository.ts` | 신규 |
| `packages/repository/src/abilities.repository.ts` | action include 추가 |
| `packages/service/src/actions.service.ts` | 신규 |
| `packages/be-common/src/casl/casl-ability.factory.ts` | action.name, action.config 사용 |
| `packages/be-common/src/casl/types.ts` | visibility Actions 추가 |
| `packages/prisma/seed-data.ts` | actionSeedData, uiSubjectSeedData 추가 |
| `packages/prisma/seed.ts` | createActions() 추가 |

---

## 삭제할 파일

- `packages/entity/src/field-visibility.entity.ts`
- `packages/entity/src/masking-pattern.entity.ts`
- `packages/repository/src/field-visibilities.repository.ts` (있다면)
- `packages/repository/src/masking-patterns.repository.ts` (있다면)
- `packages/service/src/field-visibilities.service.ts` (있다면)
- `packages/service/src/masking-patterns.service.ts` (있다면)

---

**작성자:** technical-designer
**작성일:** 2026-01-08
**수정일:** 2026-01-10

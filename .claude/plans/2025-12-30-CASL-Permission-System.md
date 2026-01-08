# 📋 RBAC/ABAC 분리형 권한 시스템 기획서

**작성일:** 2025-12-30
**수정일:** 2026-01-07
**플랫폼:** Web (Admin/User) + Mobile (User)

---

## 0. 설계 철학

### 0.1 RBAC과 ABAC의 역할 분리

```
┌─────────────────────────────────────────────────────────────────────┐
│                         권한 시스템 구조                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   RBAC (Role-Based Access Control)                                  │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  • 메뉴 접근 권한                                            │   │
│   │  • API 엔드포인트 접근                                       │   │
│   │  • 기능 ON/OFF                                               │   │
│   │  → 기존 Role, RoleCategory, RoleGroup 시스템 유지            │   │
│   │  → @RoleCategories, @RoleGroups 데코레이터 사용              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   ABAC (Attribute-Based Access Control) - CASL                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  • 데이터 레벨 필터링 (본인 데이터만, 부서 데이터만)           │   │
│   │  • 필드 가시성 제어 (이메일, 전화번호 마스킹)                  │   │
│   │  • 조건부 권한 (상태, 기간, 소유권 기반)                      │   │
│   │  → 사용자별 AbilityRule 할당                                 │   │
│   │  → CASL 라이브러리 컨벤션 준수                               │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 0.2 왜 분리하는가?

| 기존 설계 (통합) | 분리 설계 |
|-----------------|----------|
| Role → Ability → Subject | RBAC: Role → Menu (고정) |
| Ability가 Role에 종속 | ABAC: User → AbilityRule (동적) |
| 사용자별 예외 처리 불가 | 사용자별 세밀한 권한 부여 |
| Role explosion 문제 | 필요한 곳에만 ABAC 적용 |

### 0.3 제어 대상 분류

| 구분 | 제어 방식 | 예시 | 결정 시점 |
|------|----------|------|----------|
| 메뉴 접근 | **RBAC** | 설정 메뉴 보이기/숨기기 | 라우팅 레벨 |
| API 엔드포인트 | **RBAC** | POST /users 호출 가능 여부 | 가드 레벨 |
| 기능 버튼 | **RBAC** | 내보내기 버튼 활성화 | UI 렌더링 |
| 데이터 범위 | **ABAC** | 본인 예약만 조회 | 쿼리 레벨 |
| 필드 가시성 | **ABAC** | 전화번호 마스킹 | 응답 레벨 |
| 조건부 수정 | **ABAC** | 대기 상태만 수정 가능 | 비즈니스 로직 |

---

## 1. 컴포넌트 분석

> **참고**: `pnpm --filter=@cocrepo/ui analyze:components` 명령으로 기존 컴포넌트 확인

### 1.1 기존 컴포넌트 재사용

| 분류 | 컴포넌트 | 용도 |
|------|----------|------|
| **UI** | Button, Chip, Checkbox | 권한 ON/OFF 토글 |
| **Inputs** | Select, Input | Subject 선택, 검색 |
| **Widget** | DataTable | 권한 매트릭스 표시 |
| **Layouts** | VStack, HStack, Container | 레이아웃 배치 |

### 1.2 신규 컴포넌트 필요

| 분류 | 컴포넌트 | 설명 | 담당 Agent |
|------|----------|------|------------|
| **Widget** | AbilityRuleList | 사용자 권한 규칙 목록 | widget-builder |
| **Widget** | ConditionEditor | 조건 JSON 편집기 | widget-builder |
| **Feature** | UserAbilityManager | 사용자별 ABAC 권한 관리 | feature-builder |
| **Page** | AbilityRulesPage | ABAC 권한 관리 페이지 | page-builder |

### 1.3 Widget → Feature 분리 기준

```
Widget (순수 UI)              Feature (비즈니스 로직)
─────────────────────────────────────────────────────
AbilityRuleList               → UserAbilityManager (API 연결)
ConditionEditor               → (Widget만으로 충분)
```

---

## 2. RBAC 시스템 (기존 유지)

### 2.1 현재 Role 구조

```
Roles (enum)
├── USER          - 일반 사용자
├── ADMIN         - 관리자
└── SUPER_ADMIN   - 최고 관리자

RoleCategoryNames (enum)
├── COMMON        - 공통
├── ADMIN         - 관리자
├── USER          - 사용자
├── MANAGER       - 매니저
├── DEVELOPER     - 개발자
└── GUEST         - 게스트

RoleGroupNames (enum)
├── NORMAL        - 일반
└── VIP           - VIP
```

### 2.2 RBAC 사용 패턴

```typescript
// Controller에서 RBAC 적용
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)
@RoleCategories([RoleCategoryNames.ADMIN])  // RBAC
export class AdminSettingsController {

  @Get('permissions')
  @RoleCategories([RoleCategoryNames.ADMIN])  // SUPER_ADMIN만
  async getPermissions() {
    // Role 기반 접근 제어
  }
}
```

### 2.3 메뉴 접근 권한 (RBAC)

```prisma
// 기존 Menu-Role 관계 유지
model Menu {
  id          String   @id
  name        String
  path        String
  roles       Role[]   @relation("MenuRoles")  // RBAC
}

model Role {
  id          String   @id
  name        Roles
  menus       Menu[]   @relation("MenuRoles")  // RBAC
}
```

---

## 3. ABAC 시스템 (CASL 기반 신규)

### 3.1 AbilityRule 스키마 (CASL 컨벤션)

```prisma
// CASL Rule을 DB에 저장
model AbilityRule {
  id          String   @id @default(uuid())
  seq         Int      @unique @default(autoincrement())
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")
  removedAt   DateTime? @map("removed_at")

  // CASL 필수 필드
  action      String   // 'create', 'read', 'update', 'delete', 'manage'
  subject     String   // 'User', 'Ground', 'Reservation', 'all'
  fields      String[] // ['email', 'phone'] - 필드 레벨 제어
  conditions  Json?    // { "departmentId": "${user.departmentId}" }
  inverted    Boolean  @default(false)  // can(false) vs cannot(true)
  reason      String?  // 거부 시 사용자에게 보여줄 메시지

  // 사용자 연결 (RBAC과 분리)
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id])

  // 메타데이터
  name        String?  // "본인 예약만 조회", "HR 부서 데이터 접근"
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  priority    Int      @default(0)  // 규칙 우선순위 (높을수록 먼저 평가)

  @@index([userId])
  @@map("ability_rules")
}
```

### 3.2 CASL Actions

```typescript
// CASL 표준 액션
export type AbilityAction =
  | 'create'   // 생성
  | 'read'     // 조회
  | 'update'   // 수정
  | 'delete'   // 삭제
  | 'manage';  // 모든 권한 (CRUD + 기타)
```

### 3.3 CASL Subjects

```typescript
// 데이터 엔티티만 Subject로 정의 (메뉴, 기능은 RBAC에서 처리)
export type AbilitySubject =
  | 'User'
  | 'Ground'
  | 'Space'
  | 'Reservation'
  | 'Inquiry'
  | 'Notice'
  | 'Banner'
  | 'all';  // 모든 Subject
```

### 3.4 Conditions (동적 조건)

```typescript
// 조건 템플릿 변수
interface ConditionVariables {
  '${user.id}': string;           // 현재 사용자 ID
  '${user.departmentId}': string; // 소속 부서
  '${user.spaceId}': string;      // 메인 Space ID
  '${user.role}': string;         // 현재 Role
}

// 예시 조건들
const conditions = {
  // 본인 데이터만
  ownerId: '${user.id}',

  // 같은 부서만
  departmentId: '${user.departmentId}',

  // 특정 상태만
  status: { $in: ['PENDING', 'ACTIVE'] },

  // 복합 조건
  $and: [
    { spaceId: '${user.spaceId}' },
    { status: { $ne: 'DELETED' } }
  ]
};
```

---

## 4. 권한 결정 흐름

```
사용자 요청
    │
    ▼
┌─────────────────────────────────────────────────┐
│ 1. 인증 확인 (JWT)                               │
│    → 실패 시 401 Unauthorized                   │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│ 2. RBAC 체크 (RoleCategoryGuard)                │
│    "이 Role이 이 API에 접근 가능한가?"            │
│    → 실패 시 403 Forbidden                      │
│    → 메뉴/기능 레벨 제어                         │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│ 3. ABAC 체크 (CaslAbilityGuard) - 선택적        │
│    "이 사용자가 이 데이터에 접근 가능한가?"        │
│    → 데이터 레벨 필터링                          │
│    → 필드 마스킹                                │
└─────────────────────────────────────────────────┘
    │
    ▼
  응답 반환
```

---

## 5. 백엔드 구현

### 5.1 CaslAbilityFactory

```typescript
// packages/be-common/src/casl/casl-ability.factory.ts
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export type AppAbility = MongoAbility<[AbilityAction, AbilitySubject]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    private readonly abilityRulesRepository: AbilityRulesRepository,
  ) {}

  async createForUser(user: UserDto): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility
    );

    // 1. 사용자의 AbilityRules 조회
    const rules = await this.abilityRulesRepository.findActiveByUserId(user.id);

    // 2. 우선순위 순으로 정렬 (높은 priority 먼저)
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);

    // 3. CASL Ability 빌드
    for (const rule of sortedRules) {
      const conditions = rule.conditions
        ? this.interpolateConditions(rule.conditions, user)
        : undefined;

      if (rule.inverted) {
        cannot(rule.action as AbilityAction, rule.subject, conditions);
      } else {
        can(rule.action as AbilityAction, rule.subject, rule.fields, conditions);
      }
    }

    return build();
  }

  private interpolateConditions(conditions: any, user: UserDto): any {
    const conditionStr = JSON.stringify(conditions);

    const variables: Record<string, string> = {
      '${user.id}': user.id,
      '${user.departmentId}': user.departmentId ?? '',
      '${user.spaceId}': user.tenants?.find(t => t.main)?.spaceId ?? '',
      '${user.role}': user.tenants?.find(t => t.main)?.role?.name ?? '',
    };

    let interpolated = conditionStr;
    for (const [key, value] of Object.entries(variables)) {
      interpolated = interpolated.replace(new RegExp(key.replace('$', '\\$'), 'g'), value);
    }

    return JSON.parse(interpolated);
  }
}
```

### 5.2 ABAC 가드 (선택적 적용)

```typescript
// packages/be-common/src/casl/casl-ability.guard.ts
@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAbilities = this.reflector.get<AbilityCheck[]>(
      CHECK_ABILITIES_KEY,
      context.getHandler(),
    );

    // ABAC 체크가 필요 없으면 통과
    if (!requiredAbilities || requiredAbilities.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const ability = await this.caslAbilityFactory.createForUser(request.user);

    return requiredAbilities.every(check =>
      ability.can(check.action, check.subject)
    );
  }
}

// 데코레이터
export const CheckAbilities = (...abilities: AbilityCheck[]) =>
  SetMetadata(CHECK_ABILITIES_KEY, abilities);

interface AbilityCheck {
  action: AbilityAction;
  subject: AbilitySubject;
}
```

### 5.3 Controller 사용 예시

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)  // RBAC
@RoleCategories([RoleCategoryNames.ADMIN])   // RBAC
export class UsersController {

  // RBAC만 적용 (관리자면 모든 사용자 조회 가능)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // ABAC 추가 적용 (조건부 접근)
  @Get(':id')
  @UseGuards(CaslAbilityGuard)
  @CheckAbilities({ action: 'read', subject: 'User' })
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDto) {
    const ability = await this.caslAbilityFactory.createForUser(user);

    const targetUser = await this.usersService.findById(id);

    // CASL로 접근 가능 여부 체크
    if (!ability.can('read', subject('User', targetUser))) {
      throw new ForbiddenException('이 사용자 정보에 접근할 수 없습니다');
    }

    return targetUser;
  }
}
```

### 5.4 서비스에서 ABAC 적용

```typescript
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findAllForUser(user: UserDto) {
    const ability = await this.caslAbilityFactory.createForUser(user);

    // CASL의 accessibleBy 활용하여 필터링된 쿼리 생성
    const accessibleReservations = accessibleBy(ability, 'read').Reservation;

    return this.reservationsRepository.findMany({
      where: accessibleReservations,
    });
  }
}
```

---

## 6. API 설계

### 6.1 AbilityRules API

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | /api/v1/ability-rules/my | 내 ABAC 권한 조회 | 로그인 |
| GET | /api/v1/ability-rules/users/:userId | 사용자별 권한 조회 | SUPER_ADMIN |
| POST | /api/v1/ability-rules | 권한 규칙 생성 | SUPER_ADMIN |
| PUT | /api/v1/ability-rules/:id | 권한 규칙 수정 | SUPER_ADMIN |
| DELETE | /api/v1/ability-rules/:id | 권한 규칙 삭제 | SUPER_ADMIN |
| POST | /api/v1/ability-rules/users/:userId/batch | 일괄 권한 설정 | SUPER_ADMIN |

### 6.2 DTO 정의

```typescript
// packages/dto/src/ability-rule/

// 생성 요청
export class CreateAbilityRuleDto {
  @StringField({ required: true })
  userId: string;

  @StringField({ required: true })
  action: string;  // 'create' | 'read' | 'update' | 'delete' | 'manage'

  @StringField({ required: true })
  subject: string;  // 'User' | 'Ground' | ...

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

// 응답
export class AbilityRuleResponseDto {
  @StringField()
  id: string;

  @StringField()
  action: string;

  @StringField()
  subject: string;

  @ArrayField(() => String)
  fields: string[];

  @JsonField()
  conditions: Record<string, any> | null;

  @BooleanField()
  inverted: boolean;

  @StringField()
  reason: string | null;

  @StringField()
  name: string | null;

  @NumberField()
  priority: number;
}
```

---

## 7. 프론트엔드 연동

### 7.1 AbilityContext (ABAC 전용)

```typescript
// packages/hook/src/casl/AbilityContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { createMongoAbility, MongoAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';

type AppAbility = MongoAbility<[string, string]>;

const AbilityContext = createContext<AppAbility>(createMongoAbility());

export const Can = createContextualCan(AbilityContext.Consumer);

export function useAbility(): AppAbility {
  return useContext(AbilityContext);
}

export function AbilityProvider({ children }: { children: ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(() => createMongoAbility());
  const { data: rulesData } = useGetMyAbilityRules();

  useEffect(() => {
    if (rulesData?.data) {
      const newAbility = createMongoAbility(rulesData.data.map(rule => ({
        action: rule.action,
        subject: rule.subject,
        fields: rule.fields,
        conditions: rule.conditions,
        inverted: rule.inverted,
        reason: rule.reason,
      })));
      setAbility(newAbility);
    }
  }, [rulesData]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
```

### 7.2 ABAC 훅

```typescript
// packages/hook/src/casl/useAbilityCheck.ts

// 단일 권한 확인
export function useAbilityCheck(action: string, subject: string): boolean {
  const ability = useAbility();
  return ability.can(action, subject);
}

// 엔티티 CRUD 권한
export function useEntityAbility(subject: string) {
  const ability = useAbility();

  return {
    canCreate: ability.can('create', subject),
    canRead: ability.can('read', subject),
    canUpdate: ability.can('update', subject),
    canDelete: ability.can('delete', subject),
    canManage: ability.can('manage', subject),
  };
}

// 필드 레벨 권한 (마스킹용)
export function useFieldAbility(subject: string, field: string): boolean {
  const ability = useAbility();
  return ability.can('read', subject, field);
}
```

### 7.3 컴포넌트에서 사용

```tsx
// ABAC: 데이터 레벨 권한 체크
function ReservationActions({ reservation }: Props) {
  const ability = useAbility();

  // 특정 예약에 대한 권한 확인 (조건 평가)
  const canEdit = ability.can('update', subject('Reservation', reservation));
  const canDelete = ability.can('delete', subject('Reservation', reservation));

  return (
    <HStack>
      {canEdit && <Button onPress={onEdit}>수정</Button>}
      {canDelete && <Button onPress={onDelete} color="danger">삭제</Button>}
    </HStack>
  );
}

// ABAC: 필드 마스킹
function UserInfo({ user }: Props) {
  const canReadPhone = useFieldAbility('User', 'phone');
  const canReadEmail = useFieldAbility('User', 'email');

  return (
    <VStack>
      <Text>이름: {user.name}</Text>
      <Text>이메일: {canReadEmail ? user.email : '***@***.***'}</Text>
      <Text>전화: {canReadPhone ? user.phone : '010-****-****'}</Text>
    </VStack>
  );
}
```

### 7.4 RBAC은 기존 방식 유지

```tsx
// RBAC: 메뉴 접근 (기존 NavigationStore 활용)
function SideNav() {
  const { visibleMenus } = useNavigationStore();

  return (
    <NavTreePanel items={visibleMenus} />
  );
}

// RBAC: 기능 버튼 (Role 기반)
function ExportButton() {
  const { hasFeature } = useRoleFeatures();

  if (!hasFeature('export')) return null;

  return <Button>내보내기</Button>;
}
```

---

## 8. 관리자 UI

### 8.1 화면 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    사용자 권한 관리 (ABAC)                        │
├─────────────────────────────────────────────────────────────────┤
│  사용자 검색: [          🔍]                                      │
├─────────────────────────────────────────────────────────────────┤
│  선택된 사용자: 홍길동 (hong@example.com)          [권한 추가 +]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  권한 규칙 목록                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ #  │ 이름        │ Subject │ Action │ 조건      │ 상태   │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 1  │ 본인 예약    │ Reserv..│ read   │ 본인만    │ ✓ 활성 │  │
│  │ 2  │ 부서 사용자  │ User    │ read   │ 같은 부서 │ ✓ 활성 │  │
│  │ 3  │ 삭제 금지    │ User    │ delete │ -        │ ✗ 거부 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [저장] [초기화]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 권한 추가 모달

```
┌─────────────────────────────────────────────────────────────────┐
│                      권한 규칙 추가                               │
├─────────────────────────────────────────────────────────────────┤
│  규칙 이름:     [본인 예약만 조회 가능          ]                  │
│                                                                  │
│  Subject:       [Reservation ▼]                                  │
│  Action:        [read ▼]                                         │
│  Type:          ○ 허용 (can)   ● 거부 (cannot)                   │
│                                                                  │
│  조건 (Conditions):                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ {                                                         │  │
│  │   "userId": "${user.id}"                                  │  │
│  │ }                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  거부 사유:     [본인의 예약 정보만 확인할 수 있습니다]             │
│  우선순위:      [0   ]                                           │
│                                                                  │
│                              [취소]  [저장]                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. 시드 데이터

### 9.1 기본 AbilityRules 템플릿

```typescript
// packages/prisma/seed-data.ts

export const defaultAbilityRuleTemplates = {
  // 일반 사용자 기본 권한
  USER_DEFAULT: [
    {
      name: '본인 정보 조회',
      action: 'read',
      subject: 'User',
      conditions: { id: '${user.id}' },
      inverted: false,
    },
    {
      name: '본인 정보 수정',
      action: 'update',
      subject: 'User',
      conditions: { id: '${user.id}' },
      inverted: false,
    },
    {
      name: '본인 예약 관리',
      action: 'manage',
      subject: 'Reservation',
      conditions: { userId: '${user.id}' },
      inverted: false,
    },
  ],

  // 부서장 권한
  MANAGER_DEFAULT: [
    {
      name: '부서 사용자 조회',
      action: 'read',
      subject: 'User',
      conditions: { departmentId: '${user.departmentId}' },
      inverted: false,
    },
    {
      name: '부서 예약 조회',
      action: 'read',
      subject: 'Reservation',
      conditions: { departmentId: '${user.departmentId}' },
      inverted: false,
    },
  ],

  // 전체 관리자 권한 (ABAC 관점)
  ADMIN_DEFAULT: [
    {
      name: '모든 데이터 관리',
      action: 'manage',
      subject: 'all',
      inverted: false,
    },
  ],
};
```

---

## 10. 마이그레이션 전략

### 10.1 Phase 1: 스키마 추가

```bash
# AbilityRule 모델 추가
npx prisma migrate dev --name add_ability_rules
```

### 10.2 Phase 2: 기존 Ability 데이터 변환 (선택)

```typescript
// 기존 Role-Ability 구조를 User-AbilityRule로 변환하는 마이그레이션
async function migrateAbilitiesToRules() {
  const abilities = await prisma.ability.findMany({
    include: { role: { include: { users: true } } }
  });

  for (const ability of abilities) {
    // Role에 속한 모든 사용자에게 AbilityRule 생성
    for (const user of ability.role.users) {
      await prisma.abilityRule.create({
        data: {
          userId: user.id,
          action: ability.action.toLowerCase(),
          subject: ability.subject.name,
          conditions: ability.conditions,
          inverted: ability.type === 'CAN_NOT',
        }
      });
    }
  }
}
```

### 10.3 Phase 3: 점진적 적용

1. 새로운 기능에만 ABAC 적용
2. 기존 RBAC은 그대로 유지
3. 필요한 곳에만 ABAC 추가

---

## 11. 개발 규칙 (Critical)

### 11.1 Repository 레이어 규칙

**메서드 네이밍: 데이터 관점에서 작성**

```typescript
// ✅ 올바른 예시
findActiveByUserId(userId: string)
findBySubjectWithConditions(subject: string)

// ❌ 금지
findForPermissionCheck(userId: string)
```

### 11.2 Service 레이어 규칙

**메서드 네이밍: 도메인 목적으로 작성**

```typescript
// ✅ 올바른 예시
buildAbilityForUser(user: UserDto)
checkDataAccess(user: UserDto, subject: string, action: string)

// ❌ 금지
findAbilityRulesAndBuildCasl()
```

### 11.3 Controller 레이어 규칙

```typescript
// ✅ RBAC + ABAC 함께 사용
@Controller('reservations')
@UseGuards(JwtAuthGuard, RoleCategoryGuard)  // RBAC (필수)
@RoleCategories([RoleCategoryNames.ADMIN, RoleCategoryNames.USER])
export class ReservationsController {

  @Get(':id')
  @UseGuards(CaslAbilityGuard)  // ABAC (선택적)
  @CheckAbilities({ action: 'read', subject: 'Reservation' })
  async findOne() { ... }
}
```

### 11.4 DTO 위치 규칙

```
packages/dto/src/ability-rule/
├── create-ability-rule.dto.ts
├── update-ability-rule.dto.ts
├── ability-rule-response.dto.ts
└── index.ts
```

---

## 12. 에이전트별 지시사항

### 12.1 schema-builder

- `AbilityRule` 모델 생성 (CASL 컨벤션)
- 기존 `Ability` 모델은 유지 (호환성)
- `userId` 인덱스 추가

### 12.2 repository-builder

- `AbilityRulesRepository`: `findActiveByUserId`, `findBySubject`
- 메서드명은 데이터 관점

### 12.3 service-builder

- `AbilityRulesService`: `createRule`, `updateRule`, `deleteRule`
- `CaslAbilityFactory`: `buildAbilityForUser`

### 12.4 controller-builder

- RBAC 가드는 필수 적용 (`RoleCategoryGuard`)
- ABAC 가드는 필요한 곳에만 선택 적용 (`CaslAbilityGuard`)
- `@DtoResponse()` 데코레이터 사용

### 12.5 dto-builder

- `packages/dto/src/ability-rule/` 에 DTO 생성
- `@cocrepo/decorator` 필드 데코레이터 사용

### 12.6 page-builder

- `AbilityRulesPage`: 사용자별 ABAC 권한 관리
- URL 기반 상태 관리 (`?userId=xxx`)
- 핸들러 네이밍: `on[Event][UI]` 패턴

---

## 13. 최종 체크리스트

### Phase 1: 기반 구축
- [ ] AbilityRule Prisma 스키마 추가
- [ ] Migration 실행
- [ ] AbilityRulesRepository 구현
- [ ] 시드 데이터 추가

### Phase 2: 백엔드 연동
- [ ] CaslAbilityFactory 구현
- [ ] CaslAbilityGuard 구현
- [ ] AbilityRulesController 구현
- [ ] DTO 정의
- [ ] Swagger 문서화
- [ ] Orval API 클라이언트 생성

### Phase 3: 프론트엔드 연동
- [ ] AbilityContext (ABAC 전용)
- [ ] useAbility, useAbilityCheck 훅
- [ ] Can 컴포넌트 활용
- [ ] 필드 마스킹 적용

### Phase 4: 관리자 UI
- [ ] AbilityRulesPage 구현
- [ ] AbilityRuleList Widget
- [ ] ConditionEditor Widget
- [ ] 일괄 권한 설정 기능

### 테스트
- [ ] RBAC/ABAC 분리 동작 테스트
- [ ] 조건 평가 테스트
- [ ] 필드 레벨 권한 테스트

---

**작성일:** 2026-01-07
**작성자:** Claude Code Agent

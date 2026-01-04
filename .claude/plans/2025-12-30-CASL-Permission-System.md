# 📋 CASL 기반 권한 시스템 기획서

**작성일:** 2025-12-30
**플랫폼:** Web (Admin/User) + Mobile (User)

---

## 1. 개요

### 1.1 목적

현재 프로젝트의 Role 기반 접근 제어(RBAC)를 CASL 기반 속성 기반 접근 제어(ABAC)와 통합하여 세밀한 권한 관리 시스템을 구축합니다.

### 1.2 현재 시스템 분석

#### 기존 Role 시스템
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

#### 기존 CASL 모델 (Prisma)
- `Ability`: 권한 정의 (CAN/CAN_NOT + Subject + Role)
- `Action`: 행위 정의 (CREATE, READ, UPDATE, DELETE, ACCESS)

#### 기존 데코레이터
- `@RoleCategories([RoleCategoryNames.ADMIN])` - 역할 카테고리 기반
- `@RoleGroups(['VIP'])` - 역할 그룹 기반

---

## 2. 아키텍처 설계

### 2.1 권한 체계 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                         Permission System                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │    Role     │───▶│   Ability    │◀───│    Subject      │    │
│  │  (역할)      │    │   (권한)      │    │   (대상)        │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
│         │                  │                     │              │
│         ▼                  ▼                     ▼              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │  Category   │    │   Action     │    │  Conditions     │    │
│  │  (카테고리)  │    │   (행위)      │    │   (조건)        │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 권한 결정 흐름

```
사용자 요청
    ↓
1. 인증 확인 (JWT)
    ↓
2. Tenant/Role 정보 추출
    ↓
3. RoleCategory/RoleGroup 체크 (기존 데코레이터)
    ↓
4. CASL Ability 체크 (세밀한 권한)
    ↓
5. Conditions 평가 (동적 조건)
    ↓
허용/거부
```

---

## 3. Subject 정의 (권한 대상)

### 3.1 Subject 카테고리

| 카테고리 | 설명 | 예시 |
|----------|------|------|
| **Menu** | 메뉴 접근 권한 | menu:members, menu:settings |
| **Feature** | 기능 접근 권한 | feature:export, feature:bulk-delete |
| **Entity** | 엔티티 CRUD 권한 | User, Ground, Reservation |
| **API** | API 엔드포인트 권한 | api:users, api:reports |
| **Column** | 테이블 컬럼 가시성 | column:user:email, column:user:phone |

### 3.2 Subject 목록

```typescript
export enum SubjectType {
  // 메뉴 관련
  MENU_DASHBOARD = 'menu:dashboard',
  MENU_MEMBERS = 'menu:members',
  MENU_MEMBERS_LIST = 'menu:members:list',
  MENU_MEMBERS_GRADES = 'menu:members:grades',
  MENU_MEMBERS_WITHDRAWN = 'menu:members:withdrawn',
  MENU_RESERVATIONS = 'menu:reservations',
  MENU_NOTIFICATIONS = 'menu:notifications',
  MENU_INQUIRIES = 'menu:inquiries',
  MENU_CONTENTS = 'menu:contents',
  MENU_SETTINGS = 'menu:settings',
  MENU_SETTINGS_GROUND = 'menu:settings:ground',
  MENU_SETTINGS_ADMINS = 'menu:settings:admins',
  MENU_SETTINGS_PERMISSIONS = 'menu:settings:permissions',
  MENU_SETTINGS_SYSTEM = 'menu:settings:system',

  // 기능 관련
  FEATURE_EXPORT = 'feature:export',
  FEATURE_IMPORT = 'feature:import',
  FEATURE_BULK_DELETE = 'feature:bulk-delete',
  FEATURE_SEND_NOTIFICATION = 'feature:send-notification',

  // 엔티티 관련
  ENTITY_USER = 'User',
  ENTITY_GROUND = 'Ground',
  ENTITY_SPACE = 'Space',
  ENTITY_RESERVATION = 'Reservation',
  ENTITY_CONTENT = 'Content',

  // 컬럼 가시성 관련 (동적으로 DB에서 관리)
  // column:{entity}:{field} 형태
  // 예: column:user:email, column:user:phone, column:user:createdAt

  // 특수 권한
  ALL = 'all',  // 모든 권한 (SUPER_ADMIN용)
}
```

### 3.3 Subject Prisma 스키마 확장

```prisma
model Subject {
  id          String         @id @default(uuid())
  seq         Int            @unique @default(autoincrement())
  createdAt   DateTime       @default(now()) @map("created_at")
  updatedAt   DateTime?      @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?      @map("removed_at") @db.Timestamptz(6)
  name        String         @unique
  type        SubjectTypes   @default(Entity)
  label       String?        // 한글 표시명
  description String?
  parentId    String?        @map("parent_id")
  tenantId    String         @map("tenant_id")
  sortOrder   Int            @default(0) @map("sort_order")

  parent      Subject?       @relation("SubjectHierarchy", fields: [parentId], references: [id])
  children    Subject[]      @relation("SubjectHierarchy")
  abilities   Ability[]

  @@map("subjects")
}

enum SubjectTypes {
  Menu
  Feature
  Entity
  API
  Column    // 테이블 컬럼 가시성
}
```

---

## 4. Action 정의 (수행 행위)

### 4.1 Action 목록

```typescript
export enum AbilityActions {
  // CRUD 기본 행위
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  // 확장 행위
  ACCESS = 'ACCESS',     // 접근 (메뉴, 페이지)
  MANAGE = 'MANAGE',     // 전체 관리 (모든 CRUD 포함)
  EXPORT = 'EXPORT',     // 내보내기
  IMPORT = 'IMPORT',     // 가져오기
  APPROVE = 'APPROVE',   // 승인
  REJECT = 'REJECT',     // 거절
}
```

### 4.2 Action - Subject 매트릭스

| Subject Type | 가능한 Actions |
|--------------|----------------|
| Menu | ACCESS |
| Feature | ACCESS, MANAGE |
| Entity | CREATE, READ, UPDATE, DELETE, MANAGE |
| API | ACCESS, MANAGE |

---

## 5. Ability 규칙 설계

### 5.1 Role별 기본 권한 템플릿

#### SUPER_ADMIN (최고 관리자)
```typescript
const superAdminAbilities = [
  { action: 'MANAGE', subject: 'all' },  // 모든 권한
];
```

#### ADMIN (관리자)
```typescript
const adminAbilities = [
  // 메뉴 접근
  { action: 'ACCESS', subject: 'menu:dashboard' },
  { action: 'ACCESS', subject: 'menu:members' },
  { action: 'ACCESS', subject: 'menu:reservations' },
  { action: 'ACCESS', subject: 'menu:settings' },
  { action: 'ACCESS', subject: 'menu:settings:ground' },

  // 엔티티 권한
  { action: 'MANAGE', subject: 'User' },
  { action: 'MANAGE', subject: 'Reservation' },
  { action: 'READ', subject: 'Ground' },
  { action: 'UPDATE', subject: 'Ground' },

  // 제한 (CAN_NOT)
  { type: 'CAN_NOT', action: 'ACCESS', subject: 'menu:settings:permissions' },
  { type: 'CAN_NOT', action: 'MANAGE', subject: 'Role' },
];
```

#### USER (일반 사용자)
```typescript
const userAbilities = [
  // 자신의 데이터만 접근
  { action: 'READ', subject: 'User', conditions: { id: '${user.id}' } },
  { action: 'UPDATE', subject: 'User', conditions: { id: '${user.id}' } },

  // 예약 권한
  { action: 'CREATE', subject: 'Reservation' },
  { action: 'READ', subject: 'Reservation', conditions: { userId: '${user.id}' } },
];
```

### 5.2 Conditions (동적 조건)

```typescript
interface AbilityCondition {
  [field: string]: string | number | boolean | ConditionExpression;
}

interface ConditionExpression {
  $eq?: any;       // 같음
  $ne?: any;       // 같지 않음
  $in?: any[];     // 포함
  $nin?: any[];    // 미포함
  $gt?: number;    // 초과
  $gte?: number;   // 이상
  $lt?: number;    // 미만
  $lte?: number;   // 이하
}

// 예시: 자신의 테넌트 데이터만 접근
const condition = {
  tenantId: '${user.mainTenantId}',
  status: { $in: ['ACTIVE', 'PENDING'] },
};
```

---

## 6. Ability Prisma 스키마 개선

```prisma
model Ability {
  id          String         @id @default(uuid())
  seq         Int            @unique @default(autoincrement())
  createdAt   DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?      @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?      @map("removed_at") @db.Timestamptz(6)
  type        AbilityTypes   // CAN, CAN_NOT
  action      AbilityActions // Action을 Ability에 직접 포함
  roleId      String         @map("role_id")
  description String?
  conditions  Json?
  subjectId   String         @map("subject_id")
  tenantId    String         @map("tenant_id")
  isActive    Boolean        @default(true) @map("is_active")

  role        Role           @relation(fields: [roleId], references: [id])
  subject     Subject        @relation(fields: [subjectId], references: [id])

  @@unique([roleId, subjectId, action])
  @@map("abilities")
}
```

---

## 7. 백엔드 연동 (NestJS)

### 7.1 CaslAbilityFactory

```typescript
// packages/be-common/src/casl/casl-ability.factory.ts

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly abilitiesRepository: AbilitiesRepository) {}

  async createForUser(user: UserDto): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    const mainTenant = user.tenants?.find((t) => t.main);
    if (!mainTenant?.role) return build();

    // DB에서 Role에 해당하는 Abilities 조회
    const abilities = await this.abilitiesRepository.findByRoleId(
      mainTenant.role.id,
    );

    for (const ability of abilities) {
      const conditions = ability.conditions
        ? this.parseConditions(ability.conditions, user)
        : undefined;

      if (ability.type === 'CAN') {
        can(ability.action, ability.subject.name, conditions);
      } else {
        cannot(ability.action, ability.subject.name, conditions);
      }
    }

    return build();
  }
}
```

### 7.2 PoliciesGuard

```typescript
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    if (policyHandlers.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const ability = await this.caslAbilityFactory.createForUser(request.user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }
}
```

### 7.3 Controller 사용 예시

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  @Get()
  @CheckPolicies(
    new AccessMenuPolicy('menu:members'),
    new ManageEntityPolicy('READ', 'User'),
  )
  async getUsers() {
    return this.usersService.findAll();
  }

  @Post()
  @CheckPolicies(new ManageEntityPolicy('CREATE', 'User'))
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### 7.4 기존 데코레이터와 통합

```typescript
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RoleCategoryGuard, PoliciesGuard)
@RoleCategories([RoleCategoryNames.ADMIN])  // 기존 데코레이터
export class AdminSettingsController {

  @Get('permissions')
  @CheckPolicies(new AccessMenuPolicy('menu:settings:permissions'))
  async getPermissions() {
    // RoleCategory가 ADMIN이면서
    // menu:settings:permissions에 ACCESS 권한이 있어야 함
  }
}
```

---

## 8. 프론트엔드 연동 (React)

### 8.1 AbilityContext

```typescript
// packages/hook/src/casl/AbilityContext.tsx

const AbilityContext = createContext<AppAbility>(createEmptyAbility());

export const Can = createContextualCan(AbilityContext.Consumer);

export function useAbility(): AppAbility {
  return useContext(AbilityContext);
}

export function AbilityProvider({ children }: { children: ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(createEmptyAbility);
  const { data: abilitiesData } = useGetMyAbilities();

  useEffect(() => {
    if (abilitiesData?.data) {
      setAbility(createAbilityFromRules(abilitiesData.data));
    }
  }, [abilitiesData]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
```

### 8.2 Can 컴포넌트 사용

```tsx
// 메뉴 표시/숨김
<Can I="ACCESS" a="menu:settings:permissions">
  <MenuItem to="/admin/settings/permissions">권한 관리</MenuItem>
</Can>

// 버튼 권한
<Can I="DELETE" a="User">
  <Button color="danger">삭제</Button>
</Can>

// 기능 권한
<Can I="ACCESS" a="feature:export">
  <Button>내보내기</Button>
</Can>
```

### 8.3 usePermission 훅

```typescript
// 권한 확인 훅
export function usePermission(action: Actions, subject: Subjects): boolean {
  const ability = useAbility();
  return ability.can(action, subject);
}

// 엔티티 권한 훅
export function useEntityPermissions(entity: string) {
  const ability = useAbility();

  return {
    canCreate: ability.can('CREATE', entity),
    canRead: ability.can('READ', entity),
    canUpdate: ability.can('UPDATE', entity),
    canDelete: ability.can('DELETE', entity),
    canManage: ability.can('MANAGE', entity),
  };
}

// 메뉴 접근 권한 훅
export function useMenuAccess(menuSubject: string): boolean {
  return usePermission('ACCESS', menuSubject);
}
```

---

## 9. 관리자 권한 관리 UI

### 9.1 화면 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                      권한 관리 (Permissions)                      │
├─────────────────────────────────────────────────────────────────┤
│  역할 선택: [ADMIN ▼]                           [저장] [초기화]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┤
│  │ 카테고리    │ 대상           │ 접근 │ 생성 │ 읽기 │ 수정 │ 삭제 │
│  ├─────────────────────────────────────────────────────────────┤
│  │ 메뉴                                                        │
│  │   ├─ 대시보드               │  ✓  │  -  │  -  │  -  │  -  │
│  │   ├─ 회원 관리              │  ✓  │  -  │  -  │  -  │  -  │
│  │   ├─ 설정                   │  ✓  │  -  │  -  │  -  │  -  │
│  │   │   ├─ Ground 정보        │  ✓  │  -  │  -  │  -  │  -  │
│  │   │   ├─ 관리자 계정        │  ✗  │  -  │  -  │  -  │  -  │
│  │   │   └─ 권한 관리          │  ✗  │  -  │  -  │  -  │  -  │
│  ├─────────────────────────────────────────────────────────────┤
│  │ 엔티티                                                       │
│  │   ├─ User                   │  -  │  ✓  │  ✓  │  ✓  │  ✗  │
│  │   ├─ Ground                 │  -  │  ✗  │  ✓  │  ✓  │  ✗  │
│  │   └─ Reservation            │  -  │  ✓  │  ✓  │  ✓  │  ✓  │
│  ├─────────────────────────────────────────────────────────────┤
│  │ 기능                                                        │
│  │   ├─ 내보내기               │  ✓  │  -  │  -  │  -  │  -  │
│  │   └─ 일괄 삭제              │  ✗  │  -  │  -  │  -  │  -  │
│  └─────────────────────────────────────────────────────────────┤
│  ✓ 허용 (CAN)   ✗ 거부 (CAN_NOT)   - 해당 없음                    │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 필요한 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/v1/abilities/my | 현재 사용자 권한 조회 |
| GET | /api/v1/abilities/roles/:roleId | 역할별 권한 목록 조회 |
| GET | /api/v1/subjects | Subject 목록 조회 (트리 구조) |
| PUT | /api/v1/abilities/roles/:roleId | 역할 권한 일괄 업데이트 |

---

## 10. 구현 우선순위

| Phase | 내용 | 범위 |
|-------|------|------|
| **Phase 1** | 기반 구축 | Prisma 스키마, 시드 데이터, Repository |
| **Phase 2** | 백엔드 연동 | CaslAbilityFactory, PoliciesGuard, API |
| **Phase 3** | 프론트엔드 연동 | AbilityContext, Can 컴포넌트, 훅 |
| **Phase 4** | 관리자 UI | PermissionsPage, PermissionMatrix |

---

## 11. 체크리스트

- [ ] Prisma 스키마 업데이트 (Subject 확장, Ability 개선)
- [ ] 시드 데이터 추가 (Subject, Ability)
- [ ] Repository 레이어 구현
- [ ] CaslAbilityFactory 구현
- [ ] PoliciesGuard 완성
- [ ] 권한 조회 API 구현
- [ ] AbilityProvider 구현
- [ ] Can 컴포넌트 설정
- [ ] usePermission 훅 구현
- [ ] 메뉴 시스템에 권한 적용
- [ ] 관리자 권한 관리 UI 구현

---

## 12. 컬럼 가시성 시스템 (Column Visibility System)

> ⚠️ **핵심 원칙**: 컬럼 가시성은 하드코딩하지 않고, DB 기반 동적 시스템으로 관리합니다.

### 12.1 개요

Admin 화면에서 테이블 컬럼의 표시/숨김을 디바이스 타입과 역할에 따라 동적으로 제어하는 시스템입니다.

**필요성:**
- 모바일로 접속하는 관리자 존재 (모바일 반응형 필수)
- 디바이스별로 표시할 컬럼이 다름 (데이터 밀도 조절)
- 역할별로 볼 수 있는 컬럼이 다를 수 있음 (권한 연동)
- 하드코딩 시 유지보수 어려움 → DB 기반 동적 관리

### 12.2 컬럼 정의 스키마

```prisma
// 테이블 컬럼 정의 (메타데이터)
model ColumnDefinition {
  id          String              @id @default(uuid())
  seq         Int                 @unique @default(autoincrement())
  createdAt   DateTime            @default(now()) @map("created_at")
  updatedAt   DateTime?           @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?           @map("removed_at") @db.Timestamptz(6)

  entity      String              // 엔티티명 (User, Reservation 등)
  field       String              // 필드명 (email, phone, createdAt 등)
  label       String              // 표시 라벨 (이메일, 전화번호 등)
  sortOrder   Int                 @default(0) @map("sort_order")

  // 필수 여부 (필수 컬럼은 모든 디바이스에서 표시)
  isRequired  Boolean             @default(false) @map("is_required")

  // 디바이스별 기본 가시성
  visibleOnDesktop  Boolean       @default(true) @map("visible_on_desktop")
  visibleOnTablet   Boolean       @default(true) @map("visible_on_tablet")
  visibleOnMobile   Boolean       @default(false) @map("visible_on_mobile")

  // 정렬 가능 여부
  sortable    Boolean             @default(false)

  // 너비 설정
  width       String?             // '80px', '120px', 'auto' 등
  minWidth    String?             @map("min_width")

  // Space 귀속 (멀티테넌시)
  spaceId     String              @map("space_id")
  space       Space               @relation(fields: [spaceId], references: [id])

  // 컬럼별 권한 (선택적)
  subjectId   String?             @map("subject_id")
  subject     Subject?            @relation(fields: [subjectId], references: [id])

  @@unique([entity, field, spaceId])
  @@index([entity, spaceId])
  @@map("column_definitions")
}
```

### 12.3 컬럼 가시성 규칙

#### 필수 컬럼 (isRequired = true)
- 모든 디바이스에서 항상 표시
- 숨길 수 없음
- 예: 선택 체크박스, 이름, 상태, 액션 버튼

#### 선택 컬럼 (isRequired = false)
- 디바이스별 기본 가시성 설정에 따름
- 역할별 권한으로 추가 제어 가능
- 예: 이메일, 전화번호, 가입일, 닉네임

#### 디바이스 타입 감지

```typescript
enum DeviceType {
  DESKTOP = 'desktop',  // ≥1280px
  TABLET = 'tablet',    // 768-1279px
  MOBILE = 'mobile',    // <768px
}

function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return DeviceType.DESKTOP;
  const width = window.innerWidth;
  if (width >= 1280) return DeviceType.DESKTOP;
  if (width >= 768) return DeviceType.TABLET;
  return DeviceType.MOBILE;
}
```

### 12.4 API 설계

#### 컬럼 정의 조회

```
GET /api/v1/columns/:entity

Query Parameters:
- deviceType: 'desktop' | 'tablet' | 'mobile' (optional, 서버에서 기본 필터링)

Response:
{
  data: [
    {
      field: "name",
      label: "이름",
      isRequired: true,
      visible: true,
      sortable: true,
      width: "120px"
    },
    {
      field: "email",
      label: "이메일",
      isRequired: false,
      visible: true,  // Desktop에서는 true
      sortable: true,
      width: "200px"
    },
    {
      field: "phone",
      label: "전화번호",
      isRequired: false,
      visible: false, // Tablet/Mobile에서는 false
      sortable: false,
      width: "140px"
    }
  ]
}
```

#### 컬럼 정의 수정 (관리자)

```
PUT /api/v1/columns/:entity

Body:
{
  columns: [
    {
      field: "email",
      visibleOnDesktop: true,
      visibleOnTablet: true,
      visibleOnMobile: false
    }
  ]
}
```

### 12.5 프론트엔드 연동

#### useColumnVisibility 훅

```typescript
interface ColumnConfig {
  field: string;
  label: string;
  isRequired: boolean;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

export function useColumnVisibility(entity: string): {
  columns: ColumnConfig[];
  visibleColumns: ColumnConfig[];
  isLoading: boolean;
  deviceType: DeviceType;
} {
  const deviceType = useDeviceType();
  const { data, isLoading } = useGetColumns(entity, { deviceType });

  const visibleColumns = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(col => col.visible);
  }, [data]);

  return {
    columns: data?.data ?? [],
    visibleColumns,
    isLoading,
    deviceType,
  };
}
```

#### 테이블 컴포넌트 사용 예시

```tsx
function MemberTable() {
  const { visibleColumns, isLoading } = useColumnVisibility('User');

  if (isLoading) return <TableSkeleton />;

  return (
    <Table>
      <TableHeader>
        {visibleColumns.map(col => (
          <TableColumn
            key={col.field}
            style={{ width: col.width }}
            allowsSorting={col.sortable}
          >
            {col.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {/* ... */}
      </TableBody>
    </Table>
  );
}
```

### 12.6 권한 연동 (CASL 통합)

컬럼 가시성과 CASL 권한을 통합하여 역할별로 특정 컬럼을 숨길 수 있습니다.

```typescript
// Subject로 컬럼 권한 정의
const columnAbilities = [
  // ADMIN은 전화번호 컬럼 볼 수 없음
  { type: 'CAN_NOT', action: 'READ', subject: 'column:user:phone', role: 'ADMIN' },

  // SUPER_ADMIN은 모든 컬럼 접근 가능
  { type: 'CAN', action: 'READ', subject: 'column:*', role: 'SUPER_ADMIN' },
];

// 사용 예시
<Can I="READ" a="column:user:phone">
  <TableColumn>전화번호</TableColumn>
</Can>
```

### 12.7 시드 데이터 예시

```typescript
const userColumnSeeds = [
  // 필수 컬럼
  { entity: 'User', field: 'checkbox', label: '선택', isRequired: true, sortOrder: 0 },
  { entity: 'User', field: 'name', label: '이름', isRequired: true, sortOrder: 1, sortable: true },
  { entity: 'User', field: 'status', label: '상태', isRequired: true, sortOrder: 10 },
  { entity: 'User', field: 'actions', label: '액션', isRequired: true, sortOrder: 100 },

  // 선택 컬럼 - 디바이스별 가시성
  {
    entity: 'User',
    field: 'email',
    label: '이메일',
    isRequired: false,
    visibleOnDesktop: true,
    visibleOnTablet: true,
    visibleOnMobile: false,  // 모바일에서 숨김
    sortOrder: 2,
    sortable: true,
  },
  {
    entity: 'User',
    field: 'phone',
    label: '전화번호',
    isRequired: false,
    visibleOnDesktop: true,
    visibleOnTablet: false,  // 태블릿부터 숨김
    visibleOnMobile: false,
    sortOrder: 3,
  },
  {
    entity: 'User',
    field: 'nickname',
    label: '닉네임',
    isRequired: false,
    visibleOnDesktop: true,
    visibleOnTablet: false,
    visibleOnMobile: false,
    sortOrder: 4,
  },
  {
    entity: 'User',
    field: 'createdAt',
    label: '가입일',
    isRequired: false,
    visibleOnDesktop: true,
    visibleOnTablet: true,
    visibleOnMobile: false,
    sortOrder: 5,
    sortable: true,
  },
];
```

### 12.8 관리자 UI (컬럼 설정 화면)

```
┌─────────────────────────────────────────────────────────────────┐
│                   컬럼 가시성 설정 (User)                        │
├─────────────────────────────────────────────────────────────────┤
│  [저장] [초기화]                                                 │
├─────────────────────────────────────────────────────────────────┤
│  컬럼명     │ 필수 │ Desktop │ Tablet │ Mobile │ 정렬 │ 너비   │
│  ──────────────────────────────────────────────────────────────  │
│  선택       │  ✓  │    -    │   -    │   -   │  -  │  40px  │
│  이름       │  ✓  │    -    │   -    │   -   │  ✓  │ 120px  │
│  이메일     │  ✗  │   ✓    │   ✓   │   ✗  │  ✓  │ 200px  │
│  전화번호   │  ✗  │   ✓    │   ✗   │   ✗  │  ✗  │ 140px  │
│  닉네임     │  ✗  │   ✓    │   ✗   │   ✗  │  ✓  │ 120px  │
│  역할       │  ✗  │   ✓    │   ✓   │   ✓  │  ✓  │ 100px  │
│  상태       │  ✓  │    -    │   -    │   -   │  ✗  │  80px  │
│  가입일     │  ✗  │   ✓    │   ✓   │   ✗  │  ✓  │ 120px  │
│  액션       │  ✓  │    -    │   -    │   -   │  -  │ 100px  │
├─────────────────────────────────────────────────────────────────┤
│  ✓ 표시  ✗ 숨김  - 필수 (항상 표시)                               │
└─────────────────────────────────────────────────────────────────┘
```

### 12.9 체크리스트

- [ ] ColumnDefinition Prisma 스키마 추가
- [ ] 컬럼 정의 시드 데이터 작성
- [ ] 컬럼 조회 API 구현
- [ ] 컬럼 수정 API 구현 (관리자용)
- [ ] useColumnVisibility 훅 구현
- [ ] useDeviceType 훅 구현
- [ ] 테이블 컴포넌트 컬럼 동적 렌더링
- [ ] 컬럼 설정 관리자 UI 구현
- [ ] CASL 통합 (역할별 컬럼 권한)

---

## 13. 참고 자료

- [CASL 공식 문서](https://casl.js.org/v6/en/)
- [CASL React](https://casl.js.org/v6/en/package/casl-react)
- [NestJS Authorization](https://docs.nestjs.com/security/authorization)

---

# 🔧 기술 설계

## 1. Entity 상세 설계

### 1.1 새로운 Entity

#### Subject (권한 대상 - 확장)

**파일 경로:** `packages/prisma/schema/core.prisma` (기존 Subject 모델 확장)

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| seq | Int | 시퀀스 | @unique @default(autoincrement()) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime? | 수정일 | @updatedAt |
| removedAt | DateTime? | 삭제일 (소프트 삭제) | - |
| name | String | Subject 식별자 (예: menu:members) | @unique |
| type | SubjectTypes | Subject 타입 (Menu, Feature, Entity, API, Column) | @default(Entity) |
| label | String? | 한글 표시명 (예: 회원 관리) | - |
| description | String? | 상세 설명 | - |
| parentId | String? | 부모 Subject ID (계층 구조) | - |
| spaceId | String | Space ID (멀티테넌시) | @map("space_id") |
| sortOrder | Int | 정렬 순서 | @default(0) |

**인덱스 설계:**

| 인덱스명 | 필드 | 용도 |
|----------|------|------|
| idx_subject_space | spaceId | Space별 Subject 조회 성능 최적화 |
| idx_subject_type | type | 타입별 필터링 (Menu, Entity 등) |
| unique_subject_name | name | Subject 이름 중복 방지 |

**관계:**

```
Subject 1 ──── N Subject (self-reference, 계층 구조)
        │
        └──── N Ability (Subject에 대한 권한들)
        │
        └──── 0..N ColumnDefinition (컬럼별 권한 연동)
```

**Enum 추가:**

```prisma
enum SubjectTypes {
  Menu      // 메뉴 접근 권한
  Feature   // 기능 권한
  Entity    // 엔티티 CRUD
  API       // API 엔드포인트
  Column    // 테이블 컬럼 가시성
}
```

---

#### ColumnDefinition (컬럼 정의 메타데이터)

**파일 경로:** `packages/prisma/schema/core.prisma` (신규 모델)

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| seq | Int | 시퀀스 | @unique @default(autoincrement()) |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime? | 수정일 | @updatedAt |
| removedAt | DateTime? | 삭제일 | - |
| entity | String | 엔티티명 (User, Reservation 등) | - |
| field | String | 필드명 (email, phone 등) | - |
| label | String | 표시 라벨 (이메일, 전화번호 등) | - |
| sortOrder | Int | 컬럼 표시 순서 | @default(0) |
| isRequired | Boolean | 필수 컬럼 여부 (필수는 항상 표시) | @default(false) |
| visibleOnDesktop | Boolean | Desktop에서 기본 표시 여부 | @default(true) |
| visibleOnTablet | Boolean | Tablet에서 기본 표시 여부 | @default(true) |
| visibleOnMobile | Boolean | Mobile에서 기본 표시 여부 | @default(false) |
| sortable | Boolean | 정렬 가능 여부 | @default(false) |
| width | String? | 컬럼 너비 (px, auto 등) | - |
| minWidth | String? | 최소 너비 | - |
| spaceId | String | Space ID (멀티테넌시) | @map("space_id") |
| subjectId | String? | 권한 Subject ID (선택적) | @map("subject_id") |

**인덱스 설계:**

| 인덱스명 | 필드 | 용도 |
|----------|------|------|
| unique_entity_field_space | entity, field, spaceId | 엔티티+필드+Space 조합 고유성 보장 |
| idx_column_entity_space | entity, spaceId | 엔티티별 컬럼 조회 최적화 |
| idx_column_subject | subjectId | 권한 연동 조회 |

**관계:**

```
ColumnDefinition N ──── 1 Space
                 │
                 └──── 0..1 Subject (컬럼별 권한)
```

---

#### Ability (권한 - 개선)

**파일 경로:** `packages/prisma/schema/core.prisma` (기존 Ability 모델 개선)

**필드 상세 (변경 사항):**

| 필드 | 타입 | 설명 | 변경 내역 |
|------|------|------|----------|
| action | AbilityActions | Action 직접 포함 | **신규 추가** (기존에는 별도 Action 테이블 참조) |
| isActive | Boolean | 활성화 여부 | **신규 추가** (권한 on/off 관리) |
| tenantId | String | Tenant ID (기존 spaceId 대신) | **필드명 변경** (spaceId → tenantId) |

**개선된 제약조건:**

```prisma
@@unique([roleId, subjectId, action])  // 역할+대상+행위 조합 고유성
@@index([roleId])                      // Role별 권한 조회 최적화
@@index([subjectId])                   // Subject별 권한 조회
@@index([tenantId])                    // Tenant별 권한 관리
```

**Enum 확장:**

```prisma
enum AbilityActions {
  CREATE    // 생성
  READ      // 읽기
  UPDATE    // 수정
  DELETE    // 삭제
  ACCESS    // 접근 (메뉴, 페이지)
  MANAGE    // 전체 관리
  EXPORT    // 내보내기
  IMPORT    // 가져오기
  APPROVE   // 승인
  REJECT    // 거절
}
```

---

### 1.2 기존 Entity 수정

#### Subject 모델 수정

**변경 사항:**

```prisma
model Subject {
  // 기존 필드...
  id        String    @id @default(uuid())
  seq       Int       @unique @default(autoincrement())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt DateTime? @map("removed_at") @db.Timestamptz(6)
  name      String    @unique
  spaceId   String    @map("space_id")

  // 추가 필드
  type        SubjectTypes  @default(Entity)      // 신규
  label       String?                             // 신규
  description String?                             // 신규
  parentId    String?       @map("parent_id")     // 신규 (계층 구조)
  sortOrder   Int           @default(0) @map("sort_order")  // 신규

  // 기존 관계
  space       Space         @relation(fields: [spaceId], references: [id])
  abilities   Ability[]     // Subject를 참조하는 Ability는 기존 Ability 모델에 정의됨

  // 추가 관계
  parent      Subject?      @relation("SubjectHierarchy", fields: [parentId], references: [id])
  children    Subject[]     @relation("SubjectHierarchy")
  columnDefinitions ColumnDefinition[]  // 컬럼 가시성 연동

  @@index([spaceId])
  @@index([type])           // 신규 인덱스
  @@map("subjects")
}
```

---

#### Ability 모델 수정

**변경 사항:**

```prisma
model Ability {
  // 기존 필드
  id          String       @id @default(uuid())
  seq         Int          @unique @default(autoincrement())
  createdAt   DateTime     @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?    @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?    @map("removed_at") @db.Timestamptz(6)
  type        AbilityTypes
  roleId      String       @map("role_id")
  description String?
  conditions  Json?
  subjectId   String       @map("subject_id")
  spaceId     String       @map("space_id")

  // 추가 필드
  action      AbilityActions  // 신규 (기존에는 별도 Action 테이블 참조)
  isActive    Boolean      @default(true) @map("is_active")  // 신규

  // 관계
  role        Role         @relation(fields: [roleId], references: [id])
  subject     Subject      @relation(fields: [subjectId], references: [id])
  space       Space        @relation(fields: [spaceId], references: [id])

  @@unique([roleId, subjectId, action])  // 신규 제약조건
  @@index([spaceId])
  @@index([roleId])      // 신규 인덱스
  @@index([subjectId])   // 신규 인덱스
  @@map("abilities")
}
```

---

#### Space 모델 수정

**관계 추가:**

```prisma
model Space {
  // 기존 필드 및 관계...

  // 추가 관계
  columnDefinitions ColumnDefinition[]  // 신규

  // 나머지는 기존과 동일
}
```

---

## 2. Repository 레이어 설계

### 2.1 SubjectsRepository

**파일:** `packages/repository/src/subjects.repository.ts`

**메서드 명세:**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findById | id: string | Subject \| null | ID로 Subject 조회 |
| findByName | name: string | Subject \| null | name으로 Subject 조회 (예: menu:members) |
| findManyBySpaceId | spaceId: string, options?: { type?: SubjectTypes } | Subject[] | Space별 Subject 목록 조회 (타입 필터링 가능) |
| findHierarchyTree | spaceId: string, type?: SubjectTypes | Subject[] | 계층 구조 트리 조회 (parent/children 포함) |
| create | data: CreateSubjectData | Subject | Subject 생성 |
| updateById | id: string, data: UpdateSubjectData | Subject | Subject 수정 |
| removeById | id: string | Subject | Subject 소프트 삭제 |

**쿼리 최적화:**

- `findHierarchyTree`: include parent/children (self-reference)
- `findManyBySpaceId`: where 조건에 type 필터 추가

---

### 2.2 AbilitiesRepository

**파일:** `packages/repository/src/abilities.repository.ts`

**메서드 명세:**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findByRoleId | roleId: string | Ability[] | Role별 권한 목록 조회 (Subject 포함) |
| findByRoleIds | roleIds: string[] | Ability[] | 여러 Role의 권한 목록 조회 |
| findByRoleAndSubject | roleId: string, subjectId: string | Ability[] | Role+Subject 조합으로 조회 |
| createMany | data: CreateAbilityData[] | Ability[] | 권한 일괄 생성 |
| updateByRoleId | roleId: string, data: UpdateAbilityData[] | Ability[] | Role의 권한 일괄 업데이트 (트랜잭션) |
| removeById | id: string | Ability | 권한 소프트 삭제 |
| activateById | id: string | Ability | 권한 활성화 |
| deactivateById | id: string | Ability | 권한 비활성화 |

**트랜잭션 처리:**

- `updateByRoleId`: 기존 권한 삭제 + 새 권한 일괄 생성 (트랜잭션)

**include 옵션:**

```typescript
include: {
  subject: true,  // Subject 정보 포함
  role: true,     // Role 정보 포함
}
```

---

### 2.3 ColumnDefinitionsRepository

**파일:** `packages/repository/src/column-definitions.repository.ts`

**메서드 명세:**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findByEntity | entity: string, spaceId: string | ColumnDefinition[] | 엔티티별 컬럼 정의 조회 |
| findByEntityAndDevice | entity: string, spaceId: string, deviceType: DeviceType | ColumnDefinition[] | 디바이스별 가시성 필터링 조회 |
| findByField | entity: string, field: string, spaceId: string | ColumnDefinition \| null | 특정 필드 조회 |
| createMany | data: CreateColumnDefinitionData[] | ColumnDefinition[] | 컬럼 정의 일괄 생성 |
| updateByEntity | entity: string, spaceId: string, data: UpdateColumnDefinitionData[] | ColumnDefinition[] | 엔티티의 컬럼 정의 일괄 업데이트 |
| removeById | id: string | ColumnDefinition | 컬럼 정의 소프트 삭제 |

**쿼리 로직:**

```typescript
// findByEntityAndDevice 예시
async findByEntityAndDevice(entity: string, spaceId: string, deviceType: DeviceType) {
  const columns = await this.txHost.tx.columnDefinition.findMany({
    where: {
      entity,
      spaceId,
      removedAt: null,
      OR: [
        { isRequired: true },  // 필수 컬럼은 항상 포함
        deviceType === 'desktop' ? { visibleOnDesktop: true } : {},
        deviceType === 'tablet' ? { visibleOnTablet: true } : {},
        deviceType === 'mobile' ? { visibleOnMobile: true } : {},
      ],
    },
    orderBy: { sortOrder: 'asc' },
    include: { subject: true },  // 권한 연동
  });

  return columns.map(col => plainToInstance(ColumnDefinition, col));
}
```

---

## 3. Service 레이어 설계

### 3.1 SubjectsService

**파일:** `packages/service/src/service/subjects.service.ts`

**비즈니스 로직:**

| 메서드명 | 책임 | 호출하는 Repository 메서드 |
|----------|------|---------------------------|
| getSubjectTree | Space별 Subject 계층 트리 조회 | findHierarchyTree |
| getSubjectsByType | 타입별 Subject 목록 조회 | findManyBySpaceId |
| createSubject | Subject 생성 (이름 중복 검증) | findByName, create |
| updateSubject | Subject 수정 | updateById |
| deleteSubject | Subject 삭제 (자식 존재 시 예외) | findById, removeById |

**검증 로직:**

- `createSubject`: name 중복 검증
- `deleteSubject`: children 존재 시 ForbiddenException

---

### 3.2 AbilitiesService

**파일:** `packages/service/src/service/abilities.service.ts`

**비즈니스 로직:**

| 메서드명 | 책임 | 호출하는 Repository 메서드 |
|----------|------|---------------------------|
| getMyAbilities | 현재 사용자 권한 조회 | findByRoleId(s) |
| getAbilitiesByRole | 역할별 권한 조회 | findByRoleId |
| updateRoleAbilities | 역할 권한 일괄 업데이트 (트랜잭션) | updateByRoleId |
| checkPermission | 특정 권한 확인 (CAN/CAN_NOT 판별) | findByRoleAndSubject |

**트랜잭션 처리:**

```typescript
@Transactional()
async updateRoleAbilities(roleId: string, abilities: UpdateAbilityDto[]): Promise<Ability[]> {
  // 1. 기존 권한 비활성화 또는 삭제
  // 2. 새 권한 일괄 생성
  // 트랜잭션으로 원자성 보장
  return this.repository.updateByRoleId(roleId, abilities);
}
```

---

### 3.3 ColumnDefinitionsService

**파일:** `packages/service/src/service/column-definitions.service.ts`

**비즈니스 로직:**

| 메서드명 | 책임 | 호출하는 Repository 메서드 |
|----------|------|---------------------------|
| getColumnsByEntity | 엔티티별 컬럼 정의 조회 | findByEntity |
| getVisibleColumns | 디바이스별 가시성 필터링 조회 | findByEntityAndDevice |
| updateColumnSettings | 컬럼 설정 일괄 업데이트 | updateByEntity |
| seedDefaultColumns | 기본 컬럼 시드 생성 | createMany |

**권한 연동:**

```typescript
async getVisibleColumns(
  entity: string,
  spaceId: string,
  deviceType: DeviceType,
  ability: AppAbility,  // CASL Ability 객체
): Promise<ColumnDefinition[]> {
  const columns = await this.repository.findByEntityAndDevice(entity, spaceId, deviceType);

  // 권한 필터링: subject가 있는 컬럼은 READ 권한 확인
  return columns.filter(col => {
    if (!col.subject) return true;
    return ability.can('READ', col.subject.name);
  });
}
```

---

## 4. Controller 레이어 설계

### 4.1 AbilitiesController

**파일:** `apps/server/src/module/abilities/abilities.controller.ts`

**엔드포인트 상세:**

#### GET /api/v1/abilities/my

| 항목 | 내용 |
|------|------|
| 설명 | 현재 사용자의 권한 목록 조회 |
| 인증 | Bearer Token 필수 |
| 권한 | - (본인 권한 조회) |

**Query Parameters:**

없음

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "CAN",
      "action": "ACCESS",
      "subject": {
        "name": "menu:members",
        "label": "회원 관리",
        "type": "Menu"
      },
      "conditions": null
    },
    {
      "type": "CAN",
      "action": "MANAGE",
      "subject": { "name": "User", "type": "Entity" },
      "conditions": { "spaceId": "${user.mainSpaceId}" }
    }
  ]
}
```

**Error Responses:**

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |

---

#### GET /api/v1/abilities/roles/:roleId

| 항목 | 내용 |
|------|------|
| 설명 | 역할별 권한 목록 조회 |
| 인증 | Bearer Token 필수 |
| 권한 | SUPER_ADMIN 또는 menu:settings:permissions 접근 권한 |

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| roleId | string | Role UUID |

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "CAN",
      "action": "ACCESS",
      "subject": { "name": "menu:dashboard", "label": "대시보드" },
      "isActive": true
    }
  ]
}
```

**Error Responses:**

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | Role을 찾을 수 없음 |

---

#### PUT /api/v1/abilities/roles/:roleId

| 항목 | 내용 |
|------|------|
| 설명 | 역할 권한 일괄 업데이트 |
| 인증 | Bearer Token 필수 |
| 권한 | SUPER_ADMIN 전용 |

**Body:**

```json
{
  "abilities": [
    {
      "type": "CAN",
      "action": "ACCESS",
      "subjectId": "subject-uuid"
    },
    {
      "type": "CAN_NOT",
      "action": "DELETE",
      "subjectId": "subject-uuid"
    }
  ]
}
```

**Response (200):**

```json
{
  "message": "역할 권한이 업데이트되었습니다",
  "data": [...]
}
```

**Error Responses:**

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | SUPER_ADMIN 권한 필요 |
| 404 | Role 또는 Subject를 찾을 수 없음 |
| 500 | 트랜잭션 실패 |

---

### 4.2 SubjectsController

**파일:** `apps/server/src/module/subjects/subjects.controller.ts`

#### GET /api/v1/subjects

| 항목 | 내용 |
|------|------|
| 설명 | Subject 목록 조회 (트리 구조) |
| 인증 | Bearer Token 필수 |
| 권한 | ADMIN 이상 |

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| type | SubjectTypes | N | 타입 필터링 (Menu, Feature, Entity 등) |

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "menu:settings",
      "label": "설정",
      "type": "Menu",
      "children": [
        {
          "id": "uuid",
          "name": "menu:settings:permissions",
          "label": "권한 관리",
          "type": "Menu",
          "parentId": "parent-uuid"
        }
      ]
    }
  ]
}
```

---

### 4.3 ColumnsController

**파일:** `apps/server/src/module/columns/columns.controller.ts`

#### GET /api/v1/columns/:entity

| 항목 | 내용 |
|------|------|
| 설명 | 엔티티별 컬럼 정의 조회 (디바이스 필터링) |
| 인증 | Bearer Token 필수 |
| 권한 | - (본인 Space 컬럼 조회) |

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| entity | string | 엔티티명 (User, Reservation 등) |

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| deviceType | 'desktop' \| 'tablet' \| 'mobile' | N | 디바이스 타입 (기본: desktop) |

**Response (200):**

```json
{
  "data": [
    {
      "field": "name",
      "label": "이름",
      "isRequired": true,
      "visible": true,
      "sortable": true,
      "width": "120px"
    },
    {
      "field": "email",
      "label": "이메일",
      "isRequired": false,
      "visible": true,
      "sortable": true,
      "width": "200px"
    }
  ]
}
```

---

#### PUT /api/v1/columns/:entity

| 항목 | 내용 |
|------|------|
| 설명 | 엔티티 컬럼 설정 일괄 업데이트 |
| 인증 | Bearer Token 필수 |
| 권한 | SUPER_ADMIN 또는 menu:settings:permissions 접근 권한 |

**Body:**

```json
{
  "columns": [
    {
      "field": "email",
      "visibleOnDesktop": true,
      "visibleOnTablet": true,
      "visibleOnMobile": false
    }
  ]
}
```

**Response (200):**

```json
{
  "message": "컬럼 설정이 업데이트되었습니다",
  "data": [...]
}
```

---

## 5. DTO 설계

**파일:** `packages/dto/src/abilities/`, `packages/dto/src/subjects/`, `packages/dto/src/columns/`

### 5.1 Abilities DTO

| DTO 클래스 | 용도 | 필드 |
|------------|------|------|
| AbilityResponseDto | 권한 응답 | id, type, action, subject, conditions, isActive |
| MyAbilitiesResponseDto | 내 권한 목록 응답 | abilities: AbilityResponseDto[] |
| CreateAbilityDto | 권한 생성 요청 | type, action, subjectId, conditions? |
| UpdateRoleAbilitiesDto | 역할 권한 업데이트 | abilities: CreateAbilityDto[] |

### 5.2 Subjects DTO

| DTO 클래스 | 용도 | 필드 |
|------------|------|------|
| SubjectResponseDto | Subject 응답 | id, name, type, label, description, children? |
| SubjectsTreeResponseDto | Subject 트리 응답 | subjects: SubjectResponseDto[] |
| CreateSubjectDto | Subject 생성 | name, type, label?, description?, parentId? |

### 5.3 Columns DTO

| DTO 클래스 | 용도 | 필드 |
|------------|------|------|
| ColumnDefinitionResponseDto | 컬럼 정의 응답 | field, label, isRequired, visible, sortable, width |
| ColumnsResponseDto | 컬럼 목록 응답 | columns: ColumnDefinitionResponseDto[] |
| UpdateColumnDefinitionDto | 컬럼 수정 요청 | field, visibleOnDesktop?, visibleOnTablet?, visibleOnMobile? |

---

## 6. 기술 고려사항

### 6.1 보안

| 항목 | 대응 방안 |
|------|----------|
| 인증 | JWT Bearer Token 검증 (JwtAuthGuard) |
| 인가 | CASL 기반 세밀한 권한 제어 (PoliciesGuard) |
| 입력 검증 | class-validator DTO 검증 |
| SQL Injection | Prisma ORM 파라미터화 쿼리 |
| 권한 에스컬레이션 방지 | Role 기반 계층 구조 + CASL 정책 |
| Conditions 보안 | JSON 조건 파싱 시 사용자 입력 검증 (템플릿 변수만 허용) |

### 6.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 권한 조회 최적화 | Role별 Ability 캐싱 (Redis, TTL 5분) |
| Subject 트리 조회 | Self-reference include 최적화 (depth 제한) |
| 인덱스 활용 | roleId, subjectId, spaceId 복합 인덱스 |
| N+1 문제 방지 | include로 Subject, Role 관계 조회 |
| 컬럼 가시성 조회 | 디바이스별 필터링을 DB 레벨에서 처리 |

### 6.3 에러 처리

| 에러 상황 | HTTP 코드 | 에러 메시지 |
|----------|-----------|-------------|
| 권한 없음 | 403 | "해당 작업을 수행할 권한이 없습니다" |
| Subject 없음 | 404 | "Subject를 찾을 수 없습니다" |
| Role 없음 | 404 | "역할을 찾을 수 없습니다" |
| 중복 Ability | 409 | "이미 존재하는 권한입니다" |
| 자식 Subject 존재 | 409 | "하위 Subject가 존재하여 삭제할 수 없습니다" |
| 검증 실패 | 400 | class-validator 메시지 |
| 트랜잭션 실패 | 500 | "권한 업데이트에 실패했습니다" |

---

## 7. 마이그레이션 계획

**순서:**

1. **Enum 추가**: `SubjectTypes`, `AbilityActions` 확장
2. **Subject 모델 수정**: type, label, description, parentId, sortOrder 필드 추가
3. **Ability 모델 수정**: action, isActive 필드 추가, 제약조건 변경
4. **ColumnDefinition 모델 생성**: 신규 테이블 생성
5. **인덱스 추가**: Subject, Ability, ColumnDefinition 인덱스 생성
6. **시드 데이터 실행**: Subject, Ability, ColumnDefinition 기본 데이터 생성

**Migration 명령어:**

```bash
# 1. Schema 변경사항 반영
pnpm prisma:migrate dev --name add-permission-system

# 2. Entity 클래스 생성
pnpm prisma:generate

# 3. 시드 데이터 실행
pnpm prisma:seed
```

**롤백 계획:**

- Migration 파일에 down migration SQL 포함 (수동 작성)
- 운영 환경에서는 `prisma migrate deploy` 사용 (자동 롤백 없음)
- 백업 DB에서 스키마 복원 계획 수립

---

## 8. 화면별 기술 명세

### 8.1 권한 관리 화면 (PermissionsPage)

**파일:** `apps/admin/src/pages/settings/permissions/PermissionsPage.tsx`

**컴포넌트 구조:**

```
PermissionsPage (Page)
├── RoleSelector (Widget)
│   └── Select (UI)
├── PermissionsMatrix (Feature)
│   ├── SubjectTree (Widget)
│   │   ├── TreeNode (UI)
│   │   └── Checkbox (UI)
│   └── ActionCheckboxes (Widget)
│       └── Checkbox (UI)
└── SaveButton (UI)
```

**필요한 컴포넌트:**

| 레이어 | 컴포넌트명 | 설명 | 위치 |
|--------|-----------|------|------|
| Page | PermissionsPage | 권한 관리 메인 페이지 | apps/admin/src/pages/settings/permissions |
| Feature | PermissionsMatrix | 권한 매트릭스 테이블 | packages/ui/src/components/feature/PermissionsMatrix |
| Widget | RoleSelector | 역할 선택 드롭다운 | packages/ui/src/components/widgets/RoleSelector |
| Widget | SubjectTree | Subject 계층 트리 | packages/ui/src/components/widgets/SubjectTree |
| Widget | ActionCheckboxes | Action별 체크박스 그룹 | packages/ui/src/components/widgets/ActionCheckboxes |
| UI | TreeNode | 트리 노드 | packages/ui/src/components/ui/TreeNode |

**State 관리:**

```typescript
// usePermissionsHandlers.ts
interface PermissionsState {
  selectedRoleId: string | null;
  abilities: Ability[];
  subjects: Subject[];
  isDirty: boolean;
}

function usePermissionsHandlers() {
  const [state, setState] = useState<PermissionsState>({...});

  const onSelectRole = (roleId: string) => {
    // Role 변경 시 해당 Role의 Ability 조회
  };

  const onToggleAbility = (subjectId: string, action: AbilityActions) => {
    // Ability CAN/CAN_NOT 토글
  };

  const onClickSave = async () => {
    // 변경사항 일괄 저장 (PUT /api/v1/abilities/roles/:roleId)
  };

  const onClickReset = () => {
    // 변경사항 초기화
  };

  return { state, onSelectRole, onToggleAbility, onClickSave, onClickReset };
}
```

**API 연동:**

```typescript
import { useGetAbilitiesByRole, useUpdateRoleAbilities } from '@cocrepo/api';

const { data: abilitiesData } = useGetAbilitiesByRole(selectedRoleId);
const { mutate: updateAbilities } = useUpdateRoleAbilities();
```

---

### 8.2 컬럼 가시성 설정 화면 (ColumnSettingsPage)

**파일:** `apps/admin/src/pages/settings/columns/ColumnSettingsPage.tsx`

**컴포넌트 구조:**

```
ColumnSettingsPage (Page)
├── EntitySelector (Widget)
│   └── Select (UI)
├── ColumnSettingsTable (Feature)
│   ├── Table (UI)
│   ├── TableHeader (UI)
│   ├── TableBody (UI)
│   ├── TableRow (UI)
│   └── Checkbox (UI)
└── SaveButton (UI)
```

**필요한 컴포넌트:**

| 레이어 | 컴포넌트명 | 설명 | 위치 |
|--------|-----------|------|------|
| Page | ColumnSettingsPage | 컬럼 설정 메인 페이지 | apps/admin/src/pages/settings/columns |
| Feature | ColumnSettingsTable | 컬럼 설정 테이블 | packages/ui/src/components/feature/ColumnSettingsTable |
| Widget | EntitySelector | 엔티티 선택 드롭다운 | packages/ui/src/components/widgets/EntitySelector |
| UI | Table, TableHeader, TableBody, TableRow | 테이블 UI | packages/ui/src/components/ui/Table |

**State 관리:**

```typescript
// useColumnSettingsHandlers.ts
interface ColumnSettingsState {
  selectedEntity: string | null;
  columns: ColumnDefinition[];
  isDirty: boolean;
}

function useColumnSettingsHandlers() {
  const [state, setState] = useState<ColumnSettingsState>({...});

  const onSelectEntity = (entity: string) => {
    // 엔티티 변경 시 컬럼 정의 조회
  };

  const onToggleVisible = (field: string, deviceType: DeviceType) => {
    // 디바이스별 가시성 토글
  };

  const onClickSave = async () => {
    // 변경사항 저장 (PUT /api/v1/columns/:entity)
  };

  return { state, onSelectEntity, onToggleVisible, onClickSave };
}
```

**모바일 반응형:**

- Desktop (≥1280px): 전체 테이블 표시
- Tablet (768-1279px): 스크롤 가능한 테이블
- Mobile (<768px): 카드 레이아웃으로 전환 (아코디언)

---

### 8.3 MenuStore 연동 방안

**현재 MenuStore 구조:**

- `setAbilityChecker(checker: AbilityChecker)`: 권한 체크 함수 설정
- 권한 기반 메뉴 필터링 (`items` getter)

**연동 방안:**

1. **AbilityProvider로 전역 Ability 관리**

```typescript
// apps/admin/src/App.tsx
<AbilityProvider>
  <MenuProvider>
    <Router />
  </MenuProvider>
</AbilityProvider>
```

2. **MenuStore에 Ability 주입**

```typescript
// apps/admin/src/stores/MenuStoreProvider.tsx
function MenuStoreProvider({ children }) {
  const ability = useAbility();  // AbilityContext에서 가져오기
  const menuStore = useMemo(() => {
    const store = new MenuStore(ADMIN_MENU_CONFIG, {
      abilityChecker: (action, subject) => ability.can(action, subject),
      onNavigate: (path) => router.push(path),
    });
    return store;
  }, [ability]);

  return (
    <MenuStoreContext.Provider value={menuStore}>
      {children}
    </MenuStoreContext.Provider>
  );
}
```

3. **Menu Config에 Subject 매핑**

```typescript
// packages/constant/src/menu/admin-menu.ts
export const ADMIN_MENU_CONFIG: MenuConfig[] = [
  {
    id: 'members',
    label: '회원',
    icon: 'users',
    subject: 'menu:members',  // Subject와 매핑
    children: [
      {
        id: 'members-list',
        label: '회원 목록',
        path: '/members',
        subject: 'menu:members:list',
      },
    ],
  },
  {
    id: 'settings',
    label: '설정',
    icon: 'settings',
    subject: 'menu:settings',
    children: [
      {
        id: 'settings-permissions',
        label: '권한 관리',
        path: '/settings/permissions',
        subject: 'menu:settings:permissions',
      },
    ],
  },
];
```

---

## 9. 구현 우선순위 및 단계 (상세)

### Phase 1: 기반 구축 (2-3일)

**구현 항목:**

- [ ] Prisma 스키마 수정
  - [ ] Subject 모델 확장 (type, label, description, parentId, sortOrder)
  - [ ] Ability 모델 개선 (action, isActive)
  - [ ] ColumnDefinition 모델 생성
  - [ ] Enum 추가 (SubjectTypes, AbilityActions 확장)
  - [ ] 인덱스 추가
- [ ] Migration 실행 및 검증
- [ ] Entity 클래스 생성 (Subject, Ability, ColumnDefinition)
- [ ] Repository 레이어 구현
  - [ ] SubjectsRepository
  - [ ] AbilitiesRepository
  - [ ] ColumnDefinitionsRepository
- [ ] 시드 데이터 작성
  - [ ] Subject 시드 (Menu, Feature, Entity 타입)
  - [ ] Ability 시드 (Role별 기본 권한)
  - [ ] ColumnDefinition 시드 (User 엔티티)

**검증 기준:**

- Migration 성공 및 DB 스키마 확인
- Repository 메서드 단위 테스트 통과
- 시드 데이터 정상 생성 확인

**의존성:**

- 없음 (독립 실행 가능)

---

### Phase 2: 백엔드 연동 (3-4일)

**구현 항목:**

- [ ] Service 레이어 구현
  - [ ] SubjectsService
  - [ ] AbilitiesService
  - [ ] ColumnDefinitionsService
- [ ] DTO 정의
  - [ ] Abilities DTO (AbilityResponseDto, CreateAbilityDto 등)
  - [ ] Subjects DTO (SubjectResponseDto, SubjectsTreeResponseDto 등)
  - [ ] Columns DTO (ColumnDefinitionResponseDto 등)
- [ ] Controller 구현
  - [ ] AbilitiesController (GET /my, GET /roles/:id, PUT /roles/:id)
  - [ ] SubjectsController (GET /, POST /)
  - [ ] ColumnsController (GET /:entity, PUT /:entity)
- [ ] CASL 통합
  - [ ] CaslAbilityFactory 구현
  - [ ] PoliciesGuard 구현
  - [ ] Policy Handlers (AccessMenuPolicy, ManageEntityPolicy 등)
- [ ] Swagger 문서화
- [ ] Orval 설정 및 API 클라이언트 생성

**검증 기준:**

- API 엔드포인트 정상 동작 (Postman/Swagger 테스트)
- PoliciesGuard 권한 검증 통과
- Orval 생성 코드 정상 동작 확인

**의존성:**

- Phase 1 완료 (Repository, 시드 데이터)

---

### Phase 3: 프론트엔드 연동 (3-4일)

**구현 항목:**

- [ ] Hooks 구현
  - [ ] useAbility, usePermission, useEntityPermissions
  - [ ] useColumnVisibility, useDeviceType
- [ ] AbilityProvider 구현
  - [ ] AbilityContext 생성
  - [ ] Can 컴포넌트 설정
- [ ] MenuStore 연동
  - [ ] abilityChecker 주입
  - [ ] ADMIN_MENU_CONFIG에 subject 매핑
- [ ] UI 컴포넌트 (필요 시 신규 생성)
  - [ ] TreeNode (계층 구조 표시)
  - [ ] Table 개선 (동적 컬럼 렌더링)
- [ ] Widget 컴포넌트
  - [ ] RoleSelector
  - [ ] SubjectTree
  - [ ] ActionCheckboxes
  - [ ] EntitySelector

**검증 기준:**

- Can 컴포넌트로 메뉴 권한 제어 동작 확인
- useColumnVisibility로 동적 테이블 렌더링 확인
- MenuStore 권한 필터링 정상 동작

**의존성:**

- Phase 2 완료 (API, Orval 클라이언트)

---

### Phase 4: 관리자 UI (4-5일)

**구현 항목:**

- [ ] Feature 컴포넌트
  - [ ] PermissionsMatrix (권한 매트릭스 테이블)
  - [ ] ColumnSettingsTable (컬럼 설정 테이블)
- [ ] Page 컴포넌트
  - [ ] PermissionsPage (권한 관리 화면)
  - [ ] ColumnSettingsPage (컬럼 설정 화면)
- [ ] Handlers 구현
  - [ ] usePermissionsHandlers
  - [ ] useColumnSettingsHandlers
- [ ] 모바일 반응형
  - [ ] Tablet/Mobile 레이아웃 대응
  - [ ] ColumnSettingsPage 카드 레이아웃
- [ ] Storybook 작성
  - [ ] PermissionsMatrix.stories.tsx
  - [ ] ColumnSettingsTable.stories.tsx

**검증 기준:**

- SUPER_ADMIN으로 권한 관리 화면 접근 및 권한 수정 성공
- 컬럼 설정 화면에서 디바이스별 가시성 설정 성공
- 모바일 디바이스에서 반응형 레이아웃 정상 표시

**의존성:**

- Phase 3 완료 (Hooks, Widgets)

---

## 10. 테스트 전략

### 10.1 단위 테스트 (Unit Test)

**범위:**

| 레이어 | 테스트 대상 | 테스트 케이스 예시 |
|--------|-------------|-------------------|
| Repository | SubjectsRepository | findHierarchyTree: 계층 구조 정확성 검증 |
| Repository | AbilitiesRepository | findByRoleId: Role별 Ability 조회 정확성 |
| Repository | ColumnDefinitionsRepository | findByEntityAndDevice: 디바이스 필터링 검��� |
| Service | AbilitiesService | updateRoleAbilities: 트랜잭션 원자성 검증 |
| Service | ColumnDefinitionsService | getVisibleColumns: 권한 필터링 검증 |
| Utils | parseConditions | 조건 템플릿 파싱 정확성 (${user.id} 등) |

**도구:**

- Jest
- Prisma Mock (Repository 테스트)

---

### 10.2 통합 테스트 (Integration Test)

**시나리오:**

1. **권한 조회 플로우**
   - Given: USER 역할로 로그인
   - When: GET /api/v1/abilities/my 호출
   - Then: USER 역할의 Ability 목록 반환

2. **권한 업데이트 플로우**
   - Given: SUPER_ADMIN으로 로그인
   - When: PUT /api/v1/abilities/roles/:roleId (ADMIN 권한 수정)
   - Then: Ability 업데이트 성공, DB 반영 확인

3. **컬럼 가시성 조회**
   - Given: ADMIN 역할, Mobile 디바이스
   - When: GET /api/v1/columns/User?deviceType=mobile
   - Then: Mobile에서 visible=true인 컬럼만 반환

4. **메뉴 권한 필터링**
   - Given: ADMIN 역할 (menu:settings:permissions 권한 없음)
   - When: MenuStore.items 조회
   - Then: "권한 관리" 메뉴 숨김

**도구:**

- Supertest (API 테스트)
- Prisma Test Database

---

### 10.3 E2E 테스트 (End-to-End Test)

**시나리오:**

1. **권한 관리 화면 전체 플로우**
   - Given: SUPER_ADMIN으로 로그인
   - When:
     1. /settings/permissions 페이지 접근
     2. ADMIN 역할 선택
     3. "menu:members" Subject의 ACCESS 권한 체크
     4. 저장 버튼 클릭
   - Then:
     1. 권한 업데이트 성공 메시지 표시
     2. DB에 Ability 저장 확인
     3. ADMIN으로 로그인 시 "회원" 메뉴 표시

2. **컬럼 설정 화면 플로우**
   - Given: SUPER_ADMIN으로 로그인
   - When:
     1. /settings/columns 페이지 접근
     2. User 엔티티 선택
     3. "email" 컬럼의 Mobile 가시성 체크
     4. 저장
   - Then:
     1. 설정 저장 성공
     2. Mobile 디바이스에서 User 테이블에 "이메일" 컬럼 표시

3. **역할별 메뉴 접근 제어**
   - Given: ADMIN 역할 (menu:settings:permissions 권한 없음)
   - When: 좌측 메뉴 확인
   - Then: "설정 > 권한 관리" 메뉴 미표시

**도구:**

- Playwright 또는 Cypress
- Test Database (Seed 데이터 포함)

---

## 11. 보안 고려사항 상세

### 11.1 권한 에스컬레이션 방지

**시나리오:**

- ADMIN이 자신의 Role에 SUPER_ADMIN 권한 부여 시도

**대응:**

```typescript
// AbilitiesService.updateRoleAbilities
async updateRoleAbilities(currentUser: User, roleId: string, abilities: CreateAbilityDto[]) {
  // 1. currentUser의 Role 확인
  const userRole = currentUser.tenants.find(t => t.main)?.role;

  // 2. SUPER_ADMIN만 권한 수정 가능
  if (userRole?.name !== Roles.SUPER_ADMIN) {
    throw new ForbiddenException('권한 수정은 SUPER_ADMIN만 가능합니다');
  }

  // 3. 자신의 Role 수정 방지
  if (roleId === userRole.id) {
    throw new ForbiddenException('자신의 역할 권한은 수정할 수 없습니다');
  }

  // 4. 업데이트 진행
  return this.repository.updateByRoleId(roleId, abilities);
}
```

### 11.2 Conditions 보안

**위험:**

- 사용자 입력 JSON을 그대로 conditions에 저장 시 위험

**대응:**

```typescript
// CaslAbilityFactory.parseConditions
parseConditions(conditions: Json, user: User): any {
  const conditionStr = JSON.stringify(conditions);

  // 허용된 템플릿 변수만 치환
  const allowedVars = {
    '${user.id}': user.id,
    '${user.mainSpaceId}': user.tenants.find(t => t.main)?.spaceId,
  };

  let parsed = conditionStr;
  for (const [key, value] of Object.entries(allowedVars)) {
    parsed = parsed.replace(new RegExp(key, 'g'), value);
  }

  return JSON.parse(parsed);
}
```

---

## 12. 성능 최적화 상세

### 12.1 Ability 캐싱

**Redis 캐싱 전략:**

```typescript
// CaslAbilityFactory
async createForUser(user: UserDto): Promise<AppAbility> {
  const cacheKey = `abilities:user:${user.id}`;

  // 1. Redis에서 캐시 확인
  const cached = await this.redis.get(cacheKey);
  if (cached) {
    return createAbilityFromRules(JSON.parse(cached));
  }

  // 2. DB 조회
  const abilities = await this.abilitiesRepository.findByRoleId(...);

  // 3. CASL Ability 생성
  const ability = this.buildAbility(abilities);

  // 4. Redis 캐싱 (TTL 5분)
  await this.redis.setex(cacheKey, 300, JSON.stringify(abilities));

  return ability;
}
```

**캐시 무효화:**

- 권한 업데이트 시: `redis.del('abilities:user:*')` (Role에 속한 모든 사용자)
- 사용자 Role 변경 시: `redis.del('abilities:user:${userId}')`

---

### 12.2 Subject 트리 조회 최적화

**Depth 제한:**

```typescript
// SubjectsRepository.findHierarchyTree
async findHierarchyTree(spaceId: string, type?: SubjectTypes, maxDepth = 3) {
  const subjects = await this.txHost.tx.subject.findMany({
    where: { spaceId, type, parentId: null },  // Root만 조회
    include: this.buildInclude(maxDepth),
  });

  return subjects.map(s => plainToInstance(Subject, s));
}

private buildInclude(depth: number) {
  if (depth <= 0) return {};
  return {
    children: {
      include: this.buildInclude(depth - 1),
    },
  };
}
```

---

## 13. 최종 체크리스트

### Phase 1: 기반 구축
- [ ] Prisma 스키마 수정 완료
- [ ] Migration 실행 및 검증
- [ ] Entity 클래스 생성
- [ ] Repository 레이어 구현 및 테스트

### Phase 2: 백엔드 연동
- [ ] Service 레이어 구현 및 테스트
- [ ] DTO 정의
- [ ] Controller 구현
- [ ] CaslAbilityFactory 및 PoliciesGuard 구현
- [ ] Swagger 문서화
- [ ] Orval API 클라이언트 생성

### Phase 3: 프론트엔드 연동
- [ ] Hooks 구현 (useAbility, usePermission, useColumnVisibility)
- [ ] AbilityProvider 구현
- [ ] MenuStore 연동
- [ ] UI/Widget 컴포넌트 생성

### Phase 4: 관리자 UI
- [ ] PermissionsPage 구현
- [ ] ColumnSettingsPage 구현
- [ ] 모바일 반응형 적용
- [ ] Storybook 작성

### 테스트 및 배포
- [ ] 단위 테스트 작성 및 통과
- [ ] 통합 테스트 작성 및 통과
- [ ] E2E 테스트 작성 및 통과
- [ ] 보안 취약점 검토
- [ ] 성능 테스트 (권한 조회 응답 시간 <100ms)
- [ ] Staging 환경 배포 및 검증
- [ ] Production 배포

---

**작성일:** 2026-01-03
**작성자:** technical-designer (Claude Code Agent)

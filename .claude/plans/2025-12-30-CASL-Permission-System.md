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

## 12. 참고 자료

- [CASL 공식 문서](https://casl.js.org/v6/en/)
- [CASL React](https://casl.js.org/v6/en/package/casl-react)
- [NestJS Authorization](https://docs.nestjs.com/security/authorization)

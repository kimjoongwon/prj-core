# 05. 기술 설계 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 최종 수정일: 2026-02-07 (Role 이름 변경, Ability/Grant 분리, Guard 체계 업데이트)

## Prisma 스키마 (L7)

### Role 모델

```prisma
model Role {
  id             String              @id @default(uuid())
  createdAt      DateTime            @default(now()) @map("created_at")
  updatedAt      DateTime?           @updatedAt @map("updated_at")
  removedAt      DateTime?           @map("removed_at")

  name           String              @unique
  displayName    String?             @map("display_name")
  description    String?
  isSystem       Boolean             @default(false) @map("is_system")

  assignments    Assignment[]
  associations   RoleAssociation[]
  classification RoleClassification?
  tenants        Tenant[]

  @@map("roles")
}
```

### Subject 모델 (REFERENCE - CASL 대상 정의)

```prisma
model Subject {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  removedAt DateTime? @map("removed_at")

  name        String  @unique    // Prisma 모델명, 'all', 'menu:xxx' 등
  displayName String? @map("display_name")
  icon        String?
  order       Int     @default(0)
  isSystem    Boolean @default(true) @map("is_system")
  group       String?             // 'entity', 'menu', 'feature' 등

  abilities Ability[]

  @@index([group])
  @@index([isSystem])
  @@map("subjects")
}
```

### Action 모델 (REFERENCE - 행위 정의)

```prisma
model Action {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  removedAt DateTime? @map("removed_at")

  name        String  @unique    // 'create', 'read', 'read:masked:email' 등
  displayName String? @map("display_name")
  description String?
  group       String?             // 'crud', 'visibility', 'bulk'
  order       Int     @default(0)
  isSystem    Boolean @default(true) @map("is_system")
  config      Json?               // { type: 'masking', preset: 'PRESET_EMAIL' }

  abilities Ability[]

  @@index([group])
  @@map("actions")
}
```

### Ability 모델 (REFERENCE - 재사용 가능한 권한 정의)

```prisma
model Ability {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  removedAt DateTime? @map("removed_at")

  // 메타데이터
  name        String  @unique    // 재사용 가능한 고유 이름
  description String?

  // CASL 필수 필드
  fields     String[] @default([])        // 접근 가능한 필드 목록
  conditions Json?                         // ABAC 조건 (템플릿 변수 포함)
  inverted   Boolean  @default(false)      // false=can, true=cannot
  reason     String?                       // 거부 시 표시할 사유

  // FK
  subjectId String @map("subject_id")
  actionId  String @map("action_id")

  // 관계
  subject Subject @relation(fields: [subjectId], references: [id])
  action  Action  @relation(fields: [actionId], references: [id])
  grants  Grant[]                          // Grant를 통해 Role/User에 연결

  @@index([subjectId])
  @@index([actionId])
  @@index([name])
  @@map("abilities")
}
```

### Grant 모델 (Role/User에 Ability 부여, 다형성)

```prisma
model Grant {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  removedAt DateTime? @map("removed_at")

  // 다형성 FK (Polymorphic Association)
  granteeType String @map("grantee_type") // "Role" | "User"
  granteeId   String @map("grantee_id")   // roleId 또는 userId
  abilityId   String @map("ability_id")

  // 메타데이터
  isActive Boolean @default(true) @map("is_active")
  priority Int     @default(0)             // Role: 0-9, User 예외: 10+

  // 관계
  ability Ability @relation(fields: [abilityId], references: [id])

  @@unique([granteeType, granteeId, abilityId])
  @@index([granteeType, granteeId])
  @@index([abilityId])
  @@index([isActive])
  @@map("grants")
}
```

### 모델 관계도

```
Subject (REFERENCE)    Action (REFERENCE)
    │                      │
    └──────┬───────────────┘
           │
           ▼
     Ability (REFERENCE)
     Subject + Action + conditions
           │
           ▼
  Grant (CONFIGURATION)
      granteeType + granteeId + abilityId
           │
     ┌─────┴─────┐
     ▼           ▼
   Role        User
(granteeType  (granteeType
 ="Role")      ="User")
```

---

## 비즈니스 로직 (L9)

### Guard 체계

| ID | Guard | 설명 | 적용 위치 |
|----|-------|------|----------|
| L9-LOG-001 | JwtAuthGuard | JWT 토큰 검증, request.user 설정 | 글로벌 (`@PublicRoute` 제외) |
| L9-LOG-002 | SpaceAccessGuard | X-Space-ID 필수 검증 + Tenant 매칭 | 글로벌 (`@PublicRoute`/`@SkipSpaceCheck` 제외) |
| L9-LOG-003 | RolesGuard | @Roles 데코레이터 기반 역할명 검사 | Controller 메서드 (`@Roles(...)`) |
| L9-LOG-004 | RoleCategoryGuard | Role의 Category 계층 검증 | Controller 메서드 (`@RoleCategories(...)`) |
| L9-LOG-005 | RoleGroupGuard | Role의 Group 검증 | Controller 메서드 (`@RoleGroups(...)`) |
| L9-LOG-006 | PoliciesGuard | CASL Ability 기반 정책 검사 | Controller 메서드 |

### Guard 실행 순서

```
JwtAuthGuard → SpaceAccessGuard → RolesGuard/RoleCategoryGuard/RoleGroupGuard → PoliciesGuard
     ↓              ↓                        ↓                                      ↓
 JWT 검증      X-Space-ID 필수          역할/카테고리/그룹 검증              CASL 정책 검사
 request.user   Tenant 매칭                                              Ability 기반 can/cannot
```

### RolesGuard 로직

```typescript
// packages/be-common/src/guard/roles.guard.ts

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. @Roles() 데코레이터에서 필요한 역할 추출
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    // 2. 역할 지정 없으면 통과
    if (!roles || roles.length === 0) return true;

    // 3. 사용자 인증 확인
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException("인증된 사용자가 필요합니다.");

    // 4. Tenant 유효성 확인
    if (!user.tenants?.length) throw new ForbiddenException("사용자에게 할당된 테넌트가 없습니다.");

    // 5. X-Space-ID 헤더로 현재 Space의 Tenant 조회
    const spaceId = request.headers["x-space-id"];
    let tenant;
    if (spaceId) {
      tenant = user.tenants.find(t => t.spaceId === spaceId);
      if (!tenant) throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
    } else {
      tenant = user.tenants[0]; // x-space-id 없으면 첫 번째 테넌트
    }

    // 6. Tenant의 역할이 필요한 역할에 포함되는지 확인
    if (!tenant.role) throw new ForbiddenException("테넌트에 역할이 할당되지 않았습니다.");
    return roles.includes(tenant.role.name);
  }
}
```

### CaslAbilityFactory 로직

```typescript
// packages/be-common/src/casl/casl-ability.factory.ts

@Injectable()
export class CaslAbilityFactory {
  constructor(
    private readonly rolePoliciesRepository: RolePoliciesRepository,
    private readonly cls: ClsService,
  ) {}

  async createForUser(user: UserDto): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    // 1. CLS에서 현재 Space의 Tenant 정보 조회
    const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
    const currentTenant = spaceId
      ? user.tenants?.find(t => t.spaceId === spaceId)
      : user.tenants?.[0];

    if (!currentTenant?.role) return build();

    const roleId = currentTenant.roleId;

    // 2. RolePolicy로 PolicyAbility 조회 (Policy → Ability 추출)
    const rolePolicies = await this.rolePoliciesRepository.findActiveByRoleIdsInSpace([roleId], spaceId);
    const roleAbilities = rolePolicies.flatMap(rolePolicy =>
      (rolePolicy.policy?.policyAbilities ?? [])
        .filter(policyAbility => policyAbility.ability)
        .map(policyAbility => ({
          ...policyAbility.ability!,   // Ability 데이터 spread
          priority: rolePolicy.priority,
        })),
    );

    // 3. Ability 병합 (subject+action 키 기준, priority 높은 것 우선)
    const mergedAbilities = this.mergeAbilities(roleAbilities);

    // 5. 사용자 컨텍스트 구성 (템플릿 변수 치환용)
    const userContext = this.buildUserContext(user, currentTenant);

    // 6. 각 Ability를 CASL 규칙으로 변환
    for (const ability of mergedAbilities) {
      const action = ability.action.name.toUpperCase();
      const subject = ability.subject.name;
      const conditions = this.parseConditions(ability.conditions, userContext);

      if (!ability.inverted) {
        can(action, subject, conditions);     // 허용
      } else {
        cannot(action, subject, conditions);  // 거부
      }
    }

    return build();
  }
}
```

### Ability 병합 알고리즘

```typescript
// subject + action 조합을 키로 사용
private mergeAbilities(roleAbilities): AbilityWithPriority[] {
  const abilityMap = new Map<string, AbilityWithPriority>();

  for (const ability of roleAbilities) {
    const key = `${ability.subject.name}:${ability.action.name}`;
    const existing = abilityMap.get(key);
    if (!existing || ability.priority > existing.priority) {
      abilityMap.set(key, ability);
    }
  }

  return Array.from(abilityMap.values()).sort((a, b) => b.priority - a.priority);
}
```

### 유효성 검사 규칙

| ID | DTO | 필드 | 규칙 | 소스 |
|----|-----|------|------|------|
| L9-LOG-007 | CreateRoleDto | name | 필수, 영문대문자+언더스코어, 2-50자 | 추정 |
| L9-LOG-008 | CreateRoleDto | displayName | 선택, 최대 100자 | 추정 |
| L9-LOG-009 | CreateAbilityDto | name | 필수, 고유, 최대 200자 | abilities.controller.ts |
| L9-LOG-010 | CreateAbilityDto | subjectId | 필수, UUID | abilities.controller.ts |
| L9-LOG-011 | CreateAbilityDto | actionId | 필수, UUID | abilities.controller.ts |
| L9-LOG-012 | CreateGrantDto | abilityId | 필수, UUID | abilities.controller.ts |
| L9-LOG-013 | CreateGrantDto | granteeType | 필수, "Role" \| "User" | abilities.controller.ts |
| L9-LOG-014 | CreateGrantDto | granteeId | 필수, UUID (roleId 또는 userId) | abilities.controller.ts |

### 서비스 비즈니스 규칙

| ID | 규칙 | 설명 | 소스 |
|----|------|------|------|
| L9-LOG-015 | 시스템 역할 보호 | isSystem=true인 역할은 수정/삭제 불가 | roles.service.ts |
| L9-LOG-016 | 연결된 테넌트 확인 | 테넌트가 연결된 역할은 삭제 불가 | roles.service.ts |
| L9-LOG-017 | 역할 이름 중복 체크 | 역할 이름(name)은 고유해야 함 | roles.service.ts |
| L9-LOG-018 | Ability 이름 고유 | Ability name은 고유해야 함 | abilities.service.ts |
| L9-LOG-019 | PolicyAbility 중복 방지 | 동일 (policyId, abilityId) 조합 불가 | policy.service.ts |
| L9-LOG-020 | Policy assignment 우선순위 | priority가 높을수록 우선 적용 | casl-ability.factory.ts |
| L9-LOG-021 | Policy에서 Ability 추출 | RolePolicy가 PolicyAbility + Ability join 반환 | casl-ability.factory.ts |

---

## 시스템 역할 (System Roles)

| 역할명 | 상수 | 설명 |
|--------|------|------|
| `PLATFORM_ADMIN` | `SYSTEM_ROLES.PLATFORM_ADMIN` | 시스템 전체 관리 권한 |
| `COMPANY_MANAGER` | `SYSTEM_ROLES.COMPANY_MANAGER` | 특정 Company 운영 권한 |
| `MEMBER` | `SYSTEM_ROLES.MEMBER` | 회원 기본 권한 |

### Role Category (역할 카테고리)

| 카테고리 | enum 값 | 설명 |
|----------|---------|------|
| `PLATFORM` | `RoleCategoryNames.PLATFORM` | 플랫폼 레벨 |
| `SHARED` | `RoleCategoryNames.SHARED` | 공유 레벨 |
| `WORKSPACE` | `RoleCategoryNames.WORKSPACE` | 워크스페이스 레벨 |
| `PUBLIC` | `RoleCategoryNames.PUBLIC` | 공개 레벨 |
| `PROJECT` | `RoleCategoryNames.PROJECT` | 프로젝트 레벨 |
| `TECHNICAL` | `RoleCategoryNames.TECHNICAL` | 기술 레벨 |
| `RESTRICTED` | `RoleCategoryNames.RESTRICTED` | 제한 레벨 |

### Role Group (역할 그룹)

| 그룹 | enum 값 | 설명 |
|------|---------|------|
| `TRUSTED` | `RoleGroupNames.TRUSTED` | 신뢰 그룹 |
| `STANDARD` | `RoleGroupNames.STANDARD` | 표준 그룹 |
| `PREMIUM` | `RoleGroupNames.PREMIUM` | 프리미엄 그룹 |

---

## 템플릿 변수

CaslAbilityFactory에서 지원하는 조건 템플릿 변수:

| 변수 | 설명 | 예시 |
|------|------|------|
| `${user.id}` | 현재 사용자 ID | 본인 데이터만 접근 |
| `${user.email}` | 사용자 이메일 | - |
| `${user.name}` | 사용자 이름 | - |
| `${user.spaceId}` | 사용자 소속 Space ID | - |
| `${user.currentTenantId}` | 현재 Tenant ID | - |
| `${user.currentSpaceId}` | 현재 Space ID (X-Space-ID) | Space 내 데이터만 접근 |
| `${user.currentRoleId}` | 현재 Role ID | - |
| `${user.roleCategory}` | 현재 Role의 카테고리명 | 카테고리 기반 접근 제어 |
| `${user.roleGroupNames}` | 현재 Role의 그룹명 배열 | 그룹 기반 접근 제어 |
| `${user.userCategory}` | 사용자 분류 카테고리 | 이용자 분류 기반 |
| `${user.userGroupNames}` | 사용자 그룹명 배열 | 이용자 그룹 기반 |

### 보안 검증

```typescript
// 허용된 변수만 치환 (ALLOWED_TEMPLATE_VARIABLES)
const ALLOWED_TEMPLATE_VARIABLES = [
  "user.id", "user.spaceId", "user.email", "user.name",
  "user.currentTenantId", "user.currentSpaceId", "user.currentRoleId",
  "user.roleCategory", "user.roleGroupNames",
  "user.userCategory", "user.userGroupNames",
] as const;

// 허용되지 않은 변수는 빈 문자열로 치환
```

### 조건 사용 예시

```json
// 본인 데이터만 조회
{
  "userId": "${user.id}"
}

// 현재 Space 데이터만 조회
{
  "spaceId": "${user.currentSpaceId}"
}

// 복합 조건
{
  "departmentId": "${user.departmentId}",
  "status": "ACTIVE"
}
```

---

## 테스트 케이스 (L10)

### Roles API 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-001 | GET /roles - 정상 | happy | COMPANY_MANAGER 권한으로 역할 목록 조회 |
| L10-TST-002 | GET /roles - 미인증 | error | 토큰 없이 요청 시 401 |
| L10-TST-003 | GET /roles - 권한 없음 | error | MEMBER 역할로 요청 시 403 |
| L10-TST-004 | POST /roles - 정상 | happy | PLATFORM_ADMIN로 역할 생성 |
| L10-TST-005 | POST /roles - 중복 이름 | error | 이미 존재하는 이름으로 생성 시 409 |
| L10-TST-006 | PATCH /roles/:roleId - 정상 | happy | displayName 수정 성공 |
| L10-TST-007 | PATCH /roles/:roleId - 시스템 역할 | error | isSystem=true 역할 수정 시 403 |
| L10-TST-008 | DELETE /roles/:roleId - 정상 | happy | 역할 삭제 성공 |
| L10-TST-009 | DELETE /roles/:roleId - 연결된 테넌트 | error | 테넌트 연결 시 400 |
| L10-TST-010 | DELETE /roles/:roleId - 시스템 역할 | error | isSystem=true 역할 삭제 시 403 |

### Abilities API 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-011 | GET /abilities/my - 정상 | happy | 본인에게 부여된 Grant(Ability 포함) 조회 |
| L10-TST-012 | GET /abilities/roles/:roleId | happy | Role별 Grant 목록 조회 |
| L10-TST-013 | GET /abilities/users/:userId | happy | User별 예외 Grant 목록 조회 |
| L10-TST-014 | GET /abilities/:abilityId | happy | Ability 상세 조회 |
| L10-TST-015 | POST /abilities - 정상 | happy | 새 Ability 생성 (Subject + Action 조합) |
| L10-TST-016 | POST /abilities - 중복 이름 | error | 이미 존재하는 Ability name으로 생성 시 409 |
| L10-TST-017 | PATCH /abilities/:abilityId | happy | Ability 수정 (conditions, inverted 등) |
| L10-TST-018 | DELETE /abilities/:abilityId | happy | Ability 소프트 삭제 |
| L10-TST-019 | PUT /abilities/roles/:roleId | happy | Role Grant 일괄 설정 (기존 삭제 + 새 생성) |
| L10-TST-020 | PUT /abilities/users/:userId | happy | User 예외 Grant 일괄 설정 |

### CASL 통합 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-021 | Grant→Ability 추출 | happy | Grant에서 Ability 정보를 정확히 추출하고 priority 복사 |
| L10-TST-022 | Ability 병합 - priority | happy | 동일 subject+action에서 높은 priority가 우선 |
| L10-TST-023 | 조건 기반 Ability | happy | conditions 템플릿 변수 치환 |
| L10-TST-024 | inverted Ability | happy | cannot 규칙 적용 |
| L10-TST-025 | User 예외 Grant 우선 | happy | User Grant(priority 10+)이 Role Grant(priority 0-9) 덮어씀 |
| L10-TST-026 | 비활성 Grant 무시 | happy | isActive=false인 Grant은 조회에서 제외 |

### Guard 단위 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-027 | RolesGuard - x-space-id 매칭 | happy | x-space-id 헤더로 올바른 Tenant 조회 |
| L10-TST-028 | RolesGuard - x-space-id 미매칭 | error | 매칭 Tenant 없으면 403 |
| L10-TST-029 | RoleCategoryGuard - 계층 검증 | happy | 상위/하위 카테고리 계층 포함 검증 |
| L10-TST-030 | RoleGroupGuard - 그룹 검증 | happy | associations 기반 그룹 매칭 |
| L10-TST-031 | SpaceAccessGuard - @SkipSpaceCheck | happy | @SkipSpaceCheck 시 X-Space-ID 없이 통과 |
| L10-TST-032 | SpaceAccessGuard - X-Space-ID 누락 | error | 헤더 없으면 400 |
| L10-TST-033 | SpaceAccessGuard - @PublicRoute | happy | @PublicRoute 시 인증 없이 통과 |

---

## 확장 고려사항

### 미구현 기능 (추정)

1. **권한 그룹핑**: Subject/Action 그룹별 일괄 권한 설정
2. **권한 상속**: 상위 역할의 권한을 하위 역할이 상속
3. **권한 템플릿**: 자주 사용하는 Ability 조합을 템플릿으로 저장
4. **권한 감사 로그**: Grant 감사 기록

### 프론트엔드 필요 작업

1. `/roles` 페이지 구현 (역할 목록/상세/등록/수정)
2. `/roles/:roleId/abilities` 권한 매트릭스 UI (Role에 Ability를 Grant로 부여)
3. `/users/:userId/abilities` 사용자별 예외 Grant UI
4. Ability 연동

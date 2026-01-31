# 05. 기술 설계 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## Prisma 스키마 (L7)

### Role 모델

```prisma
model Role {
  id             String              @id @default(uuid())
  seq            Int                 @unique @default(autoincrement())
  createdAt      DateTime            @default(now()) @map("created_at")
  updatedAt      DateTime?           @updatedAt @map("updated_at")
  removedAt      DateTime?           @map("removed_at")

  name           String              @unique
  displayName    String?             @map("display_name")
  description    String?
  isSystem       Boolean             @default(false) @map("is_system")

  abilities      Ability[]
  assignments    Assignment[]
  associations   RoleAssociation[]
  classification RoleClassification?
  tenants        Tenant[]

  @@map("roles")
}
```

### Ability 모델

```prisma
model Ability {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime? @updatedAt @map("updated_at")
  removedAt   DateTime? @map("removed_at")

  // CASL 필수 필드
  fields      String[]  @default([])
  conditions  Json?
  inverted    Boolean   @default(false)
  reason      String?

  // 연결 대상
  subjectId   String    @map("subject_id")
  actionId    String    @map("action_id")
  roleId      String?   @map("role_id")
  userId      String?   @map("user_id")

  // 관계
  subject     Subject   @relation(fields: [subjectId], references: [id])
  action      Action    @relation(fields: [actionId], references: [id])
  role        Role?     @relation(fields: [roleId], references: [id])
  user        User?     @relation(fields: [userId], references: [id])

  // 메타데이터
  name        String?
  description String?
  isActive    Boolean   @default(true) @map("is_active")
  priority    Int       @default(0)

  @@index([subjectId])
  @@index([actionId])
  @@index([roleId])
  @@index([userId])
  @@map("abilities")
}
```

---

## 비즈니스 로직 (L9)

### Guard 체계

| ID | Guard | 설명 | 적용 위치 |
|----|-------|------|----------|
| L9-LOG-001 | RolesGuard | @Roles 데코레이터 기반 역할 검사 | Controller 메서드 |
| L9-LOG-002 | PoliciesGuard | CASL Ability 기반 정책 검사 | Controller 메서드 |

### RolesGuard 로직

```typescript
// packages/be-common/src/guard/roles.guard.ts

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. @Roles() 데코레이터에서 필요한 역할 추출
    const roles = this.reflector.get<SystemRoleName[]>(ROLES_KEY, context.getHandler());

    // 2. 역할 지정 없으면 통과
    if (isEmpty(roles)) return true;

    // 3. 사용자 인증 확인
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    // 4. X-Space-ID 헤더에서 현재 Space의 Tenant 조회
    const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
    const tenant = user.tenants.find(t => t.spaceId === spaceId);

    // 5. Tenant의 역할이 필요한 역할에 포함되는지 확인
    return roles.includes(tenant.role.name);
  }
}
```

### CaslAbilityFactory 로직

```typescript
// packages/be-common/src/casl/casl-ability.factory.ts

@Injectable()
export class CaslAbilityFactory {
  async createForUser(user: UserDto): Promise<AppAbility> {
    // 1. 현재 Space의 Tenant에서 Role 확인
    const roleId = currentTenant.roleId;

    // 2. Role 기반 권한 조회
    const roleAbilities = await this.abilitiesRepository.findActiveByRoleIds([roleId]);

    // 3. User 예외 권한 조회
    const userAbilities = await this.abilitiesRepository.findActiveByUserId(user.id);

    // 4. 권한 병합 (priority 기반, User 권한 우선)
    const mergedAbilities = this.mergeAbilities(roleAbilities, userAbilities);

    // 5. CASL 규칙으로 변환
    for (const ability of mergedAbilities) {
      const conditions = this.parseConditions(ability.conditions, userContext);

      if (!ability.inverted) {
        can(action, subject, conditions);
      } else {
        cannot(action, subject, conditions);
      }
    }

    return build();
  }
}
```

### 유효성 검사 규칙

| ID | DTO | 필드 | 규칙 | 소스 |
|----|-----|------|------|------|
| L9-LOG-003 | CreateRoleDto | name | 필수, 영문대문자+언더스코어, 2-50자 | 추정 |
| L9-LOG-004 | CreateRoleDto | displayName | 선택, 최대 100자 | 추정 |
| L9-LOG-005 | CreateAbilityDto | subjectId | 필수, UUID | abilities.controller.ts |
| L9-LOG-006 | CreateAbilityDto | actionId | 필수, UUID | abilities.controller.ts |
| L9-LOG-007 | CreateAbilityDto | roleId/userId | 둘 중 하나 필수 | abilities.controller.ts |

### 서비스 비즈니스 규칙

| ID | 규칙 | 설명 | 소스 |
|----|------|------|------|
| L9-LOG-008 | 시스템 역할 보호 | isSystem=true인 역할은 수정/삭제 불가 | roles.service.ts:78 |
| L9-LOG-009 | 연결된 테넌트 확인 | 테넌트가 연결된 역할은 삭제 불가 | roles.service.ts:106 |
| L9-LOG-010 | 이름 중복 체크 | 역할 이름(name)은 고유해야 함 | roles.service.ts:52 |
| L9-LOG-011 | 권한 우선순위 | priority가 높을수록 우선 적용 | casl-ability.factory.ts:154 |

---

## 테스트 케이스 (L10)

### Roles API 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-001 | GET /roles - 정상 | happy | ADMIN 권한으로 역할 목록 조회 |
| L10-TST-002 | GET /roles - 미인증 | error | 토큰 없이 요청 시 401 |
| L10-TST-003 | GET /roles - 권한 없음 | error | USER 역할로 요청 시 403 |
| L10-TST-004 | POST /roles - 정상 | happy | SUPER_ADMIN으로 역할 생성 |
| L10-TST-005 | POST /roles - 중복 이름 | error | 이미 존재하는 이름으로 생성 시 409 |
| L10-TST-006 | PATCH /roles/:id - 정상 | happy | displayName 수정 성공 |
| L10-TST-007 | PATCH /roles/:id - 시스템 역할 | error | isSystem=true 역할 수정 시 403 |
| L10-TST-008 | DELETE /roles/:id - 정상 | happy | 역할 삭제 성공 |
| L10-TST-009 | DELETE /roles/:id - 연결된 테넌트 | error | 테넌트 연결 시 400 |
| L10-TST-010 | DELETE /roles/:id - 시스템 역할 | error | isSystem=true 역할 삭제 시 403 |

### Abilities API 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-011 | GET /abilities/my - 정상 | happy | 본인 권한 조회 |
| L10-TST-012 | GET /abilities/roles/:roleId | happy | Role별 권한 조회 |
| L10-TST-013 | GET /abilities/users/:userId | happy | User별 예외 권한 조회 |
| L10-TST-014 | POST /abilities - 정상 | happy | 새 권한 생성 |
| L10-TST-015 | PUT /abilities/roles/:roleId | happy | Role 권한 일괄 설정 |
| L10-TST-016 | PUT /abilities/users/:userId | happy | User 예외 권한 설정 |

### CASL 통합 테스트

| ID | 테스트 | 유형 | 설명 |
|----|--------|------|------|
| L10-TST-017 | 권한 병합 - priority | happy | 높은 priority가 낮은 priority 덮어씀 |
| L10-TST-018 | 조건 기반 권한 | happy | conditions 템플릿 변수 치환 |
| L10-TST-019 | inverted 권한 | happy | cannot 규칙 적용 |
| L10-TST-020 | User 예외 권한 우선 | happy | User 권한이 Role 권한 덮어씀 |

---

## 템플릿 변수

CaslAbilityFactory에서 지원하는 조건 템플릿 변수:

| 변수 | 설명 | 예시 |
|------|------|------|
| `${user.id}` | 현재 사용자 ID | 본인 데이터만 접근 |
| `${user.spaceId}` | 사용자 기본 Space ID | - |
| `${user.email}` | 사용자 이메일 | - |
| `${user.name}` | 사용자 이름 | - |
| `${user.currentTenantId}` | 현재 Tenant ID | - |
| `${user.currentSpaceId}` | 현재 Space ID | Space 내 데이터만 접근 |
| `${user.currentRoleId}` | 현재 Role ID | - |

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

## 확장 고려사항

### 미구현 기능 (추정)

1. **권한 그룹핑**: Subject/Action 그룹별 일괄 권한 설정
2. **권한 상속**: 상위 역할의 권한을 하위 역할이 상속
3. **권한 템플릿**: 자주 사용하는 권한 조합을 템플릿으로 저장
4. **권한 감사 로그**: 권한 변경 이력 기록

### 프론트엔드 필요 작업

1. `/roles` 페이지 구현 (역할 목록/상세/등록/수정)
2. `/roles/:id/abilities` 권한 매트릭스 UI
3. `/users/:id/abilities` 사용자별 예외 권한 UI
4. AbilityStore 연동

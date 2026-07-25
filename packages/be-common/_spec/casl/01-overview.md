# 01. 개요 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 생성일: 2026-01-31
> 최종 수정일: 2026-02-07 (Role 이름 변경, Ability/Grant 분리 구조 반영, Guard 체계 업데이트)
> 생성기: req-reverse-engineer

## 시스템 컨텍스트 (L0)

| 항목 | 내용 |
|------|------|
| 시스템명 | CASL 기반 권한 관리 시스템 |
| 설명 | RBAC(Role-Based Access Control)와 ABAC(Attribute-Based Access Control)를 결합한 권한 관리 시스템 |
| 분석 도메인 | Role, Ability, Grant, Subject, Action |

### 핵심 개념

```
                    ┌─────────────────────────────────────────────┐
                    │           CASL Ability Factory              │
                    │  (런타임 권한 생성 및 조건 기반 검사)          │
                    └─────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
              ┌──────────┐       ┌──────────┐       ┌──────────┐
              │   Role   │       │  Subject │       │  Action  │
              │ (역할)    │       │ (대상)    │       │ (행위)   │
              └──────────┘       └──────────┘       └──────────┘
                    │                   │                   │
                    │                   └─────────┬─────────┘
                    │                             │
                    │                             ▼
                    │                   ┌──────────────────┐
                    │                   │     Ability      │
                    │                   │ (권한 정의 템플릿) │
                    │                   │ Subject + Action  │
                    │                   └──────────────────┘
                    │                             │
                    │                             │
                    ▼                             ▼
              ┌──────────────────────────────────────────┐
              │            Grant (CONFIGURATION)          │
              │  Role/User에 Ability를 부여하는 중간 테이블  │
              │  granteeType: "Role" | "User"             │
              │  granteeId: roleId 또는 userId             │
              │  abilityId: 부여할 Ability                  │
              │  priority: 우선순위 (User > Role)           │
              └──────────────────────────────────────────┘
```

### 모델 역할 요약

| 모델 | 유형 | 역할 |
|------|------|------|
| **Subject** | REFERENCE | CASL 대상 정의 (Prisma 모델명, 커스텀 Subject) |
| **Action** | REFERENCE | 행위 정의 (CRUD, visibility, masking 등) |
| **Ability** | REFERENCE | 재사용 가능한 권한 정의 (Subject + Action + 조건) |
| **Grant** | CONFIGURATION | Role/User에 Ability를 부여 (다형성: granteeType + granteeId) |

---

## 사용자 (행위자) - L1

| ID | 이름 | 설명 | 권한 | 소스 |
|----|------|------|------|------|
| L1-ACT-001 | 플랫폼 관리자 | 시스템 전체 관리 권한 보유 | PLATFORM_ADMIN | `@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])` |
| L1-ACT-002 | Company 관리자 | 특정 Company 운영 권한 보유 | COMPANY_MANAGER | `@Roles([SYSTEM_ROLES.COMPANY_MANAGER])` |
| L1-ACT-003 | 회원 | 본인 정보/예약 관리 및 시설/콘텐츠 조회 권한 | MEMBER | `SYSTEM_ROLES.MEMBER` |

### 권한 계층

```
PLATFORM_ADMIN (플랫폼 관리자)
    ├── 역할 생성/수정/삭제
    ├── Ability(권한 정의) 생성/수정/삭제
    ├── Grant(권한 부여) - Role별 일괄 설정
    └── Grant(권한 부여) - User별 예외 설정

COMPANY_MANAGER (Company 관리자)
    ├── 역할 목록 조회
    ├── Ability/Grant 조회
    └── (PLATFORM_ADMIN 하위 권한)

MEMBER (회원)
    └── 본인 권한(Grant) 조회만 가능
```

---

## 사용자 목표 (Goal) - L2

| ID | 행위자 | 목표 | 설명 |
|----|-------|------|------|
| L2-GOL-001 | 플랫폼 관리자 | 역할 관리 | 시스템 역할을 생성, 수정, 삭제하여 권한 체계를 정의 |
| L2-GOL-002 | 플랫폼 관리자 | Ability 관리 | 재사용 가능한 권한 정의(Ability)를 생성, 수정, 삭제 |
| L2-GOL-003 | 플랫폼 관리자 | Grant 설정 | 역할별 기본 Grant 및 사용자별 예외 Grant를 설정 |
| L2-GOL-004 | Company 관리자 | 권한 현황 파악 | 역할/Ability/Grant 목록을 조회하여 현재 권한 체계 파악 |
| L2-GOL-005 | 회원 | 본인 권한 확인 | 본인에게 부여된 권한(Grant) 목록을 확인 |

---

## 소스 파일

| 레이어 | 파일 | 설명 |
|--------|------|------|
| Prisma | `packages/be-prisma/schema/subject.prisma` | Subject 모델 |
| Prisma | `packages/be-prisma/schema/action.prisma` | Action 모델 |
| Prisma | `packages/be-prisma/schema/ability.prisma` | Ability 모델 |
| Prisma | `packages/be-prisma/schema/policy.prisma` | Policy 모델 |
| Prisma | `packages/be-prisma/schema/policy-ability.prisma` | PolicyAbility 모델 |
| Prisma | `packages/be-prisma/schema/role-policy.prisma` | RolePolicy 모델 |
| Prisma | `packages/be-prisma/schema/role.prisma` | Role 모델 |
| Prisma | `packages/be-prisma/schema/role-association.prisma` | RoleAssociation 모델 |
| Prisma | `packages/be-prisma/schema/role-classification.prisma` | RoleClassification 모델 |
| Entity | `packages/be-entity/src/ability.entity.ts` | Ability 도메인 엔티티 |
| Entity | `packages/be-entity/src/policy.entity.ts` | Policy 도메인 엔티티 |
| Entity | `packages/be-entity/src/role.entity.ts` | Role 도메인 엔티티 |
| Repository | `packages/be-repository/src/abilities.repository.ts` | Ability CRUD |
| Repository | `packages/be-repository/src/policies.repository.ts` | Policy 조회 (Space 기반) |
| Service | `packages/be-service/src/ability/ability.service.ts` | Ability 비즈니스 로직 |
| Service | `packages/be-service/src/policy/policy.service.ts` | Policy 비즈니스 로직 |
| UseCase | `packages/be-usecase/src/core/get-my-abilities.usecase.ts` | Ability + Policy 조합 로직 |
| CASL | `packages/be-common/src/casl/casl-ability.factory.ts` | CASL Ability 생성 팩토리 (Policy repository 사용) |
| Guard | `packages/be-common/src/guard/roles.guard.ts` | @Roles 데코레이터 Guard |
| Guard | `packages/be-common/src/guard/role-category.guard.ts` | @RoleCategories 데코레이터 Guard |
| Guard | `packages/be-common/src/guard/role-group.guard.ts` | @RoleGroups 데코레이터 Guard |
| Guard | `packages/be-common/src/guard/space-access.guard.ts` | X-Space-ID 기반 접근 Guard |
| Decorator | `packages/be-decorator/src/roles.decorator.ts` | @Roles 데코레이터 |
| Decorator | `packages/be-decorator/src/role-categories.decorator.ts` | @RoleCategories 데코레이터 |
| Decorator | `packages/be-decorator/src/role-groups.decorator.ts` | @RoleGroups 데코레이터 |
| Decorator | `packages/be-decorator/src/skip-space-check.decorator.ts` | @SkipSpaceCheck 데코레이터 |
| Controller | `packages/be-controller/src/roles/roles.controller.ts` | 역할 CRUD API |
| Controller | `packages/be-controller/src/abilities/abilities.controller.ts` | Ability API |
| DTO | `packages/be-dto/src/ability.dto.ts` | AbilityDto, AbilitySummaryDto |
| DTO | `packages/be-dto/src/abilities/` | CreateAbilityDto, AbilityResponseDto |
| DTO | `packages/be-dto/src/policies/` | CreatePolicyDto, UpdatePolicyDto, PolicyResponseDto |
| Enum | `packages/common-enum/src/role-category-names.enum.ts` | RoleCategoryNames (ts-jenum) |
| Enum | `packages/common-enum/src/role-group-names.enum.ts` | RoleGroupNames (ts-jenum) |
| Constant | `packages/common-constant/src/schema/role-type.constant.ts` | SYSTEM_ROLES 상수 |
| Store | `packages/fe-store/src/stores/abilityStore.ts` | 프론트엔드 Ability 상태 관리 |

---

## 핵심 비즈니스 규칙

### 1. 역할(Role) 관련
- 시스템 역할(PLATFORM_ADMIN, COMPANY_MANAGER, MEMBER)은 수정/삭제 불가
- 역할 이름(name)은 고유해야 함
- 연결된 테넌트가 있는 역할은 삭제 불가

### 2. Ability(권한 정의) 관련
- Subject + Action 조합으로 재사용 가능한 권한을 정의
- `inverted=false`면 허용(can), `true`면 거부(cannot)
- `conditions` 필드로 ABAC 조건 설정 가능
- `fields` 필드로 접근 가능한 필드 제한 가능

### 3. Grant(권한 부여) 관련
- 다형성 연결 방식: `granteeType` ("Role" | "User") + `granteeId`로 대상 식별
- Role 기반 Grant: `granteeType="Role"` (기본 권한, priority 0-9)
- User 예외 Grant: `granteeType="User"` (예외 권한, priority 10+)
- `priority` 값이 높을수록 우선 적용 (User Grant가 Role Grant 덮어씀)
- `isActive`로 활성화/비활성화 관리

### 4. 조건(Conditions) 기반 ABAC
- 템플릿 변수 지원: `${user.id}`, `${user.currentSpaceId}`, `${user.roleCategory}` 등
- 보안을 위해 허용된 변수만 치환 (`ALLOWED_TEMPLATE_VARIABLES`)
- 예시: `{ "spaceId": "${user.currentSpaceId}" }`

### 5. Space 기반 접근 제어
- Guard 실행 순서: JwtAuthGuard → SpaceAccessGuard → RolesGuard 등
- X-Space-ID 헤더로 현재 Space의 Tenant를 찾아 역할 검증
- `@SkipSpaceCheck` 데코레이터로 Space 선택 불필요한 엔드포인트 지원
- 상세 내용은 [SpaceAccessControl 기획서](../space-access-control/01-overview.md) 참조

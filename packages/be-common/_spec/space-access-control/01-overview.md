# 01. Space 기반 접근 제어 시스템

> 생성일: 2026-02-07
> 상태: ✅ 구현 완료

## 시스템 컨텍스트 (L0)

| 항목 | 내용 |
|------|------|
| 시스템명 | Space 기반 접근 제어 시스템 |
| 설명 | Multi-Tenancy 환경에서 `x-tenant-id` 헤더를 기반으로 Guard/Interceptor/SpaceContext를 통해 Space별 접근 제어를 수행하는 시스템 |
| 관련 시스템 | [CASL 권한 관리](../2026-01-31-CASL/01-overview.md) |

---

## 전체 아키텍처

```
[프론트엔드]                      [백엔드]

PersistStore.tenantId             Guard Layer (요청 차단)
    ↓                             ┌─ JwtAuthGuard ─→ JWT 검증, request.user 설정
Axios Interceptor                 ├─ SpaceAccessGuard ─→ x-tenant-id + Tenant 검증
  x-tenant-id 헤더 자동 추가      └─ RolesGuard/RoleCategoryGuard/RoleGroupGuard (선택적)
    ↓                                  ↓
─── HTTP Request ──────────────→  Interceptor Layer (컨텍스트 설정)
                                  ┌─ RequestContextMiddleware ─→ CLS에 원시값 저장
                                  ├─ SpaceScopeInterceptor ─→ EFFECTIVE_SPACE_IDS 계산
                                  └─ Response 인터셉터들 (래핑/DTO변환/직렬화)
                                       ↓
                                  Controller → Service(SpaceContext) → Repository
```

---

## Guard Layer - 접근 차단

### 실행 순서

| 순서 | Guard | 역할 | 트리거 |
|------|-------|------|--------|
| 1 | `JwtAuthGuard` | JWT 토큰 검증, `request.user` 설정 | 글로벌 (`@PublicRoute` 제외) |
| 2 | `SpaceAccessGuard` | `x-tenant-id` 필수 검증 + Tenant 매칭 | 글로벌 (`@PublicRoute`/`@SkipSpaceCheck` 제외) |
| 3 | `RolesGuard` | `tenant.role.name` 검증 | `@Roles(SYSTEM_ROLES.COMPANY_MANAGER)` |
| 4 | `RoleCategoryGuard` | Role의 Category 계층 검증 | `@RoleCategories(RoleCategoryNames.SHARED)` |
| 5 | `RoleGroupGuard` | Role의 Group 검증 | `@RoleGroups(RoleGroupNames.TRUSTED)` |

### SpaceAccessGuard 핵심 로직

```
인증된 사용자 → @PublicRoute? → skip
             → @SkipSpaceCheck? → skip
             → x-tenant-id 헤더 필수
               → user.tenants에서 tenantId 매칭
               → Tenant 존재하면 통과
               → Tenant 없으면 ForbiddenException
```

### Skip 데코레이터

| 데코레이터 | 효과 | 사용 사례 |
|----------|------|---------|
| `@PublicRoute()` | JWT + SpaceAccessGuard 모두 skip | 로그인, 회원가입 등 |
| `@SkipSpaceCheck()` | SpaceAccessGuard만 skip (JWT는 필요) | `/my-spaces` 등 Space 선택 전 API |

---

## Interceptor Layer - 컨텍스트 설정

### RequestContextMiddleware가 CLS에 저장하는 값

| CLS 키 | 값 | 소스 |
|--------|---|------|
| `TENANT_ID` | x-tenant-id 헤더값 | request.headers |
| `TENANT` | 현재 요청 Tenant 정보 | user.tenants.find(tenantId) |
| `SPACE_ID` | 현재 Tenant에서 파생된 Space ID | tenant.spaceId 또는 tenant.space.id |
| `EFFECTIVE_SPACE_IDS` | 데코레이터 scope와 Space category 위계로 계산한 최종 Space ID[] | SpaceScopeInterceptor |
| `ROLE_NAME` | 현재 Tenant의 역할명 | tenant.role.name |
| `ROLE_CATEGORY` | 역할 카테고리명 | tenant.role.classification.category.name |
| `ROLE_GROUP_NAMES` | 역할 그룹명[] | tenant.role.associations[].group.name |
| `USER_CATEGORY` | 이용자 분류 | user.classification |
| `USER_GROUP_IDS` | 이용자 그룹 ID[] | user.associations |

### SpaceScopeInterceptor - EFFECTIVE_SPACE_IDS 결정

| 데코레이터 | EFFECTIVE_SPACE_IDS | 사용 사례 |
|----------|------------------|---------|
| 없음 또는 `@WithDescendantSpaces()` | 현재 Space + 모든 하위 category Space | 대부분의 조회 API |
| `@WithAncestorSpaces()` | 현재 Space + 모든 상위 category Space | 상위 리소스까지 필요한 조회 |
| `@WithSpaceTree()` | 현재 Space + 모든 상위/하위 category Space | 위계 전체를 함께 보는 조회 |

`PLATFORM_ADMIN` role 예외는 두지 않습니다. 최상위 Space category에 속한 tenant라면 기본 descendant scope 계산 결과로 전체 하위 Space를 보게 됩니다.

### Swagger 문서화

| 항목 | 문서화 기준 |
|------|-------------|
| 보호 API | `@ApiAuth()`가 `x-tenant-id` header를 필수로 노출 |
| Tenant 선택 전 API | `@ApiAuth({ tenantHeader: false })` 또는 인증 전용 decorator로 `x-tenant-id` 필수 표시 제외 |
| 선택적 Tenant API | `@ApiTenantHeader({ required: false })`로 선택 header 표시 |
| Scope decorator | `x-space-resource-scope` vendor extension에 `WITH_DESCENDANTS`, `WITH_ANCESTORS`, `WITH_TREE` 기록 |
| Orval codegen | `x-tenant-id` header parameter는 codegen 입력 transformer에서 제거하고 Axios interceptor 주입을 유지 |

---

## SpaceContext (Service Layer)

```typescript
@Injectable()
class SpaceContext {
  get tenantId(): string | undefined         // x-tenant-id
  get spaceId(): string | undefined          // 현재 Tenant에서 파생된 Space ID
  get tenant(): TenantDto | undefined        // 현재 Tenant
  get spaceIds(): string[]                   // EFFECTIVE_SPACE_IDS (최종)
  get spaceFilter()                          // { spaceId: { in: spaceIds } }
  get tenantFilter()                         // { tenantId }
  canAccessSpace(targetSpaceId: string): boolean
}
```

---

## Multi-Tenancy 도메인 모델

```
SpaceCategory (ROOT, BRANCH 등)
    ↓ SpaceClassification
Space (접근/테넌트 컨테이너)
    ├── Company (구체화: 사업자등록번호, 법인/운영사 연락처 등) [1:1]
    │   └── Ground (서비스 시설: 시설명, 현장 연락처, 이미지 등) [1:1]
    ├── SpaceClassification → Category (분류 체계)
    ├── SpaceAssociation → Group (그룹핑)
    └── Tenant (Bridge) ←── User + Role 연결
              ↓
         User (1) ──→ (N) Tenant ──→ (1) Space
                          ├─ roleId → Role (1)
                          └─ spaceId → Space (1)
```

같은 User가 여러 Space에서 다른 Role을 가질 수 있음:
```
User A:
  ├─ space-001 에서 PLATFORM_ADMIN (System Space)
  ├─ space-002 에서 COMPANY_MANAGER
  └─ space-003 에서 MEMBER
```

---

## 프론트엔드 연동

### Tenant 선택 저장
- **PersistStore** (MobX): `tenantId`를 메모리 + localStorage에 보관
- Tenant 전환 시 선택된 `tenantId`를 갱신하고 이후 요청 header에 반영

### Axios Interceptor
```typescript
// 앱 초기화 시 PersistStore 참조 주입
setApiPersistStore(persistStoreRef);

// 모든 API 요청에 x-tenant-id 자동 추가
AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (persistStoreRef?.tenantId) {
    config.headers["x-tenant-id"] = persistStoreRef.tenantId;
  }
  return config;
});
```

---

## 소스 파일

| 레이어 | 파일 | 설명 |
|--------|------|------|
| Guard | `packages/be-common/src/guard/space-access.guard.ts` | SpaceAccessGuard |
| Guard | `packages/be-common/src/guard/roles.guard.ts` | RolesGuard (현재 Tenant role 기반) |
| Guard | `packages/be-common/src/guard/role-category.guard.ts` | RoleCategoryGuard |
| Guard | `packages/be-common/src/guard/role-group.guard.ts` | RoleGroupGuard |
| Middleware | `packages/be-common/src/middleware/request-context.middleware.ts` | CLS 값 설정 |
| Context | `packages/be-context/src/space-context.ts` | SpaceContext Injectable |
| Context | `packages/be-common/src/context/space-scope.interceptor.ts` | SpaceScopeInterceptor |
| Context | `packages/be-common/src/context/space-scope.decorator.ts` | @WithDescendantSpaces, @WithAncestorSpaces, @WithSpaceTree |
| Decorator | `packages/be-decorator/src/skip-space-check.decorator.ts` | @SkipSpaceCheck |
| Decorator | `packages/be-decorator/src/public-route.decorator.ts` | @PublicRoute |
| Constant | `packages/common-constant/src/context/context-keys.constant.ts` | CLS 키 상수 |
| Util | `packages/be-common/src/util/permission.util.ts` | 현재 Tenant/Space 파생 유틸 |
| Setup | `apps/core/api/src/setNestApp.ts` | 글로벌 Guard/Interceptor 등록 |
| FE API | `packages/fe-api/src/libs/customAxios.ts` | x-tenant-id 헤더 자동 추가 |
| FE Store | `packages/fe-store/src/stores/persistStore.ts` | tenantId 보관 |

---

## Resource Scope 선택

```typescript
import { WithAncestorSpaces, WithSpaceTree } from "@cocrepo/be-common";

@Get("ancestor-resources")
@WithAncestorSpaces()
findAncestorResources() {
  return this.service.findMany();
}

@Get("tree-resources")
@WithSpaceTree()
findTreeResources() {
  return this.service.findMany();
}
```

---

## 현재 적용 현황

### Controller별 데코레이터 사용

| Controller | `@WithDescendantSpaces` | `@WithAncestorSpaces` | `@WithSpaceTree` | `@SkipSpaceCheck` | `@PublicRoute` |
|-----------|:-:|:-:|:-:|:-:|:-:|
| UsersController | 기본값 | - | - | - | - |
| RolesController | 기본값 | - | - | - | - |
| ActionsController | 기본값 | - | - | - | ✅ |
| SubjectsController | 기본값 | - | - | - | ✅ |
| GroundsController | 기본값 | - | - | - | 일부 ✅ |
| AuthController | 기본값 | - | - | ✅ (`/my-spaces`) | ✅ (login 등) |

### Service별 SpaceContext 사용

| 서비스 | SpaceContext | 파라미터 | 비고 |
|--------|:-----------:|:--------:|------|
| UsersService | ✅ | 일부 | 목록은 SpaceContext, 상세/생성/수정/삭제는 파라미터 |
| SpacesService | - | ✅ | Space 자체 관리라 SpaceContext 불필요 |
| RolesService | - | ✅ | 시스템 수준 조회 |
| SpacesService | - | ✅ | Space root는 파라미터 기반, Company/Ground detail은 `/spaces/:spaceId/ground` nested route로 처리 |

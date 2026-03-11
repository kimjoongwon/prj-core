# 01. Space 기반 접근 제어 시스템

> 생성일: 2026-02-07
> 상태: ✅ 구현 완료

## 시스템 컨텍스트 (L0)

| 항목 | 내용 |
|------|------|
| 시스템명 | Space 기반 접근 제어 시스템 |
| 설명 | Multi-Tenancy 환경에서 X-Space-ID 헤더를 기반으로 Guard/Interceptor/SpaceContext를 통해 Space별 접근 제어를 수행하는 시스템 |
| 관련 시스템 | [CASL 권한 관리](../2026-01-31-CASL/01-overview.md) |

---

## 전체 아키텍처

```
[프론트엔드]                      [백엔드]

PersistStore.spaceId              Guard Layer (요청 차단)
    ↓                             ┌─ JwtAuthGuard ─→ JWT 검증, request.user 설정
Axios Interceptor                 ├─ SpaceAccessGuard ─→ X-Space-ID + Tenant 검증
  x-space-id 헤더 자동 추가       └─ RolesGuard/RoleCategoryGuard/RoleGroupGuard (선택적)
    ↓                                  ↓
─── HTTP Request ──────────────→  Interceptor Layer (컨텍스트 설정)
                                  ┌─ RequestContextInterceptor ─→ CLS에 원시값 저장
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
| 2 | `SpaceAccessGuard` | X-Space-ID 필수 검증 + Tenant 매칭 | 글로벌 (`@PublicRoute`/`@SkipSpaceCheck` 제외) |
| 3 | `RolesGuard` | `tenant.role.name` 검증 | `@Roles(SYSTEM_ROLES.MANAGE)` |
| 4 | `RoleCategoryGuard` | Role의 Category 계층 검증 | `@RoleCategories(RoleCategoryNames.SHARED)` |
| 5 | `RoleGroupGuard` | Role의 Group 검증 | `@RoleGroups(RoleGroupNames.TRUSTED)` |

### SpaceAccessGuard 핵심 로직

```
인증된 사용자 → @PublicRoute? → skip
             → @SkipSpaceCheck? → skip
             → X-Space-ID 헤더 필수
               → user.tenants에서 spaceId 매칭
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

### RequestContextInterceptor가 CLS에 저장하는 값

| CLS 키 | 값 | 소스 |
|--------|---|------|
| `SPACE_ID` | X-Space-ID 헤더값 (1개) | request.headers |
| `TENANT` | 현재 Space의 Tenant 정보 | user.tenants.find(spaceId) |
| `ACCESSIBLE_SPACE_IDS` | 사용자 전체 Tenant의 spaceId[] | user.tenants.map(t => t.spaceId) |
| `DESCENDANT_SPACE_IDS` | 카테고리 계층 기반 하위 Space ID[] | Redis 캐시 (TTL 10분) or DB |
| `ROLE_NAME` | 현재 Tenant의 역할명 | tenant.role.name |
| `ROLE_CATEGORY` | 역할 카테고리명 | tenant.role.classification.category.name |
| `ROLE_GROUP_NAMES` | 역할 그룹명[] | tenant.role.associations[].group.name |
| `USER_CATEGORY` | 이용자 분류 | user.classification |
| `USER_GROUP_IDS` | 이용자 그룹 ID[] | user.associations |

### SpaceScopeInterceptor - EFFECTIVE_SPACE_IDS 결정

| 데코레이터 | EFFECTIVE_SPACE_IDS | 사용 사례 |
|----------|------------------|---------|
| `@OnlyMySpace()` | `[SPACE_ID]` (1개) | 현재 Space에만 생성/수정 |
| `@AccessibleSpaces()` | `DESCENDANT_SPACE_IDS` (계층 포함) | 하위 Space 포함 조회 |
| 없음 (기본) | `DESCENDANT_SPACE_IDS` | 대부분의 조회 API |

---

## SpaceContext (Service Layer)

```typescript
@Injectable()
class SpaceContext {
  get spaceId(): string | undefined          // X-Space-ID 1개
  get tenant(): TenantDto | undefined        // 현재 Tenant
  get spaceIds(): string[]                   // EFFECTIVE_SPACE_IDS (최종)
  get spaceFilter()                          // { spaceId: { in: spaceIds } }
  get tenantSpaceFilter()                    // { tenants: { some: { spaceId: { in: spaceIds } } } }
  hasAccessTo(targetSpaceId: string): boolean
  assertContextSet(): void
}
```

---

## Multi-Tenancy 도메인 모델

```
SpaceCategory (ROOT, BRANCH 등)
    ↓ SpaceClassification
Space (추상 컨테이너)
    ├── Ground (구체화: name, address, phone 등) [1:1]
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
  ├─ space-001 에서 FULL_ACCESS (System Space)
  ├─ space-002 에서 MANAGE
  └─ space-003 에서 VIEW
```

---

## 프론트엔드 연동

### Space 선택 저장
- **PersistStore** (MobX): `spaceId`를 메모리 + localStorage에 보관
- Space 전환 시 `persistStore.setSpace(spaceId, groundName)` → `window.location.reload()`

### Axios Interceptor
```typescript
// 앱 초기화 시 PersistStore 참조 주입
setApiPersistStore(persistStoreRef);

// 모든 API 요청에 x-space-id 자동 추가
AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (persistStoreRef?.spaceId) {
    config.headers["x-space-id"] = persistStoreRef.spaceId;
  }
  return config;
});
```

---

## 소스 파일

| 레이어 | 파일 | 설명 |
|--------|------|------|
| Guard | `packages/be-common/src/guard/space-access.guard.ts` | SpaceAccessGuard |
| Guard | `packages/be-common/src/guard/roles.guard.ts` | RolesGuard (x-space-id 기반) |
| Guard | `packages/be-common/src/guard/role-category.guard.ts` | RoleCategoryGuard |
| Guard | `packages/be-common/src/guard/role-group.guard.ts` | RoleGroupGuard |
| Interceptor | `packages/be-common/src/interceptor/request-context.interceptor.ts` | CLS 값 설정 |
| Context | `packages/be-common/src/context/space-context.ts` | SpaceContext Injectable |
| Context | `packages/be-common/src/context/space-scope.interceptor.ts` | SpaceScopeInterceptor |
| Context | `packages/be-common/src/context/space-scope.decorator.ts` | @OnlyMySpace, @AccessibleSpaces |
| Decorator | `packages/be-decorator/src/skip-space-check.decorator.ts` | @SkipSpaceCheck |
| Decorator | `packages/be-decorator/src/public-route.decorator.ts` | @PublicRoute |
| Constant | `packages/common-constant/src/context/context-keys.constant.ts` | CLS 키 상수 |
| Util | `packages/be-common/src/util/permission.util.ts` | canAccessAllSpaces, isRootSpaceCategory |
| Setup | `apps/server/src/setNestApp.ts` | 글로벌 Guard/Interceptor 등록 |
| FE API | `packages/fe-api/src/libs/customAxios.ts` | x-space-id 헤더 자동 추가 |
| FE Store | `packages/fe-store/src/stores/persistStore.ts` | spaceId 보관 |

---

## 권한 유틸리티

```typescript
import { canAccessAllSpaces, isRootSpaceCategory } from "@cocrepo/be-common";

// Service에서 전체 접근 권한 확인
if (canAccessAllSpaces(tenant)) {
  return this.repository.findAll();  // ROOT Space: 전체 조회
}
return this.repository.findBySpaceId(spaceId);  // 일반: Space 필터링
```

---

## 현재 적용 현황

### Controller별 데코레이터 사용

| Controller | `@OnlyMySpace` | `@AccessibleSpaces` | `@SkipSpaceCheck` | `@PublicRoute` |
|-----------|:-:|:-:|:-:|:-:|
| UsersController | - | - | - | - |
| RolesController | - | - | - | - |
| ActionsController | - | - | - | ✅ |
| SubjectsController | - | - | - | ✅ |
| GroundsController | - | - | - | 일부 ✅ |
| AuthController | - | - | ✅ (`/my-spaces`) | ✅ (login 등) |

### Service별 SpaceContext 사용

| 서비스 | SpaceContext | 파라미터 | 비고 |
|--------|:-----------:|:--------:|------|
| UsersService | ✅ | 일부 | 목록은 SpaceContext, 상세/생성/수정/삭제는 파라미터 |
| SpacesService | - | ✅ | Space 자체 관리라 SpaceContext 불필요 |
| RolesService | - | ✅ | 시스템 수준 조회 |
| SpacesService | - | ✅ | Space root는 파라미터 기반, Ground detail은 `/spaces/:spaceId/ground` nested route로 처리 |

# Role Detail Policy Assignment Page Spec

> 2026-08-03 승인 변경: Prisma `Action`, `Policy`, `Role`, `Subject` 모델의 `isSystem` 필드는 전체 제거합니다. 이 route spec의 기존 "시스템 Role/Action/Policy/Subject 보호" 계약은 더 이상 유효하지 않으며, 아래 딜리버리의 `SYS-IS-REMOVE-*` 단계가 구현 기준입니다. `theme`와 FitnessCenter demo data처럼 다른 도메인의 동명 `isSystem`은 유지합니다.

## 목표

| 항목 | 내용 |
|------|------|
| route | `/roles/[roleId]` |
| route 파일 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx` |
| 사용자 목표 | 운영자가 Role aggregate root 기준으로 최종 Policy assignment 상태를 보고, 변경하고, 저장합니다. |
| 운영 목표 | Role 상세 route 하나가 Role 기본 정보, 정책 할당 렌더링, API wiring, 저장 확인, 검증 계약을 단일 소유합니다. |
| 성공 기준 | `/roles/[roleId]`에서 현재 할당/미할당/활성/우선순위/변경 요약이 보이고, 저장 전 확인 후 `syncRoleAssignments`로 전체 동기화합니다. |
| 범위 포함 | Role 상세 화면, 정책 할당 편집, 저장 확인 modal, 삭제 modal, 권한 처리, `Action`/`Policy`/`Role`/`Subject`의 `isSystem` 제거 마이그레이션, route-local state와 테스트 |
| 범위 제외 | Policy 내부 Ability 구성 화면, Policy CRUD 자체 개편, Ability/Action/Subject CRUD 개편, 새 권한 엔진 |
| 기존 구현 재사용 후보 | `RoleEditScreen`, `RoleAssignmentForm`, `RoleForm`, `getRoleById`, `getPolicies`, `getRoleAssignments`, `syncRoleAssignments`, `deleteRole` |
| 신규 생성/정리 사유 | Screen/Feature/Form 렌더링 계약을 route가 직접 소유하도록 정리하고, 중복 기획 문서를 제거합니다. |

## 사용자 / 역할 / 권한

| 사용자/역할 | 목적 | 허용 행동 | 제한/금지 | 관련 API | 비고 |
|-------------|------|-----------|-----------|----------|------|
| `PLATFORM_ADMIN` | Role 정책 할당 관리 | Role 조회, Policy 목록 조회, RoleAssignment 조회, Role 정책 편집/저장, Role 수정/삭제 이동 | 권한 없는 scope의 조회/수정 금지 | `getRoleById`, `getPolicies`, `getRoleAssignments`, `syncRoleAssignments`, `deleteRole` | primary actor |
| `COMPANY_MANAGER` | Role 기본 정보 확인 | Role 상세 조회 | 정책 할당 조회/수정 API 호출 금지 | `getRoleById` | route에서 assignment section을 숨기거나 readOnly 권한 안내로 처리합니다. |

## 도메인 모델 / 생명주기

| 도메인 객체 | 책임 | 주요 필드/값 | 상태/lifecycle | 정책/검증 | 소유 패키지 | 비고 |
|-------------|------|--------------|----------------|-----------|-------------|------|
| `Role` | 정책 할당 화면의 aggregate root | `id`, `name`, `displayName`, `description`, `removedAt` | 조회 -> 권한 확인 -> 편집/삭제 | `isSystem` 기반 보호 정책은 제거하고, 역할/권한 guard만 유지 | `packages/be-prisma/schema/role.prisma`, `packages/be-aggregate/src/role/role.aggregate.ts` | route canonical root |
| `Policy` | Role에 할당 가능한 정책 후보 | `id`, `name`, `displayName`, `description`, `entries` | 목록 조회 -> 검색/필터 -> 선택/해제 | 현재 scope에서 조회 가능한 Policy만 후보 | `packages/be-prisma/schema/policy.prisma` | row 렌더링 후보 |
| `RoleAssignment` | Role과 Policy의 최종 할당 결과 | `roleId`, `policyId`, `isActive`, `priority` | baseline 조회 -> local edit -> 저장 확인 -> 전체 동기화 | 중복 `policyId` 제거, missing assignment soft remove, priority number 검증 | `packages/be-prisma/schema/role-assignment.prisma`, `packages/be-aggregate/src/policy/role-assignment.aggregate.ts`, `packages/be-repository/src/role-assignments.repository.ts` | 핵심 편집 대상 |

## 사용자 여정

| 여정 | 행위자 | 시작점 | 단계 | 완료 조건 | 실패/복구 | 관련 API |
|------|--------|--------|------|-----------|-----------|----------|
| Role 상세 확인 | `PLATFORM_ADMIN`, `COMPANY_MANAGER` | `/roles` 목록 | 상세 진입 -> Role 기본 정보 확인 -> 상태/시스템 여부 확인 | Role title, metadata, 상태가 보임 | 404면 목록 이동 CTA | `getRoleById` |
| 정책 할당 확인 | `PLATFORM_ADMIN` | Role 상세 | 정책 할당 section 확인 -> 현재 할당 수/활성 수/priority 확인 | 후보 Policy와 assignment 상태가 한 화면에서 보임 | policy API 실패 시 section error와 재시도 | `getPolicies`, `getRoleAssignments` |
| 정책 할당 편집 | `PLATFORM_ADMIN` | 정책 할당 section | 편집 시작 -> 검색/필터 -> 선택/해제 -> active/priority 조정 -> 변경 요약 확인 | 저장 CTA가 dirty 상태에서 활성화 | 취소 시 baseline 복원 | local route state |
| 정책 할당 저장 | `PLATFORM_ADMIN` | 저장 CTA | 저장 확인 modal -> PUT -> 재조회 -> 성공 toast | 서버 baseline과 local state가 일치 | 400/403/404는 modal 유지 또는 section error 표시 | `syncRoleAssignments`, `getRoleAssignments` invalidation |
| 권한 없는 Role 접근 | `COMPANY_MANAGER` | Role 상세 | 기본 정보 확인 | 정책 할당 section 숨김 또는 권한 안내 표시 | 강제 mutation은 backend guard가 거부 | `getRoleById` |

## 백엔드 / API / 기반 계약

| 그룹 | 재사용/수정/신규 | 대상 파일 | 계약 | 소스 담당 `agent_type` | 소비/Wiring `agent_type` | 검증 `agent_type` |
|------|------------------|-----------|------|-------------------------|---------------------------|-------------------|
| Prisma / Database | 수정 | `packages/be-prisma/schema/action.prisma`, `packages/be-prisma/schema/policy.prisma`, `packages/be-prisma/schema/role.prisma`, `packages/be-prisma/schema/subject.prisma`, `packages/be-prisma/migrations/*/migration.sql` | `Action`/`Policy`/`Role`/`Subject`에서 `isSystem` 필드와 `is_system` index/column 제거, 다른 도메인 동명 필드 유지 | `be-prisma-builder` | `be-repository-builder`, `be-dto-builder`, `fe-hook-agent` | `be-prisma-builder` |
| Common Schema | 신규 | `packages/common-schema/src/schemas/access-control/sync-role-assignments.schema.ts` | route 저장 전 `assignments[].policyId/isActive/priority` 검증에 사용할 `SyncRoleAssignmentsSchema` | `common-schema-builder` | `fe-route-agent` | `common-schema-builder` |
| DTO / Query DTO | 재사용 | `packages/be-dto/src/role-assignments/*` | `SyncRoleAssignmentsDto`, `RoleAssignmentResponseDto` 유지 | `be-dto-builder` | `be-controller-builder` | `be-dto-builder` |
| Repository | 재사용 | `packages/be-repository/src/role-assignments.repository.ts` | 전체 동기화와 missing assignment soft remove 유지 | `be-repository-builder` | `be-aggregate-builder` | `be-repository-builder` |
| Aggregate | 수정 | `packages/be-aggregate/src/action/action.aggregate.ts`, `packages/be-aggregate/src/policy/policy.aggregate.ts`, `packages/be-aggregate/src/role/role.aggregate.ts`, `packages/be-aggregate/src/subject/subject.aggregate.ts`, `packages/be-aggregate/src/policy/role-assignment.aggregate.ts` | `isSystem` default/setter/guard/serialization 제거, 권한 guard는 role category/scope 기준만 유지 | `be-aggregate-builder` | `be-usecase-builder` | `be-aggregate-builder` |
| UseCase / Command | 재사용 | `packages/be-usecase/src/core/role-assignment/*`, `packages/be-command/src/core/*role-assignments*` | 조회/저장 message 유지 | `be-usecase-builder` | `be-controller-builder` | `be-usecase-builder` |
| Controller | 재사용 | `packages/be-controller/src/role-assignments/role-assignments.controller.ts`, `packages/be-controller/src/roles/roles.controller.ts`, `packages/be-controller/src/policies/policies.controller.ts` | `getRoleById`, `getPolicies`, `getRoleAssignments`, `syncRoleAssignments`, `deleteRole` 소비 | `be-controller-builder` | `fe-route-agent` | `be-controller-builder` |
| Codegen / API Client | 수정 | `packages/fe-api/src/core/**` | 새 Role Assignment 경로와 DTO를 기준으로 재생성 | `fe-hook-agent` | `fe-route-agent` | `fe-hook-agent` |
| Route / UI State | 수정 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx`, 필요 시 route-local util | route가 API, modal, dirty 계산, screen/feature/form 렌더링 계약을 단일 소유 | `fe-route-agent` | `fe-form-agent`, `fe-storybook-agent` | `fe-route-agent` |
| Form Component | 수정 가능 | `packages/fe-ui/src/form/RoleAssignmentForm/*`, `packages/fe-ui/src/form/RoleForm/*` | 별도 spec 없이 이 route spec의 렌더링 계약에 맞춰 입력 leaf를 정리 | `fe-form-agent` | `fe-route-agent` | `fe-form-agent` |

## 디자인 정렬

- 정보 위계: Role 식별 정보 -> 시스템/삭제 상태 -> 정책 할당 요약 -> 정책 후보 목록 -> 변경 요약/저장 순서로 읽힙니다.
- Navigation: `/roles/[roleId]`가 Role Policy assignment의 canonical route입니다. Policy 이름은 `/policies/[policyId]`로 이동하되, Policy 생성/수정 form을 이 route 안에 중첩하지 않습니다.
- Platform density: Admin desktop 화면이므로 table/list density를 우선합니다. 카드형 반복보다 한 줄에서 policy name, ability count, assigned, active, priority를 스캔할 수 있어야 합니다.
- Visual safety: 저장 전 변경 건수와 위험 문구를 modal과 sticky summary에 반복 노출합니다. `primary`는 저장, `warning`은 해제/변경, `danger`는 삭제에만 사용합니다.
- Lazyweb quick reference: `role permissions admin` desktop 검색에서 Clerk, Hygraph, Roadie, Conduktor, Teachable 화면이 공통적으로 sidebar + role header + permission table/list + search/filter + checkbox/toggle 조합을 사용합니다. 이 route는 그 패턴을 기존 Admin density와 HeroUI token 안에서 적용합니다.

## 컴포넌트 재사용 / 렌더링 인벤토리

### route 조합 컴포넌트

| 컴포넌트 | 상태 | 경로 | route에서 맡길 계약 | 수정 owner | 비고 |
|----------|------|------|---------------------|------------|------|
| `RoleEditScreen` | 재사용 | `packages/fe-ui/src/screen/RoleEditScreen/RoleEditScreen.tsx` | Role 상세 page shell, `title`, `description`, `actions`, `readOnly`, `isLoading`, `notFound`, `children` 주입 | `fe-route-agent` 소비 | 별도 spec 없이 이 route spec의 화면 계약을 따릅니다. |
| `RoleForm` | 수정 | `packages/fe-ui/src/form/RoleForm/RoleForm.tsx` | Role 기본 정보 readOnly 렌더링, name/displayName/description 표시, `isSystem` switch 제거 | `fe-form-agent` 수정 가능 | 기본 정보 form 자체 구조는 유지합니다. |
| `RoleAssignmentForm` | 수정 | `packages/fe-ui/src/form/RoleAssignmentForm/RoleAssignmentForm.tsx` | Policy 후보 목록, 선택/해제, active switch, priority input, loading/empty/readOnly 표시 | `fe-form-agent` | 검색/필터/정렬/table-like density는 이 route spec 기준으로 보강합니다. |
| route page | 수정 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx` | API query/mutation, permission guard, modal open/close, baseline/current assignment state, dirty summary 계산 | `fe-route-agent` | screen/feature/form 렌더링 계약의 최종 owner입니다. |

### layout / widget / input 재사용

| 컴포넌트 | 상태 | 경로 | 사용 위치 | route 계약 | 비고 |
|----------|------|------|-----------|-------------|------|
| `Screen.Header` / `Section.Header` | 재사용 | `packages/fe-ui/src/layout/Screen/Screen.tsx`, `packages/fe-ui/src/layout/Section/Section.tsx` | 상단 title/actions, 정책 할당 section header | title, description, actions 전달 | 별도 title bar 컴포넌트 없이 각 layout slot에서 처리 |
| `Section` | 재사용 | `packages/fe-ui/src/layout/Section/Section.tsx` | Role 기본 정보, 추가 정보, 정책 할당 section | `Section.Header`, `Section.Body`, 필요 시 `Section.Footer` | page section 구조만 담당 |
| `SectionSurface` | 재사용 | `packages/fe-ui/src/surface/SectionSurface/SectionSurface.tsx` | page-level surface | 기존 screen shell surface 유지 | 중첩 card처럼 보이지 않게 section-level만 사용 |
| `Button` | 재사용 | `packages/fe-ui/src/input/Button/Button.tsx` | 목록/수정/삭제/정책 편집/취소/저장 | lucide icon을 `startContent`로 전달 | icon 없는 긴 설명 버튼 금지 |
| `AlertDialog` | 우선 재사용 | `packages/fe-ui/src/feedback/AlertDialog/AlertDialog.tsx` | Role 삭제, 정책 저장 확인 | `Heading`, `Body`, `Footer`, confirm button 조합 | 변경 summary가 복잡해도 custom widget을 만들지 않고 AlertDialog slot으로 표현 |
| `Modal` | 조건부 재사용 | `@heroui/react` | 복잡한 저장 summary modal | AlertDialog로 표현이 어려운 경우만 사용 | route-local modal state는 `useOverlayState` |
| `Chip` | 재사용 | `packages/fe-ui/src/data-display/Chip/Chip.tsx` | Role/system/status, assigned/active/dirty count | 색상 역할: primary/success/warning/default | summary와 row 상태 표시 |
| `TextField` | 재사용 | `packages/fe-ui/src/input/TextField/TextField.tsx` | 검색 입력, priority number input | 검색은 route-local state, priority는 assignment state 수정 | priority input width 고정 |
| `Checkbox` | 재사용 | `packages/fe-ui/src/input/Checkbox/Checkbox.tsx` | Policy row 선택/해제 | readOnly에서는 숨김 | row 전체 layout이 흔들리지 않게 고정 영역 유지 |
| `Switch` | 재사용 | `packages/fe-ui/src/input/Switch/Switch.tsx` | assignment active toggle | 선택된 policy row에서만 enabled | readOnly에서는 static text로 대체 가능 |
| `EmptyState` | 재사용 가능 | `packages/fe-ui/src/feedback/EmptyState/EmptyState.tsx` | empty policies, permission 안내 | 기존 empty 문구와 CTA 표현 | 단순 문구면 form 내부 empty block 허용 |

### 신규 생성 금지 / 수정 기준

| 항목 | 결정 |
|------|------|
| 신규 Screen spec | 만들지 않습니다. 화면 렌더링은 이 route/page spec이 소유합니다. |
| 신규 Feature spec | 만들지 않습니다. 정책 할당 feature 렌더링은 이 route/page spec이 소유합니다. |
| 신규 `RoleAssignmentPanel` | 만들지 않습니다. route가 section/header/dirty summary/modal을 소유하고, `RoleAssignmentForm`은 입력 leaf로 유지합니다. |
| 신규 DataGrid | 이번 scope에서는 만들지 않습니다. table-like list를 `RoleAssignmentForm` 내부 markup으로 구현합니다. 이후 공용화가 필요할 때 별도 승인합니다. |
| 기존 `RoleAssignmentForm` 수정 기준 | 검색/필터/정렬, dense row, readOnly/static row, loading/empty를 이 spec의 화면 러프에 맞춰 보강합니다. |

## 화면 렌더링

### 읽기 모드 화면

```text
+--------------------------------------------------------------------------------+
| Role 상세                                             [목록으로] [수정] [삭제] |
| 운영 관리자 Role의 상세 정보입니다.                                            |
+--------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------+
| 운영 관리자                                                [사용자 Role] [사용 중] |
| Role ID  7c0...91a     name  space-admin                                  |
| 설명     워크스페이스 운영을 관리하는 Role                                      |
| 생성일   2026-03-18     수정일 2026-07-04                                      |
+--------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------+
| 정책 할당                                      할당 4  활성 3  비활성 1          |
| 현재 Role에 연결된 Policy assignment를 관리합니다.                 [정책 편집] |
+--------------------------------------------------------------------------------+
| 검색 [ 정책명, 설명 검색                                           ]  정렬 [우선순위 v] |
| 필터 [전체] [할당됨] [미할당] [활성] [비활성] [시스템]                          |
+--------------------------------------------------------------------------------+
| 상태      Policy                         Ability   활성 상태      우선순위       |
|--------------------------------------------------------------------------------|
| 할당됨    사용자 관리                    12        활성          10             |
|           사용자를 조회하고 기본 정보를 수정합니다.               [시스템]       |
|--------------------------------------------------------------------------------|
| 할당됨    예약 운영                       8        활성           20             |
|           예약 생성, 변경, 취소를 운영합니다.                    [공간]         |
|--------------------------------------------------------------------------------|
| 미할당    운영 리포트                     5        -              -             |
|           운영 지표와 처리 상태를 확인합니다.                    [공간]         |
|--------------------------------------------------------------------------------|
| 할당됨    보안 설정                       4        비활성         90             |
|           인증 정책과 세션 정책을 관리합니다.                    [시스템]       |
+--------------------------------------------------------------------------------+
```

읽기 모드에서 `Policy` row는 선택 checkbox와 입력 control을 숨깁니다. 운영자가 현 상태를 빠르게 스캔할 수 있게 `할당 상태`, `활성 상태`, `우선순위`, `Ability 수`를 table-like list로 고정합니다.

### 편집 모드 화면

```text
+--------------------------------------------------------------------------------+
| Role 상세                                             [목록으로] [수정] [삭제] |
| 운영 관리자 Role의 상세 정보입니다.                                            |
+--------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------+
| 정책 할당                    할당 5  활성 4  비활성 1  추가 1  해제 0  수정 2   |
| 현재 Role에 연결된 Policy assignment를 관리합니다.             [취소] [저장]    |
+--------------------------------------------------------------------------------+
| 검색 [ 예약                                               ]  정렬 [우선순위 v]  |
| 필터 [전체] [할당됨] [미할당] [활성] [비활성] [시스템]                          |
+--------------------------------------------------------------------------------+
| 선택   Policy                         Ability   Active          Priority        |
|--------------------------------------------------------------------------------|
| [x]    사용자 관리                    12        (on) 활성       [10       ]     |
|        사용자를 조회하고 기본 정보를 수정합니다.                 [시스템]       |
|--------------------------------------------------------------------------------|
| [x]    예약 운영                       8        (on) 활성       [20       ]     |
|        예약 생성, 변경, 취소를 운영합니다.                      [공간]         |
|--------------------------------------------------------------------------------|
| [x]    예약 감사                       3        (on) 활성       [30       ]     |
|        예약 변경 이력을 조회합니다.                              [공간] [추가] |
|--------------------------------------------------------------------------------|
| [ ]    운영 리포트                     5        disabled         -              |
|        운영 지표와 처리 상태를 확인합니다.                      [공간]         |
+--------------------------------------------------------------------------------+
| 변경 요약: 추가 1개 | 해제 0개 | 수정 2개                         [저장 확인] |
+--------------------------------------------------------------------------------+
```

편집 모드에서 route는 baseline assignment와 current assignment를 둘 다 보존합니다. row 선택은 assignment 생성/제거를 의미하고, active switch와 priority input은 선택된 row에서만 활성화됩니다.

### 권한 없음 화면

```text
+--------------------------------------------------------------------------------+
| Role 상세                                                      [목록으로]       |
| 플랫폼 관리자 Role의 상세 정보입니다.                                           |
+--------------------------------------------------------------------------------+
```

`COMPANY_MANAGER`처럼 assignment 권한이 없는 사용자는 정책 할당 API를 호출하지 않습니다. 이 경우 route는 Role 기본 정보만 렌더링하거나 아래 안내를 표시합니다.

```text
+--------------------------------------------------------------------------------+
| 정책 할당                                                                       |
| 이 Role의 정책 할당을 볼 권한이 없습니다.                                       |
| 필요한 경우 플랫폼 관리자에게 권한을 요청하세요.                                |
+--------------------------------------------------------------------------------+
```

### 로딩 / 빈 상태 / 오류 화면

```text
loading role
+--------------------------------------------------------------------------------+
| Role 상세                                                                       |
| [title skeleton]                                                                |
+--------------------------------------------------------------------------------+
| [Role summary skeleton]                                                         |
| [Policy assignment skeleton rows]                                                |
+--------------------------------------------------------------------------------+

not found
+--------------------------------------------------------------------------------+
| Role을 찾을 수 없습니다.                                                        |
| 삭제되었거나 접근할 수 없는 Role입니다.                              [목록으로] |
+--------------------------------------------------------------------------------+

empty policies
+--------------------------------------------------------------------------------+
| 정책 할당                                                        [정책 편집]    |
| 사용 가능한 정책이 없습니다.                                                     |
| 먼저 Policy를 생성한 뒤 Role에 할당할 수 있습니다.                              |
+--------------------------------------------------------------------------------+

save error
+--------------------------------------------------------------------------------+
| 정책 할당 저장                                                                  |
| 저장하지 못했습니다. 변경 내용을 유지한 상태로 다시 시도할 수 있습니다.          |
| 원인: 이 Role의 정책 할당을 수정할 권한이 없습니다.                 [다시 시도] |
+--------------------------------------------------------------------------------+
```

### 저장 확인 modal

```text
+----------------------------------------------+
| 정책 할당 저장                               |
+----------------------------------------------+
| 다음 변경을 저장합니다.                      |
|                                              |
| 추가 1개                                     |
| 해제 0개                                     |
| 수정 2개                                     |
|                                              |
| 저장 후 RoleAssignment가 서버 기준으로 전체      |
| 동기화됩니다.                                |
+----------------------------------------------+
|                              [취소] [저장]   |
+----------------------------------------------+
```

### 삭제 modal

```text
+----------------------------------------------+
| Role 삭제                                    |
+----------------------------------------------+
| 운영 관리자 Role을 삭제하시겠습니까?         |
| 이 작업은 되돌릴 수 없습니다.                |
+----------------------------------------------+
|                              [취소] [삭제]   |
+----------------------------------------------+
```

### 상태별 렌더링

| 상태 | 화면 렌더링 | 이벤트 |
|------|-------------|--------|
| loading role | title skeleton, body loading | route param 유지 |
| role not found | "Role을 찾을 수 없습니다."와 목록 CTA | 목록으로 이동 |
| loading policies | Policy Assignment body loading | 편집 CTA disabled |
| empty policies | "사용 가능한 정책이 없습니다." | 저장 disabled |
| permission denied | Role 기본 정보만 표시, assignment section 숨김 또는 권한 안내 | assignment API 호출 금지 |
| readOnly system role | 정책 목록은 표시, 편집/삭제 CTA disabled | PUT/DELETE 호출 금지 |
| editing clean | 취소 표시, 저장 disabled | baseline 복원 가능 |
| editing dirty | 변경 summary 표시, 저장 enabled | 저장 확인 modal open |
| saving | 저장 modal button loading | 성공 시 modal close, editing false, query invalidation |
| save error | modal 또는 section error 표시 | modal 유지, 재시도 가능 |

## 상태 / 이벤트 / 데이터 계약

| 계약 | 소유 위치 | 입력 | 출력/이벤트 | 비고 |
|------|-----------|------|-------------|------|
| route param | `page.tsx` | `roleId` | API path param | UUID 검증은 route/schema에서 보강 가능 |
| role query | `page.tsx` | `roleId` | `role`, `isLoading`, `notFound` | `getRoleById` |
| policy candidate query | `page.tsx` | current auth scope | `policies` | 권한 없는 사용자는 호출하지 않습니다. |
| assignment query | `page.tsx` | `roleId` | baseline assignments | 권한 없는 사용자는 호출하지 않습니다. |
| local assignment state | `page.tsx` 또는 route-local state file | baseline assignments | current assignments, dirty counts | route가 baseline/current 원천을 보존합니다. |
| policy row rendering | `RoleAssignmentForm` leaf | policy, assignment, readOnly | toggle/select/priority event | 렌더링 계약은 이 route spec이 소유합니다. |
| save event | `page.tsx` | current assignments | `syncRoleAssignments({ roleId, data })` | 저장 전 `SyncRoleAssignmentsSchema` 검증 |
| cancel event | `page.tsx` | baseline assignments | current reset, editing false | modal close 포함 |
| delete event | `page.tsx` | roleId | `deleteRole`, 목록 이동 | 권한 없는 사용자는 CTA 숨김/disabled |

## 딜리버리

### 산출물 시뮬레이션 / 인계 계약

| 단계 id | 단계 | 담당 `agent_type` | 입력 spec/파일 | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 / `agent_type` | 인계 조건 | 검증 기준 |
|---------|------|-------------------|----------------|-------------|----------------------|---------------------------|-----------|-----------|
| SYS-IS-REMOVE-00 | route/page spec 확정 | `orch-delivery` | 사용자 승인 요청, repo 조사 결과 | `isSystem` 제거 단일 실행 계약 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.spec.md` | SYS-IS-REMOVE-01..12 / owners | 기존 시스템 보호 계약이 폐기되고 산출물 경로가 지정됨 | `rg -n "SYS-IS-REMOVE|Action.*Policy.*Role.*Subject" apps/admin/web/src/app/\\(admin\\)/roles/\\[roleId\\]/page.spec.md` |
| SYS-IS-REMOVE-01 | Prisma schema / migration / reference data | `be-prisma-builder` | 이 spec, `packages/be-prisma/schema/{action,policy,role,subject}.prisma`, `packages/be-prisma/src/reference-data/**` | 네 모델의 `isSystem` field/index/column 제거, reference data 입력 제거, Prisma client 재생성 | `packages/be-prisma/schema/action.prisma`, `packages/be-prisma/schema/policy.prisma`, `packages/be-prisma/schema/role.prisma`, `packages/be-prisma/schema/subject.prisma`, `packages/be-prisma/migrations/20260803000000_remove_acl_catalog_is_system/migration.sql`, `packages/be-prisma/src/reference-data/definitions/roles.ts`, `packages/be-prisma/src/reference-data/definitions/actions-subjects.ts`, `packages/be-prisma/src/reference-data/definitions/admin-permissions.ts`, `packages/be-prisma/src/reference-data/sync-reference-data.ts`, `packages/be-prisma/docs/schema-metadata-guide.md`, `packages/be-prisma/src/generated/client/**` | SYS-IS-REMOVE-02,03,05,08 / backend owners | `FitnessCenter` demo/bootstrap과 theme의 `isSystem`은 유지, Action/Policy/Role/Subject Prisma 타입에는 미존재 | `pnpm --filter=@cocrepo/prisma run schema:check && pnpm --filter=@cocrepo/prisma run generate` |
| SYS-IS-REMOVE-02 | Entity contract | `be-entity-builder` | SYS-IS-REMOVE-01 결과, `packages/be-entity/src/*` | `ActionEntity`, `PolicyEntity`, `RoleEntity`, `SubjectEntity`의 `isSystem` 제거 | `packages/be-entity/src/action.entity.ts`, `packages/be-entity/src/policy.entity.ts`, `packages/be-entity/src/role.entity.ts`, `packages/be-entity/src/subject.entity.ts` | SYS-IS-REMOVE-04,05 / backend owners | entity public contract에 `isSystem` 없음 | `pnpm --filter=@cocrepo/entity run type-check` |
| SYS-IS-REMOVE-03 | DTO / input / command contract | `be-dto-builder`, `be-command-builder` | SYS-IS-REMOVE-01,02 결과, `packages/be-dto/src/**`, `packages/be-input/src/command/core/**`, `packages/be-command/src/core/**` | request/response DTO와 CQRS command/query input에서 `isSystem` 제거 | `packages/be-dto/src/action.dto.ts`, `packages/be-dto/src/abilities/action-response/**`, `packages/be-dto/src/policies/{create-policy.dto.ts,update-policy.dto.ts,policy-response.dto.ts}`, `packages/be-dto/src/role.dto.ts`, `packages/be-dto/src/subject{.dto.ts,/subject.dto.ts}`, `packages/be-dto/src/create/create-role.dto.ts`, `packages/be-dto/src/dto-exclude-presets.ts`, `packages/be-input/src/command/core/{create-action.input.ts,update-action.input.ts,create-policy.input.ts,update-policy.input.ts,create-role.input.ts,update-role.input.ts}`, `packages/be-command/src/core/{create-action.command.ts,update-action.command.ts,create-policy.command.ts,update-policy.command.ts,create-role.command.ts,update-role.command.ts}` | SYS-IS-REMOVE-04,06,08 / backend owners | OpenAPI DTO와 command payload에 `isSystem` 입력/출력이 없음 | `pnpm --filter=@cocrepo/dto run type-check && pnpm --filter=@cocrepo/input run type-check && pnpm --filter=@cocrepo/command run type-check` |
| SYS-IS-REMOVE-04 | Aggregate policy migration | `be-aggregate-builder` | SYS-IS-REMOVE-02,03 결과, aggregate files | Action/Policy/Role/Subject aggregate의 `isSystem` default/guard/serialization 제거, Role assignment는 권한/scope guard만 유지 | `packages/be-aggregate/src/action/action.aggregate.ts`, `packages/be-aggregate/src/policy/policy.aggregate.ts`, `packages/be-aggregate/src/policy/role-assignment.aggregate.ts`, `packages/be-aggregate/src/role/role.aggregate.ts`, `packages/be-aggregate/src/subject/subject.aggregate.ts`, `packages/be-aggregate/__tests__/{role.aggregate.spec.ts,policy-relationship.aggregate.spec.ts}` | SYS-IS-REMOVE-06 / `be-usecase-builder` | update/delete/sync 실패 조건이 `isSystem`이 아니라 권한/scope/removedAt 기준 | `pnpm --filter=@cocrepo/aggregate run test -- --runInBand` |
| SYS-IS-REMOVE-05 | Repository mapping / query ordering | `be-repository-builder` | SYS-IS-REMOVE-01,02 결과, repository files | select/orderBy/to-domain mapper에서 `isSystem` 제거 | `packages/be-repository/src/actions.repository.ts`, `packages/be-repository/src/policies.repository.ts`, `packages/be-repository/src/roles.repository.ts`, `packages/be-repository/src/subjects.repository.ts`, `packages/be-repository/src/to-domain-entity.ts`, `packages/be-repository/__tests__/{roles.repository.spec.ts,policy-entries.repository.spec.ts,to-domain-entity.spec.ts}` | SYS-IS-REMOVE-06 / `be-usecase-builder` | DB read/write path가 삭제된 column을 참조하지 않음 | `pnpm --filter=@cocrepo/repository run type-check && pnpm --filter=@cocrepo/repository run test -- --runInBand` |
| SYS-IS-REMOVE-06 | UseCase / service behavior | `be-usecase-builder`, `be-service-builder`, `common-toolkit-builder` | SYS-IS-REMOVE-03..05 결과, usecase/service/common spec files | Action/Policy/Role mutation guard와 OIDC auth payload에서 `isSystem` 의존 제거 | `packages/be-usecase/src/core/action/{create-action.usecase.ts,update-action.usecase.ts,delete-action.usecase.ts}`, `packages/be-usecase/src/core/policy/{create-policy.usecase.ts,update-policy.usecase.ts,delete-policy.usecase.ts}`, `packages/be-usecase/src/core/role/{create-role.usecase.ts,update-role.usecase.ts,delete-role.usecase.ts,get-role-by-id.usecase.ts,get-roles.usecase.ts}`, `packages/be-usecase/src/core/subject/{get-subject-by-id.usecase.ts,get-subjects.usecase.ts}`, `packages/be-service/src/oidc/account.service.ts`, `packages/be-service/src/oidc/tenant-with-relations.type.ts`, `packages/be-service/src/oidc/types/oidc-provider.types.ts`, `packages/be-service/__tests__/account.service.spec.ts`, `packages/be-common/_spec/casl/03-interactions.md`, `packages/be-common/_spec/auth-security/oidc-auth-flow.md` | SYS-IS-REMOVE-07,08 / API owners | `isSystemRole`도 Role 파생 계약이므로 제거 | `pnpm --filter=@cocrepo/usecase run type-check && pnpm --filter=@cocrepo/service run type-check` |
| SYS-IS-REMOVE-07 | Controller / API docs | `be-controller-builder` | SYS-IS-REMOVE-03,06 결과, controller files | Swagger 설명과 mutation contract에서 시스템 보호 문구 제거 | `packages/be-controller/src/actions/actions.controller.ts`, `packages/be-controller/src/policies/policies.controller.ts`, `packages/be-controller/src/roles/roles.controller.ts`, `packages/be-controller/src/subjects/subjects.controller.ts`, `apps/core/api/src/swagger/**`, `apps/core/api/test/{actions.e2e.ts,role-system.e2e.ts}` | SYS-IS-REMOVE-08 / `fe-hook-agent` | API response/request schema에 `isSystem` 없음 | `pnpm --filter=@cocrepo/controller run type-check && pnpm --filter=core-api run type-check` |
| SYS-IS-REMOVE-08 | FE API codegen | `fe-hook-agent` | SYS-IS-REMOVE-07 결과, generated OpenAPI | `packages/fe-api` core/idp model에서 `isSystem` 제거 | `packages/fe-api/src/core/model/{actionDto.ts,actionResponseDto.ts,createActionDto.ts,updateActionDto.ts,roleDto.ts,subjectDto.ts,createPolicyDto.ts,updatePolicyDto.ts,policyResponseDto.ts}`, `packages/fe-api/src/idp/model/{actionDto.ts,actionResponseDto.ts,createActionDto.ts,updateActionDto.ts,roleDto.ts,subjectDto.ts,createPolicyDto.ts,updatePolicyDto.ts,policyResponseDto.ts}`, `packages/fe-api/src/core/actions/actions.ts` | SYS-IS-REMOVE-09,10,11 / frontend owners | generated API 타입에 삭제된 필드 없음 | `pnpm --filter=@cocrepo/api run type-check` |
| SYS-IS-REMOVE-09 | Admin route wiring / route docs / E2E | `fe-route-agent` | SYS-IS-REMOVE-08 결과, admin route files | route initial state, readOnly guard, mutation payload, legacy `_spec` docs, E2E fixture에서 `isSystem` 제거 | `apps/admin/web/src/app/(admin)/actions/{page.tsx,page.e2e.ts,new/page.tsx,[actionId]/page.tsx,[actionId]/edit/page.tsx,_spec/03-interactions.md,[actionId]/_spec/03-interactions.md,[actionId]/edit/_spec/03-interactions.md,new/_spec/03-interactions.md}`, `apps/admin/web/src/app/(admin)/policies/{page.tsx,new/page.tsx,[policyId]/page.tsx,[policyId]/edit/page.tsx}`, `apps/admin/web/src/app/(admin)/roles/{page.tsx,page.e2e.ts,new/page.tsx,[roleId]/page.tsx,[roleId]/edit/page.tsx,[roleId]/page.e2e.ts,_spec/03-interactions.md,[roleId]/edit/_spec/03-interactions.md,new/_spec/03-interactions.md}`, `apps/admin/web/src/app/(admin)/subjects/{page.tsx,page.e2e.ts,[subjectId]/page.tsx,[subjectId]/page.e2e.ts,_spec/03-interactions.md}` | SYS-IS-REMOVE-12 / final grep | UI route가 삭제된 API field를 보내거나 읽지 않음 | `pnpm --filter=admin-web run type-check` |
| SYS-IS-REMOVE-10 | Form leaf migration | `fe-form-agent` | SYS-IS-REMOVE-08,09 결과, form files | Action/Policy/Role form의 `isSystem` switch/state 제거 | `packages/fe-ui/src/form/ActionForm/ActionForm.tsx`, `packages/fe-ui/src/form/PolicyForm/PolicyForm.tsx`, `packages/fe-ui/src/form/RoleForm/RoleForm.tsx`, `packages/fe-ui/src/form/RoleAssignmentForm/RoleAssignmentForm.tsx`, 관련 `*.test.tsx`, 관련 `*.stories.tsx` | SYS-IS-REMOVE-12 / final grep | form state type과 렌더링에 `isSystem` 없음 | `pnpm --filter=@cocrepo/ui run type-check` |
| SYS-IS-REMOVE-11 | DataGrid / screen state migration | `fe-data-grid-agent`, `fe-screen-agent` | SYS-IS-REMOVE-08 결과, UI screen/grid files | 목록 column, filter, badge, stories fixture에서 `isSystem` 제거 | `packages/fe-ui/src/data-grid/columns/data-grid/adminColumns.tsx`, `packages/fe-ui/src/data-grid/columns/internal/fieldPresets.ts`, `packages/fe-ui/src/screen/{ActionListScreen,SubjectListScreen,SubjectDetailScreen,PolicyListScreen,RoleListScreen,RoleEditScreen,PolicyEditScreen,ActionEditScreen}/**` | SYS-IS-REMOVE-12 / final grep | 시스템/공간 chip, 시스템 여부 filter/column이 표시되지 않음 | `pnpm --filter=@cocrepo/ui run type-check` |
| SYS-IS-REMOVE-12 | Docs / final static cleanup | `orch-delivery` | owner 완료 보고, 이 spec | 산출물 경로와 금지 grep 결과 확인 보고 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.spec.md` | none-final | target scope의 `isSystem`/`is_system`/시스템 보호 문구가 0건, 허용 도메인은 유지 | 금지 grep 표 기준 통과 |

### 에이전트 배정 매트릭스

| 단계 id | 단계 | 담당 `agent_type` | 입력 파일 | 출력 파일 또는 생성 결과 경로 | 수정 허용 파일 | 의존 단계 | 소비 단계 | 산출물 행 id | 병렬 | 완료 조건 |
|---------|------|-------------------|-----------|-------------------------------|----------------|-----------|-----------|---------------|------|-----------|
| SYS-IS-REMOVE-00 | spec 확정 | `orch-delivery` | repo 조사 결과 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.spec.md` | route spec | none | SYS-IS-REMOVE-01..12 | SYS-IS-REMOVE-00 | false | 실행 계약 확정 |
| SYS-IS-REMOVE-01 | Prisma/schema | `be-prisma-builder` | route spec | schema/migration/generated/reference data | Prisma schema/migration/reference-data/generated/docs 경로 | SYS-IS-REMOVE-00 | SYS-IS-REMOVE-02,03,05,08 | SYS-IS-REMOVE-01 | false | schema/generate 통과 |
| SYS-IS-REMOVE-02 | Entity | `be-entity-builder` | SYS-IS-REMOVE-01 | entity contract | `packages/be-entity/src/*` | SYS-IS-REMOVE-01 | SYS-IS-REMOVE-04,05 | SYS-IS-REMOVE-02 | true | type-check 통과 |
| SYS-IS-REMOVE-03 | DTO/input/command | `be-dto-builder`, `be-command-builder` | SYS-IS-REMOVE-01 | DTO/input/command contract | DTO/input/command 경로 | SYS-IS-REMOVE-01 | SYS-IS-REMOVE-04,06,08 | SYS-IS-REMOVE-03 | true | type-check 통과 |
| SYS-IS-REMOVE-04 | Aggregate | `be-aggregate-builder` | SYS-IS-REMOVE-02,03 | aggregate/test | aggregate 경로 | SYS-IS-REMOVE-02, SYS-IS-REMOVE-03 | SYS-IS-REMOVE-06 | SYS-IS-REMOVE-04 | false | aggregate test 통과 |
| SYS-IS-REMOVE-05 | Repository | `be-repository-builder` | SYS-IS-REMOVE-01,02 | repository/test | repository 경로 | SYS-IS-REMOVE-01, SYS-IS-REMOVE-02 | SYS-IS-REMOVE-06 | SYS-IS-REMOVE-05 | true | repository test 통과 |
| SYS-IS-REMOVE-06 | UseCase/service/common docs | `be-usecase-builder`, `be-service-builder`, `common-toolkit-builder` | SYS-IS-REMOVE-03..05 | usecase/service/test/common docs | usecase/service/be-common spec 경로 | SYS-IS-REMOVE-03, SYS-IS-REMOVE-04, SYS-IS-REMOVE-05 | SYS-IS-REMOVE-07 | SYS-IS-REMOVE-06 | false | backend type-check 통과 |
| SYS-IS-REMOVE-07 | Controller/API docs | `be-controller-builder` | SYS-IS-REMOVE-03,06 | controller/swagger/e2e | controller, core-api swagger/test 경로 | SYS-IS-REMOVE-03, SYS-IS-REMOVE-06 | SYS-IS-REMOVE-08 | SYS-IS-REMOVE-07 | false | controller/core-api type-check 통과 |
| SYS-IS-REMOVE-08 | FE API codegen | `fe-hook-agent` | SYS-IS-REMOVE-07 | generated client | `packages/fe-api/src/**` | SYS-IS-REMOVE-07 | SYS-IS-REMOVE-09,10,11 | SYS-IS-REMOVE-08 | false | fe-api type-check 통과 |
| SYS-IS-REMOVE-09 | Admin routes | `fe-route-agent` | SYS-IS-REMOVE-08 | route/e2e/spec docs | admin route 경로 | SYS-IS-REMOVE-08 | SYS-IS-REMOVE-12 | SYS-IS-REMOVE-09 | true | admin-web type-check 통과 |
| SYS-IS-REMOVE-10 | Forms | `fe-form-agent` | SYS-IS-REMOVE-08 | form/test/story | form 경로 | SYS-IS-REMOVE-08 | SYS-IS-REMOVE-12 | SYS-IS-REMOVE-10 | true | ui type-check 통과 |
| SYS-IS-REMOVE-11 | Grid/screens | `fe-data-grid-agent`, `fe-screen-agent` | SYS-IS-REMOVE-08 | grid/screen/test/story | grid/screen 경로 | SYS-IS-REMOVE-08 | SYS-IS-REMOVE-12 | SYS-IS-REMOVE-11 | true | ui type-check 통과 |
| SYS-IS-REMOVE-12 | final cleanup | `orch-delivery` | owner 완료 보고 | cleanup report | route spec | SYS-IS-REMOVE-01..11 | none-final | SYS-IS-REMOVE-12 | false | 금지 grep 통과 |

### 실행 그래프

```mermaid
flowchart TD
  A["SYS-IS-REMOVE-00 orch-delivery spec"] --> B["SYS-IS-REMOVE-01 be-prisma-builder schema/migration"]
  B --> C["SYS-IS-REMOVE-02 be-entity-builder"]
  B --> D["SYS-IS-REMOVE-03 be-dto-builder + be-command-builder"]
  C --> E["SYS-IS-REMOVE-04 be-aggregate-builder"]
  D --> E
  B --> F["SYS-IS-REMOVE-05 be-repository-builder"]
  E --> G["SYS-IS-REMOVE-06 be-usecase-builder + be-service-builder"]
  D --> G
  G --> H["SYS-IS-REMOVE-07 be-controller-builder"]
  H --> I["SYS-IS-REMOVE-08 fe-hook-agent codegen"]
  I --> J["SYS-IS-REMOVE-09 fe-route-agent"]
  I --> K["SYS-IS-REMOVE-10 fe-form-agent"]
  I --> L["SYS-IS-REMOVE-11 fe-data-grid-agent + fe-screen-agent"]
  J --> M["SYS-IS-REMOVE-12 orch-delivery cleanup"]
  K --> M
  L --> M
  B --> M
  F --> G
```

### 단계 순서 표

| 순서 | 단계 id | 단계 | 직렬/병렬 | 의존 단계 | 완료 조건 |
|------|---------|------|-----------|-----------|-----------|
| 1 | SYS-IS-REMOVE-00 | route/page spec | 직렬 | none | 승인 |
| 2 | SYS-IS-REMOVE-01 | Prisma/schema/migration | 직렬 | SYS-IS-REMOVE-00 | schema/generate 통과 |
| 3 | SYS-IS-REMOVE-02, SYS-IS-REMOVE-03, SYS-IS-REMOVE-05 | entity, DTO/input/command, repository | 병렬 가능 | SYS-IS-REMOVE-01 | 각 owner type-check/test 통과 |
| 4 | SYS-IS-REMOVE-04 | aggregate | 직렬 | SYS-IS-REMOVE-02, SYS-IS-REMOVE-03 | aggregate test 통과 |
| 5 | SYS-IS-REMOVE-06 | usecase/service | 직렬 | SYS-IS-REMOVE-03, SYS-IS-REMOVE-04, SYS-IS-REMOVE-05 | backend type-check 통과 |
| 6 | SYS-IS-REMOVE-07 | controller/API docs | 직렬 | SYS-IS-REMOVE-06 | API contract 갱신 |
| 7 | SYS-IS-REMOVE-08 | FE API codegen | 직렬 | SYS-IS-REMOVE-07 | generated client 갱신 |
| 8 | SYS-IS-REMOVE-09, SYS-IS-REMOVE-10, SYS-IS-REMOVE-11 | routes, forms, grid/screens | 병렬 가능 | SYS-IS-REMOVE-08 | frontend type-check 통과 |
| 9 | SYS-IS-REMOVE-12 | final cleanup | 직렬 | SYS-IS-REMOVE-01..11 | 금지 grep 0건 |

## 테스트 인벤토리 / owner 검증

### 단위 테스트 인벤토리

| 테스트 대상 | 검증 항목 | 테스트 파일 | mock/stub | 작성 agent_type | 검증 agent_type | 통과 기준 |
|-------------|-----------|-------------|-----------|------------------|------------------|-----------|
| Prisma schema/reference data | `Action`/`Policy`/`Role`/`Subject` field 제거, 허용 도메인 유지 | `packages/be-prisma/src/reference-data/**/*.test.ts` 또는 schema convention 검증 | none | `be-prisma-builder` | `be-prisma-builder` | schema/generate 통과 |
| DTO/input/command contract | create/update/response payload에 `isSystem` 없음 | `packages/be-dto/src/__tests__/**`, `packages/be-command/**/*.spec.ts` | none | `be-dto-builder`, `be-command-builder` | `be-dto-builder`, `be-command-builder` | type-check/test 통과 |
| `RoleAssignmentAggregate` | 권한/scope guard 유지, `isSystem` guard 제거 | `packages/be-aggregate/__tests__/policy-relationship.aggregate.spec.ts` | repository mock | `be-aggregate-builder` | `be-aggregate-builder` | forbidden/pass 케이스가 `isSystem` 없이 통과 |
| Action/Policy/Role mutation usecase | update/delete가 삭제된 field를 조회하지 않음 | `packages/be-usecase/src/core/{action,policy,role}/**/*.spec.ts` | repository mock | `be-usecase-builder` | `be-usecase-builder` | `isSystem` fixture 없이 통과 |
| route dirty mapper | added/removed/updated count, baseline reset | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.test.tsx` 또는 route-local util test | policy fixture | `fe-route-agent` | `fe-route-agent` | dirty summary 계산 일치 |
| Form/Grid/Screen UI | 시스템 여부 toggle/filter/badge 제거 | `packages/fe-ui/src/form/**/*.test.tsx`, `packages/fe-ui/src/screen/**/*.test.tsx` | generated DTO fixture | `fe-form-agent`, `fe-data-grid-agent`, `fe-screen-agent` | 동일 owner | `isSystem` fixture 없이 렌더링 통과 |

### E2E 테스트 인벤토리

| 시나리오 | 검증 흐름 | 테스트 파일 | mock/stub | 작성 agent_type | 검증 agent_type | 통과 기준 |
|----------|-----------|-------------|-----------|------------------|------------------|-----------|
| Role 정책 할당 조회 | `/roles` -> 상세 -> 정책 할당 요약/목록 확인 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.e2e.ts` | existing seed | `fe-route-agent` | `fe-route-agent` | heading, summary, list visible |
| Role 정책 변경 저장 | 편집 -> policy 선택/해제 -> 저장 확인 -> PUT -> 성공 toast -> 재조회 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.e2e.ts` | policy/role seed | `fe-route-agent` | `fe-route-agent` | 변경 건수와 저장 결과 확인 |
| 시스템 여부 제거 확인 | Role/Action/Subject 목록과 상세에서 시스템 여부 column/filter/badge가 보이지 않음 | `apps/admin/web/src/app/(admin)/{roles,actions,subjects}/**/*.e2e.ts` | existing seed | `fe-route-agent` | `fe-route-agent` | 시스템 여부 UI 부재, mutation payload 부재 |
| 권한 없는 사용자 | `COMPANY_MANAGER`로 상세 접근 -> assignment API 미호출/권한 안내 | `apps/admin/web/src/app/(admin)/roles/[roleId]/page.e2e.ts` | auth fixture | `fe-route-agent` | `fe-route-agent` | 403 toast 없이 기본 정보 표시 |

### 정적 검증 / 금지 grep

| 검증 항목 | 명령 | 검증 agent_type | 통과 기준 |
|-----------|------|------------------|-----------|
| admin web typecheck | `pnpm --filter=admin-web run type-check` | `fe-route-agent` | 0 errors |
| ui typecheck | `pnpm --filter=@cocrepo/ui run type-check` | `fe-form-agent` | 0 errors |
| target `isSystem` 금지 grep | `rg -n "\\bisSystem\\b|is_system|isSystemRole|시스템 여부|시스템 Role|시스템 Action|시스템 Policy|시스템 Subject" packages/be-prisma/schema packages/be-prisma/migrations packages/be-prisma/src/reference-data packages/be-prisma/src/generated packages/be-prisma/docs packages/be-entity/src packages/be-dto/src packages/be-input/src packages/be-command/src packages/be-aggregate/src packages/be-repository/src packages/be-usecase/src packages/be-controller/src packages/be-service/src packages/be-common/_spec packages/fe-api/src packages/fe-ui/src apps/admin/web/src/app/\\(admin\\) apps/core/api/test docs --glob '!packages/be-prisma/src/demo-data/fitness-centers.ts' --glob '!packages/be-prisma/src/bootstrap/system-space.ts' --glob '!packages/fe-ui/src/design-system/provider/DesignSystemProvider.tsx' --glob '!apps/admin/web/src/app/(admin)/roles/[roleId]/page.spec.md'` | `orch-delivery` | 0건 |
| 허용 `isSystem` 보존 grep | `rg -n "\\bisSystem\\b" packages/be-prisma/src/demo-data/fitness-centers.ts packages/be-prisma/src/bootstrap/system-space.ts packages/fe-ui/src/design-system/provider/DesignSystemProvider.tsx` | `orch-delivery` | 허용 도메인 참조가 유지됨 |

### owner 검증 표

| owner agent_type | 입력 파일 | 산출물 | 재실행 조건 |
|------------------|-----------|--------|-------------|
| `orch-delivery` | 이 route/page spec | 실행 계약, final cleanup | scope/owner/path 변경 |
| `be-prisma-builder` | SYS-IS-REMOVE-01 행 | schema/migration/reference data/generated Prisma | DB field/index/migration 변경 |
| `be-entity-builder` | SYS-IS-REMOVE-02 행 | entity contract | domain entity shape 변경 |
| `be-dto-builder`, `be-command-builder` | SYS-IS-REMOVE-03 행 | DTO/input/command contract | API payload shape 변경 |
| `be-aggregate-builder` | SYS-IS-REMOVE-04 행 | aggregate behavior/test | mutation guard 변경 |
| `be-repository-builder` | SYS-IS-REMOVE-05 행 | repository mapper/query/test | Prisma selection/order 변경 |
| `be-usecase-builder`, `be-service-builder`, `common-toolkit-builder` | SYS-IS-REMOVE-06 행 | usecase/service behavior와 be-common spec 정리 | auth/session payload 변경 |
| `be-controller-builder` | SYS-IS-REMOVE-07 행 | controller/swagger/core-api tests | API docs/operation 변경 |
| `fe-hook-agent` | SYS-IS-REMOVE-08 행 | FE API generated client | OpenAPI output 변경 |
| `fe-route-agent` | SYS-IS-REMOVE-09 행 | admin route/e2e/docs | route payload/UI flow 변경 |
| `fe-form-agent` | SYS-IS-REMOVE-10 행 | form leaf/test/story | form state 변경 |
| `fe-data-grid-agent`, `fe-screen-agent` | SYS-IS-REMOVE-11 행 | grid/screen/test/story | list/detail rendering 변경 |

## 검증 / 승인 기준

- spec acceptance: `Action`/`Policy`/`Role`/`Subject`의 `isSystem` 제거 실행 계약은 이 `page.spec.md` 하나만 소유합니다.
- route acceptance: `/roles/[roleId]`는 Role aggregate root 기준으로 Role 기본 정보와 Policy assignment를 같은 화면에서 렌더링합니다.
- UI acceptance: 현재 할당 수, 활성/비활성 수, 추가/해제/수정 수, 저장 전 확인이 명확히 보입니다.
- permission acceptance: 권한 없는 사용자는 assignment API를 호출하지 않고, 시스템 Role은 mutation CTA가 disabled/hidden 됩니다.
- cleanup acceptance: 이 route/page spec 외에 같은 화면 계약을 소유하는 중복 기획 문서가 남지 않습니다.

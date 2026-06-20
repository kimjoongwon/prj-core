# 역할 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/[roleId]`

## 사용자 시나리오

1. 관리자가 역할 기본 정보를 조회합니다.
2. 기존 Ability 직접 편집 대신 정책 할당 목록을 확인합니다.
3. 정책 편집 모드에서 역할에 적용할 정책, 활성 여부, 우선순위를 조정하고 저장합니다.
4. 비시스템 역할은 수정 및 삭제 작업을 수행할 수 있습니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- API: `useGetRoleById`, `useDeleteRole`, `useGetPolicies`, `useGetRolePolicies`, `useSyncRolePolicies`
- reusable target: `packages/fe-ui/src/screen/RoleDetailScreen/RoleDetailScreen.tsx`

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 초기 렌더 | `useGetRoleById(roleId)` | 역할 기본 정보 조회 |
| 초기 렌더 | `useGetPolicies()` | 선택 가능한 정책 목록 조회 |
| 초기 렌더 | `useGetRolePolicies(roleId)` | 현재 역할 정책 할당 조회 |
| 저장 | `useSyncRolePolicies` | `{ rolePolicies: [{ policyId, isActive, priority }] }` 전체 동기화 |
| 삭제 | `useDeleteRole` | 역할 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/roles` 이동 |
| `onClickEditButton` | `/roles/[roleId]/edit` 이동 |
| `onClickEditPoliciesButton` | 현재 할당 정책을 로컬 선택 상태로 복제하고 편집 시작 |
| `onTogglePolicy` | 로컬 정책 assignment 추가/제거 |
| `onChangePolicyAssignmentActive` | 로컬 RolePolicy 활성 여부 변경 |
| `onChangePolicyAssignmentPriority` | 로컬 RolePolicy 우선순위 변경 |
| `onClickConfirmSavePoliciesButton` | `useSyncRolePolicies` 호출 |
| `onClickDeleteConfirm` | `useDeleteRole` 호출 후 `/roles` 이동 |

## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| 본문 | `RoleDetailScreen`가 `ScreenSurface > SectionSurface`로 상세 영역 구성 |
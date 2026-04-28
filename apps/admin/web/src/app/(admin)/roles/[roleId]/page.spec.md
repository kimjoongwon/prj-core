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
- reusable target: `packages/fe-ui/src/page/RoleDetailPage/RoleDetailPage.tsx`

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

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 상위 roles layout skeleton |
| 본문 | `RoleDetailPage`가 `DetailPageSurface > DetailSectionCard`로 상세 영역 구성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 역할 Ability 직접 편집을 정책 할당 편집으로 교체 | codex |
| 2026-04-28 | RolePolicy assignment payload와 active/priority 편집 계약 반영 | codex |
| 2026-04-27 | 메뉴 노출과 화면 접근이 별도 권한 정책이며 page 접근은 역할 상세에서 수동 부여하는 정책을 명시 | codex |
| 2026-04-27 | 권한 저장 성공 시 현재 로그인 사용자 권한 캐시도 무효화해 화면 접근 변경을 즉시 반영하도록 문서화 | codex |

# 이용자 상세 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/users/[userId]`

## 사용자 시나리오

1. 관리자가 이용자 기본 정보를 확인합니다.
2. 역할을 통한 정책과 별개로 사용자에게 직접 할당할 정책을 확인합니다.
3. 정책 편집 모드에서 직접 할당 정책, 활성 여부, 우선순위를 조정하고 저장합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- API: `useGetUserById`, `useGetPolicies`, `useGetUserPolicies`, `useSyncUserPolicies`
- reusable target: `packages/fe-ui/src/screen/UserDetailScreen/UserDetailScreen.tsx`

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 초기 렌더 | `useGetUserById(userId)` | 이용자 기본 정보 조회 |
| 초기 렌더 | `useGetPolicies()` | 선택 가능한 정책 목록 조회 |
| 초기 렌더 | `useGetUserPolicies(userId)` | 현재 사용자 직접 정책 할당 조회 |
| 저장 | `useSyncUserPolicies` | `{ userPolicies: [{ policyId, isActive, priority }] }` 전체 동기화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/users` 이동 |
| `onClickEditPoliciesButton` | 현재 할당 정책을 로컬 선택 상태로 복제하고 편집 시작 |
| `onTogglePolicy` | 로컬 정책 assignment 추가/제거 |
| `onChangePolicyAssignmentActive` | 로컬 UserPolicy 활성 여부 변경 |
| `onChangePolicyAssignmentPriority` | 로컬 UserPolicy 우선순위 변경 |
| `onClickSavePoliciesButton` | `useSyncUserPolicies` 호출 |

## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| 본문 | `UserDetailScreen`가 `ScreenSurface > SectionSurface`로 기본 정보와 정책 할당 영역 구성 |
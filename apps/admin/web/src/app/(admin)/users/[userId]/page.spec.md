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
- reusable target: `packages/fe-ui/src/screen/UserDetailPage/UserDetailPage.tsx`

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

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 상위 users layout skeleton |
| 본문 | `UserDetailPage`가 `DetailPageSurface > DetailSectionCard`로 기본 정보와 정책 할당 영역 구성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | placeholder 상세를 정책 직접 할당 화면으로 확장 | codex |
| 2026-04-28 | UserPolicy assignment payload와 active/priority 편집 계약 반영 | codex |
| 2026-03-22 | TODO 상태의 이용자 상세도 `detail/view` shell을 직접 소비하도록 본문/스펙을 정리 | codex |
| 2026-03-21 | 이용자 상세를 `detail/view` 재사용 타깃으로 재정의하고 route-layout 계약 형식으로 재작성 | codex |

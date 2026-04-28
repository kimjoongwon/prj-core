# 정책 수정 페이지 기획서

> 생성일: 2026-04-28
> 타입: page
> 경로: `/policies/[policyId]/edit`

## 사용자 시나리오

1. 관리자가 기존 정책 정보를 불러옵니다.
2. 기본 정보와 Ability 선택을 수정합니다.
3. 저장 후 정책 상세 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- API: `useGetPolicyById`, `useUpdatePolicy`, `useSyncPolicyAbilities`, `useGetAbilities`
- reusable target: `packages/fe-ui/src/page/PolicyEditPage/PolicyEditPage.tsx`

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/policies/[policyId]` 이동 |
| `onClickSubmitButton` | `useUpdatePolicy` 호출 후 `useSyncPolicyAbilities`로 Ability 전체 동기화 |
| `onToggleAbility` | 로컬 `abilityIds` 선택 상태 변경 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 정책 수정 route page 스캐폴딩 추가 | codex |
| 2026-04-28 | 기본 정보 수정과 Ability 동기화를 실제 API 계약 기준으로 분리 | codex |

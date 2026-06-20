# 정책 등록 페이지 기획서

> 생성일: 2026-04-28
> 타입: page
> 경로: `/policies/new`

## 사용자 시나리오

1. 관리자가 정책 이름, 표시명, 설명, 시스템 정책 여부를 입력합니다.
2. 정책에 포함할 Ability를 선택합니다.
3. 등록 후 생성된 정책 상세 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- API: `useCreatePolicy`, `useSyncPolicyAbilities`, `useGetAbilities`
- reusable target: `packages/fe-ui/src/screen/PolicyCreateScreen/PolicyCreateScreen.tsx`

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/policies` 이동 |
| `onClickSubmitButton` | `useCreatePolicy` 호출 후 선택 Ability가 있으면 `useSyncPolicyAbilities` 호출 |
| `onToggleAbility` | 로컬 `abilityIds` 선택 상태 변경 |
# 정책 상세 페이지 기획서

> 생성일: 2026-04-28
> 타입: page
> 경로: `/policies/[policyId]`

## 사용자 시나리오

1. 관리자가 정책 기본 정보와 연결 Ability를 확인합니다.
2. Ability 편집 모드에서 정책에 포함할 Ability를 조정합니다.
3. 정책 수정 또는 삭제 작업으로 이동합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- API: `useGetPolicyById`, `useDeletePolicy`, `useSyncPolicyAbilities`, `useGetAbilities`
- reusable target: `packages/fe-ui/src/screen/PolicyDetailScreen/PolicyDetailScreen.tsx`

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/policies` 이동 |
| `onClickEditButton` | `/policies/[policyId]/edit` 이동 |
| `onClickDeleteConfirm` | `useDeletePolicy` 호출 |
| `onClickSaveAbilitiesButton` | `useSyncPolicyAbilities` 호출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 정책 상세 route page 스캐폴딩 추가 | codex |
| 2026-04-28 | 실제 PolicyAbility 응답에서 Ability ID를 매핑하도록 정리 | codex |

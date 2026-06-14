# 정책 목록 페이지 기획서

> 생성일: 2026-04-28
> 타입: page
> 경로: `/policies`

## 사용자 시나리오

1. 관리자가 정책 기반 인가 정책 목록을 확인합니다.
2. 정책별 시스템 여부, 연결 Ability 수, 생성일을 스캔합니다.
3. 정책 상세, 수정, 삭제, 등록 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- API: `useGetPolicies`, `useDeletePolicy`
- reusable target: `packages/fe-ui/src/screen/PolicyListScreen/PolicyListScreen.tsx`

## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| 본문 | `PolicyListScreen` 내부 `SectionSurface`로 목록 테이블을 감쌈 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | `/policies/new` 이동 |
| `onClickPolicyRow` | `/policies/[policyId]` 이동 |
| `onClickEditPolicyButton` | `/policies/[policyId]/edit` 이동 |
| `onClickDeletePolicyButton` | `useDeletePolicy` 호출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure screen에 직접 주입하도록 정리 | codex |
| 2026-04-28 | 정책 기반 인가 목록 route page 스캐폴딩 추가 | codex |
| 2026-04-28 | 생성된 Orval Policy API와 실제 Policy 필드 기준으로 정리 | codex |

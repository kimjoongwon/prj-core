# PolicyListPage 기획서

> 생성일: 2026-04-28
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `policies` | 정책 행 목록 |
| `totalCount` | 전체 정책 수 |
| `isLoading` | 목록 로딩 상태 |
| `onClickCreateButton` | 등록 이동 이벤트 |
| `onClickPolicyRow` | 상세 이동 이벤트 |
| `onClickEditPolicyButton` | 수정 이동 이벤트 |
| `onClickDeletePolicyButton` | 삭제 요청 이벤트 |

## 시각 Composition

- `PageTitleBar`로 페이지 타이틀과 등록 버튼을 표시합니다.
- `Surface` 안에 HeroUI `Table`을 배치합니다.
- 정책 유형(시스템/공간), Ability 수, 생성일을 목록 컬럼으로 표시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 목록 row 계약을 Orval DTO optional props 기준으로 정리 | codex |
| 2026-04-28 | 정책 목록 pure screen 컴포넌트 추가 | codex |
| 2026-04-28 | Policy 전역 effect/active/priority 표시를 제거하고 시스템 여부 중심으로 조정 | codex |

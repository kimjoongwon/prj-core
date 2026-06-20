# TenantAccessRequestMyListScreen 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: fe-ui-screen
> 위치: `packages/fe-ui/src/screen/TenantAccessRequestMyListScreen/TenantAccessRequestMyListScreen.tsx`

## 화면 목적

신청자가 본인의 Space/Role 접근 신청 목록과 처리 상태를 확인하고, `PENDING` 신청을 취소할 수 있게 한다.

## Props 계약

| prop | 설명 |
|------|------|
| `requests` | `TenantAccessRequestDto[]` optional. Space명/Role명/상태/신청일은 DTO에서 파생 |
| `totalCount` | 목록 총 건수 |
| `isLoading` | 목록 loading skeleton 표시 여부 |
| `cancelingRequestId` | 취소 mutation 진행 중인 신청 ID |
| `onClickNewRequestButton` | 신규 신청 화면 이동 이벤트 |
| `onClickCancelRequestButton` | PENDING 신청 취소 이벤트 |

## 화면 구성

| 영역 | owner | 설명 |
|------|-------|------|
| 제목/액션 | `PageTitleBar` | 접근 신청 제목과 신청하기 버튼 |
| 목록 SectionSurface | `ScreenSurface + screen SectionSurface` | HeroUI Table로 신청 목록 표시 |
| 상태 표시 | `TenantAccessRequestStatusBadge` | PENDING/APPROVED/REJECTED/CANCELED badge |
| 신청 요약 | `TenantAccessRequestSummary` | Space와 Role을 한 줄 요약 |

## UX 상태

| 상태 | 처리 |
|------|------|
| loading | `Skeleton`으로 목록 영역을 유지 |
| empty | Table `emptyContent`로 신청 내역 없음 표시 |
| disabled | PENDING이 아닌 row는 취소 버튼 비활성화 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| TARP-MY-001 | 신청 목록이 있음 | 화면 진입 | Space/Role/상태/신청일이 보임 |
| TARP-MY-002 | PENDING 신청이 있음 | 취소 버튼 클릭 | `onClickCancelRequestButton`에 신청 ID 전달 |
| TARP-MY-003 | 처리 완료 신청이 있음 | 목록 렌더링 | 취소 버튼이 비활성화됨 |
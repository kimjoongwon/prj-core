# TenantAccessRequestReviewDetailScreen 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: fe-ui-screen
> 위치: `packages/fe-ui/src/screen/TenantAccessRequestReviewDetailScreen/TenantAccessRequestReviewDetailScreen.tsx`

## 화면 목적

승인자가 신청 상세와 신청 사유를 확인한 뒤 코멘트를 남기고 승인 또는 반려한다.

## Props 계약

| prop | 설명 |
|------|------|
| `request` | 신청 상세 데이터 |
| `reviewComment` | 승인/반려 코멘트 입력값 |
| `isLoading` | 상세 loading 상태 |
| `isApproving` | 승인 mutation 상태 |
| `isRejecting` | 반려 mutation 상태 |
| `canApprove` | UI 승인 버튼 활성화 조건 |
| `onClickBackButton` | 목록 이동 |
| `onChangeReviewCommentTextArea` | 코멘트 변경 |
| `onClickApproveButton` | 승인 요청 |
| `onClickRejectButton` | 반려 요청 |

## 화면 구성

| 영역 | owner | 설명 |
|------|-------|------|
| 제목/뒤로가기 | `PageTitleBar` | 접근 신청 상세 제목과 목록 버튼 |
| 신청 요약 | `ScreenSurface + screen SectionSurface` | Space/Role/신청자/상태/신청 사유 |
| 검토 입력 | `ScreenSurface + screen SectionSurface` | 코멘트 textarea와 승인/반려 버튼 |

## UX 상태

| 상태 | 처리 |
|------|------|
| loading | 상세 전체 skeleton |
| non-PENDING | textarea 및 승인/반려 버튼 비활성화, 처리자/코멘트 표시 |
| canApprove=false | 승인 버튼 비활성화 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| TARP-REVIEW-DETAIL-001 | PENDING 신청 | 화면 진입 | 승인/반려 버튼이 보임 |
| TARP-REVIEW-DETAIL-002 | 코멘트 입력 | 승인 클릭 | `onClickApproveButton` 호출 |
| TARP-REVIEW-DETAIL-003 | 처리 완료 신청 | 화면 진입 | 검토 액션이 비활성화됨 |
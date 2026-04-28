# Admin 테넌트 접근 승인 상세 페이지 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: next-route-page
> 경로: `/tenant-access-requests/[tenantAccessRequestId]`
> 위치: `apps/admin/web/src/app/(admin)/tenant-access-requests/[tenantAccessRequestId]/page.tsx`

## 화면 목적

승인자가 접근 신청 상세를 확인하고 코멘트와 함께 승인 또는 반려한다.

## Route / Page Mapping

| 항목 | 값 |
|------|----|
| route path | `/tenant-access-requests/[tenantAccessRequestId]` |
| route page | `apps/admin/web/src/app/(admin)/tenant-access-requests/[tenantAccessRequestId]/page.tsx` |
| pure page component | `TenantAccessRequestReviewDetailPage` |
| route param | `tenantAccessRequestId` |
| route meta | `route.meta.ts` |

## 데이터 / API

| 시점 | API | 전달 대상 |
|------|-----|-----------|
| 진입 | `useGetTenantAccessRequest(tenantAccessRequestId)` | 신청 상세 |
| 승인 | `useApproveTenantAccessRequest` | 성공 시 상세/목록 query invalidate |
| 반려 | `useRejectTenantAccessRequest` | 성공 시 상세/목록 query invalidate |

## 이벤트

| 이벤트 | 핸들러 | 결과 |
|--------|--------|------|
| 목록 클릭 | `onClickBackButton` | 승인 목록으로 이동 |
| 코멘트 입력 | `onChangeReviewCommentTextarea` | route-local 상태 갱신 |
| 승인 클릭 | `onClickApproveButton` | approve mutation 실행 |
| 반려 클릭 | `onClickRejectButton` | reject mutation 실행 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| ADMIN-TARP-DETAIL-001 | 처리 가능한 신청 | 화면 진입 | 신청자/Space/Role/사유 표시 |
| ADMIN-TARP-DETAIL-002 | PENDING 신청 | 승인 클릭 | approve API 호출 |
| ADMIN-TARP-DETAIL-003 | PENDING 신청 | 반려 클릭 | reject API 호출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 초기 생성 | Codex |

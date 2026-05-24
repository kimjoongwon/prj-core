# Admin 테넌트 접근 승인 목록 페이지 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: next-route-page
> 경로: `/tenant-access-requests`
> 위치: `apps/admin/web/src/app/(admin)/tenant-access-requests/page.tsx`

## 화면 목적

`FULL_ACCESS` 또는 Space `MANAGE` 승인자가 처리 가능한 접근 신청 목록을 확인하고 상세 검토 화면으로 이동한다.

## Route / Screen Mapping

| 항목 | 값 |
|------|----|
| route path | `/tenant-access-requests` |
| route page | `apps/admin/web/src/app/(admin)/tenant-access-requests/page.tsx` |
| pure screen component | `TenantAccessRequestReviewListPage` |
| route meta | `route.meta.ts` |
| SSR/prefetch 예외 | 없음 |

## 데이터 / API

| 시점 | API | 전달 대상 |
|------|-----|-----------|
| 진입 | `useGetTenantAccessRequests({ take: 20, skip: 0 })` | DTO `data`를 검토 목록 `requests`에 직접 전달 |
| 진입 | `useGetTenantAccessRequests({ status: "PENDING", take: 1 })` | pendingCount |

## 이벤트

| 이벤트 | 핸들러 | 결과 |
|--------|--------|------|
| 보기 클릭 | `onClickRequestRow` | `/tenant-access-requests/[tenantAccessRequestId]` 이동 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| ADMIN-TARP-LIST-001 | 승인자 로그인 | 화면 진입 | 접근 승인 제목과 검토 목록 표시 |
| ADMIN-TARP-LIST-002 | 목록 row 있음 | 보기 클릭 | 상세 경로로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 초기 생성 | Codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure screen에 직접 주입하도록 정리 | codex |

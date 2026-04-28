# IDP 테넌트 접근 신청 목록 페이지 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: next-route-page
> 경로: `/tenant-access-requests`
> 위치: `apps/idp/web/src/app/tenant-access-requests/page.tsx`

## 화면 목적

로그인 사용자가 본인의 접근 신청 이력을 확인하고 새 신청 또는 PENDING 신청 취소를 수행한다.

## Route / Page Mapping

| 항목 | 값 |
|------|----|
| route path | `/tenant-access-requests` |
| route page | `apps/idp/web/src/app/tenant-access-requests/page.tsx` |
| pure page component | `TenantAccessRequestMyListPage` |
| page role | CSR container |
| SSR/prefetch 예외 | 없음 |

## 데이터 / API

| 시점 | API | 전달 대상 |
|------|-----|-----------|
| 진입 | `useGetMyTenantAccessRequests({ take: 20, skip: 0 })` | DTO `data`를 `requests`에 직접 전달, `meta.total`을 `totalCount`로 전달 |
| 취소 | `useCancelTenantAccessRequest` | 성공 시 내 신청 목록 query invalidate |

## 이벤트

| 이벤트 | 핸들러 | 결과 |
|--------|--------|------|
| 신청하기 클릭 | `onClickNewRequestButton` | `/tenant-access-requests/new` 이동 |
| 취소 클릭 | `onClickCancelRequestButton` | 취소 mutation 실행 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| IDP-TARP-LIST-001 | 로그인 상태 | 화면 진입 | 접근 신청 제목과 신청하기 버튼 표시 |
| IDP-TARP-LIST-002 | PENDING 신청 존재 | 취소 클릭 | 취소 API 호출 후 목록 갱신 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 초기 생성 | Codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure page에 직접 주입하도록 정리 | codex |

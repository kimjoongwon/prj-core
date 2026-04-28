# IDP 테넌트 접근 신청 생성 페이지 기획서

> 생성일: 2026-04-28
> 수정일: 2026-04-28
> 타입: next-route-page
> 경로: `/tenant-access-requests/new`
> 위치: `apps/idp/web/src/app/tenant-access-requests/new/page.tsx`

## 화면 목적

로그인 사용자가 Space와 희망 Role을 선택해 접근 신청을 생성한다.

## Route / Page Mapping

| 항목 | 값 |
|------|----|
| route path | `/tenant-access-requests/new` |
| route page | `apps/idp/web/src/app/tenant-access-requests/new/page.tsx` |
| pure page component | `TenantAccessRequestCreatePage` |
| page role | CSR form container |
| SSR/prefetch 예외 | 없음 |

## 데이터 / API

| 시점 | API | 전달 대상 |
|------|-----|-----------|
| 진입 | `useGetCreateTenantAccessRequestForm` | defaultObject/options |
| 제출 | `useCreateTenantAccessRequest` | 성공 시 목록 invalidate 후 `/tenant-access-requests` 이동 |

## 상태와 이벤트

| 항목 | 설명 |
|------|------|
| `formState` | `useLocalObservable` route-local form 상태 |
| `onChangeSpaceSelection` | 선택 Space ID 갱신 |
| `onChangeRoleSelection` | 선택 Role ID 갱신 |
| `onChangeReasonTextarea` | 신청 사유 갱신 |
| `onClickSubmitButton` | create mutation 실행 |

## 테스트 관점

| ID | Given | When | Then |
|----|-------|------|------|
| IDP-TARP-CREATE-001 | bootstrap 성공 | 화면 진입 | Space/Role 선택지가 표시됨 |
| IDP-TARP-CREATE-002 | 필수값 입력 | 제출 클릭 | 생성 API 호출 후 목록으로 이동 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 초기 생성 | Codex |

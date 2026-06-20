# 문의 관리 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/inquiries`

## 사용자 시나리오

1. 관리자가 문의 목록과 통계를 확인합니다.
2. 상태 필터와 검색으로 문의를 좁혀봅니다.
3. 목록에서 상세로 이동하거나 새 문의 접수 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/InquiryListScreen/InquiryListScreen.tsx`
- route는 `useGetInquiries`, `useGetInquiryStats`, `nuqs` query state, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetInquiries({ take, skip, search, inquiryStatus })` | admin layout의 Space bootstrap/access gate 아래에서 문의 목록 조회. Space 전환은 hard reload로 query cache를 초기화 |
| 클라이언트 렌더 | `useGetInquiryStats()` | admin layout의 Space bootstrap/access gate 아래에서 문의 통계 조회. Space 전환은 hard reload로 query cache를 초기화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickNewInquiry` | route가 신규 문의 화면으로 이동 |
| `onClickInquiryRow` | route가 문의 상세 화면으로 이동 |
| `onClickStatusFilter` | route가 `setQueryStates({ inquiryStatus, skip: 0 })`를 처리 |
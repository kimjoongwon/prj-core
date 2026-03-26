# 문의 관리 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/inquiries`

## 사용자 시나리오

1. 관리자가 문의 현황 카드에서 신규/진행중/SLA 위반 상태를 빠르게 파악합니다.
2. 목록에서 검색과 상태 필터를 적용하고, 문의 상세로 이동합니다.
3. "문의 접수" 버튼으로 새 문의 접수 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/inquiries/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/inquiries/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, `Surface` 안의 현황 카드/문의 목록 grid만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 stats/grid 콘텐츠 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 문의 접수 버튼 | 문의 관리 진입점 |
| 현황 카드 | `Surface` + `InquiryStatsCards` | 신규/진행중/해결/SLA 위반 요약 |
| 목록 영역 | `Surface` + `MetaDataGrid` | 문의 상태, 채널, 담당자, SLA 등 표시 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetInquiriesSuspense({ take, skip, search, inquiryStatus })` | 문의 목록 조회 |
| 클라이언트 렌더 | `useGetInquiryStatsSuspense()` | 통계 카드 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickNewInquiry` | `/inquiries/new` 이동 |
| `onClickInquiryRow` | `/inquiries/[inquiryId]` 이동 |
| `onClickStatusFilter` | inquiryStatus URL 상태 갱신 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | stats/grid wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 문의 관리를 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 문의 관리 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |

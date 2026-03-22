# 이용자 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/users/layout.tsx`

## Server Skeleton

- 상위 `apps/admin/web/src/app/(admin)/layout.tsx`가 Admin 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton만 소유합니다.
- 제목, 요약 카드, 검색 입력, grid 콘텐츠는 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | Admin 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/users/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 이용자 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/users/page.tsx` | `PageTitleBar`, stats cards, directory header, `MetaDataGrid` | 이용자 목록 콘텐츠 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | `Surface` | stats/grid 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/users/page.tsx` | 이용자 목록 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/users` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- stats와 목록은 하나의 page lifecycle을 공유합니다.
- detail/aside/modal을 독립 전환할 요구가 없어 parallel routes를 도입하지 않습니다.

## Child Content Contract

- `page.tsx`는 `children` 콘텐츠만 구현합니다.
- `page.tsx`는 route-level skeleton primitive를 import하지 않습니다.
- `page.tsx`는 page-local `PageTitleBar`, stats cards, directory/grid 콘텐츠만 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | users page 콘텐츠 wrapper 기준을 raw container에서 범용 `Surface`로 정정 | codex |
| 2026-03-21 | 이용자 route layout을 generic server skeleton 계약으로 재정의 | codex |

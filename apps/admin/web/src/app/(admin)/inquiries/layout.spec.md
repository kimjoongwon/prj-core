# 문의 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/inquiries/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton을 조립합니다.
- 문의 현황 카드, 문의 목록 grid, 액션 버튼은 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/inquiries/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 문의 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/inquiries/page.tsx` | `PageTitleBar`, `InquiryStatsCards`, `MetaDataGrid` | 문의 관리 콘텐츠와 상호작용 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | raw bordered container | 현황 카드/목록 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/inquiries/page.tsx` | 문의 관리 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/inquiries` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 현황 카드와 문의 목록은 하나의 page lifecycle을 공유합니다.
- route-level parallel slot 분리는 사용하지 않습니다.

## Child Content Contract

- `page.tsx`는 `children` 콘텐츠만 구현합니다.
- `page.tsx`는 CSR query state, 통계/목록 조회, row navigation, 상태 필터 액션만 담당합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | 문의 route의 서버 skeleton 계약 신규 정의 | codex |

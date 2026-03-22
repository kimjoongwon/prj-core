# 루틴 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/routines/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton을 구성합니다.
- 제목, 등록 버튼, grid, 삭제 모달은 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/routines/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 루틴 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/routines/page.tsx` | `PageTitleBar`, `MetaDataGrid`, modal | 루틴 목록 콘텐츠 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | `Surface` | grid 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/routines/page.tsx` | 루틴 목록 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/routines` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 목록과 삭제 모달은 page-local state로 해결하고 parallel routes를 사용하지 않습니다.

## Child Content Contract

- `page.tsx`는 query state, CSR 목록 조회, 삭제 모달, 등록 이동만 담당합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | routines page 콘텐츠 wrapper 기준을 raw container에서 범용 `Surface`로 정정 | codex |
| 2026-03-21 | 루틴 route의 서버 skeleton 계약 신규 정의 | codex |

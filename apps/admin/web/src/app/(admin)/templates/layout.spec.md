# 메시지 템플릿 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/templates/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton만 소유합니다.
- 제목, 등록 버튼, grid, 상태 토글은 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/templates/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 템플릿 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/templates/page.tsx` | `PageTitleBar`, `MetaDataGrid`, status toggle | 템플릿 목록 콘텐츠 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | `Surface` | grid 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/templates/page.tsx` | 템플릿 목록 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/templates` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 목록 route로만 동작하며 parallel routes를 사용하지 않습니다.

## Child Content Contract

- `page.tsx`는 CSR 목록 조회, URL 상태, 템플릿 활성 토글만 담당합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | templates page 콘텐츠 wrapper 기준을 raw container에서 범용 `Surface`로 정정 | codex |
| 2026-03-21 | 메시지 템플릿 route의 서버 skeleton 계약 신규 정의 | codex |

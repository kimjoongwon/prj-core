# Action route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/actions/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 앱 셸을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton만 조립합니다.
- 제목, 설명, 등록 버튼, grid 콘텐츠는 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/actions/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | route 본문 skeleton |
| page content | `apps/admin/web/src/app/(admin)/actions/page.tsx` | `PageTitleBar`, `MetaDataGrid` | Action 목록 콘텐츠와 상호작용 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | 본문 배경/표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | raw bordered container | grid 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/actions/page.tsx` | Action 목록 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/actions` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 목록 하나만 가진 route라 병렬 영역 분리가 필요하지 않습니다.

## Child Content Contract

- `page.tsx`는 `children` 콘텐츠만 구현합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.
- page는 `PageTitleBar`, `MetaDataGrid`, URL 상태, CSR 조회만 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | Action route의 서버 skeleton 계약 신규 정의 | codex |

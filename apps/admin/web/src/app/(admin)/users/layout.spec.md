# 이용자 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/users/layout.tsx`

## Server Skeleton

- 상위 `apps/admin/web/src/app/(admin)/layout.tsx`는 Admin 앱 전역 `Layout` 셸(헤더, 사이드바, 모바일 네비게이션)을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page` 단위 skeleton을 소유합니다.
- `Page top`에는 `Section` 내부 `Surface` 위에 `PageTitleBar`를 배치해 이용자 목록의 제목/설명 영역을 구성합니다.
- `Page` 본문은 `PageSurface -> Section -> SectionSurface` 순서로 조립하고, `children` 콘텐츠는 최종 `SectionSurface` 내부에 마운트합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| 앱 셸 | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | Admin 공통 헤더/사이드바/모바일 네비게이션 |
| route top | `apps/admin/web/src/app/(admin)/users/layout.tsx` | `Page` + `Section` + `Surface` + `PageTitleBar` | route 제목/설명과 상단 배치 |
| route body | `apps/admin/web/src/app/(admin)/users/layout.tsx` | `PageSurface` + `Section` + `SectionSurface` | 이용자 목록 route의 본문 표면과 children 마운트 위치 |
| page content | `apps/admin/web/src/app/(admin)/users/page.tsx` | stats grid, directory header, `MetaDataGrid` | `children` slot 안의 콘텐츠와 상호작용 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route top | `layout.tsx` | `Surface` | `PageTitleBar`가 올라가는 상단 표면 |
| page body | `layout.tsx` | `PageSurface` | 이용자 목록 route 전체 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | `children` 콘텐츠가 올라가는 내부 섹션 표면 |
| content blocks | `page.tsx` | raw container / widget surface | stats 카드, grid 본문 등 콘텐츠 수준 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/users/page.tsx` | 이용자 목록의 기본 콘텐츠 |

- named slot(`@detail`, `@aside`, `@modal`)은 사용하지 않습니다.

## Slot URL Mapping

| Slot key | URL | 비고 |
|----------|-----|------|
| `children` | `/users` | route의 기본 진입점 |

- slot 이름이 URL을 추가로 분기하지 않습니다.

## Slot Fallbacks

- named slot이 없으므로 `@slot/default.tsx` fallback 파일은 필요하지 않습니다.
- hard reload 시에도 `/users`는 `children` 콘텐츠만 다시 마운트합니다.

## Independent Navigation Policy

- 이용자 목록 route는 stats 영역과 목록 영역이 하나의 콘텐츠 수명주기를 공유합니다.
- 목록을 유지한 채 detail/aside/modal만 독립 전환하는 요구가 없어 parallel routes를 도입하지 않습니다.
- 추후 `/users/[userId]` inspector, deep-link modal 같은 독립 영역이 생기면 그때 named slot 도입을 검토합니다.

## Child Content Contract

- `page.tsx`는 `children` slot 콘텐츠만 구현합니다.
- `page.tsx`는 `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`, `PageTitleBar`를 직접 import/조립하지 않습니다.
- `page.tsx`는 CSR 콘텐츠 파일로 `useGetUsers`, `useMetaDataGridQueryStates`, `useQueryState("search")`를 사용해 통계/목록/검색 상호작용만 담당합니다.
- 승인 없는 `_client.tsx`, `_prefetch.ts`, SSR prefetch 패턴은 허용하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | route-level skeleton ownership 규칙에 맞춰 `users/layout.tsx` 계약을 server `Page/PageSurface/Section/Surface` 구조로 재정의 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |

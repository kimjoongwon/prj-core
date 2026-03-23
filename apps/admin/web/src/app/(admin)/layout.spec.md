# 루트 layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 위치: apps/admin/web/src/app/(admin)/layout.tsx

## Server Skeleton

- 상위 shell은 `apps/admin/web/src/app/layout.spec.md`가 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 동작하며 `Layout` skeleton을 소유합니다.
- `Layout`은 `desktopVariant="stacked-header"`를 사용해 전폭 header + 하단 sidebar/main 구조를 shared shell로 조립합니다.
- 헤더, 사이드바, 모바일 오버레이/FAB/하단 내비게이션 바인딩은 route-local client slot 컴포넌트가 담당합니다.
- 데스크톱 사이드바는 shared `SidePanel`을 사용하며 2depth 메뉴가 현재 선택 상태를 기준으로 노출되어야 합니다.
- route-level 데이터 fetch나 페이지 이벤트 바인딩은 `layout.tsx`가 직접 수행하지 않습니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| route layout | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` + client slot props | 서버 skeleton 조립과 child mount |
| child content | child `page.tsx` / slot page | 콘텐츠 전용 컴포넌트 | layout이 제공한 slot 안에서 실제 화면 콘텐츠 구현 |

- `apps/admin/web/src/app/(admin)/abilities/page.spec.md`
- `apps/admin/web/src/app/(admin)/actions/page.spec.md`
- `apps/admin/web/src/app/(admin)/assets/page.spec.md`
- `apps/admin/web/src/app/(admin)/dashboard/page.spec.md`
- `apps/admin/web/src/app/(admin)/inquiries/page.spec.md`
- `apps/admin/web/src/app/(admin)/roles/page.spec.md`
- `apps/admin/web/src/app/(admin)/routines/page.spec.md`
- `apps/admin/web/src/app/(admin)/spaces/page.spec.md`
- `apps/admin/web/src/app/(admin)/subjects/page.spec.md`
- `apps/admin/web/src/app/(admin)/tasks/page.spec.md`
- `apps/admin/web/src/app/(admin)/templates/page.spec.md`
- `apps/admin/web/src/app/(admin)/timelines/page.spec.md`
- `apps/admin/web/src/app/(admin)/users/page.spec.md`

## Surface Ownership

| 레벨 | Owner | 구성 | 역할 |
|------|-------|------|------|
| route skeleton | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | route 단위 배치와 표면 소유 |
| shell bindings | `apps/admin/web/src/app/(admin)/_layout/*` | client slot 컴포넌트 | 네비게이션, Space, logout, 모바일 shell 상호작용 |
| child content | child `page.tsx` | route skeleton 내부 콘텐츠 | 데이터 조회, 입력, 목록, 상세 상호작용 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | child route `page.tsx` | `(admin)` route group 하위 페이지 콘텐츠 mount |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/dashboard`, `/users`, `/abilities` 등 `(admin)` 하위 route URL |

## Slot Fallbacks

- named slot이 없어 `default.tsx` fallback은 필요하지 않습니다.

## Independent Navigation Policy

- `children` 단일 slot 구조이며 independent navigation이 필요한 병렬 영역은 없습니다.

## Child Content Contract

- child `page.tsx`와 `@slot/**/page.tsx`는 자신이 채우는 slot 콘텐츠만 구현합니다.
- child 페이지는 `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`를 다시 조립하지 않습니다.
- child 페이지 계약은 각 `page.spec.md`의 `Consumed Layout Contract`와 `Rendering Decision`을 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `fe-ui` shared console shell을 사용하도록 전환하고 stacked-header + 2depth sidebar 계약을 명시 | codex |
| 2026-03-21 | direct client layout을 서버 `Layout` skeleton + client slot 컴포넌트 구조로 전환 | codex |
| 2026-03-21 | pathless route group의 `children` mount 설명과 URL 매핑을 실제 구조에 맞게 보정 | codex |
| 2026-03-21 | fe-route-layout-builder 계약에 맞춰 layout skeleton/slot 계약을 재정의 | codex |

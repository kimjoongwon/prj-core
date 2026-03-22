# 루트 layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 위치: apps/idp/web/src/app/(console)/layout.tsx

## Server Skeleton

- 상위 shell은 `apps/idp/web/src/app/layout.spec.md`가 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 동작하며 route 전용 HTML/container skeleton을 소유합니다.
- route shell은 `Layout` primitive를 재사용하지 않고 `header/sidebar/main` 구조를 직접 조립하며, 인터랙티브 slot은 `_layout/Console*Slot.tsx`가 담당합니다.
- route-level 데이터 fetch나 페이지 이벤트 바인딩은 `layout.tsx`가 직접 수행하지 않습니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| route layout | `apps/idp/web/src/app/(console)/layout.tsx` | `header/sidebar/main` shell + mobile slot mount | route skeleton 조립과 child mount |
| child content | child `page.tsx` / slot page | 콘텐츠 전용 컴포넌트 | layout이 제공한 slot 안에서 실제 화면 콘텐츠 구현 |

- `apps/idp/web/src/app/(console)/accounts/page.spec.md`
- `apps/idp/web/src/app/(console)/auth-audit-logs/page.spec.md`
- `apps/idp/web/src/app/(console)/dashboard/page.spec.md`
- `apps/idp/web/src/app/(console)/oidc-clients/page.spec.md`
- `apps/idp/web/src/app/(console)/oidc-sessions/page.spec.md`
- `apps/idp/web/src/app/(console)/security-policy/page.spec.md`

## Surface Ownership

| 레벨 | Owner | 구성 | 역할 |
|------|-------|------|------|
| route skeleton | `apps/idp/web/src/app/(console)/layout.tsx` | route 전용 HTML/container | route 단위 배치와 표면 소유 |
| child content | child `page.tsx` | route skeleton 내부 콘텐츠 | 데이터 조회, 입력, 목록, 상세 상호작용 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | child route `page.tsx` | `(console)` route group 하위 콘솔 페이지 콘텐츠 mount |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/dashboard`, `/accounts`, `/oidc-clients` 등 콘솔 route URL |

## Slot Fallbacks

- named slot이 없어 `default.tsx` fallback은 필요하지 않습니다.

## Independent Navigation Policy

- `children` 단일 slot 구조이며 independent navigation이 필요한 병렬 영역은 없습니다.

## Child Content Contract

- child `page.tsx`와 `@slot/**/page.tsx`는 자신이 채우는 slot 콘텐츠만 구현합니다.
- child 페이지는 route-level `Page`, `PageSurface`, `Section`, `SectionSurface`를 직접 다시 조립하지 않습니다.
- content-level visual grouping은 `Surface`, `feature/detail/view`, `widget/form` 같은 재사용 타깃을 우선 사용합니다.
- child 페이지 계약은 각 `page.spec.md`의 `Consumed Layout Contract`와 `Rendering Decision`을 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | `Layout` primitive를 제거하고 `(console)` shell을 route markup + `_layout/Console*Slot` 조합으로 재구성 | codex |
| 2026-03-21 | route local client helper를 `_layout/ConsoleLayoutClient.tsx`로 이동해 server layout/client helper 경계를 명확히 함 | codex |
| 2026-03-21 | pathless console route group의 `children` mount 설명과 URL 매핑을 실제 구조에 맞게 보정 | codex |
| 2026-03-21 | fe-route-layout-builder 계약에 맞춰 layout skeleton/slot 계약을 재정의 | codex |

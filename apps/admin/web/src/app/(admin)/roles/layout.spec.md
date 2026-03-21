# 역할 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/roles/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton을 조립합니다.
- 제목, 경고 배너, 목록 콘텐츠는 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/roles/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 역할 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/roles/page.tsx` | `PageTitleBar`, warning banner, 역할 table | 역할 목록 콘텐츠 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | raw bordered container | 경고 배너/목록 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/roles/page.tsx` | 역할 목록 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/roles` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 경고 배너와 목록은 동일한 lifecycle을 공유하므로 parallel routes를 사용하지 않습니다.

## Child Content Contract

- `page.tsx`는 `children` 콘텐츠만 구현합니다.
- `page.tsx`는 `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`를 import하지 않습니다.
- page는 `PageTitleBar`, warning banner, CSR 목록 렌더링만 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | 역할 route의 서버 skeleton 계약으로 재정의 | codex |

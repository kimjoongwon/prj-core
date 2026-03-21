# 역할 그룹 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/roles/groups/layout.tsx`

## Server Skeleton

- 상위 roles layout이 역할 도메인 shell을 제공합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton만 소유합니다.
- 그룹 목록 제목, 액션 버튼, 테이블은 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| parent route | `apps/admin/web/src/app/(admin)/roles/layout.tsx` | roles skeleton | 역할 도메인 기본 shell |
| route body | `apps/admin/web/src/app/(admin)/roles/groups/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 그룹 목록 skeleton |
| page content | `apps/admin/web/src/app/(admin)/roles/groups/page.tsx` | `PageTitleBar`, table | 그룹 목록 콘텐츠 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | raw bordered container | 목록 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/roles/groups/page.tsx` | 역할 그룹 목록 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/roles/groups` |

## Slot Fallbacks

- named slot 없음.

## Independent Navigation Policy

- 단일 목록 route라 parallel routes가 필요하지 않습니다.

## Child Content Contract

- `page.tsx`는 table 기반 콘텐츠와 query만 담당합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | 역할 그룹 route skeleton 계약 신규 정의 | codex |

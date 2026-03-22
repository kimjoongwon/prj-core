# 에셋 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/assets/layout.tsx`

## Server Skeleton

- 상위 Admin layout이 공통 shell을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton을 구성합니다.
- 업로드 액션, 폴더 트리, 에셋 목록, 모달은 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | 공통 shell |
| route body | `apps/admin/web/src/app/(admin)/assets/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 에셋 route skeleton |
| page content | `apps/admin/web/src/app/(admin)/assets/page.tsx` | `PageTitleBar`, `FolderTree`, `MetaDataGrid`, modal | 에셋 관리 콘텐츠와 상태 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | children mount |
| content block | `page.tsx` | `Surface` (`padding="none"`) | 폴더 트리 + 목록 브라우저 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/assets/page.tsx` | 에셋 관리 기본 콘텐츠 |

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/assets` |

## Slot Fallbacks

- named slot이 없어 fallback 파일은 필요하지 않습니다.

## Independent Navigation Policy

- 폴더 트리와 에셋 브라우저는 하나의 page lifecycle을 공유합니다.
- detail/aside/modal을 route slot으로 분리하지 않고 page-local modal로 처리합니다.

## Child Content Contract

- `page.tsx`는 `children` 콘텐츠만 구현합니다.
- `page.tsx`는 persist store hydrate gate, space 선택 검증, CSR 조회/뮤테이션, modal 상태만 담당합니다.
- route-level skeleton primitive는 `layout.tsx`가 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 에셋 브라우저 wrapper를 raw container 대신 `Surface`(`padding="none"`) 기준으로 정정 | codex |
| 2026-03-21 | 에셋 관리 route의 서버 skeleton 계약 신규 정의 | codex |

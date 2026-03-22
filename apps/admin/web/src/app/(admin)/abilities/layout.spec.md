# 권한 route layout 기획서

> 생성일: 2026-03-21
> 타입: layout
> 경로: `apps/admin/web/src/app/(admin)/abilities/layout.tsx`

## Server Skeleton

- 상위 `apps/admin/web/src/app/(admin)/layout.tsx`가 Admin 앱 공통 셸을 소유합니다.
- 이 route의 `layout.tsx`는 서버 컴포넌트로 `Page -> PageSurface -> Section -> SectionSurface` skeleton만 소유합니다.
- route 제목, 설명, 액션 버튼, 필터/목록 콘텐츠는 `page.tsx`가 담당합니다.

## Page Composition

| 레벨 | 소유 파일 | 구성 요소 | 책임 |
|------|-----------|-----------|------|
| app shell | `apps/admin/web/src/app/(admin)/layout.tsx` | `Layout` | Admin 공통 헤더/사이드바 |
| route body | `apps/admin/web/src/app/(admin)/abilities/layout.tsx` | `Page` + `PageSurface` + `Section` + `SectionSurface` | 권한 route의 기본 본문 표면과 children mount |
| page content | `apps/admin/web/src/app/(admin)/abilities/page.tsx` | `PageTitleBar`, 필터 패널, 목록 테이블 | 권한 목록 콘텐츠와 상호작용 |

## Surface Ownership

| 레벨 | Owner | 컴포넌트 | 역할 |
|------|-------|----------|------|
| route body | `layout.tsx` | `PageSurface` | route 본문 표면 |
| child mount | `layout.tsx` | `SectionSurface` | `children` 콘텐츠 mount |
| content block | `page.tsx` | `Surface` | 필터/목록 시각 구획 |

## Slot Topology

| Slot key | 파일 | 설명 |
|----------|------|------|
| `children` | `apps/admin/web/src/app/(admin)/abilities/page.tsx` | 권한 목록 기본 콘텐츠 |

- named slot은 사용하지 않습니다.

## Slot URL Mapping

| Slot key | URL |
|----------|-----|
| `children` | `/abilities` |

## Slot Fallbacks

- named slot이 없어 `@slot/default.tsx`는 필요하지 않습니다.

## Independent Navigation Policy

- 권한 목록 route는 필터와 테이블이 하나의 navigation lifecycle을 공유합니다.
- detail/modal/aside를 독립 전환할 요구가 없어 parallel routes를 도입하지 않습니다.

## Child Content Contract

- `page.tsx`는 `children` slot 콘텐츠만 구현합니다.
- `page.tsx`는 `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`를 import하지 않습니다.
- `page.tsx`는 page-local `PageTitleBar`, 필터 입력, 목록 테이블, CSR 데이터 조회만 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | abilities page 콘텐츠 wrapper 기준을 raw container에서 범용 `Surface`로 정정 | codex |
| 2026-03-21 | route skeleton ownership 기준으로 `abilities/layout.tsx` 계약을 정의 | codex |

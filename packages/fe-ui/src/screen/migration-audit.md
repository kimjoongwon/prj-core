# Page Migration Audit

> 생성일: 2026-03-26
> 기준 경로: apps/admin/web/src/app

## 목적

`packages/fe-ui/src/screen/[PageName]/[PageName].tsx` 기반 page 레이어 이관 상태를 기록합니다.

## 현황 요약

- 전체 route `page.tsx`: 79개
- `thin_container`: 1개
- `route_composes_page_ui`: 78개
- `no_ui_import`: 0개
- `pure_page_runtime_violation`: 0개

## Thin Container 완료

- `apps/admin/web/src/app/(admin)/dashboard/page.tsx`

## Route Direct Composition 남음

- 나머지 78개 route는 `@cocrepo/ui` page component를 import하고 route-local query, mutation, navigation, local state를 준비한 뒤 pure screen props로 주입합니다.

## 별도 확인 필요

- 없음

## Pure Screen Runtime 위반 잔여

- 없음

## 최근 반영

- 2026-03-26: admin/idp web route `page.tsx` 전체를 `packages/fe-ui/src/screen` 기반 thin container 구조로 정리
- 2026-03-29: IDP console pure screen에서 API/navigation/react-query import를 제거해 pure screen runtime 위반을 46개(admin 영역만 남음)까지 축소
- 2026-03-29: admin 목록 페이지(`assets`, `inquiries`, `roles`, `routines`, `spaces`, `tasks`, `templates`, `timelines`)를 pure screen + thin route container 구조로 재정의해 pure screen runtime 위반을 37개까지 축소
- 2026-03-30: roles/routines/actions/inquiries/idp 상세·등록·수정 route가 runtime을 소유하고 `packages/fe-ui/src/screen`는 pure props contract만 유지하도록 재정렬
- 2026-03-30: `rg 'useRouter|useParams|useLocalObservable|useQueryClient|toast|useGet…' packages/fe-ui/src/screen --glob '*.tsx'` 기준 pure screen runtime 위반 0건 확인

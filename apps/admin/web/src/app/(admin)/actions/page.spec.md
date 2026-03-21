# Action 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/actions`

## 사용자 시나리오

1. 관리자가 Action 이름을 검색하거나 group 상태로 목록을 좁혀봅니다.
2. 목록에서 Action을 확인하고 등록 버튼으로 새 Action 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/actions/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/actions/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`와 `MetaDataGrid`만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `feature/master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 grid 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 등록 버튼 | Action 목록 안내 |
| 목록 영역 | `MetaDataGrid` | 검색, group 필터, Action 목록 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetActionsSuspense({ group })` | Action 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | `/actions/new` 이동 |
| `queryStates.search` 변경 | 이름/표시명 클라이언트 필터링 |
| `queryStates.group` 변경 | group 기준 재조회 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | Action 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | Action 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |

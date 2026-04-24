# Subject 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/subjects`

## 사용자 시나리오

1. 관리자가 Subject 이름으로 검색하거나 group으로 필터링합니다.
2. Subject 메타데이터를 grid에서 확인합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/subjects/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/subjects/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 Subject 조회와 query state만 담당하고 시각 조합은 `SubjectListPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/SubjectListPage/SubjectListPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` | Subject 목록 안내 |
| 목록 영역 | `Surface` + `MetaDataGrid` | 이름 검색, group 필터, 목록 표시 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSubjects()` | Subject 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `queryStates.search` 변경 | pure page 내부 이름 검색 |
| `queryStates.group` 변경 | pure page 내부 group 기준 필터링 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `SubjectListPage` pure page와 thin route container 구조로 전환하고 page component path를 반영 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | Subject 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | Subject 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |

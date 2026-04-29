# 권한 대상 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/subjects`

## 사용자 시나리오

1. 관리자가 권한 대상명을 검색하거나 사람이 이해할 수 있는 유형 필터로 목록을 좁힙니다.
2. 관리자가 대상의 표시명과 유형을 grid에서 확인합니다.
3. 목록 행을 클릭해 대상 상세 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/subjects/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/subjects/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 대상 조회, `group` query state, 상세 라우팅만 담당하고 시각 조합은 `SubjectListPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- page component path: `packages/fe-ui/src/page/SubjectListPage/SubjectListPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 `useGetSubjects({ group })`, `nuqs` `useQueryStates()`, 상세 이동 핸들러를 소유하고 pure page에 props를 주입합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` | 권한 대상 목록 안내 |
| 유형 필터 | `Tabs` + 설명 패널 | 전체/공통/데이터/메뉴/화면/기능/화면 요소 기준 필터와 역할 설명 |
| 목록 영역 | `Surface` + `DataGrid` | 대상명 검색, 대상/유형/설명 표시, 목록 표시, 행 클릭 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSubjects({ group })` | 선택된 유형 기준 대상 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `queryStates.search` 변경 | pure page 내부 대상명 검색 |
| `queryStates.group` 변경 | route가 `useGetSubjects({ group })` 재호출, pure page도 현재 rows를 유형 기준으로 방어 필터링 |
| `onClickSubject` | `/subjects/[subjectId]` 상세 화면 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 목록 컬럼을 대상/유형/설명 중심으로 정리하고 페이지 유형 표현을 화면으로 변경 | codex |
| 2026-04-29 | Subject 식별자 중심 표현을 권한 대상/유형/설명 중심 UI로 갱신 | codex |
| 2026-04-29 | group query API 연동, 행 클릭 상세 이동, 필터 후 total/pagination 계약을 반영 | codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure page에 직접 주입하도록 정리 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `SubjectListPage` pure page와 thin route container 구조로 전환하고 page component path를 반영 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | Subject 목록을 `data-grid` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | Subject 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |

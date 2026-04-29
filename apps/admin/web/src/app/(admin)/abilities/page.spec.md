# 권한 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/abilities`

## 사용자 시나리오

1. 관리자가 권한 이름, 설명, Subject, Action, 허용/거부 조건으로 권한 목록을 필터링합니다.
2. 특정 권한 행을 선택해 상세 페이지로 이동합니다.
3. "권한 추가" 버튼으로 등록 페이지로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/abilities/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/abilities/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 데이터 조회/필터 상태/라우팅만 담당하고 시각 조합은 `AbilityListPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- page component path: `packages/fe-ui/src/page/AbilityListPage/AbilityListPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 등록 버튼 | `권한 정의` 제목과 등록 이동 액션 |
| 요약 카드 | `StatsCard` x4 | 전체, 표시 중, 거부 규칙, 조건/필드 제한 현황 |
| 필터 패널 | `Surface` + search input + select 묶음 + active filter chip | 클라이언트 필터링 조건. 검색 input은 `aria-label="권한 이름 검색"` 접근성 이름을 제공해야 하며, HeroUI Select trigger에는 `대상(Subject)`, `행동(Action)`, `규칙 유형` placeholder 텍스트가 렌더링되어야 한다. |
| 목록 패널 | `Surface` + `DataGrid` | 규칙, 대상, 행동, 적용 범위, 조건, 등록일 기준 권한 목록과 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetAbilities()` | 권한 목록 조회 |
| 클라이언트 렌더 | `useGetSubjects()` | Subject 필터 옵션 조회 |
| 클라이언트 렌더 | `useGetActions()` | Action 필터 옵션 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onChangeSearchInput` | 검색어 갱신 후 `skip=0`으로 초기화 |
| `onChangeSubjectSelect` | Subject 필터 갱신 후 `skip=0`으로 초기화 |
| `onChangeActionSelect` | Action 필터 갱신 후 `skip=0`으로 초기화 |
| `onChangeTypeSelect` | 허용/거부 필터 갱신 후 `skip=0`으로 초기화 |
| `onClickResetFiltersButton` | 모든 필터와 `skip` 초기화 |
| `onClickAbilityRow` | `/abilities/[abilityId]` 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 운영자 친화형 목록 개선을 위해 요약 카드, 확장 검색, URL query 기반 필터, client-side pagination slice 계약을 반영 | codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure page에 직접 주입하도록 정리 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-03-29 | `AbilityListPage`가 `DataGrid` 기반 테이블 조합을 사용하도록 정착된 상태에 맞춰 reusable target을 `data-grid`로 보정 | codex |
| 2026-03-26 | `AbilityListPage` pure page와 thin route container 구조로 전환하고 page component path를 반영 | codex |
| 2026-03-23 | 필터 Select 검증 기준을 접근성 role name이 아닌 HeroUI trigger placeholder 텍스트로 명시 | codex |
| 2026-03-23 | 검색 input이 자동화/스크린리더에서 일관되게 식별되도록 `aria-label="권한 이름 검색"` 계약을 추가 | codex |
| 2026-03-22 | 필터/목록 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | route-layout / page-builder 계약에 맞춰 권한 목록을 `layout.tsx` + content-only `page.tsx` 구조로 재정의 | codex |

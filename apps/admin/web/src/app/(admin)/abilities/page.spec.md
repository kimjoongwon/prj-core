# 권한 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/abilities`

## 사용자 시나리오

1. 관리자가 권한 이름, Subject, Action, 허용/거부 조건으로 권한 목록을 필터링합니다.
2. 특정 권한 행을 선택해 상세 페이지로 이동합니다.
3. "권한 추가" 버튼으로 등록 페이지로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/abilities/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/abilities/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, `Surface` 안의 필터 입력/목록 테이블만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/list`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 콘텐츠 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 등록 버튼 | 권한 목록 안내와 이동 액션 |
| 필터 패널 | `Surface` + search input + select 묶음 | 클라이언트 필터링 조건. 검색 input은 `aria-label="권한 이름 검색"` 접근성 이름을 제공해야 하며, HeroUI Select trigger에는 `Subject 선택`, `Action 선택`, `유형 선택` placeholder 텍스트가 렌더링되어야 한다. |
| 목록 패널 | `Surface` + custom table | 권한 메타데이터와 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetAbilitiesSuspense()` | 권한 목록 조회 |
| 클라이언트 렌더 | `useGetSubjectsSuspense()` | Subject 필터 옵션 조회 |
| 클라이언트 렌더 | `useGetActionsSuspense()` | Action 필터 옵션 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onChangeSearchInput` | 권한 이름 검색어 갱신 |
| `onChangeSubjectSelect` | Subject 필터 갱신 |
| `onChangeActionSelect` | Action 필터 갱신 |
| `onChangeTypeSelect` | 허용/거부 필터 갱신 |
| `onClickResetFiltersButton` | 모든 필터 초기화 |
| `onClickAbilityRow` | `/abilities/[abilityId]` 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | 필터 Select 검증 기준을 접근성 role name이 아닌 HeroUI trigger placeholder 텍스트로 명시 | codex |
| 2026-03-23 | 검색 input이 자동화/스크린리더에서 일관되게 식별되도록 `aria-label="권한 이름 검색"` 계약을 추가 | codex |
| 2026-03-22 | 필터/목록 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | route-layout / page-builder 계약에 맞춰 권한 목록을 `layout.tsx` + content-only `page.tsx` 구조로 재정의 | codex |

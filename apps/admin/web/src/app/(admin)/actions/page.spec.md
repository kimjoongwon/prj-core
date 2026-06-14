# 권한 액션 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/actions`

## 사용자 시나리오

1. 관리자가 권한 액션이 역할/정책에서 어떤 의미를 가지는지 확인합니다.
2. 액션 이름이나 표시명으로 검색하거나 그룹 탭으로 목록을 좁혀봅니다.
3. 목록에서 액션 상세를 확인하거나 등록 버튼으로 새 액션 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/actions/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/actions/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 전체 Action 목록 조회, query state, 신규/상세 라우팅만 담당하고 시각 조합은 `ActionListScreen`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/ActionListScreen/ActionListScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 `useGetActions(undefined)`와 ``nuqs` `useQueryStates()``를 소유하고 pure screen에 props를 주입합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 액션 등록 버튼 | 권한 액션 카탈로그 안내 |
| 맥락 패널 | `SectionSurface` | 액션/Ability/시스템 액션 의미 설명 |
| 목록 영역 | `SectionSurface` + 그룹 탭 + `DataGrid` | 검색, group 필터, Action 목록, 상세 진입 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetActions(undefined)` | 전체 Action 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | `/actions/new` 이동 |
| `onClickActionRow` | `/actions/${actionId}` 상세 이동 |
| `queryStates.search` 변경 | pure screen 내부 이름/표시명 클라이언트 필터링 |
| `queryStates.group` 변경 | pure screen 내부 그룹 탭 필터링 |

## E2E 검증 메모

- 시스템 여부 검증은 현재 시드 데이터가 기본 Action을 모두 시스템 값으로 제공하므로 목록 gridcell의 `시스템` 표시를 기준으로 확인합니다.
- 권한 액션 카탈로그 맥락 문구, 그룹 탭 필터, 검색, 상세 버튼 이동을 검증합니다.

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 권한 액션 맥락 패널, 클라이언트 그룹 필터, 상세 진입 흐름을 반영 | codex |
| 2026-04-28 | route의 Page 전용 row 매핑을 제거하고 Orval DTO를 pure screen에 직접 주입하도록 정리 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `ActionListScreen` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-28 | 목록 E2E가 현재 시드 데이터 기준으로 시스템 컬럼의 `시스템` 표시를 검증하도록 기준을 보강 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `SectionSurface` 기준으로 문서화 | codex |
| 2026-03-21 | Action 목록을 `data-grid` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | Action 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |

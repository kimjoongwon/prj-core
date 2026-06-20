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
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 대상 조회, `group` query state, 상세 라우팅만 담당하고 시각 조합은 `SubjectListScreen`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/SubjectListScreen/SubjectListScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- route는 `useGetSubjects({ group })`, `nuqs` `useQueryStates()`, 상세 이동 핸들러를 소유하고 pure screen에 props를 주입합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` | 권한 대상 목록 안내 |
| 유형 필터 | `Tabs` + 설명 패널 | 전체/공통/데이터/메뉴/화면/기능/화면 요소 기준 필터와 역할 설명 |
| 목록 영역 | `SectionSurface` + `DataGrid` | 대상명 검색, 대상/유형/설명 표시, 목록 표시, 행 클릭 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSubjects({ group })` | 선택된 유형 기준 대상 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `queryStates.search` 변경 | pure screen 내부 대상명 검색 |
| `queryStates.group` 변경 | route가 `useGetSubjects({ group })` 재호출, pure screen도 현재 rows를 유형 기준으로 방어 필터링 |
| `onClickSubject` | `/subjects/[subjectId]` 상세 화면 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음
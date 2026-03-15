# Subject 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/subjects`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                       │
│ Subject 목록                                                      │
│ 시스템에 등록된 Subject를 조회합니다.                              │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                    │
│  [🔍 식별자, 표시명 검색...        ] [분류: 전체 ▼]               │
│ ┌──────────────┬──────────────┬──────────┬────────┬──────┬──────┐│
│ │ 식별자       │ 표시명       │ 분류     │ 시스템 │ 순서 │ 생성일││
│ ├──────────────┼──────────────┼──────────┼────────┼──────┼──────┤│
│ │ User         │ 사용자       │ entity   │  ●     │  1   │2026..││
│ │ Role         │ 역할         │ entity   │  ●     │  2   │2026..││
│ │ admin        │ 어드민 메뉴  │ menu     │  ○     │  1   │2026..││
│ │ UserList     │ 사용자 목록  │ feature  │  ○     │  1   │2026..││
│ │ Button       │ 버튼         │ ui       │  ●     │  1   │2026..││
│ └──────────────┴──────────────┴──────────┴────────┴──────┴──────┘│
│  [< 이전]  1 / 5  [다음 >]                                        │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 시스템에 등록된 Subject 목록을 조회한다
2. 검색창에 식별자 또는 표시명을 입력하여 Subject를 검색한다
3. 분류(group) 필터를 변경하여 entity/menu/feature/ui별 Subject를 조회한다
4. DataGrid 행을 클릭하여 Subject 상세 페이지로 이동한다

## 레이아웃 구성

| 영역          | 컴포넌트                   | 설명                                                                      |
| ------------- | -------------------------- | ------------------------------------------------------------------------- |
| 페이지 래퍼   | `Page`                     | 페이지 콘텐츠 구조 배치                                                   |
| 페이지 헤더   | `PageTitleBar`             | title="Subject 목록", description="시스템에 등록된 Subject를 조회합니다." |
| 데이터 그리드 | `Section` > `MetaDataGrid` | Subject 목록 표시, 검색/필터/정렬 지원                                    |

## Surface / Elevation

| 항목                   | 결정                                                                            |
| ---------------------- | ------------------------------------------------------------------------------- |
| PageSurface owner      | `apps/admin/web/src/app/(admin)/subjects/page.tsx`                              |
| PageSurface 역할       | Subject 검색/필터와 목록 전체를 raised 본문으로 묶음                            |
| SectionSurface 대상    | Subject `MetaDataGrid`                                                          |
| SectionSurface padding | `padding="none"`                                                                |
| 예외                   | 없음. 검색/필터가 `MetaDataGrid` 슬롯에 있어도 surface는 `page.tsx`가 직접 소유 |

## 컬럼 정의

| 필드        | 라벨      | 크기 | 정렬   | 셀 컴포넌트                                                                       |
| ----------- | --------- | ---- | ------ | --------------------------------------------------------------------------------- |
| name        | 식별자    | 200  | -      | 기본 (필수 컬럼)                                                                  |
| displayName | 표시명    | 150  | -      | `DefaultCell` ("-" 폴백)                                                          |
| group       | 분류      | 120  | center | `Chip` (그룹별 색상: entity=primary, menu=secondary, feature=success, ui=warning) |
| isSystem    | 시스템    | 100  | center | `BooleanCell`                                                                     |
| order       | 정렬 순서 | 100  | center | 기본                                                                              |
| createdAt   | 생성일    | 150  | -      | `DateTimeCell`                                                                    |

## 필터/검색 정의

| 위치 | 타입   | ID     | 설명                                     |
| ---- | ------ | ------ | ---------------------------------------- |
| 좌측 | search | search | 식별자, 표시명으로 검색 (debounce 300ms) |
| 우측 | select | group  | 분류 필터 (전체/Entity/Menu/Feature/UI)  |

## 페이지 상태

| 상태        | 설명             | UI                           |
| ----------- | ---------------- | ---------------------------- |
| 로딩        | suspense 조회 중 | MetaDataGrid 로딩 상태       |
| 데이터 표시 | 목록 로드 완료   | 필터링된 Subject 목록 표시   |
| 빈 데이터   | 조회 결과 없음   | "조회된 Subject가 없습니다." |

## API 호출

| 시점       | API                        | 설명                                    |
| ---------- | -------------------------- | --------------------------------------- |
| 클라이언트 | `useGetSubjectsSuspense()` | 전체 Subject 목록 조회 (CSR + Suspense) |

## 이벤트 핸들러

| 이벤트           | 동작                                                 |
| ---------------- | ---------------------------------------------------- |
| 검색어 입력      | name, displayName 기준 클라이언트 사이드 필터링      |
| 분류 필터 변경   | group 기준 클라이언트 사이드 필터링 ("all"이면 전체) |
| DataGrid 행 클릭 | Subject 상세 페이지로 이동 (MetaDataGrid 기본 동작)  |

## 특이사항

- 서버 사이드 페이지네이션 없이 전체 데이터를 한 번에 가져와 클라이언트 사이드 필터링 수행
- `page.tsx`는 browser-only no-SSR boundary를 제공하고 내부 페이지 컴포넌트에서 `Suspense` fallback과 목록 렌더링을 직접 구성
- nuqs 기반 URL 상태 관리 (`useMetaDataGridQueryStates`)
- Subject는 조회 전용 (등록/수정/삭제 없음)

## 구현 체크리스트

- [x] page.tsx (browser-only no-SSR boundary + 내부 페이지 컴포넌트에서 `useMetaDataGridQueryStates`, `useGetSubjectsSuspense` 실행)
- [x] `_client.tsx` 없음 (CSR 기본 패턴)
- [x] `_prefetch.ts` 없음 (SSR 예외 아님)

## 변경 이력

| 일자       | 내용                                                                                                          | 작성자               |
| ---------- | ------------------------------------------------------------------------------------------------------------- | -------------------- |
| 2026-03-15 | 상대 `/api` 호출의 prerender 오류를 피하기 위해 Subject 목록 `page.tsx`를 browser-only no-SSR boundary로 전환 | codex                |
| 2026-03-15 | Next.js build 요구에 맞춰 `useMetaDataGridQueryStates` 실행을 page-level `Suspense` boundary 안쪽으로 이동    | codex                |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화                                                                       | codex                |
| 2026-03-15 | Subject 목록 본문에 `PageSurface > SectionSurface(padding="none")` ownership을 추가                           | codex                |
| 2026-03-15 | Subject 목록을 CSR + Suspense 단일 `page.tsx` 패턴으로 전환하고 `_client.tsx`, `_prefetch.ts`를 제거          | codex                |
| 2026-02-18 | 초기 생성 (역기획)                                                                                            | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가                                                                                              | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리                                                         | codex                |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `Page + PageTitleBar` 패턴으로 정리                                                 | codex                |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리)                                             | codex                |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영                                                            | codex                |

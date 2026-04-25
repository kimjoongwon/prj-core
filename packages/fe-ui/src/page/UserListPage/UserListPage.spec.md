# UserListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/UserListPage/UserListPage.tsx

## 역할

이용자 목록 route의 pure page 컴포넌트입니다. 검색 입력, 통계 카드, MetaDataGrid 시각 조합만 소유하고 query state와 데이터 조회는 route container가 담당합니다.

## 구성 요소

| 항목              | 설명                    |
| ----------------- | ----------------------- |
| UserListPageUser  | 목록 행 view model 계약 |
| UserListPageStats | 상단 통계 카드 계약     |
| UserListPageProps | 공개 계약 요소          |
| UserListPage      | 공개 계약 요소          |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGrid state를 useLocalObservable 기반 MetaDataGridStateModel class instance로 생성하도록 변경 | codex |
| 2026-04-25 | MetaDataGrid server result를 rows/totalCount/isLoading props로 분리 | codex |
| 2026-04-25 | MetaDataGrid 호출을 state prop 기반 query 계약으로 변경 | codex |

| 일자       | 내용                                                                                                                         | 작성자       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-03-29 | `UserListPage`와 loading fallback을 `observer`로 감싸 목록/로딩 상태의 MobX 변경 추적 계약을 고정                          | codex        |
| 2026-03-27 | user page는 로컬 row contract를 유지하면서 cell 참조를 루트 `src/cell` 배럴로 고정해 columns refactor와 import 흐름을 단순화 | codex        |
| 2026-03-27 | `UserRoleCell` import를 이동된 루트 `src/cell` 배럴 기준으로 정리                                                            | codex        |
| 2026-03-27 | columns 레이어 exported row type import를 제거하고 page contract 기반 user columns builder를 사용하도록 조정                 | codex        |
| 2026-03-27 | 이용자 목록 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관                                          | codex        |
| 2026-03-26 | users 목록 route의 page-level UI를 page 레이어로 이동                                                                        | codex-worker |

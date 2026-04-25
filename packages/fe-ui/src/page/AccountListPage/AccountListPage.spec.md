# AccountListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AccountListPage/AccountListPage.tsx

## 역할

IDP 계정 목록 화면의 pure page 컴포넌트입니다.
조회, query state, 잠금 해제 mutation은 route thin container가 소유하고 이 파일은 목록 시각 조합과 확인 modal만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AccountListPageAccount | IDP 계정 목록 row 계약 |
| AccountListPageProps | pure page 입력 계약 |
| idpConsoleAccountsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AccountListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGrid state를 useLocalObservable 기반 MetaDataGridStateModel class instance로 생성하도록 변경 | codex |
| 2026-04-25 | 검색 input을 column-header placement로 전환해 컬럼 헤더 아래에서 Enter commit되도록 변경 | codex |
| 2026-04-25 | MetaDataGrid server result를 rows/totalCount/isLoading props로 분리 | codex |
| 2026-04-25 | MetaDataGrid 호출을 state prop 기반 query 계약으로 변경 | codex |
| 2026-04-24 | pure page query state 타입을 shared hook ReturnType 의존에서 명시 계약으로 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | IDP 계정 목록을 pure page로 재정의하고 조회·query state·unlock mutation을 route thin container로 이동 | codex |
| 2026-03-27 | 계정 관리 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |

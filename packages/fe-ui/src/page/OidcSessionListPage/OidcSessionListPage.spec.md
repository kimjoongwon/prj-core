# OidcSessionListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcSessionListPage/OidcSessionListPage.tsx

## 역할

OIDC 세션 목록 화면의 pure page 컴포넌트입니다.
조회, query state, revoke mutation은 route thin container가 소유하고 이 파일은 stats/grid 조합과 confirm modal만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcSessionListPageSession | 세션 row 계약 |
| OidcSessionListPageStats | 세션 통계 계약 |
| OidcSessionListPageProps | pure page 입력 계약 |
| idpConsoleOidcSessionsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| OidcSessionListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | MetaDataGrid state를 useLocalObservable 기반 MetaDataGridStateModel class instance로 생성하도록 변경 | codex |
| 2026-04-28 | 검색 input을 MetaDataGrid toolbar 렌더링으로 되돌려 컬럼 헤더 필터 배치를 제거 | codex |
| 2026-04-25 | MetaDataGrid server result를 rows/totalCount/isLoading props로 분리 | codex |
| 2026-04-25 | MetaDataGrid 호출을 state prop 기반 query 계약으로 변경 | codex |
| 2026-04-24 | pure page query state 타입을 shared hook ReturnType 의존에서 명시 계약으로 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | OIDC 세션 목록을 pure page로 재정의하고 조회·통계·revoke mutation·query state를 route thin container로 이동 | codex |
| 2026-03-27 | 컬럼 builder 이관 후 남은 미사용 `OidcSessionDto` type import를 제거 | codex |
| 2026-03-27 | OIDC 세션 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |

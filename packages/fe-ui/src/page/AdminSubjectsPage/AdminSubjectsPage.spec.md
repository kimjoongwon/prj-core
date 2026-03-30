# AdminSubjectsPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AdminSubjectsPage/AdminSubjectsPage.tsx

## 역할

Subject 목록 화면의 pure page 컴포넌트입니다.
데이터 조회와 querystring 상태는 route thin container가 소유하고 이 파일은 목록 시각 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminSubjectsPageSubject | Subject 목록 row 계약 |
| AdminSubjectsPageProps | pure page 입력 계약 |
| adminSubjectsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AdminSubjectsPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Subject 목록을 pure page로 재정의하고 조회·query state 책임을 route thin container로 이동 | codex |
| 2026-03-27 | Subject 목록 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |

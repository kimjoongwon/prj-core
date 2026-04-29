# SubjectListPage page 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/SubjectListPage/SubjectListPage.tsx

## 역할

권한 대상 목록 화면의 pure page 컴포넌트입니다.
데이터 조회, querystring 상태, 라우팅은 route thin container가 소유하고 이 파일은 대상 유형 필터, 설명, 목록 시각 조합과 DataGrid interaction 연결만 담당합니다.

## 디자인 스케치

```text
SubjectListPage
- PageTitleBar
- Surface
  - SubjectGroupFilterTabs
    - Tabs
    - selected filter description
  - DataGrid
    - search input
    - paginated rows
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `SubjectsPageFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `SubjectGroupFilterTabs` | `현재 파일` | 대상 유형 필터와 선택된 유형 설명 표시 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Surface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| SubjectListPageProps.subjects | SubjectDto[] optional row 계약 |
| SubjectListPageProps.onClickSubject | row click 시 route가 처리할 상세 이동 계약 |
| SubjectListPageProps | pure page 입력 계약 |
| adminSubjectsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| SubjectListPage | 공개 계약 요소 |

## 동작

| 항목 | 설명 |
|------|------|
| 검색 | `name`, `displayName`에 대해 클라이언트 필터링하되 placeholder는 대상명 기준으로 표시 |
| 유형 필터 | `전체`, `공통`, `데이터`, `메뉴`, `화면`, `기능`, `화면 요소` 탭을 제공하고 선택된 유형의 역할 설명을 표시 |
| 유형 표시 | 목록 행에는 내부 식별자 대신 표시명과 한글 유형 라벨을 우선 표시 |
| 설명 표시 | 대상별 권한 사용 맥락을 설명 컬럼에 표시 |
| 페이지네이션 | 필터링된 rows를 `skip`/`take` 기준으로 slice하고 total은 필터 결과 수로 표시 |
| 행 클릭 | `DataGrid.onRowClick`에서 Subject ID를 `onClickSubject`로 전달 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 유형 필터 Tabs |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 권한 대상 설명 컬럼과 화면 유형 라벨을 추가해 목록 해석성을 개선 | codex |
| 2026-04-29 | 내부 식별자 중심 목록을 권한 대상 표시명, 한글 유형 탭, 유형 설명 중심으로 개선 | codex |
| 2026-04-29 | group select 옵션, clearable select, 필터 후 페이지 슬라이스, row click 상세 이동 계약을 반영 | codex |
| 2026-04-28 | 목록 row 계약을 Page 전용 view model 대신 Orval DTO optional props로 정리 | codex |
| 2026-04-24 | 목록 검색과 페이지네이션 검색 조건 계약을 명시적으로 정리 | codex |
| 2026-03-29 | Subject 목록 화면의 조회/검색 조건 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |

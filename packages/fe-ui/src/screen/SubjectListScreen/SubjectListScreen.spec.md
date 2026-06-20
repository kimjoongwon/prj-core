# SubjectListScreen page 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/SubjectListScreen/SubjectListScreen.tsx

## 역할

권한 대상 목록 화면의 pure screen 컴포넌트입니다.
데이터 조회, querystring 상태, 라우팅은 route thin container가 소유하고 이 파일은 대상 유형 필터, 설명, 목록 시각 조합과 DataGrid interaction 연결만 담당합니다.

## 디자인 스케치

```text
SubjectListScreen
- PageTitleBar
- SectionSurface
  - SubjectGroupFilterSelect
    - Select
    - selected filter description
  - DataGrid
    - search input
    - paginated rows
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `SubjectsScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `SubjectGroupFilterSelect` | `현재 파일` | 대상 유형 선택과 선택된 유형 설명 표시 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| SubjectListScreenProps.subjects | SubjectDto[] optional row 계약 |
| SubjectListScreenProps.onClickSubject | row click 시 route가 처리할 상세 이동 계약 |
| SubjectListScreenProps | pure screen 입력 계약 |
| adminSubjectsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| SubjectListScreen | 공개 계약 요소 |

## 동작

| 항목 | 설명 |
|------|------|
| 검색 | `name`, `displayName`에 대해 클라이언트 필터링하되 placeholder는 대상명 기준으로 표시 |
| 유형 필터 | `전체`, `공통`, `데이터`, `메뉴`, `화면`, `기능`, `화면 요소` Select를 제공하고 선택된 유형의 역할 설명을 표시 |
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
| @heroui/react | 유형 필터 Select |
| mobx-react-lite | 기능 구현 의존성 |
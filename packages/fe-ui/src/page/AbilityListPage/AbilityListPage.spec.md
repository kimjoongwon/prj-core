# AbilityListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AbilityListPage/AbilityListPage.tsx

## 역할

권한 목록 route에서 사용하는 pure page 컴포넌트입니다. 필터, 빈 상태, 테이블 렌더링만 소유하고 데이터 조회와 라우팅은 app route container가 담당합니다.
권한 목록 표는 직접 `<table>`를 만들지 않고 `DataGrid`와 `columns` 레이어의 공용 조합만 사용합니다.

## 디자인 스케치

```text
AbilityListPage
- PageTitleBar
  - Button
- VStack
  - Surface
    - PageTitleBar
    - Input
    - Select x2
    - Select
      - SelectItem x2
    - Button
  - Surface
    - PageTitleBar
    - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Surface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `AbilityListPageFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Search` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Select` | `@heroui/react` | 사용자 입력 컨트롤 |
| `SelectItem` | `@heroui/react` | 사용자 입력 컨트롤 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityListPageOption | 필터 Select 옵션 계약 |
| AbilityListPageProps.abilities | AbilityResponseDto[] optional row 계약 |
| AbilityListPageFilters | 필터 상태 계약 |
| AbilityListPageProps | 공개 계약 요소 |
| AbilityListPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 목록 row 계약을 Page 전용 view model 대신 Orval DTO optional props로 정리 | codex |
| 2026-04-24 | 목록 검색과 페이지네이션 검색 조건 계약을 명시적으로 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |

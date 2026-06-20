# UserListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/UserListScreen/UserListScreen.tsx

## 역할

이용자 목록 route의 pure screen 컴포넌트입니다. 검색 입력, 통계 카드, DataGrid 시각 조합만 소유하고 query state와 데이터 조회는 route container가 담당합니다.

## 디자인 스케치

```text
UserListScreen
- PageTitleBar
- VStack
  - StatsCard x3
  - SectionSurface
    - UsersDirectoryHeader
    - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `UsersScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Search` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `StatsCard` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Users` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `UserCheck` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `UserMinus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `UsersDirectoryHeader` | `현재 파일` | 페이지 내부 보조 컴포넌트 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 구성 요소

| 항목              | 설명                    |
| ----------------- | ----------------------- |
| UserListScreenProps.users | UserDto[] optional row 계약 |
| UserListScreenStats | 상단 통계 카드 계약     |
| UserListScreenProps | 공개 계약 요소          |
| UserListScreen      | 공개 계약 요소          |
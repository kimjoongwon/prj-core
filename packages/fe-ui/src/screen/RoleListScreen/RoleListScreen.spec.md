# RoleListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/RoleListScreen/RoleListScreen.tsx

## 역할

역할 목록 화면의 pure screen 컴포넌트입니다. 역할 조회, query state, 신규 등록 라우팅은 route thin container가 소유하고 이 파일은 안내 배너와 grid 조합만 담당합니다.

## 디자인 스케치

```text
RoleListScreen
- PageTitleBar
  - Button
- VStack
  - PageTitleBar
  - SectionSurface
    - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `RolesScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoleListScreenProps.roles | RoleDto[] optional row 계약 |
| RoleListScreenProps | pure screen 입력 계약 |
| RoleListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
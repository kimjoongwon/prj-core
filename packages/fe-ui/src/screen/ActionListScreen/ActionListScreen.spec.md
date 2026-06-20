# ActionListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/ActionListScreen/ActionListScreen.tsx

## 역할

권한 액션 목록 화면의 pure screen 컴포넌트입니다.
데이터 조회, querystring 상태, 라우팅은 route thin container가 소유하고 이 파일은 목록 시각 조합만 담당합니다.

## 디자인 스케치

```text
ActionListScreen
- PageTitleBar (권한 액션 목록 + 액션 등록)
- SectionSurface (권한 액션 카탈로그 맥락)
- SectionSurface
  - Group filter Select
  - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Button` | `@heroui/react` | 주요 액션 실행 |
| `Select`, `ListBox.Item` | `@heroui/react` | 액션 그룹 필터 |
| `KeyRound`, `Layers3`, `Plus`, `ShieldCheck` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ActionGroupFilterSelect` | `현재 파일` | 액션 그룹 선택과 선택된 그룹 설명 표시 |
| `ActionsScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `HStack`, `VStack` | `@cocrepo/ui` | semantic rhythm 레이아웃 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| ActionListScreenProps.actions | ActionDto[] optional row 계약 |
| ActionListScreenProps.onClickActionRow | 상세 화면 이동을 위한 row/action click 계약 |
| ActionListScreenProps | pure screen 입력 계약 |
| adminActionsPageQueryInputs | 검색 query input 정의 |
| ActionListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
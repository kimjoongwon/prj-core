# OidcSessionListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/OidcSessionListScreen/OidcSessionListScreen.tsx

## 역할

OIDC 세션 목록 화면의 pure screen 컴포넌트입니다.
조회, query state, revoke mutation은 route thin container가 소유하고 이 파일은 stats/grid 조합과 confirm modal만 담당합니다.

## 디자인 스케치

```text
OidcSessionListScreen
- VStack
  - PageTitleBar
    - Button
  - StatsCard
  - SectionSurface
    - DataGrid
  - ConfirmModal x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `StatsCard` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Activity` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcSessionListScreenProps.sessions | OidcSessionDto[] optional row 계약 |
| OidcSessionListScreenStats | 세션 통계 계약 |
| OidcSessionListScreenProps | pure screen 입력 계약 |
| idpConsoleOidcSessionsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| OidcSessionListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
# AccountListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/AccountListScreen/AccountListScreen.tsx

## 역할

IDP 계정 목록 화면의 pure screen 컴포넌트입니다.
조회, query state, 잠금 해제 mutation은 route thin container가 소유하고 이 파일은 목록 시각 조합과 확인 modal만 담당합니다.

## 디자인 스케치

```text
AccountListScreen
- VStack
  - PageTitleBar
  - SectionSurface
    - DataGrid
  - ConfirmModal
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |
| `ConfirmModal` | `@cocrepo/ui` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| AccountListScreenProps.accounts | IdpAccountDto[] optional row 계약 |
| AccountListScreenProps | pure screen 입력 계약 |
| idpConsoleAccountsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AccountListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |
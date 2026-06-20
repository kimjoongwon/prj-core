# TimelineListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/TimelineListScreen/TimelineListScreen.tsx

## 역할

타임라인 목록 화면의 pure screen 컴포넌트입니다. 타임라인 조회, query state, 삭제 mutation, 라우팅 href 주입은 route thin container가 소유하고 이 파일은 grid 렌더링과 삭제 modal만 담당합니다.

## 디자인 스케치

```text
TimelineListScreen
- PageTitleBar
  - Button
- SectionSurface
  - DataGrid
- Modal
  - Modal overlay content
    - Modal.Header
    - Modal.Body
    - Modal.Footer
      - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `TimelinesScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineListScreenProps.timelines | TimelineDto[] optional row 계약 |
| TimelineListScreenProps | pure screen 입력 계약 |
| adminTimelinesPageQueryInputs | route와 page가 공유하는 query input 정의 |
| TimelineListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |
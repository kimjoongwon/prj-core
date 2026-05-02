# TaskListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/TaskListPage/TaskListPage.tsx

## 역할

태스크 목록 화면의 pure page 컴포넌트입니다. 태스크 조회, query state, 삭제 mutation, 라우팅은 route thin container가 소유하고 이 파일은 목록 렌더링과 삭제 modal만 담당합니다.
각 row는 Orval `TaskDto` 계약을 따르며 Exercise 영상 준비 여부를 `exercise.videoFileId` 존재 여부로 표시합니다.

## 디자인 스케치

```text
TaskListPage
- PageTitleBar
  - Button
- Surface
  - DataGrid
- Modal
  - ModalContent
    - ModalHeader
    - ModalBody
    - ModalFooter
      - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Surface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `TasksPageFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalContent` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalHeader` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalBody` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalFooter` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TaskListPageProps.tasks | TaskDto[] optional row 계약 |
| TaskListPageProps | pure page 입력 계약 |
| adminTasksPageQueryInputs | route와 page가 공유하는 query input 정의 |
| TaskListPage | 공개 계약 요소 |

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

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | 삭제 모달과 주요 액션 문구가 런타임 i18n을 사용하도록 반영 | codex |
| 2026-04-28 | Storybook row fixture가 `TaskDto.exercise` 계약과 영상 준비 여부 표시 기준을 따르도록 정리 | codex |
| 2026-04-28 | 목록 row 계약을 Page 전용 view model 대신 Orval DTO optional props로 정리 | codex |
| 2026-04-24 | 목록 검색과 페이지네이션 검색 조건 계약을 명시적으로 정리 | codex |
| 2026-03-29 | Task 목록의 스케줄 가능 상태 노출 계약 추가 | codex |
| 2026-03-29 | Task 목록 화면의 조회/삭제/라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |

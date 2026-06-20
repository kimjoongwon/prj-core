# RoutineCreateScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/RoutineCreateScreen/RoutineCreateScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Routine 작성 시 스케줄 가능한 Task만 편성 후보로 노출하고, 영상 누락 Exercise가 포함되면 저장을 차단합니다.

## 디자인 스케치

```text
RoutineCreateScreen
- VStack
  - PageTitleBar
  - ScreenSurface
    - SectionSurface
      - Section
        - PageTitleBar
        - Input x2
    - RoutineActivitySection
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
| `MediaThumbnail` | `@cocrepo/ui` | 화면 조합 요소 |
| `RoutineMediaThumbnail` | `현재 파일` | 페이지 내부 보조 컴포넌트 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `DragHandle` | `@cocrepo/ui` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `CandidateTaskCard` | `현재 파일` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DraggableSortableList` | `@cocrepo/ui` | 화면 조합 요소 |
| `ActivityCard` | `현재 파일` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `RoutineActivitySection` | `현재 파일` | 콘텐츠 그룹과 elevation 구성 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoutineCreateScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/routines | 기능 구현 의존성 |
| @cocrepo/api/core/tasks | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- Task 검색 결과는 `exercise.videoFileId`가 있는 항목만 기본 후보로 사용합니다.
- 이미 추가된 Activity 중 스케줄 불가 항목이 있으면 저장 버튼을 차단하고 경고를 표시합니다.
- 후보 Task 카드 key는 `task.id`가 중복되어도 충돌하지 않도록 index를 함께 사용합니다.
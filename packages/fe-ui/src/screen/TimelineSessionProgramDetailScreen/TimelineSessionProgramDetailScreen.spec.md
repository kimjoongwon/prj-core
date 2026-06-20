# TimelineSessionProgramDetailScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineSessionProgramDetailScreen/TimelineSessionProgramDetailScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
Program 상세에서 routine snapshot 메타와 `executionPlan` 기반 실행 운동 목록을 읽기 전용으로 표시합니다.

## 디자인 스케치

```text
TimelineSessionProgramDetailScreen
- VStack
  - PageTitleBar
    - Button x2
  - ScreenSurface
    - SectionSurface
      - Section
        - PageTitleBar
        - Link x2
        - DateTimeCell (조건부)
    - SectionSurface
      - Section
        - PageTitleBar
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
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `SectionSurface` | `@cocrepo/ui` | screen 주요 구역 surface |
| `Link` | `next/link` | 사용자 액션 실행 |
| `DateTimeCell` | `../../cell` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineSessionProgramDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- 기본 정보 영역은 `routineNameSnapshot`과 `activityCount`를 우선 사용합니다.
- `executionPlan` 각 항목은 순서, 반복, 휴식, 운동 설명, 시간, 횟수, 이미지/영상 자산 링크를 카드 형태로 노출합니다.
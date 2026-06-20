# TimelineSessionDetailScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TimelineSessionDetailScreen/TimelineSessionDetailScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.
세션 상세에서 Program 목록 summary를 표시하며 운동 수, 대표 운동, routine snapshot 이름을 함께 노출합니다.

## 디자인 스케치

```text
TimelineSessionDetailScreen
- VStack
  - PageTitleBar
    - Button x2
  - ScreenSurface
    - VStack
      - SectionSurface
        - Section
          - PageTitleBar
          - Chip (조건부)
          - DateTimeCell x2
          - Link (조건부)
          - DateTimeCell (조건부)
      - SectionSurface
        - Section
          - PageTitleBar
            - Button
          - Table
            - Table.Header
            - Table.Body
  - Modal x2
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
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Pencil` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Trash2` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `ScreenSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Section` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Link` | `next/link` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Table` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Header` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Column` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Body` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Row` | `@heroui/react` | 목록/표 데이터 표시 |
| `Table.Cell` | `@heroui/react` | 목록/표 데이터 표시 |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineSessionDetailScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/timelines | 기능 구현 의존성 |
| @cocrepo/api/core/users | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |

## UI 규칙

- Program table은 `activityCount`, `previewExerciseNames`를 사용해 실행 운동 요약을 표시합니다.
- Routine 컬럼은 live routine name보다 `routineNameSnapshot`을 우선 사용합니다.
- Program 이름은 hydration 전에도 이동 가능한 상세 링크로 렌더링합니다.